// src/overlay/types/OverlayModes.ts

export enum OverlayMode {
  GAMES_ONLY = 'games_only',
  ALL_APPLICATIONS = 'all_applications',
  DESKTOP_MODE = 'desktop_mode',
  CUSTOM_WHITELIST = 'custom_whitelist'
}

export interface OverlayConfig {
  mode: OverlayMode;
  enabled: boolean;
  hotkey: string;
  whitelist: string[];
  blacklist: string[];
  opacity: number;
  position: { x: number; y: number };
  clickThrough: boolean;
}

export interface WindowInfo {
  processName: string;
  windowTitle: string;
  hwnd?: number; // Windows handle
  pid?: number;   // Process ID
}

export const DEFAULT_BLACKLIST = [
  'banking.exe',
  'wallet.exe',
  'password-manager.exe',
  'keepass.exe',
  '1password.exe',
  'bitwarden.exe',
  'lastpass.exe'
];