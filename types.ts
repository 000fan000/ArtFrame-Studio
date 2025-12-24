export enum FrameStyle {
  MODERN_BLACK = 'MODERN_BLACK',
  MODERN_WHITE = 'MODERN_WHITE',
  OAK_WOOD = 'OAK_WOOD',
  DARK_WALNUT = 'DARK_WALNUT',
  GOLD_ORNATE = 'GOLD_ORNATE',
  SILVER_METAL = 'SILVER_METAL',
  CUSTOM_COLOR = 'CUSTOM_COLOR',
}

export enum WallStyle {
  SOLID_COLOR = 'SOLID_COLOR',
  CONCRETE = 'CONCRETE',
  BRICK_WHITE = 'BRICK_WHITE',
  DARK_MODE = 'DARK_MODE',
}

export interface FrameConfig {
  style: FrameStyle;
  width: number; // in pixels
  color: string; // Hex code for custom color
  depth: number; // visual shadow depth
}

export interface MatConfig {
  enabled: boolean;
  width: number; // in pixels
  color: string;
  texture: 'SMOOTH' | 'TEXTURED';
}

export interface WallConfig {
  style: WallStyle;
  color: string; // for solid color
}

export interface ArtState {
  image: string | null; // Data URL
  fileName: string;
  rotation: number;
}

export interface ThemePreset {
  id: string;
  label: string;
  description: string;
  previewColor: string; 
  config: {
    frame: FrameConfig;
    mat: MatConfig;
    wall: WallConfig;
  }
}