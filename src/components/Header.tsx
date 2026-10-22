import { useEditorStore } from '../store/useEditorStore';
import { saveProjectFile, loadProjectFile } from '../utils/export';

export function Header() {
  const { undo, redo, history, scene, setScene, addElement } = useEditorStore();

  const handleSave = () => {
    saveProjectFile(scene);
  };

  const handleLoad = async () => {
    try {
      const loadedScene = await loadProjectFile();
      setScene(loadedScene);
    } catch (err) {
      console.error('Error loading project', err);
      alert('Failed to load project file');
    }
  };

  const triggerExport = () => {
    // We dispatch a custom event that CanvasArea will listen to,
    // since the stage ref lives inside CanvasArea.
    window.dispatchEvent(new CustomEvent('export-png'));
  };

  return (
    <header className="h-14 border-b border-neutral-800 bg-neutral-950 flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center font-bold text-xs">
          TV
        </div>
        <h1 className="font-medium text-sm">News Screen Designer</h1>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={undo}
          disabled={history.past.length === 0}
          className="text-xs text-neutral-400 hover:text-white px-2 py-1 disabled:opacity-50"
        >
          Undo
        </button>
        <button
          onClick={redo}
          disabled={history.future.length === 0}
          className="text-xs text-neutral-400 hover:text-white px-2 py-1 disabled:opacity-50"
        >
          Redo
        </button>
        <div className="w-px h-4 bg-neutral-800" />

        <button
          onClick={() => addElement({
            type: 'rect',
            name: 'Rectangle',
            x: 100, y: 100, width: 200, height: 200, rotation: 0, opacity: 1, locked: false, hidden: false,
            fill: '#0033a0', stroke: '#ffffff', strokeWidth: 0
          } as any)}
          className="text-xs bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded transition-colors"
        >
          + Rect
        </button>
        <button
          onClick={() => addElement({
            type: 'ellipse',
            name: 'Ellipse',
            x: 150, y: 150, width: 200, height: 200, rotation: 0, opacity: 1, locked: false, hidden: false,
            fill: '#cc0000', stroke: '#ffffff', strokeWidth: 0
          } as any)}
          className="text-xs bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded transition-colors"
        >
          + Ellipse
        </button>
        <button
          onClick={() => addElement({
            type: 'text',
            name: 'Text',
            x: 100, y: 100, width: 400, height: 100, rotation: 0, opacity: 1, locked: false, hidden: false,
            text: 'BREAKING NEWS',
            fontSize: 64,
            fontFamily: 'Arial',
            fontStyle: 'bold',
            align: 'center',
            fill: '#ffffff',
            lineHeight: 1,
            letterSpacing: 0
          } as any)}
          className="text-xs bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded transition-colors"
        >
          + Text
        </button>

        <div className="w-px h-4 bg-neutral-800" />

        <button
          onClick={handleLoad}
          className="text-xs bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded transition-colors"
        >
          Load JSON
        </button>
        <button
          onClick={handleSave}
          className="text-xs bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded transition-colors"
        >
          Save JSON
        </button>
        <button
          onClick={triggerExport}
          className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded transition-colors font-medium"
        >
          Export PNG (4K)
        </button>
      </div>
    </header>
  );
}
