// src/overlay/OverlaySettingsUI.tsx

import React, { useState, useEffect } from 'react';
import { OverlayModeManager } from './OverlayModeManager';
import { OverlayMode, OverlayConfig } from './types/OverlayModes';

export const OverlaySettings: React.FC = () => {
  const manager = OverlayModeManager.getInstance();
  const [config, setConfig] = useState<OverlayConfig>(manager.getConfig());
  const [newApp, setNewApp] = useState('');

  useEffect(() => {
    setConfig(manager.getConfig());
  }, []);

  const handleModeChange = (mode: OverlayMode) => {
    manager.setMode(mode);
    setConfig(manager.getConfig());
  };

  const handleAddApp = (isWhitelist: boolean) => {
    if (!newApp.trim()) return;
    
    if (isWhitelist) {
      manager.addToWhitelist(newApp.trim());
    } else {
      manager.addToBlacklist(newApp.trim());
    }
    
    setNewApp('');
    setConfig(manager.getConfig());
  };

  return (
    <div className="overlay-settings">
      <h2>Overlay Mode</h2>
      
      {/* Mode Selection */}
      <div className="setting-group">
        <label>Overlay Activation Mode</label>
        <select 
          value={config.mode}
          onChange={(e) => handleModeChange(e.target.value as OverlayMode)}
        >
          <option value={OverlayMode.GAMES_ONLY}>
            Games Only (Default)
          </option>
          <option value={OverlayMode.ALL_APPLICATIONS}>
            All Applications (System-Wide)
          </option>
          <option value={OverlayMode.DESKTOP_MODE}>
            Desktop Mode Only
          </option>
          <option value={OverlayMode.CUSTOM_WHITELIST}>
            Custom Whitelist
          </option>
        </select>
        <p className="help-text">
          {getModeDescription(config.mode)}
        </p>
      </div>

      {/* Conditional UI based on mode */}
      {config.mode === OverlayMode.CUSTOM_WHITELIST && (
        <div className="setting-group">
          <label>Allowed Applications</label>
          <div className="app-list">
            {config.whitelist.map(app => (
              <div key={app} className="app-item">
                <span>{app}</span>
                <button onClick={() => {
                  manager.removeFromWhitelist(app);
                  setConfig(manager.getConfig());
                }}>Remove</button>
              </div>
            ))}
          </div>
          <div className="add-app">
            <input
              type="text"
              placeholder="Application name (e.g., chrome.exe)"
              value={newApp}
              onChange={(e) => setNewApp(e.target.value)}
            />
            <button onClick={() => handleAddApp(true)}>Add</button>
          </div>
        </div>
      )}

      {/* Blacklist (available in all modes) */}
      <div className="setting-group">
        <label>Blocked Applications</label>
        <p className="help-text">
          Overlay will never appear in these applications (security)
        </p>
        <div className="app-list">
          {config.blacklist.map(app => (
            <div key={app} className="app-item">
              <span>{app}</span>
              <button 
                onClick={() => {
                  manager.removeFromBlacklist(app);
                  setConfig(manager.getConfig());
                }}
                disabled={isSecurityCritical(app)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Settings */}
      <div className="setting-group">
        <label>
          <input
            type="checkbox"
            checked={config.clickThrough}
            onChange={(e) => {
              manager.updateConfig({ clickThrough: e.target.checked });
              setConfig(manager.getConfig());
            }}
          />
          Enable click-through when not interacting
        </label>
      </div>

      <div className="setting-group">
        <label>Overlay Opacity</label>
        <input
          type="range"
          min="0.3"
          max="1"
          step="0.05"
          value={config.opacity}
          onChange={(e) => {
            manager.updateConfig({ opacity: parseFloat(e.target.value) });
            setConfig(manager.getConfig());
          }}
        />
        <span>{Math.round(config.opacity * 100)}%</span>
      </div>
    </div>
  );
};

function getModeDescription(mode: OverlayMode): string {
  switch (mode) {
    case OverlayMode.GAMES_ONLY:
      return 'Overlay appears only in detected games (current behavior)';
    case OverlayMode.ALL_APPLICATIONS:
      return 'Overlay works in all applications except blacklisted ones';
    case OverlayMode.DESKTOP_MODE:
      return 'Overlay available on Windows desktop with hotkey activation';
    case OverlayMode.CUSTOM_WHITELIST:
      return 'Choose specific applications where overlay should appear';
    default:
      return '';
  }
}

function isSecurityCritical(appName: string): boolean {
  const critical = ['banking.exe', 'password-manager.exe'];
  return critical.includes(appName);
}