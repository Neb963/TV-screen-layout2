import { create } from 'zustand';
import type { EditorElement, Scene } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface HistoryState {
  past: Scene[];
  future: Scene[];
}

interface EditorState {
  scene: Scene;
  selectedIds: string[];
  history: HistoryState;

  // Actions
  addElement: (element: Omit<EditorElement, 'id'>) => void;
  updateElement: (id: string, updates: Partial<EditorElement>) => void;
  removeElement: (id: string) => void;
  selectElements: (ids: string[]) => void;
  clearSelection: () => void;
  setScene: (scene: Scene) => void;
  updateScene: (updates: Partial<Scene>) => void;

  // Layers
  bringForward: (id: string) => void;
  sendBackward: (id: string) => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;

  // History
  undo: () => void;
  redo: () => void;
  saveHistory: () => void;
}

const DEFAULT_SCENE: Scene = {
  width: 1920,
  height: 1080,
  backgroundColor: '#000000',
  elements: [],
};

const MAX_HISTORY = 50;

export const useEditorStore = create<EditorState>((set, get) => ({
  scene: DEFAULT_SCENE,
  selectedIds: [],
  history: {
    past: [],
    future: [],
  },

  saveHistory: () => {
    set((state) => {
      const past = [...state.history.past, state.scene];
      if (past.length > MAX_HISTORY) past.shift();
      return {
        history: {
          past,
          future: [],
        },
      };
    });
  },

  undo: () => {
    set((state) => {
      if (state.history.past.length === 0) return state;
      const previous = state.history.past[state.history.past.length - 1];
      const newPast = state.history.past.slice(0, state.history.past.length - 1);
      return {
        scene: previous,
        history: {
          past: newPast,
          future: [state.scene, ...state.history.future],
        },
      };
    });
  },

  redo: () => {
    set((state) => {
      if (state.history.future.length === 0) return state;
      const next = state.history.future[0];
      const newFuture = state.history.future.slice(1);
      return {
        scene: next,
        history: {
          past: [...state.history.past, state.scene],
          future: newFuture,
        },
      };
    });
  },

  addElement: (element) => {
    get().saveHistory();
    const newElement = { ...element, id: uuidv4() } as EditorElement;
    set((state) => ({
      scene: {
        ...state.scene,
        elements: [...state.scene.elements, newElement],
      },
      selectedIds: [newElement.id],
    }));
  },

  updateElement: (id, updates) => {
    // Note: Do NOT call saveHistory on every rapid update (like drag).
    // The component dragging should call saveHistory on drag START.
    set((state) => ({
      scene: {
        ...state.scene,
        elements: state.scene.elements.map((el) =>
          el.id === id ? { ...el, ...updates } : el
        ) as EditorElement[],
      },
    }));
  },

  removeElement: (id) => {
    get().saveHistory();
    set((state) => ({
      scene: {
        ...state.scene,
        elements: state.scene.elements.filter((el) => el.id !== id),
      },
      selectedIds: state.selectedIds.filter((selId) => selId !== id),
    }));
  },

  selectElements: (ids) => {
    set({ selectedIds: ids });
  },

  clearSelection: () => {
    set({ selectedIds: [] });
  },

  setScene: (scene) => {
    get().saveHistory();
    set({ scene, selectedIds: [] });
  },

  updateScene: (updates) => {
    get().saveHistory();
    set((state) => ({
      scene: { ...state.scene, ...updates },
    }));
  },

  bringForward: (id) => {
    get().saveHistory();
    set((state) => {
      const elements = [...state.scene.elements];
      const index = elements.findIndex((el) => el.id === id);
      if (index < 0 || index === elements.length - 1) return state;

      const el = elements[index];
      elements[index] = elements[index + 1];
      elements[index + 1] = el;

      return { scene: { ...state.scene, elements } };
    });
  },

  sendBackward: (id) => {
    get().saveHistory();
    set((state) => {
      const elements = [...state.scene.elements];
      const index = elements.findIndex((el) => el.id === id);
      if (index <= 0) return state;

      const el = elements[index];
      elements[index] = elements[index - 1];
      elements[index - 1] = el;

      return { scene: { ...state.scene, elements } };
    });
  },

  bringToFront: (id) => {
    get().saveHistory();
    set((state) => {
      const elements = [...state.scene.elements];
      const index = elements.findIndex((el) => el.id === id);
      if (index < 0 || index === elements.length - 1) return state;

      const el = elements.splice(index, 1)[0];
      elements.push(el);

      return { scene: { ...state.scene, elements } };
    });
  },

  sendToBack: (id) => {
    get().saveHistory();
    set((state) => {
      const elements = [...state.scene.elements];
      const index = elements.findIndex((el) => el.id === id);
      if (index <= 0) return state;

      const el = elements.splice(index, 1)[0];
      elements.unshift(el);

      return { scene: { ...state.scene, elements } };
    });
  }
}));
