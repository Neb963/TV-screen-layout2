import { useEditorStore } from '../store/useEditorStore';
import { ChevronUp, ChevronDown, ChevronsUp, ChevronsDown, Eye, EyeOff, Lock, Unlock } from 'lucide-react';

export function LayersPanel() {
  const {
    scene,
    selectedIds,
    selectElements,
    updateElement,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack
  } = useEditorStore();

  const elements = [...scene.elements].reverse(); // Render top-most elements first (visual z-order)

  if (elements.length === 0) {
    return (
      <div className="text-sm text-neutral-500 italic p-4 text-center">
        No layers yet
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Selected Layer Controls */}
      <div className="flex items-center justify-between p-2 border-b border-neutral-800 bg-neutral-900/50">
        <span className="text-xs text-neutral-400">Order</span>
        <div className="flex space-x-1">
          <button
            onClick={() => selectedIds.length === 1 && bringToFront(selectedIds[0])}
            disabled={selectedIds.length !== 1}
            className="p-1 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded disabled:opacity-30"
            title="Bring to Front"
          >
            <ChevronsUp size={14} />
          </button>
          <button
            onClick={() => selectedIds.length === 1 && bringForward(selectedIds[0])}
            disabled={selectedIds.length !== 1}
            className="p-1 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded disabled:opacity-30"
            title="Bring Forward"
          >
            <ChevronUp size={14} />
          </button>
          <button
            onClick={() => selectedIds.length === 1 && sendBackward(selectedIds[0])}
            disabled={selectedIds.length !== 1}
            className="p-1 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded disabled:opacity-30"
            title="Send Backward"
          >
            <ChevronDown size={14} />
          </button>
          <button
            onClick={() => selectedIds.length === 1 && sendToBack(selectedIds[0])}
            disabled={selectedIds.length !== 1}
            className="p-1 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded disabled:opacity-30"
            title="Send to Back"
          >
            <ChevronsDown size={14} />
          </button>
        </div>
      </div>

      {/* Layer List */}
      <div className="flex-1 overflow-y-auto">
        {elements.map((el) => {
          const isSelected = selectedIds.includes(el.id);

          return (
            <div
              key={el.id}
              className={`flex items-center justify-between px-3 py-2 text-sm border-b border-neutral-800/50 cursor-pointer select-none transition-colors ${
                isSelected ? 'bg-blue-600/20 text-white' : 'text-neutral-300 hover:bg-neutral-800'
              }`}
              onClick={(e) => {
                if (e.shiftKey || e.metaKey || e.ctrlKey) {
                  if (isSelected) {
                    selectElements(selectedIds.filter(id => id !== el.id));
                  } else {
                    selectElements([...selectedIds, el.id]);
                  }
                } else {
                  selectElements([el.id]);
                }
              }}
            >
              <div className="flex items-center space-x-2 truncate flex-1">
                <span className="text-xs text-neutral-500 uppercase w-10 shrink-0">{el.type}</span>
                <span className="truncate">{el.name || 'Unnamed'}</span>
              </div>

              <div className="flex items-center space-x-2 ml-2 shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateElement(el.id, { locked: !el.locked });
                  }}
                  className={`p-1 rounded ${el.locked ? 'text-red-400' : 'text-neutral-500 hover:text-white'}`}
                >
                  {el.locked ? <Lock size={14} /> : <Unlock size={14} />}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateElement(el.id, { hidden: !el.hidden });
                  }}
                  className={`p-1 rounded ${el.hidden ? 'text-neutral-600' : 'text-neutral-500 hover:text-white'}`}
                >
                  {el.hidden ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
