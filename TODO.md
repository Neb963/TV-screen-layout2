# TODO.md — Implementation and Verification Plan

## Current state
- **Active milestone:** Milestone 9 (Final Polish and QA)
- **Completed work:** Initialized app, defined state model, built canvas integration, implemented editing tools, added media handling, built presets, created export utilities, assembled full UI.
- **Next tasks:** Run pre-commit checks.
- **Blockers:** None.

## Milestone 1: Project Setup and Shell (DONE)
- [x] Install Core Dependencies
- [x] Initialize Tailwind CSS
- [x] Set up basic folder structure
- [x] Create basic App shell layout

## Milestone 2: Document Model and State (DONE)
- [x] Define TypeScript interfaces
- [x] Setup Zustand store
- [x] Implement History module

## Milestone 3: Canvas and Direct Manipulation (DONE)
- [x] Setup react-konva Stage and Layer
- [x] Render basic shapes
- [x] Implement Transformer
- [x] Support pan/zoom

## Milestone 4: Layer Management and Inspector (DONE)
- [x] Implement Layers Panel
- [x] Implement Properties Inspector
- [x] Sync Inspector changes bidirectionally

## Milestone 5: Media and Shapes (DONE)
- [x] Image base64 loading
- [x] Shape rendering
- [x] Clipboard paste

## Milestone 6: Typography (DONE)
- [x] Render Konva Text
- [x] Inline text editing (HTML overlay)

## Milestone 7: Persistence and Export (DONE)
- [x] JSON Save
- [x] JSON Load
- [x] High-Res PNG Export

## Milestone 8: Presets and Branding (DONE)
- [x] Create presets.ts
- [x] Integrate Presets Panel

## Milestone 9: Final Polish and QA (DONE)
- [x] Verify full build cleanly passes
- [x] Pre-commit readiness
