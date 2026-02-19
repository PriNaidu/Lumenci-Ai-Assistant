import { useCallback } from 'react';
import { useChatStore } from '../stores/chatStore';
import { useChartStore } from '../stores/chartStore';
import { useSuggestionStore } from '../stores/suggestionStore';
import { sendChatMessage } from '../services/ai';
import { generateId } from '../lib/utils';
import type { AISuggestion, FieldChange } from '../types';

export function useChatSubmit() {
  const addMessage = useChatStore((s) => s.addMessage);
  const setLoading = useChatStore((s) => s.setLoading);
  const messages = useChatStore((s) => s.messages);
  const chartData = useChartStore((s) => s.data);
  const selectedElementId = useChartStore((s) => s.selectedElementId);
  const addSuggestion = useSuggestionStore((s) => s.addSuggestion);
  const addEvidenceGap = useSuggestionStore((s) => s.addEvidenceGap);

  return useCallback(
    async (userMessage: string) => {
      if (!chartData) return;

      // Add user message
      addMessage({
        id: generateId(),
        role: 'user',
        content: userMessage,
        timestamp: Date.now(),
        relatedElementIds: selectedElementId ? [selectedElementId] : undefined,
      });

      setLoading(true);

      try {
        const response = await sendChatMessage(
          userMessage,
          chartData,
          selectedElementId,
          messages
        );

        const now = Date.now();

        // Process suggestions
        const suggestionIds: string[] = [];
        for (const rawSuggestion of response.suggestions) {
          const targetElement = chartData.elements.find(
            (el) => el.id === rawSuggestion.elementId
          );
          if (!targetElement) continue;

          const changes: FieldChange[] = rawSuggestion.changes.map((c) => ({
            field: c.field,
            oldValue: targetElement[c.field],
            newValue: c.newValue,
          }));

          const suggestion: AISuggestion = {
            id: generateId(),
            elementId: rawSuggestion.elementId,
            changes,
            reasoning: rawSuggestion.reasoning,
            status: 'pending',
            timestamp: now,
          };

          addSuggestion(suggestion);
          suggestionIds.push(suggestion.id);
        }

        // Process evidence gaps
        for (const gap of response.evidenceGaps) {
          addEvidenceGap({
            id: generateId(),
            elementId: gap.elementId,
            field: gap.field,
            description: gap.description,
            resolved: false,
          });
        }

        // Add assistant message
        addMessage({
          id: generateId(),
          role: 'assistant',
          content: response.message,
          timestamp: now,
          suggestionId: suggestionIds[0],
          relatedElementIds: response.suggestions.map((s) => s.elementId),
        });
      } catch (err) {
        addMessage({
          id: generateId(),
          role: 'assistant',
          content: `**Error:** ${err instanceof Error ? err.message : 'Failed to get AI response. Please try again.'}`,
          timestamp: Date.now(),
        });
      } finally {
        setLoading(false);
      }
    },
    [chartData, selectedElementId, messages, addMessage, setLoading, addSuggestion, addEvidenceGap]
  );
}
