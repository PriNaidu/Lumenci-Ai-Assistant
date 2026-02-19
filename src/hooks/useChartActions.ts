import { useCallback } from 'react';
import { useChartStore } from '../stores/chartStore';
import { useSuggestionStore } from '../stores/suggestionStore';
import type { AISuggestion } from '../types';

export function useChartActions() {
  const updateElement = useChartStore((s) => s.updateElement);
  const setHighlightedElements = useChartStore((s) => s.setHighlightedElements);
  const updateSuggestionStatus = useSuggestionStore((s) => s.updateSuggestionStatus);

  const acceptSuggestion = useCallback(
    (suggestion: AISuggestion) => {
      const changes: Record<string, string> = {};
      for (const change of suggestion.changes) {
        changes[change.field] = change.newValue;
      }

      updateElement(
        suggestion.elementId,
        changes,
        `Applied AI suggestion: ${suggestion.reasoning.slice(0, 60)}`
      );

      updateSuggestionStatus(suggestion.id, 'accepted');
      setHighlightedElements([suggestion.elementId]);
    },
    [updateElement, updateSuggestionStatus, setHighlightedElements]
  );

  const rejectSuggestion = useCallback(
    (suggestion: AISuggestion) => {
      updateSuggestionStatus(suggestion.id, 'rejected');
    },
    [updateSuggestionStatus]
  );

  return { acceptSuggestion, rejectSuggestion };
}
