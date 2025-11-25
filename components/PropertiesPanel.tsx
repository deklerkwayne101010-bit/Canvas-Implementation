import React, { useEffect, useState } from 'react';
import { CanvasElement, ElementType, ShapeType } from '../types';
import { generateMagicText } from '../services/geminiService';
import { IconSparkles, IconBold, IconItalic, IconUnderline } from './Icons';

interface PropertiesPanelProps {
  element: CanvasElement | null;
  onUpdate: (id: string, updates: Partial<CanvasElement>) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ element, onUpdate }) => {
  const [magicLoading, setMagicLoading] = useState(false);

  if (!element) return null;

  const handleMagicRewrite = async () => {
     if (!element.content) return;
     setMagicLoading(true);
     try {
         const newText = await generateMagicText("more professional and concise", element.content);
         onUpdate(element.id, { content: newText });
     } catch (e) {
         alert("Failed to rewrite text");
     } finally {
         setMagicLoading(false);
     }
  };

  return (
    <div className="w-64 bg-white border-l h-full flex flex-col shadow-xl z-20">
      <div className="p-4 border-b bg-gray-50">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Properties</h3>
      </div>
      
      <div className="p-4 space-y-6 overflow-y-auto flex-1">
        {/* Common Properties */}
        <div className="space-y-3">
           <label className="text-xs font-semibold text-gray-500">Position</label>
           <div className="grid grid-cols-2 gap-2">
              <div>
                  <span className="text-[10px] text-gray-400">X</span>
                  <input 
                    type="number" 
                    value={Math.round(element.x)} 
                    onChange={(e) => onUpdate(element.id, { x: Number(e.target.value) })}
                    className="w-full border rounded px-2 py-1 text-sm"
                  />
              </div>
              <div>
                  <span className="text-[10px] text-gray-400">Y</span>
                  <input 
                    type="number" 
                    value={Math.round(element.y)} 
                    onChange={(e) => onUpdate(element.id, { y: Number(e.target.value) })}
                    className="w-full border rounded px-2 py-1 text-sm"
                  />
              </div>
           </div>
           
           <div className="grid grid-cols-2 gap-2">
              <div>
                  <span className="text-[10px] text-gray-400">W</span>
                  <input 
                    type="number" 
                    value={Math.round(element.width)} 
                    onChange={(e) => onUpdate(element.id, { width: Number(e.target.value) })}
                    className="w-full border rounded px-2 py-1 text-sm"
                  />
              </div>
              <div>
                  <span className="text-[10px] text-gray-400">H</span>
                  <input 
                    type="number" 
                    value={Math.round(element.height)} 
                    onChange={(e) => onUpdate(element.id, { height: Number(e.target.value) })}
                    className="w-full border rounded px-2 py-1 text-sm"
                  />
              </div>
           </div>
        </div>
        
        <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500">Layer Opacity</label>
            <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01"
                value={element.opacity ?? 1} 
                onChange={(e) => onUpdate(element.id, { opacity: parseFloat(e.target.value) })}
                className="w-full accent-purple-600"
            />
        </div>

        {/* Text Specific */}
        {element.type === ElementType.TEXT && (
          <div className="space-y-4 pt-4 border-t">
            <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-gray-500">Text Style</label>
                <button 
                    onClick={handleMagicRewrite}
                    disabled={magicLoading}
                    className="text-[10px] flex items-center gap-1 text-purple-600 bg-purple-50 px-2 py-1 rounded hover:bg-purple-100"
                >
                    <IconSparkles className="w-3 h-3" /> {magicLoading ? '...' : 'Rewrite'}
                </button>
            </div>
            
            <textarea
                value={element.content}
                onChange={(e) => onUpdate(element.id, { content: e.target.value })}
                className="w-full border rounded p-2 text-sm"
                rows={3}
            />

            <div className="flex gap-2 items-center">
                 <input 
                    type="color" 
                    value={element.color || '#000000'}
                    onChange={(e) => onUpdate(element.id, { color: e.target.value })}
                    className="h-8 w-8 rounded cursor-pointer border-0 p-0"
                 />
                 <input 
                    type="number"
                    value={element.fontSize || 16}
                    onChange={(e) => onUpdate(element.id, { fontSize: Number(e.target.value) })}
                    className="w-full border rounded px-2 text-sm h-8"
                    placeholder="Size"
                 />
            </div>

            <div className="flex gap-1 justify-between">
                 <button 
                    onClick={() => onUpdate(element.id, { fontWeight: element.fontWeight === 'bold' ? 'normal' : 'bold' })}
                    className={`flex-1 py-1 border rounded flex justify-center ${element.fontWeight === 'bold' ? 'bg-purple-100 border-purple-300' : 'bg-gray-50'}`}
                 >
                    <IconBold className="w-4 h-4" />
                 </button>
                 <button 
                    onClick={() => onUpdate(element.id, { fontStyle: element.fontStyle === 'italic' ? 'normal' : 'italic' })}
                    className={`flex-1 py-1 border rounded flex justify-center ${element.fontStyle === 'italic' ? 'bg-purple-100 border-purple-300' : 'bg-gray-50'}`}
                 >
                    <IconItalic className="w-4 h-4" />
                 </button>
                 <button 
                    onClick={() => onUpdate(element.id, { textDecoration: element.textDecoration === 'underline' ? 'none' : 'underline' })}
                    className={`flex-1 py-1 border rounded flex justify-center ${element.textDecoration === 'underline' ? 'bg-purple-100 border-purple-300' : 'bg-gray-50'}`}
                 >
                    <IconUnderline className="w-4 h-4" />
                 </button>
            </div>
            
            <div className="flex gap-2 text-sm">
                <button 
                    className={`flex-1 py-1 border rounded ${element.textAlign === 'left' ? 'bg-purple-100 border-purple-300' : ''}`}
                    onClick={() => onUpdate(element.id, { textAlign: 'left' })}
                >Left</button>
                 <button 
                    className={`flex-1 py-1 border rounded ${element.textAlign === 'center' ? 'bg-purple-100 border-purple-300' : ''}`}
                    onClick={() => onUpdate(element.id, { textAlign: 'center' })}
                >Center</button>
                 <button 
                    className={`flex-1 py-1 border rounded ${element.textAlign === 'right' ? 'bg-purple-100 border-purple-300' : ''}`}
                    onClick={() => onUpdate(element.id, { textAlign: 'right' })}
                >Right</button>
            </div>
          </div>
        )}

        {/* Shape Specific */}
        {element.type === ElementType.SHAPE && (
             <div className="space-y-4 pt-4 border-t">
                <label className="text-xs font-semibold text-gray-500">Appearance</label>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Fill Color</span>
                    <input 
                        type="color" 
                        value={element.backgroundColor || '#000000'}
                        onChange={(e) => onUpdate(element.id, { backgroundColor: e.target.value })}
                        className="h-8 w-8 rounded cursor-pointer border-0 p-0"
                    />
                </div>
                {element.shapeType === ShapeType.RECTANGLE && (
                     <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Radius</span>
                        <input 
                            type="range"
                            min="0"
                            max="100"
                            value={element.borderRadius || 0}
                            onChange={(e) => onUpdate(element.id, { borderRadius: Number(e.target.value) })}
                            className="w-full accent-purple-600"
                        />
                     </div>
                )}
             </div>
        )}
        
        {/* Image Specific */}
         {element.type === ElementType.IMAGE && (
             <div className="space-y-4 pt-4 border-t">
                <label className="text-xs font-semibold text-gray-500">Image Settings</label>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Radius</span>
                        <input 
                            type="range"
                            min="0"
                            max="100"
                            value={element.borderRadius || 0}
                            onChange={(e) => onUpdate(element.id, { borderRadius: Number(e.target.value) })}
                            className="w-full accent-purple-600"
                        />
                </div>
             </div>
        )}
      </div>
    </div>
  );
};

export default PropertiesPanel;