import { useState, useRef, useEffect } from 'react';
import { Text } from 'react-konva';
import { Html } from 'react-konva-utils';
import { useEditorStore } from '../store/useEditorStore';
import type { TextElement } from '../types';

interface Props {
  element: TextElement;
  isSelected: boolean;
  commonProps: any;
}

export function EditableText({ element, isSelected, commonProps }: Props) {
  const { updateElement, saveHistory } = useEditorStore();
  const [isEditing, setIsEditing] = useState(false);
  const textRef = useRef<any>(null);

  // If selection is lost while editing, stop editing
  useEffect(() => {
    if (!isSelected && isEditing) {
      setIsEditing(false);
    }
  }, [isSelected, isEditing]);

  const handleDoubleClick = () => {
    if (element.locked) return;
    setIsEditing(true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsEditing(false);
    if (e.target.value !== element.text) {
      saveHistory();
      updateElement(element.id, { text: e.target.value });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // If shift+enter is pressed, add a new line. If just enter, stop editing.
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      setIsEditing(false);
      if (e.currentTarget.value !== element.text) {
        saveHistory();
        updateElement(element.id, { text: e.currentTarget.value });
      }
    }
  };

  if (isEditing) {
    // Use HTML overlay for editing
    return (
      <Html
        divProps={{
          style: {
            position: 'absolute',
            left: 0,
            top: 0,
          },
        }}
      >
        <textarea
          defaultValue={element.text}
          autoFocus
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          style={{
            width: `${element.width}px`,
            height: `${element.height}px`,
            fontSize: `${element.fontSize}px`,
            fontFamily: element.fontFamily,
            fontStyle: element.fontStyle,
            fontWeight: element.fontStyle.includes('bold') ? 'bold' : 'normal',
            lineHeight: element.lineHeight,
            letterSpacing: `${element.letterSpacing}px`,
            textAlign: element.align,
            color: element.fill,
            backgroundColor: 'transparent',
            border: 'none',
            padding: 0,
            margin: 0,
            outline: 'none',
            resize: 'none',
            overflow: 'hidden',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
          }}
        />
      </Html>
    );
  }

  return (
    <Text
      {...commonProps}
      text={element.text}
      fontSize={element.fontSize}
      fontFamily={element.fontFamily}
      fontStyle={element.fontStyle}
      align={element.align}
      fill={element.fill}
      stroke={element.stroke}
      strokeWidth={element.strokeWidth}
      lineHeight={element.lineHeight}
      letterSpacing={element.letterSpacing}
      shadowColor={element.shadowColor}
      shadowBlur={element.shadowBlur}
      shadowOffsetX={element.shadowOffsetX}
      shadowOffsetY={element.shadowOffsetY}
      shadowOpacity={element.shadowOpacity}
      onDblClick={handleDoubleClick}
      ref={textRef}
    />
  );
}
