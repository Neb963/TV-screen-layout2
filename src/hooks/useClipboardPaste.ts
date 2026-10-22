import { useEffect } from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { fileToBase64, getImageDimensions } from '../utils/media';

export function useClipboardPaste() {
  const addElement = useEditorStore((state) => state.addElement);

  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      // Don't intercept paste if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault();
            try {
              const base64 = await fileToBase64(file);
              const { width, height } = await getImageDimensions(base64);

              // Scale down if huge
              const maxDim = 800;
              let finalWidth = width;
              let finalHeight = height;

              if (width > maxDim || height > maxDim) {
                const ratio = Math.min(maxDim / width, maxDim / height);
                finalWidth = width * ratio;
                finalHeight = height * ratio;
              }

              addElement({
                type: 'image',
                name: file.name || 'Pasted Image',
                src: base64,
                x: 100,
                y: 100,
                width: finalWidth,
                height: finalHeight,
                rotation: 0,
                opacity: 1,
                locked: false,
                hidden: false,
              } as any);
            } catch (err) {
              console.error('Failed to paste image', err);
            }
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [addElement]);
}
