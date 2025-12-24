import React, { useState, useRef, useCallback } from 'react';
import { Download, RefreshCw, Undo2, Crop } from 'lucide-react';
import html2canvas from 'html2canvas';

import Sidebar from './components/Sidebar';
import PreviewCanvas from './components/PreviewCanvas';
import UploadZone from './components/UploadZone';
import ImageCropper from './components/ImageCropper';
import Button from './components/Button';

import { 
  FrameConfig, 
  MatConfig, 
  WallConfig, 
  ArtState, 
  FrameStyle, 
  WallStyle 
} from './types';
import { DEFAULT_FRAME_WIDTH, DEFAULT_MAT_WIDTH } from './constants';

const App: React.FC = () => {
  // --- State ---
  const [art, setArt] = useState<ArtState>({
    image: null,
    fileName: 'artwork',
    rotation: 0,
  });
  
  // Store original image for non-destructive re-cropping
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);

  const [frameConfig, setFrameConfig] = useState<FrameConfig>({
    style: FrameStyle.MODERN_BLACK,
    width: DEFAULT_FRAME_WIDTH,
    color: '#000000',
    depth: 10,
  });

  const [matConfig, setMatConfig] = useState<MatConfig>({
    enabled: true,
    width: DEFAULT_MAT_WIDTH,
    color: '#FFFFFF',
    texture: 'SMOOTH',
  });

  const [wallConfig, setWallConfig] = useState<WallConfig>({
    style: WallStyle.CONCRETE,
    color: '#E2E8F0',
  });

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
      setOriginalImage(result); // Save original for cropping
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDownload = async () => {
    if (!captureRef.current) return;
    
    try {
      const canvas = await html2canvas(captureRef.current, {
        backgroundColor: null,
        scale: 2, // Reting quality
      });
      
      const link = document.createElement('a');
      link.download = `framed-${art.fileName}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
      alert("Could not generate image. Please try again.");
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
            
            <Button variant="primary" onClick={handleDownload}>
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
      </main>
    </div>
  );
};

export default App;