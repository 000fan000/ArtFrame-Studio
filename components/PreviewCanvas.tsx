import React, { useRef, useEffect } from 'react';
import { FrameConfig, MatConfig, WallConfig, ArtState, FrameStyle } from '../types';
import { FRAME_STYLES, WALL_STYLES } from '../constants';

interface PreviewCanvasProps {
  art: ArtState;
  frameConfig: FrameConfig;
  matConfig: MatConfig;
  wallConfig: WallConfig;
  captureRef: React.RefObject<HTMLDivElement>;
}

const PreviewCanvas: React.FC<PreviewCanvasProps> = ({
  art,
  frameConfig,
  matConfig,
  wallConfig,
  captureRef
}) => {
  // Determine Frame Styles
  const currentFrameStyle = FRAME_STYLES.find(s => s.id === frameConfig.style);
  
  const getFrameBackground = () => {
    if (frameConfig.style === FrameStyle.CUSTOM_COLOR) return frameConfig.color;
    return currentFrameStyle?.gradient || currentFrameStyle?.color || '#000';
  };

  const getWallBackground = () => {
    const style = WALL_STYLES.find(s => s.id === wallConfig.style);
    if (!style) return '#e2e8f0';
    if (wallConfig.style === 'SOLID_COLOR') return wallConfig.color;
    return style.css; // Usually a URL or gradient
  };

  // Determine shadow intensity based on depth
  const dropShadow = `0px 10px 30px rgba(0,0,0, ${0.3 + (frameConfig.depth * 0.01)})`;
  const innerBevel = `inset 0px 0px ${frameConfig.depth / 2}px rgba(0,0,0,0.5)`;
  
  // Mat Texture (subtle noise)
  const matTexture = matConfig.texture === 'TEXTURED' 
    ? `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E"), linear-gradient(${matConfig.color}, ${matConfig.color})`
    : matConfig.color;

  return (
    <div 
        className="flex-1 w-full h-full relative overflow-hidden flex items-center justify-center p-8 transition-colors duration-500"
        style={{ background: getWallBackground(), backgroundSize: 'cover' }}
    >
        {/* Render Area */}
        {art.image ? (
            <div 
                ref={captureRef}
                className="relative transition-all duration-300 ease-out"
                style={{
                    boxShadow: dropShadow,
                    // The Frame Container
                    backgroundColor: getFrameBackground().includes('gradient') ? undefined : getFrameBackground(),
                    background: getFrameBackground().includes('gradient') ? getFrameBackground() : undefined,
                    padding: `${frameConfig.width}px`,
                    position: 'relative',
                    // Optional: Add a subtle border radius if frame style dictates, but frames are usually sharp
                    maxWidth: '90%',
                    maxHeight: '90%',
                }}
            >
                 {/* Bevel Overlay for Frame */}
                 <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        boxShadow: innerBevel
                    }}
                 />

                {/* The Mat Container */}
                <div 
                    className="relative transition-all duration-300"
                    style={{
                        backgroundColor: matConfig.enabled ? matConfig.color : 'transparent',
                        background: matConfig.enabled ? matTexture : 'transparent',
                        padding: matConfig.enabled ? `${matConfig.width}px` : '0px',
                        boxShadow: matConfig.enabled ? 'inset 1px 1px 4px rgba(0,0,0,0.2)' : 'none',
                    }}
                >
                    {/* The Art */}
                    <img 
                        src={art.image} 
                        alt="Framed Art"
                        className="block max-w-full max-h-[70vh] w-auto h-auto object-contain shadow-sm"
                        style={{
                           // If mat is disabled, the art sits directly in frame, maybe needs a tiny shadow
                           boxShadow: !matConfig.enabled ? '0 0 5px rgba(0,0,0,0.5)' : 'none'
                        }}
                    />
                    
                    {/* Mat Bevel (inner cut) */}
                    {matConfig.enabled && (
                        <div className="absolute inset-0 pointer-events-none" 
                             style={{
                                 margin: `${matConfig.width}px`,
                                 boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.3)'
                             }}
                        />
                    )}
                </div>
            </div>
        ) : (
            <div className="text-gray-400 flex flex-col items-center animate-pulse">
                <p>Upload an image to start framing</p>
            </div>
        )}
    </div>
  );
};

export default PreviewCanvas;