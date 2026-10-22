import React from 'react';
import { useEditorStore } from '../store/useEditorStore';

export function InspectorPanel() {
  const { scene, selectedIds, updateElement, removeElement } = useEditorStore();

  if (selectedIds.length === 0) {
    return (
      <div className="text-sm text-neutral-500 italic p-4 text-center">
        Select an element to edit properties
      </div>
    );
  }

  if (selectedIds.length > 1) {
    return (
      <div className="text-sm text-neutral-500 italic p-4 text-center">
        Multiple elements selected
      </div>
    );
  }

  const selectedElement = scene.elements.find((el) => el.id === selectedIds[0]);

  if (!selectedElement) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let parsedValue: any = value;

    if (type === 'number' || type === 'range') {
      parsedValue = parseFloat(value);
      if (isNaN(parsedValue)) return;
    }

    // Call update without saving history explicitly here if rapid typing,
    // but standard DOM change events on blur or enter might be better.
    // We'll trust zustand batching for simple changes.
    updateElement(selectedElement.id, { [name]: parsedValue });
  };

  const handleDragSave = () => {
    useEditorStore.getState().saveHistory();
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Basic Properties - Available for all elements */}
      <div className="p-4 border-b border-neutral-800">
        <h3 className="text-xs font-semibold uppercase text-neutral-400 mb-3 tracking-wider">
          Layout & Transform
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] text-neutral-500 uppercase">X (px)</label>
            <input
              type="number"
              name="x"
              value={Math.round(selectedElement.x)}
              onChange={handleChange}
              onBlur={handleDragSave}
              className="bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] text-neutral-500 uppercase">Y (px)</label>
            <input
              type="number"
              name="y"
              value={Math.round(selectedElement.y)}
              onChange={handleChange}
              onBlur={handleDragSave}
              className="bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] text-neutral-500 uppercase">Width</label>
            <input
              type="number"
              name="width"
              value={Math.round(selectedElement.width)}
              onChange={handleChange}
              onBlur={handleDragSave}
              className="bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] text-neutral-500 uppercase">Height</label>
            <input
              type="number"
              name="height"
              value={Math.round(selectedElement.height)}
              onChange={handleChange}
              onBlur={handleDragSave}
              className="bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="flex flex-col space-y-1 col-span-2">
            <label className="text-[10px] text-neutral-500 uppercase">Rotation (°)</label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                name="rotation"
                min="0"
                max="360"
                value={Math.round(selectedElement.rotation)}
                onChange={handleChange}
                onMouseUp={handleDragSave}
                className="flex-1 accent-blue-500"
              />
              <input
                type="number"
                name="rotation"
                value={Math.round(selectedElement.rotation)}
                onChange={handleChange}
                onBlur={handleDragSave}
                className="w-16 bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-sm focus:border-blue-500 focus:outline-none text-right"
              />
            </div>
          </div>
          <div className="flex flex-col space-y-1 col-span-2">
            <label className="text-[10px] text-neutral-500 uppercase">Opacity ({Math.round(selectedElement.opacity * 100)}%)</label>
            <input
              type="range"
              name="opacity"
              min="0"
              max="1"
              step="0.05"
              value={selectedElement.opacity}
              onChange={handleChange}
              onMouseUp={handleDragSave}
              className="w-full accent-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Delete Action */}
      {/* Typography Properties */}
      {selectedElement.type === 'text' && (
        <div className="p-4 border-b border-neutral-800">
          <h3 className="text-xs font-semibold uppercase text-neutral-400 mb-3 tracking-wider">
            Typography
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col space-y-1 col-span-2">
              <label className="text-[10px] text-neutral-500 uppercase">Text Content</label>
              <textarea
                name="text"
                value={(selectedElement as any).text || ''}
                onChange={handleChange}
                onBlur={handleDragSave}
                rows={2}
                className="bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-sm focus:border-blue-500 focus:outline-none resize-none"
              />
            </div>
            <div className="flex flex-col space-y-1 col-span-2">
              <label className="text-[10px] text-neutral-500 uppercase">Font Family</label>
              <select
                name="fontFamily"
                value={(selectedElement as any).fontFamily || 'Arial'}
                onChange={handleChange}
                onBlur={handleDragSave}
                className="bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="Arial">Arial</option>
                <option value="Inter">Inter</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
              </select>
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] text-neutral-500 uppercase">Font Size</label>
              <input
                type="number"
                name="fontSize"
                value={(selectedElement as any).fontSize || 16}
                onChange={handleChange}
                onBlur={handleDragSave}
                className="bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] text-neutral-500 uppercase">Fill Color</label>
              <input
                type="color"
                name="fill"
                value={(selectedElement as any).fill || '#ffffff'}
                onChange={handleChange}
                onBlur={handleDragSave}
                className="w-full h-8 bg-neutral-800 border border-neutral-700 rounded cursor-pointer"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] text-neutral-500 uppercase">Alignment</label>
              <select
                name="align"
                value={(selectedElement as any).align || 'left'}
                onChange={handleChange}
                onBlur={handleDragSave}
                className="bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] text-neutral-500 uppercase">Font Style</label>
              <select
                name="fontStyle"
                value={(selectedElement as any).fontStyle || 'normal'}
                onChange={handleChange}
                onBlur={handleDragSave}
                className="bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="normal">Normal</option>
                <option value="bold">Bold</option>
                <option value="italic">Italic</option>
                <option value="italic bold">Bold Italic</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Shape Properties */}
      {(selectedElement.type === 'rect' || selectedElement.type === 'ellipse') && (
        <div className="p-4 border-b border-neutral-800">
          <h3 className="text-xs font-semibold uppercase text-neutral-400 mb-3 tracking-wider">
            Appearance
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] text-neutral-500 uppercase">Fill Color</label>
              <input
                type="color"
                name="fill"
                value={(selectedElement as any).fill || '#ffffff'}
                onChange={handleChange}
                onBlur={handleDragSave}
                className="w-full h-8 bg-neutral-800 border border-neutral-700 rounded cursor-pointer"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] text-neutral-500 uppercase">Stroke Color</label>
              <input
                type="color"
                name="stroke"
                value={(selectedElement as any).stroke || '#000000'}
                onChange={handleChange}
                onBlur={handleDragSave}
                className="w-full h-8 bg-neutral-800 border border-neutral-700 rounded cursor-pointer"
              />
            </div>
            <div className="flex flex-col space-y-1 col-span-2">
              <label className="text-[10px] text-neutral-500 uppercase">Stroke Width</label>
              <input
                type="number"
                name="strokeWidth"
                value={(selectedElement as any).strokeWidth || 0}
                onChange={handleChange}
                onBlur={handleDragSave}
                className="bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Action */}
      <div className="p-4 mt-auto">
        <button
          onClick={() => removeElement(selectedElement.id)}
          className="w-full py-2 bg-red-900/30 text-red-500 border border-red-900/50 hover:bg-red-900/50 rounded transition-colors text-sm font-medium"
        >
          Delete Element
        </button>
      </div>
    </div>
  );
}
