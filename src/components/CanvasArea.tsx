import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Rect, Ellipse, Image as KonvaImage, Transformer, Group } from 'react-konva';
import { useEditorStore } from '../store/useEditorStore';
import Konva from 'konva';
import useImage from 'use-image';
import { EditableText } from './EditableText';

// Helper component for loading images within Konva
const ImageElement = ({ element, commonProps }: { element: any, commonProps: any }) => {
  const [image] = useImage(element.src);
  return (
    <KonvaImage
      image={image}
      {...commonProps}
      crop={
        element.cropWidth
          ? {
              x: element.cropX || 0,
              y: element.cropY || 0,
              width: element.cropWidth,
              height: element.cropHeight,
            }
          : undefined
      }
    />
  );
};

import { exportHighResPNG } from '../utils/export';

export function CanvasArea() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const layerRef = useRef<Konva.Layer>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  const { scene, selectedIds, selectElements, clearSelection, updateElement, saveHistory } = useEditorStore();

  const [stageScale, setStageScale] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });

  // Handle stage sizing and centering
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const { clientWidth, clientHeight } = container;

    // Calculate a fit scale (e.g., fit within viewport with some padding)
    const padding = 60;
    const scaleX = (clientWidth - padding * 2) / scene.width;
    const scaleY = (clientHeight - padding * 2) / scene.height;
    const initialScale = Math.min(scaleX, scaleY, 1); // Don't scale up past 100% initially

    setStageScale(initialScale);
    setStagePos({
      x: (clientWidth - scene.width * initialScale) / 2,
      y: (clientHeight - scene.height * initialScale) / 2,
    });
  }, [scene.width, scene.height]);

  // Listen for export event from header
  useEffect(() => {
    const handleExport = () => {
      exportHighResPNG(stageRef.current);
    };
    window.addEventListener('export-png', handleExport);
    return () => window.removeEventListener('export-png', handleExport);
  }, []);

  // Hook transformer to selected nodes
  useEffect(() => {
    if (transformerRef.current && stageRef.current) {
      const stage = stageRef.current;
      const selectedNodes = selectedIds.map((id) => stage.findOne(`#${id}`)).filter(Boolean) as Konva.Node[];
      transformerRef.current.nodes(selectedNodes);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [selectedIds, scene.elements]);

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    const scaleBy = 1.1;
    const oldScale = stageScale;
    const pointer = stage.getPointerPosition();

    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - stagePos.x) / oldScale,
      y: (pointer.y - stagePos.y) / oldScale,
    };

    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

    setStageScale(newScale);
    setStagePos({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });
  };

  const handleStageMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // If clicking on empty stage or the background rect, clear selection
    if (e.target === e.target.getStage() || e.target.name() === 'background') {
      clearSelection();
      return;
    }

    // Check if clicked on a transformer
    if (e.target.getParent()?.className === 'Transformer') {
      return;
    }

    // Select the clicked element
    const id = e.target.id();
    if (id) {
      const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
      const isSelected = selectedIds.includes(id);

      if (!metaPressed && !isSelected) {
        selectElements([id]);
      } else if (metaPressed && isSelected) {
        selectElements(selectedIds.filter((sId) => sId !== id));
      } else if (metaPressed && !isSelected) {
        selectElements([...selectedIds, id]);
      }
    }
  };

  return (
    <div className="w-full h-full relative" ref={containerRef}>
      {/* Zoom info overlay */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-neutral-800/80 backdrop-blur text-xs rounded-full px-3 py-1.5 shadow z-10 text-neutral-300 pointer-events-none">
        {scene.width} × {scene.height} • {Math.round(stageScale * 100)}%
      </div>

      <Stage
        width={containerRef.current?.clientWidth || 800}
        height={containerRef.current?.clientHeight || 600}
        scaleX={stageScale}
        scaleY={stageScale}
        x={stagePos.x}
        y={stagePos.y}
        onWheel={handleWheel}
        onMouseDown={handleStageMouseDown}
        ref={stageRef}
        draggable // Middle-click or space+drag can be implemented later; for now simple drag on stage background
      >
        <Layer ref={layerRef}>
          {/* Background */}
          <Rect
            x={0}
            y={0}
            width={scene.width}
            height={scene.height}
            fill={scene.backgroundColor}
            name="background"
            listening={true}
          />

          {/* Render Elements */}
          {scene.elements.map((el) => {
            if (el.hidden) return null;

            const commonProps = {
              width: el.width,
              height: el.height,
              opacity: el.opacity,
            };

            let shapeNode = null;

            if (el.type === 'rect') {
              shapeNode = (
                <Rect
                  {...commonProps}
                  fill={el.fill}
                  stroke={el.stroke}
                  strokeWidth={el.strokeWidth}
                  shadowColor={el.shadowColor}
                  shadowBlur={el.shadowBlur}
                  shadowOffsetX={el.shadowOffsetX}
                  shadowOffsetY={el.shadowOffsetY}
                  shadowOpacity={el.shadowOpacity}
                />
              );
            } else if (el.type === 'ellipse') {
              // Konva Ellipse uses radiusX/radiusY and is centered on its local x/y
              shapeNode = (
                <Ellipse
                  radiusX={el.width / 2}
                  radiusY={el.height / 2}
                  x={el.width / 2}
                  y={el.height / 2}
                  opacity={el.opacity}
                  fill={el.fill}
                  stroke={el.stroke}
                  strokeWidth={el.strokeWidth}
                  shadowColor={el.shadowColor}
                  shadowBlur={el.shadowBlur}
                  shadowOffsetX={el.shadowOffsetX}
                  shadowOffsetY={el.shadowOffsetY}
                  shadowOpacity={el.shadowOpacity}
                />
              );
            } else if (el.type === 'image') {
              shapeNode = <ImageElement element={el} commonProps={commonProps} />;
            } else if (el.type === 'text') {
              shapeNode = <EditableText element={el as any} isSelected={selectedIds.includes(el.id)} commonProps={commonProps} />;
            } else {
              // Placeholder for non-implemented types
              shapeNode = (
                <Rect
                  {...commonProps}
                  fill="rgba(255,255,255,0.2)"
                  stroke="red"
                  strokeWidth={2}
                />
              );
            }

            return (
              <Group
                key={el.id}
                id={el.id}
                x={el.x}
                y={el.y}
                rotation={el.rotation}
                draggable={!el.locked && selectedIds.includes(el.id)}
                onDragStart={() => saveHistory()}
                onDragEnd={(e) => {
                  updateElement(el.id, {
                    x: e.target.x(),
                    y: e.target.y(),
                  });
                }}
                onTransformStart={() => saveHistory()}
                onTransformEnd={(e) => {
                  const node = e.target;
                  updateElement(el.id, {
                    x: node.x(),
                    y: node.y(),
                    rotation: node.rotation(),
                    width: Math.max(5, node.width() * node.scaleX()),
                    height: Math.max(5, node.height() * node.scaleY()),
                  });
                  node.scaleX(1);
                  node.scaleY(1);
                }}
              >
                {shapeNode}
              </Group>
            );
          })}

          <Transformer
            ref={transformerRef}
            boundBoxFunc={(oldBox, newBox) => {
              if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
                return oldBox;
              }
              return newBox;
            }}
            ignoreStroke={true}
            padding={1}
          />
        </Layer>
      </Stage>
    </div>
  );
}
