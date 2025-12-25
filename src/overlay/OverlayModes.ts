// src/overlay/types/OverlayModes.ts

export enum OverlayMode {
  GAMES_ONLY = 'games_only',           // Current default
  ALL_APPLICATIONS = 'all_applications', // New: System-wide
  DESKTOP_MODE = 'desktop_mode',        // New: Desktop only
  CUSTOM_WHITELIST = 'custom_whitelist' // New: User-defined
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