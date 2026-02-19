import { create } from 'zustand';
import type { ChartData, ChartSnapshot, ClaimElement, ElementId } from '../types';
import { MAX_UNDO_STACK } from '../lib/constants';

interface ChartStore {
  data: ChartData | null;
  undoStack: ChartSnapshot[];
  redoStack: ChartSnapshot[];
  selectedElementId: ElementId | null;
  highlightedElementIds: ElementId[];

  loadChart: (data: ChartData) => void;
  updateElement: (id: ElementId, changes: Partial<ClaimElement>, description: string) => void;
  undo: () => void;
  redo: () => void;
  selectElement: (id: ElementId | null) => void;
  setHighlightedElements: (ids: ElementId[]) => void;
  reset: () => void;
}

export const useChartStore = create<ChartStore>((set, get) => ({
  data: null,
  undoStack: [],
  redoStack: [],
  selectedElementId: null,
  highlightedElementIds: [],

  loadChart: (data) =>
    set({
      data,
      undoStack: [],
      redoStack: [],
      selectedElementId: null,
      highlightedElementIds: [],
    }),

  updateElement: (id, changes, description) => {
    const { data, undoStack } = get();
    if (!data) return;

    const snapshot: ChartSnapshot = {
      elements: data.elements.map((el) => ({ ...el })),
      description,
      timestamp: Date.now(),
    };

    const newUndoStack = [...undoStack, snapshot];
    if (newUndoStack.length > MAX_UNDO_STACK) {
      newUndoStack.shift();
    }

    set({
      data: {
        ...data,
        elements: data.elements.map((el) =>
          el.id === id ? { ...el, ...changes } : el
        ),
      },
      undoStack: newUndoStack,
      redoStack: [],
    });
  },

  undo: () => {
    const { data, undoStack, redoStack } = get();
    if (!data || undoStack.length === 0) return;

    const snapshot = undoStack[undoStack.length - 1];
    const newUndoStack = undoStack.slice(0, -1);

    const currentSnapshot: ChartSnapshot = {
      elements: data.elements.map((el) => ({ ...el })),
      description: 'Redo point',
      timestamp: Date.now(),
    };

    set({
      data: { ...data, elements: snapshot.elements },
      undoStack: newUndoStack,
      redoStack: [...redoStack, currentSnapshot],
    });
  },

  redo: () => {
    const { data, undoStack, redoStack } = get();
    if (!data || redoStack.length === 0) return;

    const snapshot = redoStack[redoStack.length - 1];
    const newRedoStack = redoStack.slice(0, -1);

    const currentSnapshot: ChartSnapshot = {
      elements: data.elements.map((el) => ({ ...el })),
      description: 'Undo point',
      timestamp: Date.now(),
    };

    set({
      data: { ...data, elements: snapshot.elements },
      undoStack: [...undoStack, currentSnapshot],
      redoStack: newRedoStack,
    });
  },

  selectElement: (id) => set({ selectedElementId: id }),

  setHighlightedElements: (ids) => {
    set({ highlightedElementIds: ids });
    if (ids.length > 0) {
      setTimeout(() => set({ highlightedElementIds: [] }), 1500);
    }
  },

  reset: () =>
    set({
      data: null,
      undoStack: [],
      redoStack: [],
      selectedElementId: null,
      highlightedElementIds: [],
    }),
}));
