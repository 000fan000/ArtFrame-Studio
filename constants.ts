import { FrameStyle, WallStyle, ThemePreset } from './types';

export const DEFAULT_FRAME_WIDTH = 40;
export const DEFAULT_MAT_WIDTH = 50;

export const FRAME_STYLES = [
  { id: FrameStyle.MODERN_BLACK, label: 'Modern Black', color: '#1a1a1a', gradient: null },
  { id: FrameStyle.MODERN_WHITE, label: 'Modern White', color: '#f8fafc', gradient: null },
  { id: FrameStyle.OAK_WOOD, label: 'Oak Wood', color: '#d4b08c', gradient: 'linear-gradient(90deg, #d4b08c 0%, #c19a6b 20%, #d4b08c 40%, #c19a6b 100%)' },
  { id: FrameStyle.DARK_WALNUT, label: 'Dark Walnut', color: '#5D4037', gradient: 'linear-gradient(90deg, #5D4037 0%, #4E342E 50%, #5D4037 100%)' },
  { id: FrameStyle.GOLD_ORNATE, label: 'Antique Gold', color: '#C5A059', gradient: 'linear-gradient(45deg, #C5A059 0%, #E6C67C 25%, #9D7E3E 50%, #C5A059 75%, #F0D593 100%)' },
  { id: FrameStyle.SILVER_METAL, label: 'Brushed Silver', color: '#C0C0C0', gradient: 'linear-gradient(135deg, #e2e2e2 0%, #999999 50%, #e2e2e2 100%)' },
  { id: FrameStyle.CUSTOM_COLOR, label: 'Custom Color', color: '#3b82f6', gradient: null },
];

export const WALL_STYLES = [
  { id: WallStyle.SOLID_COLOR, label: 'Solid Color', css: '' },
  { id: WallStyle.CONCRETE, label: 'Concrete', css: 'url("https://www.transparenttextures.com/patterns/concrete-wall.png")' },
  { id: WallStyle.BRICK_WHITE, label: 'White Brick', css: 'url("https://www.transparenttextures.com/patterns/white-brick-wall.png")' },
  { id: WallStyle.DARK_MODE, label: 'Dark Studio', css: 'linear-gradient(to bottom, #1a202c, #2d3748)' },
];

export const PRESET_MAT_COLORS = [
  '#FFFFFF', // White
  '#F5F5DC', // Beige
  '#1a1a1a', // Black
  '#808080', // Grey
  '#2a3b55', // Navy
  '#5c1a1a', // Deep Red
];

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'gallery_classic',
    label: 'Gallery Classic',
    description: 'Timeless black frame with a crisp white mat.',
    previewColor: '#1a1a1a',
    config: {
      frame: { style: FrameStyle.MODERN_BLACK, width: 45, color: '#000000', depth: 12 },
      mat: { enabled: true, width: 60, color: '#FFFFFF', texture: 'SMOOTH' },
      wall: { style: WallStyle.SOLID_COLOR, color: '#E2E8F0' }
    }
  },
  {
    id: 'modern_minimal',
    label: 'Modern Minimal',
    description: 'Sleek oak wood on a concrete texture.',
    previewColor: '#d4b08c',
    config: {
      frame: { style: FrameStyle.OAK_WOOD, width: 20, color: '#000000', depth: 8 },
      mat: { enabled: true, width: 80, color: '#FFFFFF', texture: 'SMOOTH' },
      wall: { style: WallStyle.CONCRETE, color: '#E2E8F0' }
    }
  },
  {
    id: 'museum_gold',
    label: 'Museum Gold',
    description: 'Ornate gold frame with a textured beige mat.',
    previewColor: '#C5A059',
    config: {
      frame: { style: FrameStyle.GOLD_ORNATE, width: 60, color: '#000000', depth: 20 },
      mat: { enabled: true, width: 50, color: '#F5F5DC', texture: 'TEXTURED' },
      wall: { style: WallStyle.DARK_MODE, color: '#000000' }
    }
  },
  {
    id: 'industrial_loft',
    label: 'Industrial Loft',
    description: 'Metallic frame against a white brick wall.',
    previewColor: '#C0C0C0',
    config: {
      frame: { style: FrameStyle.SILVER_METAL, width: 15, color: '#000000', depth: 15 },
      mat: { enabled: true, width: 40, color: '#1a1a1a', texture: 'SMOOTH' },
      wall: { style: WallStyle.BRICK_WHITE, color: '#ffffff' }
    }
  },
  {
    id: 'studio_dark',
    label: 'Studio Dark',
    description: 'Dark walnut frame in a moody environment.',
    previewColor: '#5D4037',
    config: {
      frame: { style: FrameStyle.DARK_WALNUT, width: 40, color: '#000000', depth: 15 },
      mat: { enabled: false, width: 0, color: '#000000', texture: 'SMOOTH' },
      wall: { style: WallStyle.DARK_MODE, color: '#000000' }
    }
  },
];