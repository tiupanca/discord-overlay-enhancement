// tests/overlay/OverlayModeManager.test.ts

describe('OverlayModeManager', () => {
  let manager: OverlayModeManager;

  beforeEach(() => {
    manager = OverlayModeManager.getInstance();
  });

  describe('shouldShowOverlay', () => {
    it('should respect blacklist in all modes', () => {
      manager.setMode(OverlayMode.ALL_APPLICATIONS);
      expect(manager.shouldShowOverlay('banking.exe', '')).toBe(false);
    });

    it('should show overlay for all apps in ALL_APPLICATIONS mode', () => {
      manager.setMode(OverlayMode.ALL_APPLICATIONS);
      expect(manager.shouldShowOverlay('chrome.exe', '')).toBe(true);
      expect(manager.shouldShowOverlay('vscode.exe', '')).toBe(true);
    });

    it('should only show overlay for whitelisted apps in CUSTOM_WHITELIST mode', () => {
      manager.setMode(OverlayMode.CUSTOM_WHITELIST);
      manager.addToWhitelist('chrome.exe');
      
      expect(manager.shouldShowOverlay('chrome.exe', '')).toBe(true);
      expect(manager.shouldShowOverlay('firefox.exe', '')).toBe(false);
    });

    it('should maintain GAMES_ONLY behavior by default', () => {
      manager.setMode(OverlayMode.GAMES_ONLY);
      // Assuming chrome is not detected as game
      expect(manager.shouldShowOverlay('chrome.exe', '')).toBe(false);
    });
  });

  describe('config persistence', () => {
    it('should save and load configuration', () => {
      manager.setMode(OverlayMode.ALL_APPLICATIONS);
      manager.updateConfig({ opacity: 0.7 });
      
      // Simulate app restart
      const newManager = OverlayModeManager.getInstance();
      const config = newManager.getConfig();
      
      expect(config.mode).toBe(OverlayMode.ALL_APPLICATIONS);
      expect(config.opacity).toBe(0.7);
    });
  });
});