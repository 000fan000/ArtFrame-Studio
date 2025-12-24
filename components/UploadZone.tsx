import React, { useCallback, useState } from 'react';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';

interface UploadZoneProps {
  onUpload: (file: File) => void;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onUpload(file);
      } else {
        alert('Please upload an image file');
      }
    }
  }, [onUpload]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-[400px] w-full max-w-2xl mx-auto p-6"
    >
      <div 
        className={`w-full h-96 border-4 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all duration-300 cursor-pointer relative overflow-hidden
          ${isDragging 
            ? 'border-blue-500 bg-blue-500/10 scale-105' 
            : 'border-gray-700 bg-gray-800/50 hover:bg-gray-800 hover:border-gray-600'
          }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <input 
          id="file-upload"
          type="file" 
          className="hidden" 
          accept="image/*"
          onChange={handleFileInput}
        />
        
        <div className="flex flex-col items-center p-8 text-center pointer-events-none">
          <div className="bg-gray-700 p-4 rounded-full mb-6">
            <UploadCloud size={48} className="text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {isDragging ? 'Drop it here!' : 'Upload Artwork'}
          </h2>
          <p className="text-gray-400 mb-6 max-w-sm">
            Drag and drop your photo here, or click to browse files.
            <br/><span className="text-xs opacity-60">Supports JPG, PNG, WebP up to 10MB</span>
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            Select File
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadZone;