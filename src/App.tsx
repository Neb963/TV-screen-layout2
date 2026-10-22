import { CanvasArea } from './components/CanvasArea';
import { Header } from './components/Header';
import { InspectorPanel } from './components/InspectorPanel';
import { LayersPanel } from './components/LayersPanel';
import { PresetsPanel } from './components/PresetsPanel';
import { useClipboardPaste } from './hooks/useClipboardPaste';

function App() {
  useClipboardPaste();

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-neutral-900 text-neutral-100 font-sans">
      <Header />

      {/* Main Workspace */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <aside className="w-64 border-r border-neutral-800 bg-neutral-950 flex flex-col shrink-0 h-full">
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="p-3 border-b border-neutral-800 font-medium text-xs text-neutral-400 uppercase tracking-wider">
              Layers
            </div>
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
              <LayersPanel />
            </div>
          </div>
          <div className="h-64 shrink-0 flex flex-col">
            <PresetsPanel />
          </div>
        </aside>

        {/* Canvas Area */}
        <section className="flex-1 bg-neutral-900 relative overflow-hidden flex flex-col" id="canvas-container">
          <CanvasArea />
        </section>

        {/* Right Panel (Inspector) */}
        <aside className="w-72 border-l border-neutral-800 bg-neutral-950 flex flex-col shrink-0">
          <div className="p-3 border-b border-neutral-800 font-medium text-xs text-neutral-400 uppercase tracking-wider">
            Inspector
          </div>
          <div className="flex-1 overflow-hidden">
            <InspectorPanel />
          </div>
        </aside>
      </main>
    </div>
  );
}

export default App;
