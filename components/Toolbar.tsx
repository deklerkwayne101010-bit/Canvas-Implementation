import React from 'react';
import { IconDownload, IconUndo, IconRedo, IconTrash } from './Icons';

interface ToolbarProps {
  onUndo: () => void;
  onRedo: () => void;
  onDownload: () => void;
  onDelete: () => void;
  canUndo: boolean;
  canRedo: boolean;
  hasSelection: boolean;
  fileName: string;
  setFileName: (name: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ 
  onUndo, onRedo, onDownload, onDelete, canUndo, canRedo, hasSelection, fileName, setFileName 
}) => {
  return (
    <div className="h-14 bg-white border-b flex items-center justify-between px-4 z-10 shadow-sm">
      <div className="flex items-center gap-4">
         <div className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
            CanvasAI
         </div>
         <div className="h-6 w-px bg-gray-300 mx-2"></div>
         <div className="flex items-center gap-2">
             <button onClick={onUndo} disabled={!canUndo} className="p-2 hover:bg-gray-100 rounded disabled:opacity-30 transition">
                 <IconUndo className="w-4 h-4 text-gray-700" />
             </button>
             <button onClick={onRedo} disabled={!canRedo} className="p-2 hover:bg-gray-100 rounded disabled:opacity-30 transition">
                 <IconRedo className="w-4 h-4 text-gray-700" />
             </button>
         </div>
         <div className="h-6 w-px bg-gray-300 mx-2"></div>
         <input 
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="text-sm font-medium hover:border-gray-300 border border-transparent rounded px-2 py-1 transition focus:border-purple-500 focus:outline-none"
         />
      </div>

      <div className="flex items-center gap-3">
        {hasSelection && (
            <button 
                onClick={onDelete}
                className="p-2 text-red-500 hover:bg-red-50 rounded transition flex items-center gap-1"
                title="Delete Selection (Del)"
            >
                <IconTrash className="w-4 h-4" />
            </button>
        )}
        <button 
          onClick={onDownload}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition shadow-md"
        >
          <IconDownload className="w-4 h-4" />
          Export
        </button>
      </div>
    </div>
  );
};

export default Toolbar;