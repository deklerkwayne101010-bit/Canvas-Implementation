import React, { useState } from 'react';
import { ElementType } from '../types';
import { IconType, IconImage } from './Icons';

interface SidebarProps {
  onAddElement: (type: ElementType, payload?: any) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onAddElement }) => {
  const [activeTab, setActiveTab] = useState('text');

  const tabs = [
    { id: 'text', label: 'Text', icon: IconType },
    { id: 'images', label: 'Images', icon: IconImage },
  ];

  const handleDragStart = (e: React.DragEvent, type: ElementType, payload?: any) => {
    e.dataTransfer.setData('type', type);
    if (payload) {
      e.dataTransfer.setData('payload', JSON.stringify(payload));
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'text':
        return (
          <div className="space-y-4">
            <h3 className="font-bold text-gray-700">Add Text</h3>
            <div 
              className="p-4 bg-gray-100 rounded cursor-pointer hover:bg-gray-200 border border-gray-300"
              draggable
              onDragStart={(e) => handleDragStart(e, ElementType.TEXT, { fontSize: 32, fontWeight: 'bold', content: 'Heading' })}
              onClick={() => onAddElement(ElementType.TEXT, { fontSize: 32, fontWeight: 'bold', content: 'Heading' })}
            >
              <h1 className="text-2xl font-bold">Add a Heading</h1>
            </div>
            <div 
              className="p-3 bg-gray-100 rounded cursor-pointer hover:bg-gray-200 border border-gray-300"
              draggable
              onDragStart={(e) => handleDragStart(e, ElementType.TEXT, { fontSize: 24, fontWeight: 'normal', content: 'Subheading' })}
               onClick={() => onAddElement(ElementType.TEXT, { fontSize: 24, fontWeight: 'normal', content: 'Subheading' })}
            >
              <h2 className="text-xl">Add a Subheading</h2>
            </div>
            <div 
              className="p-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200 border border-gray-300"
              draggable
              onDragStart={(e) => handleDragStart(e, ElementType.TEXT, { fontSize: 16, content: 'Little bit of body text' })}
               onClick={() => onAddElement(ElementType.TEXT, { fontSize: 16, content: 'Little bit of body text' })}
            >
              <p className="text-sm">Add a little bit of body text</p>
            </div>
          </div>
        );
      case 'images':
          return (
              <div className="space-y-4">
                  <div className="p-4 border-2 border-dashed border-gray-300 rounded text-center text-gray-500 hover:bg-gray-50 cursor-pointer">
                      <label className="cursor-pointer block">
                          Upload Image
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (ev) => {
                                      onAddElement(ElementType.IMAGE, { src: ev.target?.result });
                                  };
                                  reader.readAsDataURL(file);
                              }
                          }} />
                      </label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                      {[1, 2, 3, 4].map(i => (
                          <img 
                            key={i}
                            src={`https://picsum.photos/200/200?random=${i}`} 
                            alt="Random" 
                            className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-80"
                            onClick={() => onAddElement(ElementType.IMAGE, { src: `https://picsum.photos/400/400?random=${i}` })}
                          />
                      ))}
                  </div>
              </div>
          )
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full bg-white border-r shadow-xl z-20">
      <div className="w-20 flex flex-col items-center py-4 bg-slate-900 text-slate-400 gap-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 p-2 rounded w-full transition-colors ${activeTab === tab.id ? 'text-white bg-slate-800' : 'hover:text-white'}`}
          >
            <tab.icon className="w-6 h-6" />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
      <div className="w-72 bg-gray-50 flex flex-col h-full border-r">
          <div className="p-4 overflow-y-auto h-full scrollbar-thin">
            {renderContent()}
          </div>
      </div>
    </div>
  );
};

export default Sidebar;