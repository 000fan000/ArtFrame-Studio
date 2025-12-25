import React from 'react';
import { X, Monitor, Image as ImageIcon, Loader2 } from 'lucide-react';
import Button from './Button';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (option: 'screen' | 'original') => void;
  isProcessing: boolean;
}

const DownloadModal: React.FC<DownloadModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  isProcessing 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
        <button 
          onClick={onClose}
          disabled={isProcessing}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <h3 className="text-xl font-bold text-white mb-2">Download Artwork</h3>
        <p className="text-gray-400 text-sm mb-6">Choose your export quality.</p>

        <div className="space-y-3">
          <button
            onClick={() => onConfirm('screen')}
            disabled={isProcessing}
            className="w-full flex items-center p-4 bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-blue-500 rounded-xl transition-all group text-left"
          >
            <div className="bg-gray-700 group-hover:bg-blue-600/20 text-gray-300 group-hover:text-blue-400 p-3 rounded-lg mr-4 transition-colors">
              <Monitor size={24} />
            </div>
            <div>
              <span className="block font-semibold text-gray-200 group-hover:text-white">Screen Resolution</span>
              <span className="text-xs text-gray-500">Optimized for social media and screen viewing. (~2x scale)</span>
            </div>
          </button>

          <button
            onClick={() => onConfirm('original')}
            disabled={isProcessing}
            className="w-full flex items-center p-4 bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-green-500 rounded-xl transition-all group text-left"
          >
            <div className="bg-gray-700 group-hover:bg-green-600/20 text-gray-300 group-hover:text-green-400 p-3 rounded-lg mr-4 transition-colors">
              <ImageIcon size={24} />
            </div>
            <div>
              <span className="block font-semibold text-gray-200 group-hover:text-white">Original Quality</span>
              <span className="text-xs text-gray-500">Preserves original image dimensions and details. Best for printing.</span>
            </div>
          </button>
        </div>

        {isProcessing && (
          <div className="mt-6 flex items-center justify-center text-blue-400 gap-2">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-sm font-medium">Generating high-res image...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadModal;