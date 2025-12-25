import React, { useRef, useEffect } from 'react';
import { FrameConfig, MatConfig, WallConfig, ArtState, FrameStyle, WallStyle } from '../types';
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
    return currentFrameStyle?.gradient || currentFrameStyle?.color || '#000000';
  };

  const getWallStyles = () => {
    const baseStyles: React.CSSProperties = {
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
      transition: 'background-color 0.5s ease, background-image 0.5s ease',
    };

    // Priority 1: Custom Image Upload
    if (wallConfig.style === WallStyle.CUSTOM_IMAGE && wallConfig.image) {
        return { ...baseStyles, backgroundImage: `url("${wallConfig.image}")` };
    }

    // Priority 2: Standard Styles
    const style = WALL_STYLES.find(s => s.id === wallConfig.style);
    
    if (wallConfig.style === WallStyle.SOLID_COLOR) {
        return { ...baseStyles, backgroundColor: wallConfig.color, backgroundImage: 'none' };
    }

    if (!style) return { ...baseStyles, backgroundColor: '#e2e8f0' };

    // Handle gradients (Dark Studio) or url() patterns
    if (style.css.includes('gradient')) {
        return { ...baseStyles, backgroundImage: style.css };
    } else if (style.css.includes('url')) {
        return { ...baseStyles, backgroundImage: style.css };
    }
    
    return baseStyles;
  };

  // Determine shadow intensity based on depth
  const dropShadow = `0px 10px 30px rgba(0,0,0, ${0.3 + (frameConfig.depth * 0.01)})`;
  const innerBevel = `inset 0px 0px ${frameConfig.depth / 2}px rgba(0,0,0,0.5)`;
  
  // Mat Texture (subtle noise)
  const matTexture = matConfig.texture === 'TEXTURED' 
    ? `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E"), linear-gradient(${matConfig.color}, ${matConfig.color})`
    : matConfig.color;

  const frameBackground = getFrameBackground();
  const posX = wallConfig.position?.x || 0;
  const posY = wallConfig.position?.y || 0;

  return (
    <div 
        className="flex-1 w-full h-full relative overflow-hidden flex items-center justify-center p-8"
        style={getWallStyles()}
    >
        {/* Render Area */}
        {art.image ? (
            <div 
                ref={captureRef}
                className="relative transition-all duration-300 ease-out origin-center"
                style={{
                    transform: `translate(${posX}px, ${posY}px) scale(${wallConfig.scale})`,
                    boxShadow: dropShadow,
                    background: frameBackground,
                    padding: `${frameConfig.width}px`,
                    position: 'relative',
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
                        className="block w-auto h-auto object-contain shadow-sm"
                        style={{
                           maxHeight: '60vh', 
                           maxWidth: '60vw',  
                           boxShadow: !matConfig.enabled ? '0 0 5px rgba(0,0,0,0.5)' : 'none',
                           transform: `rotate(${art.rotation}deg)`,
                           transition: 'transform 0.3s ease-out'
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