import React, { useState, useRef, useCallback } from 'react';
import { Download, RefreshCw, Undo2, Crop } from 'lucide-react';
import html2canvas from 'html2canvas';

import Sidebar from './components/Sidebar';
import PreviewCanvas from './components/PreviewCanvas';
import UploadZone from './components/UploadZone';
import ImageCropper from './components/ImageCropper';
import Button from './components/Button';
import DownloadModal from './components/DownloadModal';

import { 
  FrameConfig, 
  MatConfig, 
  WallConfig, 
  ArtState, 
  FrameStyle, 
  WallStyle,
  ThemePreset
} from './types';
import { DEFAULT_FRAME_WIDTH, DEFAULT_MAT_WIDTH, THEME_PRESETS } from './constants';

const App: React.FC = () => {
  // --- Persistent State Handlers ---
  
  const loadCustomThemes = (): ThemePreset[] => {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem('artframe_custom_themes') || '[]');
    } catch { return []; }
  };

  const loadDefaultThemeId = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('artframe_default_theme_id');
  };

  // --- State ---

  const [customThemes, setCustomThemes] = useState<ThemePreset[]>(loadCustomThemes);
  const [defaultThemeId, setDefaultThemeId] = useState<string | null>(loadDefaultThemeId);

  // Initialize configs based on default theme if present
  const getInitialConfig = () => {
    const allThemes = [...THEME_PRESETS, ...customThemes];
    const def = allThemes.find(t => t.id === defaultThemeId);
    if (def) return def.config;
    
    return {
      frame: { style: FrameStyle.MODERN_BLACK, width: DEFAULT_FRAME_WIDTH, color: '#000000', depth: 10 },
      mat: { enabled: true, width: DEFAULT_MAT_WIDTH, color: '#FFFFFF', texture: 'SMOOTH' as const },
      // Default scale 0.4 works well for the wide-angle room background
      wall: { style: WallStyle.LIVING_ROOM, color: '#E2E8F0', scale: 0.4, position: { x: 0, y: 0 } }
    };
  };

  // We use a lazy initializer to only run this logic once on mount
  const [configState] = useState(getInitialConfig);

  const [frameConfig, setFrameConfig] = useState<FrameConfig>(configState.frame);
  const [matConfig, setMatConfig] = useState<MatConfig>(configState.mat);
  const [wallConfig, setWallConfig] = useState<WallConfig>(configState.wall);

  const [art, setArt] = useState<ArtState>({
    image: null,
    fileName: 'artwork',
    rotation: 0,
  });
  
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  
  // Download Modal State
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const captureRef = useRef<HTMLDivElement>(null);

  // --- Handlers ---

  const handleUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setArt({
        image: result,
        fileName: file.name.split('.')[0],
        rotation: 0,
      });
      setOriginalImage(result);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDownloadClick = () => {
      setIsDownloadModalOpen(true);
  };

  const handleDownloadProcess = async (option: 'screen' | 'original') => {
    if (!captureRef.current) return;
    setIsDownloading(true);
    
    // Allow UI to update before blocking with heavy canvas work
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      let scale = 2; // Default "Screen" quality (Retina-ish)

      if (option === 'original') {
        const imgElement = captureRef.current.querySelector('img');
        if (imgElement && imgElement.naturalWidth) {
           const renderedWidth = imgElement.getBoundingClientRect().width;
           if (renderedWidth > 0) {
               const ratio = imgElement.naturalWidth / renderedWidth;
               scale = Math.min(Math.max(2, ratio), 20); 
           }
        }
      }

      const canvas = await html2canvas(captureRef.current, {
        backgroundColor: null,
        scale: scale,
        useCORS: true,
        allowTaint: true,
        logging: false,
      });
      
      const link = document.createElement('a');
      const suffix = option === 'original' ? 'high-res' : 'framed';
      link.download = `${art.fileName}-${suffix}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      setIsDownloadModalOpen(false);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Could not generate image. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCropComplete = (croppedImage: string) => {
    setArt(prev => ({ ...prev, image: croppedImage }));
    setIsCropping(false);
  };

  const resetArt = () => {
      setArt({ image: null, fileName: '', rotation: 0 });
      setOriginalImage(null);
  };

  // --- Theme Handlers ---

  const handleSaveTheme = (name: string) => {
    let previewColor = '#1a1a1a';
    const styleStr = frameConfig.style.toString();

    if (frameConfig.style === FrameStyle.CUSTOM_COLOR) previewColor = frameConfig.color;
    else if (styleStr.includes('GOLD')) previewColor = '#C5A059';
    else if (styleStr.includes('WOOD') || styleStr.includes('WALNUT')) previewColor = '#d4b08c';
    else if (styleStr.includes('WHITE')) previewColor = '#f8fafc';
    else if (styleStr.includes('SILVER')) previewColor = '#C0C0C0';

    const newTheme: ThemePreset = {
        id: `custom_${Date.now()}`,
        label: name,
        description: 'Custom user theme',
        previewColor,
        config: { 
            frame: { ...frameConfig }, 
            mat: { ...matConfig }, 
            wall: { ...wallConfig } 
        }
    };

    const updated = [newTheme, ...customThemes];
    setCustomThemes(updated);
    
    try {
        localStorage.setItem('artframe_custom_themes', JSON.stringify(updated));
    } catch (e) {
        console.error("Failed to save theme to local storage", e);
    }
  };

  const handleDeleteTheme = (id: string) => {
    const updated = customThemes.filter(t => t.id !== id);
    setCustomThemes(updated);
    try {
        localStorage.setItem('artframe_custom_themes', JSON.stringify(updated));
        
        if (defaultThemeId === id) {
            setDefaultThemeId(null);
            localStorage.removeItem('artframe_default_theme_id');
        }
    } catch (e) {
        console.error("Failed to update storage", e);
    }
  };

  const handleSetDefaultTheme = (id: string) => {
    try {
        if (defaultThemeId === id) {
            setDefaultThemeId(null);
            localStorage.removeItem('artframe_default_theme_id');
        } else {
            setDefaultThemeId(id);
            localStorage.setItem('artframe_default_theme_id', id);
        }
    } catch (e) {
         console.error("Failed to set default theme", e);
    }
  };

  // --- Render ---

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-950 text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-800 z-30 shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-lg font-serif">A</div>
          <h1 className="text-xl font-bold tracking-tight">ArtFrame <span className="text-blue-400 font-light">Studio</span></h1>
        </div>

        {art.image && (
          <div className="flex items-center gap-3">
            <Button 
                variant="ghost" 
                onClick={resetArt}
                title="Change Image"
            >
                <Undo2 size={18} />
                <span className="ml-2 hidden sm:inline">Change Art</span>
            </Button>
            
            <div className="h-6 w-px bg-gray-700 mx-1"></div>

            <Button 
              variant="secondary" 
              onClick={() => setIsCropping(true)} 
              title="Crop Image"
            >
               <Crop size={18} />
               <span className="ml-2 hidden sm:inline">Crop</span>
            </Button>

            <Button variant="secondary" onClick={() => setArt(prev => ({ ...prev, rotation: prev.rotation + 90 }))} title="Rotate Art">
               <RefreshCw size={18} />
            </Button>
            
            <div className="h-6 w-px bg-gray-700 mx-1"></div>
            
            <Button variant="primary" onClick={handleDownloadClick}>
              <Download size={18} className="mr-2" />
              Download
            </Button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex flex-1 overflow-hidden relative">
        
        {!art.image ? (
          /* Empty State / Upload */
          <div className="w-full h-full flex items-center justify-center bg-gray-900 p-4">
             <UploadZone onUpload={handleUpload} />
          </div>
        ) : (
          /* Workspace */
          <>
            {/* Left Sidebar */}
            <Sidebar 
                frameConfig={frameConfig}
                setFrameConfig={setFrameConfig}
                matConfig={matConfig}
                setMatConfig={setMatConfig}
                wallConfig={wallConfig}
                setWallConfig={setWallConfig}
                customThemes={customThemes}
                defaultThemeId={defaultThemeId}
                onSaveTheme={handleSaveTheme}
                onDeleteTheme={handleDeleteTheme}
                onSetDefaultTheme={handleSetDefaultTheme}
            />

            {/* Canvas Area */}
            <PreviewCanvas 
                art={art}
                frameConfig={frameConfig}
                matConfig={matConfig}
                wallConfig={wallConfig}
                captureRef={captureRef}
            />
          </>
        )}
        
        {/* Crop Overlay */}
        {isCropping && originalImage && (
          <ImageCropper 
            imageSrc={originalImage}
            onCancel={() => setIsCropping(false)}
            onCropComplete={handleCropComplete}
          />
        )}

        {/* Download Modal */}
        <DownloadModal 
            isOpen={isDownloadModalOpen}
            onClose={() => setIsDownloadModalOpen(false)}
            onConfirm={handleDownloadProcess}
            isProcessing={isDownloading}
        />
      </main>
    </div>
  );
};

export default App;