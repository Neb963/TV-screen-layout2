import { useEditorStore } from '../store/useEditorStore';
import { presets } from '../presets';

export function PresetsPanel() {
  const { setScene } = useEditorStore();

  return (
    <div className="flex flex-col h-full border-t border-neutral-800">
      <div className="p-3 border-b border-neutral-800 font-medium text-xs text-neutral-400 uppercase tracking-wider bg-neutral-950">
        Presets
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {Object.entries(presets).map(([name, preset]) => (
          <button
            key={name}
            onClick={() => setScene(preset)}
            className="w-full text-left px-3 py-2 bg-neutral-800 hover:bg-neutral-700 rounded transition-colors text-sm font-medium text-neutral-300"
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}
