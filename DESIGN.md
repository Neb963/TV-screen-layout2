# DESIGN.md — Television News Screen Layout Designer

## 1. Product definition
A professional web application for creating ultra-high-fidelity, static television news screen mockups. It enables users to compose, edit, save, and export static broadcast graphics (lower thirds, tickers, bugs, headlines) over background images or transparent canvases. Out of scope: animation, video playback, live data feeds.

## 2. Requirements matrix
| Client Requirement | Proposed Behavior/Module | Acceptance Criteria |
| --- | --- | --- |
| Presets and branding | Built-in JSON presets (e.g., Fox News style). Custom channels saved in state. | User can apply a preset and see fully editable layers. Can save/load custom branding. |
| Canvas editor | Direct manipulation via `react-konva`. `Transformer` for resize/rotate. | Select, drag, resize, rotate, crop, duplicate, undo/redo work reliably. |
| Images & graphics | File upload & clipboard paste. Konva `Image` and `Shape` nodes. Group clipping for placeholders. | Paste/upload PNG, JPG, SVG. Assets render correctly. Can replace placeholder images with custom crop/fit. |
| Text & typography | Konva `Text` nodes. Font loading via DOM `FontFace`. | Text is fully editable (weight, size, line height, spacing, alignment, shadows, outlines). Custom fonts load & render. |
| Projects & export | Save to/from JSON. Export to PNG via Konva `toDataURL(pixelRatio)`. | JSON projects reopen exactly as saved. PNG export is high-res (e.g., 4K) and visually matches the canvas. |

## 3. Information architecture
- **Top Bar:** Project name, Undo/Redo, Export Image, Save Project, Load Project, Zoom controls.
- **Left Panel (Sidebar):**
  - **Layers:** Hierarchy of elements, Z-order manipulation, locking, hiding, grouping.
  - **Presets/Channels:** Built-in broadcast templates, user-saved presets, channel branding configurations.
  - **Assets:** Uploaded images, basic vector shapes, UI for clipboard paste.
- **Canvas (Viewport):** Infinite panning workspace, fixed-dimension target output area (e.g., 1920x1080).
- **Right Panel (Inspector):** Context-aware properties (position, rotation, text styles, image crop, shape fills/strokes/shadows).

## 4. Interaction specification
- **Selection:** Click to select, Shift+Click for multi-select. Bounding box with handles (Transformer).
- **Transforms:** Drag to move. Handles to resize/rotate. Properties panel for exact numeric input.
- **Crop/Mask:** Double-click image/placeholder to enter "crop mode", adjusting image within its clipping bounds.
- **Text Edit:** Double-click text to spawn a floating `textarea` matching the text's scale and position for seamless editing.
- **Keyboard:** Delete/Backspace to remove, Ctrl+C/V for copy/paste, Ctrl+Z/Y for undo/redo, Arrow keys for nudging.

## 5. Visual design system
- **UI Framework:** Tailwind CSS.
- **Theme:** Professional dark mode (slate/gray palette) to make bright broadcast graphics stand out.
- **Icons:** Lucide-react for sharp, consistent iconography.
- **Typography:** Inter for the UI.

## 6. Preset and channel system
- **Presets:** Serialized document state (JSON). Applying a preset clears or appends to the current scene.
- **Channels:** Collections of saved colors, font names, and logo image references that can be quickly applied to elements.
- **Built-in:** At least 2 distinct broadcast templates (e.g., "Cable News Red/Blue/White" style, "Modern Minimalist" style).

## 7. Scene/document model
- **State Manager:** Zustand.
- **Document Structure:**
  - `id`, `width`, `height`, `backgroundColor`
  - `elements`: Array of objects (`type: 'text' | 'image' | 'rect' | 'ellipse'`, `x`, `y`, `width`, `height`, `rotation`, `opacity`, `locked`, `hidden`, `name`, plus type-specific properties like `fill`, `text`, `fontFamily`, `src`).
- **History:** Past/Future arrays for undo/redo, storing snapshots of the `elements` array.

## 8. Rendering and export strategy
- **Renderer:** HTML5 Canvas via `react-konva`. Ensures exact WYSIWYG between editor and export.
- **Export:** `Stage.toDataURL` with `pixelRatio` scaled to reach target resolution (e.g., 2x for 4K from a 1080p canvas).
- **Fonts:** Custom fonts injected into the document via `@font-face` and `document.fonts.load()` before rendering.

## 9. Project persistence
- **Format:** JSON file.
- **Assets:** Images converted to Base64 data URLs to ensure projects are fully portable offline without broken links.
- **Custom Fonts:** Serialized as Base64 `ttf/woff2` or stored as external URL references depending on user upload method.

## 10. Technical architecture
- **Core:** React 18, TypeScript, Vite.
- **State:** Zustand.
- **Graphics:** Konva, react-konva, use-image.
- **Styling:** Tailwind CSS.
- **File Handling:** `file-saver` (or native File System API) for saving JSON/PNG.

## 11. Responsive and accessible UX
- Designed primarily for desktop mouse/keyboard interaction (professional graphics editor).
- Responsive UI panels (collapsible on smaller screens).
- Keyboard shortcuts for all major actions.

## 12. Testing and acceptance
- Visual parity checks: Exported PNG compared to viewport.
- Persistence checks: Reload page, upload saved JSON, verify layers and styles.
- Undo/redo checks: Perform complex transforms, group, ungroup, undo, verify exact state restoration.
- Text metrics: Verify baselines and wrapping using standard and custom fonts.

## 13. Known risks and decisions
- **Performance:** Base64 encoding large images (e.g., 4K backgrounds) may create large JSON files and cause lag during Undo/Redo state snapshots. *Mitigation:* Cap maximum image upload size and use shallow copies or structural sharing in Zustand.
- **Text Wrapping:** Konva text wrapping is sometimes slightly different from DOM. *Mitigation:* Carefully configure Konva's `Text` node properties and provide explicit line breaks or manual width controls if automatic wrapping mismatches expectations.
