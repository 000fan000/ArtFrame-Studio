import React from 'react';
import { Check } from 'lucide-react';

interface ColorPickerProps {
  label: string;
  color: string;
  presets?: string[];
  onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ 
  label, 
  color, 
  presets = [], 
  onChange 
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      
      {/* Presets */}
      {presets.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {presets.map((preset) => (
            <button
              key={preset}
              onClick={() => onChange(preset)}
              className={`w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center transition-transform hover:scale-110 ${color === preset ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900' : ''}`}
              style={{ backgroundColor: preset }}
              aria-label={`Select color ${preset}`}
            >
              {color === preset && <Check size={14} className={preset.toLowerCase() === '#ffffff' ? 'text-black' : 'text-white'} />}
            </button>
          ))}
        </div>
      )}

      {/* Custom Picker */}
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-gray-600 shadow-sm">
            <input
                type="color"
                value={color}
                onChange={(e) => onChange(e.target.value)}
                className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer p-0 border-0"
            />
        </div>
        <span className="text-xs text-gray-400 font-mono uppercase">{color}</span>
      </div>
    </div>
  );
};

export default ColorPicker;