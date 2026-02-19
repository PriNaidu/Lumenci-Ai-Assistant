import { Check, X } from 'lucide-react';
import { clsx } from 'clsx';
import type { AISuggestion } from '../../types';
import { useChartStore } from '../../stores/chartStore';
import { useChartActions } from '../../hooks/useChartActions';
import { DiffView } from './DiffView';
import { Badge } from '../common/Badge';
import { truncateText } from '../../lib/utils';

interface SuggestionCardProps {
  suggestion: AISuggestion;
}

export function SuggestionCard({ suggestion }: SuggestionCardProps) {
  const elements = useChartStore((s) => s.data?.elements);
  const { acceptSuggestion, rejectSuggestion } = useChartActions();

  const element = elements?.find((el) => el.id === suggestion.elementId);
  const elementIndex = elements?.findIndex((el) => el.id === suggestion.elementId) ?? -1;

  const isPending = suggestion.status === 'pending';

  return (
    <div
      className={clsx(
        'ml-9 mt-2 rounded-lg border p-3',
        isPending
          ? 'border-primary-200 bg-primary-50/50'
          : suggestion.status === 'accepted'
            ? 'border-green-200 bg-green-50/30'
            : 'border-slate-200 bg-slate-50/50'
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700">
            Suggestion for Element #{elementIndex + 1}
          </span>
          {element && (
            <span className="text-xs text-slate-400">
              {truncateText(element.claimElement, 40)}
            </span>
          )}
        </div>

        {!isPending && (
          <Badge variant={suggestion.status === 'accepted' ? 'success' : 'error'}>
            {suggestion.status === 'accepted' ? 'Accepted' : 'Rejected'}
          </Badge>
        )}
      </div>

      <p className="text-xs text-slate-600 mb-3 italic">{suggestion.reasoning}</p>

      <DiffView changes={suggestion.changes} />

      {isPending && (
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => acceptSuggestion(suggestion)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-green-600 text-white text-xs font-medium hover:bg-green-700 transition-colors"
          >
            <Check size={14} />
            Accept
          </button>
          <button
            onClick={() => rejectSuggestion(suggestion)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-red-300 text-red-600 text-xs font-medium hover:bg-red-50 transition-colors"
          >
            <X size={14} />
            Reject
          </button>
        </div>
      )}
    </div>
  );
}
