import React from 'react';
import { Layers, Maximize2, Palette, Image as ImageIcon } from 'lucide-react';
import { FrameConfig, MatConfig, WallConfig, FrameStyle, WallStyle } from '../types';
import { FRAME_STYLES, WALL_STYLES, PRESET_MAT_COLORS } from '../constants';
import Slider from './Slider';
import ColorPicker from './ColorPicker';

interface SidebarProps {
  frameConfig: FrameConfig;
  setFrameConfig: (c: FrameConfig) => void;
  matConfig: MatConfig;
  setMatConfig: (c: MatConfig) => void;
  wallConfig: WallConfig;
  setWallConfig: (c: WallConfig) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  frameConfig,
  setFrameConfig,
  matConfig,
  setMatConfig,
  wallConfig,
  setWallConfig,
}) => {
  const [activeTab, setActiveTab] = React.useState<'frame' | 'mat' | 'wall'>('frame');

  return (
    <div className="w-full md:w-80 bg-gray-900 border-r border-gray-800 flex flex-col h-full overflow-hidden shadow-2xl z-20">
      
      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        <button
          onClick={() => setActiveTab('frame')}
          className={`flex-1 py-4 flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors ${activeTab === 'frame' ? 'text-blue-400 bg-gray-800/50 border-b-2 border-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <Maximize2 size={18} />
          Frame
        </button>
        <button
          onClick={() => setActiveTab('mat')}
          className={`flex-1 py-4 flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors ${activeTab === 'mat' ? 'text-blue-400 bg-gray-800/50 border-b-2 border-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <Layers size={18} />
          Mat
        </button>
        <button
          onClick={() => setActiveTab('wall')}
          className={`flex-1 py-4 flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors ${activeTab === 'wall' ? 'text-blue-400 bg-gray-800/50 border-b-2 border-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <ImageIcon size={18} />
          Wall
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-700">
        
        {/* FRAME CONTROLS */}
        {activeTab === 'frame' && (
          <div className="space-y-8 animate-fade-in">
            <section>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Style</h3>
              <div className="grid grid-cols-2 gap-3">
                {FRAME_STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setFrameConfig({ ...frameConfig, style: style.id })}
                    className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all ${
                      frameConfig.style === style.id 
                        ? 'border-blue-500 bg-gray-800' 
                        : 'border-gray-700 hover:border-gray-600 hover:bg-gray-800/50'
                    }`}
                  >
                    <div 
                      className="w-full h-8 mb-2 rounded shadow-sm" 
                      style={{ 
                        background: style.gradient || style.color,
                        border: '1px solid rgba(255,255,255,0.1)'
                      }} 
                    />
                    <span className="text-xs text-center text-gray-300">{style.label}</span>
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Dimensions</h3>
              <Slider
                label="Width"
                value={frameConfig.width}
                min={10}
                max={150}
                onChange={(width) => setFrameConfig({ ...frameConfig, width })}
              />
              <Slider
                label="Visual Depth"
                value={frameConfig.depth}
                min={0}
                max={30}
                onChange={(depth) => setFrameConfig({ ...frameConfig, depth })}
              />
            </section>

            {frameConfig.style === FrameStyle.CUSTOM_COLOR && (
              <section>
                 <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Appearance</h3>
                 <ColorPicker
                    label="Frame Color"
                    color={frameConfig.color}
                    onChange={(color) => setFrameConfig({ ...frameConfig, color })}
                 />
              </section>
            )}
          </div>
        )}

        {/* MAT CONTROLS */}
        {activeTab === 'mat' && (
          <div className="space-y-8 animate-fade-in">
            <section>
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-medium text-gray-300">Enable Mat</span>
                <button
                  onClick={() => setMatConfig({ ...matConfig, enabled: !matConfig.enabled })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${matConfig.enabled ? 'bg-blue-600' : 'bg-gray-700'}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${matConfig.enabled ? 'translate-x-6' : 'translate-x-1'}`}
                  />
                </button>
              </div>

              {matConfig.enabled && (
                <>
                  <Slider
                    label="Mat Width"
                    value={matConfig.width}
                    min={10}
                    max={200}
                    onChange={(width) => setMatConfig({ ...matConfig, width })}
                  />
                  
                  <div className="mt-6">
                    <ColorPicker
                        label="Mat Color"
                        color={matConfig.color}
                        presets={PRESET_MAT_COLORS}
                        onChange={(color) => setMatConfig({ ...matConfig, color })}
                    />
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Texture</label>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setMatConfig({...matConfig, texture: 'SMOOTH'})}
                            className={`flex-1 py-2 text-xs rounded border ${matConfig.texture === 'SMOOTH' ? 'border-blue-500 bg-blue-500/20 text-white' : 'border-gray-600 text-gray-400'}`}
                        >
                            Smooth
                        </button>
                        <button
                            onClick={() => setMatConfig({...matConfig, texture: 'TEXTURED'})}
                            className={`flex-1 py-2 text-xs rounded border ${matConfig.texture === 'TEXTURED' ? 'border-blue-500 bg-blue-500/20 text-white' : 'border-gray-600 text-gray-400'}`}
                        >
                            Textured
                        </button>
                    </div>
                  </div>
                </>
              )}
              
              {!matConfig.enabled && (
                <div className="p-4 rounded-lg bg-gray-800 text-gray-400 text-sm text-center">
                    Matting is disabled. <br/>Toggle the switch to add a mat.
                </div>
              )}
            </section>
          </div>
        )}

        {/* WALL CONTROLS */}
        {activeTab === 'wall' && (
          <div className="space-y-8 animate-fade-in">
            <section>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Background</h3>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {WALL_STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setWallConfig({ ...wallConfig, style: style.id })}
                    className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all ${
                      wallConfig.style === style.id 
                        ? 'border-blue-500 bg-gray-800' 
                        : 'border-gray-700 hover:border-gray-600 hover:bg-gray-800/50'
                    }`}
                  >
                     <div 
                      className="w-full h-12 mb-2 rounded shadow-sm bg-cover bg-center" 
                      style={{ 
                        background: style.css || '#e2e8f0',
                      }} 
                    />
                    <span className="text-xs text-center text-gray-300">{style.label}</span>
                  </button>
                ))}
              </div>

              {wallConfig.style === WallStyle.SOLID_COLOR && (
                <ColorPicker
                    label="Wall Paint"
                    color={wallConfig.color}
                    onChange={(color) => setWallConfig({ ...wallConfig, color })}
                />
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;