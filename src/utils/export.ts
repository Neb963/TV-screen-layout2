import type { Scene } from '../types';
import Konva from 'konva';

export const saveProjectFile = (scene: Scene, filename: string = 'news-screen-project.json') => {
  const json = JSON.stringify(scene, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const loadProjectFile = (): Promise<Scene> => {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const result = e.target?.result as string;
          const scene = JSON.parse(result) as Scene;
          // Basic validation
          if (scene.width && scene.height && Array.isArray(scene.elements)) {
            resolve(scene);
          } else {
            reject(new Error('Invalid project file format'));
          }
        } catch (err) {
          reject(err);
        }
      };
      reader.readAsText(file);
    };

    input.click();
  });
};

export const exportHighResPNG = (stage: Konva.Stage | null, targetWidth: number = 1920) => {
  if (!stage) return;

  // Calculate pixel ratio to hit target width
  // Since our stage might be scaled down visually, we want to export based on logical dimension
  // Wait, stage size is visual size. We need the export to match original scene width exactly.

  // Best approach for export in Konva when scaled:
  // 1. Remember original scale
  // 2. Set scale to 1 to get exact pixel-perfect 1:1 render
  // 3. Export data URL
  // 4. Restore scale

  const oldScale = stage.scaleX();
  const oldPos = stage.position();

  stage.scale({ x: 1, y: 1 });
  stage.position({ x: 0, y: 0 });

  // Ensure we don't capture selection transformers
  const transformers = stage.find('Transformer');
  transformers.forEach(t => t.hide());

  // Redraw sync before export
  stage.batchDraw();

  // Get width from background rect to export just the scene area
  const background = stage.findOne('.background');
  const width = background ? background.width() : targetWidth;
  const height = background ? background.height() : targetWidth * (1080/1920);

  // Determine pixel ratio for high res if needed (e.g., 2x for 4K)
  const pixelRatio = 2; // For 4K export of 1080p canvas

  try {
    const dataURL = stage.toDataURL({
      pixelRatio: pixelRatio,
      x: 0,
      y: 0,
      width: width,
      height: height,
    });

    const link = document.createElement('a');
    link.download = `news-screen-export-${Date.now()}.png`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  } finally {
    // Always restore state
    transformers.forEach(t => t.show());
    stage.scale({ x: oldScale, y: oldScale });
    stage.position(oldPos);
    stage.batchDraw();
  }
};
