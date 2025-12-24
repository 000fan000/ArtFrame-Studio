import { FrameStyle, WallStyle } from './types';

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