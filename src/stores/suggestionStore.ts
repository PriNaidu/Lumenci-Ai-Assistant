import { create } from 'zustand';
import type { AISuggestion, EvidenceGap, SuggestionStatus } from '../types';

interface SuggestionStore {
  suggestions: AISuggestion[];
  evidenceGaps: EvidenceGap[];

  addSuggestion: (suggestion: AISuggestion) => void;
  updateSuggestionStatus: (id: string, status: SuggestionStatus) => void;
  addEvidenceGap: (gap: EvidenceGap) => void;
  resolveEvidenceGap: (id: string) => void;
  clearAll: () => void;
}

export const useSuggestionStore = create<SuggestionStore>((set) => ({
  suggestions: [],
  evidenceGaps: [],

  addSuggestion: (suggestion) =>
    set((state) => ({ suggestions: [...state.suggestions, suggestion] })),

  updateSuggestionStatus: (id, status) =>
    set((state) => ({
      suggestions: state.suggestions.map((s) =>
        s.id === id ? { ...s, status } : s
      ),
    })),

  addEvidenceGap: (gap) =>
    set((state) => ({ evidenceGaps: [...state.evidenceGaps, gap] })),

  resolveEvidenceGap: (id) =>
    set((state) => ({
      evidenceGaps: state.evidenceGaps.map((g) =>
        g.id === id ? { ...g, resolved: true } : g
      ),
    })),

  clearAll: () => set({ suggestions: [], evidenceGaps: [] }),
}));
