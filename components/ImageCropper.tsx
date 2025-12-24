import React, { useState, useRef, useEffect } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import { Check, X } from 'lucide-react';
import Button from './Button';
import { getCroppedImg } from '../utils';

interface ImageCropperProps {
  imageSrc: string;
  onCancel: () => void;
  onCropComplete: (croppedImage: string) => void;
}

// Helper to center the crop initially
function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect?: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect || 16 / 9,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

const ImageCropper: React.FC<ImageCropperProps> = ({ imageSrc, onCancel, onCropComplete }) => {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [isProcessing, setIsProcessing] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Initialize crop when image loads
  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    const initialCrop = centerAspectCrop(width, height);
    setCrop(initialCrop);
    // Initialize completed crop immediately for center start
    // Note: centerAspectCrop returns a % crop, we might need to let the library handle the first update
  }

  const handleSave = async () => {
    if (!imgRef.current || !completedCrop) {
        // If no crop interaction happened, just return original
        onCropComplete(imageSrc);
        return;
    }
    
    setIsProcessing(true);
    try {
      const image = imgRef.current;
      
      // Calculate the scale between the displayed image and the natural (actual) image size
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      // Convert the display pixel crop to actual image pixel crop
      const actualPixelCrop = {
          x: completedCrop.x * scaleX,
          y: completedCrop.y * scaleY,
          width: completedCrop.width * scaleX,
          height: completedCrop.height * scaleY,
      };

      // Guard against 0-width/height (user clicked without dragging)
      if (actualPixelCrop.width === 0 || actualPixelCrop.height === 0) {
           onCropComplete(imageSrc);
           return;
      }

      const croppedImage = await getCroppedImg(imageSrc, actualPixelCrop);
      onCropComplete(croppedImage);
    } catch (e) {
      console.error(e);
      alert('Something went wrong cropping the image.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col animate-fade-in">
      <div className="flex-1 overflow-auto flex items-center justify-center p-8">
        <ReactCrop
          crop={crop}
          onChange={(c) => setCrop(c)}
          onComplete={(c) => setCompletedCrop(c)}
          className="max-h-[80vh]"
        >
          <img
            ref={imgRef}
            src={imageSrc}
            onLoad={onImageLoad}
            alt="Crop me"
            className="max-w-full max-h-[75vh] object-contain shadow-2xl"
          />
        </ReactCrop>
      </div>

      <div className="bg-gray-900 border-t border-gray-800 p-6">
        <div className="max-w-xl mx-auto flex flex-col gap-2">
            <p className="text-gray-400 text-sm text-center mb-2">Drag the corners to resize the crop area.</p>
            <div className="flex justify-center gap-4">
                <Button variant="secondary" onClick={onCancel} disabled={isProcessing}>
                    <X size={18} className="mr-2" />
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSave} disabled={isProcessing}>
                    <Check size={18} className="mr-2" />
                    {isProcessing ? 'Processing...' : 'Apply Crop'}
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;