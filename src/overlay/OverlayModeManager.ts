// src/overlay/OverlayModeManager.ts

import { ipcRenderer } from 'electron';
import { OverlayMode, OverlayConfig } from './types/OverlayModes';

export class OverlayModeManager {
  private config: OverlayConfig;
  private static instance: OverlayModeManager;

  private constructor() {
    this.config = this.loadConfig();
    this.initializeListeners();
  }

  static getInstance(): OverlayModeManager {
    if (!OverlayModeManager.instance) {
      OverlayModeManager.instance = new OverlayModeManager();
    }
    return OverlayModeManager.instance;
  }

  private loadConfig(): OverlayConfig {
    const saved = localStorage.getItem('overlayConfig');
    return saved ? JSON.parse(saved) : this.getDefaultConfig();
  }

  private getDefaultConfig(): OverlayConfig {
    return {
      mode: OverlayMode.GAMES_ONLY,
      enabled: true,
      hotkey: 'Shift+`',
      whitelist: [],
      blacklist: this.getDefaultBlacklist(),
      opacity: 0.95,
      position: { x: 10, y: 10 },
      clickThrough: true
    };
  }

  private getDefaultBlacklist(): string[] {
    return [
      'banking.exe',
      'password-manager.exe',
      'notepad.exe',  // User can remove if desired
      // Add security-sensitive applications
    ];
  }

  setMode(mode: OverlayMode): void {
    this.config.mode = mode;
    this.saveConfig();
    this.notifyNativeModule();
  }

  shouldShowOverlay(processName: string, windowTitle: string): boolean {
    if (!this.config.enabled) return false;

    // Check blacklist first (security)
    if (this.config.blacklist.some(app => 
      processName.toLowerCase().includes(app.toLowerCase())
    )) {
      return false;
    }

    switch (this.config.mode) {
      case OverlayMode.GAMES_ONLY:
        return this.isGameProcess(processName);
      
      case OverlayMode.ALL_APPLICATIONS:
        return true;
      
      case OverlayMode.DESKTOP_MODE:
        return processName === 'explorer.exe'; // Windows desktop
      
      case OverlayMode.CUSTOM_WHITELIST:
        return this.config.whitelist.some(app =>
          processName.toLowerCase().includes(app.toLowerCase())
        );
      
      default:
        return false;
    }
  }

  private isGameProcess(processName: string): boolean {
    // Current game detection logic (unchanged for backward compatibility)
    return ipcRenderer.sendSync('overlay:is-game', processName);
  }

  private notifyNativeModule(): void {
    ipcRenderer.send('overlay:config-updated', this.config);
  }

  private saveConfig(): void {
    localStorage.setItem('overlayConfig', JSON.stringify(this.config));
  }

  private initializeListeners(): void {
    // Listen for active window changes
    ipcRenderer.on('window:changed', (event, windowInfo) => {
      const shouldShow = this.shouldShowOverlay(
        windowInfo.processName,
        windowInfo.title
      );
      ipcRenderer.send('overlay:set-visibility', shouldShow);
    });
  }

  // Public API for settings UI
  getConfig(): OverlayConfig {
    return { ...this.config };
  }

  updateConfig(updates: Partial<OverlayConfig>): void {
    this.config = { ...this.config, ...updates };
    this.saveConfig();
    this.notifyNativeModule();
  }

  addToWhitelist(appName: string): void {
    if (!this.config.whitelist.includes(appName)) {
      this.config.whitelist.push(appName);
      this.saveConfig();
    }
  }

  removeFromWhitelist(appName: string): void {
    this.config.whitelist = this.config.whitelist.filter(
      app => app !== appName
    );
    this.saveConfig();
  }

  addToBlacklist(appName: string): void {
    if (!this.config.blacklist.includes(appName)) {
      this.config.blacklist.push(appName);
      this.saveConfig();
    }
  }

  removeFromBlacklist(appName: string): void {
    // Prevent removing security-critical blacklist items
    const criticalApps = this.getDefaultBlacklist();
    if (criticalApps.includes(appName)) {
      console.warn(`Cannot remove ${appName} from blacklist (security)`);
      return;
    }
    
    this.config.blacklist = this.config.blacklist.filter(
      app => app !== appName
    );
    this.saveConfig();
  }
}