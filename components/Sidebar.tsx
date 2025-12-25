import React from 'react';
import { Layers, Maximize2, Palette, Image as ImageIcon, Sparkles, Plus, Trash2, Star, Save, Upload, ZoomIn, Move } from 'lucide-react';
import { FrameConfig, MatConfig, WallConfig, FrameStyle, WallStyle, ThemePreset } from '../types';
import { FRAME_STYLES, WALL_STYLES, PRESET_MAT_COLORS, THEME_PRESETS } from '../constants';
import Slider from './Slider';
import ColorPicker from './ColorPicker';
import Button from './Button';

interface SidebarProps {
  frameConfig: FrameConfig;
  setFrameConfig: (c: FrameConfig) => void;
  matConfig: MatConfig;
  setMatConfig: (c: MatConfig) => void;
  wallConfig: WallConfig;
  setWallConfig: (c: WallConfig) => void;
  
  // Theme Management
  customThemes: ThemePreset[];
  defaultThemeId: string | null;
  onSaveTheme: (name: string) => void;
  onDeleteTheme: (id: string) => void;
  onSetDefaultTheme: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  frameConfig,
  setFrameConfig,
  matConfig,
  setMatConfig,
  wallConfig,
  setWallConfig,
  customThemes,
  defaultThemeId,
  onSaveTheme,
  onDeleteTheme,
  onSetDefaultTheme,
}) => {
  const [activeTab, setActiveTab] = React.useState<'themes' | 'frame' | 'mat' | 'wall'>('themes');
  
  // State for inline naming form
  const [isNaming, setIsNaming] = React.useState(false);
  const [newName, setNewName] = React.useState('');

  const applyTheme = (theme: ThemePreset) => {
    // Deep copy configs when applying to break references from theme objects
    setFrameConfig({ ...theme.config.frame });
    setMatConfig({ ...theme.config.mat });
    setWallConfig({ ...theme.config.wall });
  };

  const startSave = () => {
    setNewName(`My Theme ${customThemes.length + 1}`);
    setIsNaming(true);
  };

  const confirmSave = () => {
    if (newName.trim()) {
        onSaveTheme(newName.trim());
        setIsNaming(false);
        setNewName('');
    }
  };

  const cancelSave = () => {
      setIsNaming(false);
      setNewName('');
  };

  const handleWallImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setWallConfig({
          ...wallConfig,
          style: WallStyle.CUSTOM_IMAGE,
          image: event.target?.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const renderThemeItem = (theme: ThemePreset, isCustom: boolean) => (
    <div
      key={theme.id}
      className="group w-full relative p-3 rounded-xl bg-gray-800 border border-gray-700 hover:border-blue-500 hover:bg-gray-800/80 transition-all mb-3"
    >
      <div 
        className="flex items-center gap-4 cursor-pointer"
        onClick={() => applyTheme(theme)}
      >
        <div 
          className="w-12 h-12 rounded-lg shadow-md border border-gray-600 flex-shrink-0"
          style={{ background: theme.previewColor }}
        />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-200 group-hover:text-blue-400 transition-colors truncate pr-8">
            {theme.label}
          </h4>
          <p className="text-xs text-gray-400 leading-tight mt-1 truncate">{theme.description}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="absolute top-3 right-3 flex items-center gap-1">
        <button
            title={defaultThemeId === theme.id ? "Current Default" : "Set as Default"}
            onClick={(e) => { e.stopPropagation(); onSetDefaultTheme(theme.id); }}
            className={`p-1.5 rounded-full transition-colors ${defaultThemeId === theme.id ? 'text-yellow-400 bg-yellow-400/10' : 'text-gray-600 hover:text-yellow-400 hover:bg-gray-700'}`}
        >
            <Star size={14} fill={defaultThemeId === theme.id ? "currentColor" : "none"} />
        </button>
        {isCustom && (
            <button
                title="Delete Theme"
                onClick={(e) => { e.stopPropagation(); if(confirm('Delete this theme?')) onDeleteTheme(theme.id); }}
                className="p-1.5 rounded-full text-gray-600 hover:text-red-400 hover:bg-gray-700 transition-colors"
            >
                <Trash2 size={14} />
            </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full md:w-80 bg-gray-900 border-r border-gray-800 flex flex-col h-full overflow-hidden shadow-2xl z-20">
      
      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        <button
          onClick={() => setActiveTab('themes')}
          className={`flex-1 py-4 flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors ${activeTab === 'themes' ? 'text-blue-400 bg-gray-800/50 border-b-2 border-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <Sparkles size={18} />
          Themes
        </button>
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
        
        {/* THEMES TAB */}
        {activeTab === 'themes' && (
           <div className="space-y-6 animate-fade-in">
             <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                {!isNaming ? (
                    <>
                        <Button 
                            type="button"
                            variant="primary" 
                            className="w-full justify-center" 
                            onClick={startSave}
                        >
                            <Save size={16} className="mr-2" />
                            Save Current Style
                        </Button>
                        <p className="text-xs text-gray-500 mt-2 text-center">Save current frame settings as a new theme.</p>
                    </>
                ) : (
                    <div className="flex flex-col gap-3 animate-fade-in">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-gray-400 uppercase">Theme Name</label>
                            <input 
                                type="text" 
                                value={newName} 
                                onChange={(e) => setNewName(e.target.value)}
                                className="bg-gray-900 text-white text-sm rounded-lg border border-gray-700 p-2 focus:border-blue-500 focus:outline-none w-full"
                                autoFocus
                                placeholder="Enter name..."
                                onKeyDown={(e) => {
                                    if(e.key === 'Enter') confirmSave();
                                    if(e.key === 'Escape') cancelSave();
                                }}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button 
                                type="button"
                                variant="secondary" 
                                className="flex-1 py-1 text-xs" 
                                onClick={cancelSave}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="button"
                                variant="primary" 
                                className="flex-1 py-1 text-xs" 
                                onClick={confirmSave}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                )}
             </div>

             {/* Custom Themes */}
             {customThemes.length > 0 && (
                <div>
                     <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">My Themes</h3>
                     {customThemes.map(t => renderThemeItem(t, true))}
                </div>
             )}

             {/* Preset Themes */}
             <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">Presets</h3>
                {THEME_PRESETS.map(t => renderThemeItem(t, false))}
             </div>
           </div>
        )}

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
                    className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all relative overflow-hidden ${
                      wallConfig.style === style.id 
                        ? 'border-blue-500 bg-gray-800' 
                        : 'border-gray-700 hover:border-gray-600 hover:bg-gray-800/50'
                    }`}
                  >
                     {/* Preview for styles */}
                     <div 
                      className="w-full h-12 mb-2 rounded shadow-sm bg-cover bg-center" 
                      style={{ 
                        background: style.id === WallStyle.CUSTOM_IMAGE && wallConfig.image 
                            ? `url(${wallConfig.image})` 
                            : (style.css || (style.id === WallStyle.CUSTOM_IMAGE ? '#374151' : '#e2e8f0')),
                        backgroundSize: 'cover'
                      }} 
                    >
                        {style.id === WallStyle.CUSTOM_IMAGE && !wallConfig.image && (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                                <ImageIcon size={20} />
                            </div>
                        )}
                    </div>
                    <span className="text-xs text-center text-gray-300">{style.label}</span>
                  </button>
                ))}
              </div>

               <div className="mb-6 border-t border-gray-800 pt-6">
                 <div className="flex items-center gap-2 mb-4 text-gray-400">
                     <Move size={16} />
                     <span className="text-xs font-bold uppercase tracking-wider">Placement</span>
                 </div>
                 
                 <div className="space-y-2 mb-6">
                     <Slider
                        label="Scale"
                        value={wallConfig.scale}
                        min={0.1}
                        max={2.0}
                        step={0.05}
                        unit="x"
                        onChange={(scale) => setWallConfig({ ...wallConfig, scale })}
                      />
                 </div>

                 <div className="space-y-2">
                     <Slider
                        label="Horizontal"
                        value={wallConfig.position?.x || 0}
                        min={-500}
                        max={500}
                        step={10}
                        unit="px"
                        onChange={(x) => setWallConfig({ ...wallConfig, position: { ...wallConfig.position, x } })}
                      />
                      <Slider
                        label="Vertical"
                        value={wallConfig.position?.y || 0}
                        min={-500}
                        max={500}
                        step={10}
                        unit="px"
                        onChange={(y) => setWallConfig({ ...wallConfig, position: { ...wallConfig.position, y } })}
                      />
                      <button 
                        onClick={() => setWallConfig({...wallConfig, position: { x: 0, y: 0 }})}
                        className="text-xs text-blue-400 hover:text-blue-300 mt-1"
                      >
                        Reset Position
                      </button>
                 </div>
              </div>

              {/* Custom Image Upload */}
              {wallConfig.style === WallStyle.CUSTOM_IMAGE && (
                  <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 animate-fade-in">
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-3">Upload Background</label>
                      <button
                        onClick={() => document.getElementById('wall-image-upload')?.click()}
                        className="w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition-colors border border-gray-600 border-dashed"
                      >
                        <Upload size={16} />
                        <span className="text-sm">Choose Image</span>
                      </button>
                      <input 
                        id="wall-image-upload" 
                        type="file" 
                        accept="image/*"
                        className="hidden" 
                        onChange={handleWallImageUpload}
                      />
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Upload a photo of your own room to see how the art looks on your wall.
                      </p>
                  </div>
              )}

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