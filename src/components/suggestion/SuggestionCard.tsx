import { Check, X, Lightbulb } from 'lucide-react';
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
        'ml-9 mt-2 rounded-xl border p-3.5 shadow-sm animate-fade-in',
        isPending
          ? 'border-primary-200/80 bg-gradient-to-br from-primary-50/60 to-white'
          : suggestion.status === 'accepted'
            ? 'border-green-200/80 bg-gradient-to-br from-green-50/40 to-white'
            : 'border-slate-200/80 bg-gradient-to-br from-slate-50/60 to-white'
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-amber-100 flex items-center justify-center">
            <Lightbulb size={11} className="text-amber-600" />
          </div>
          <span className="text-xs font-semibold text-slate-700">
            Element #{elementIndex + 1}
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

      <p className="text-xs text-slate-500 mb-3 italic leading-relaxed">{suggestion.reasoning}</p>

      <DiffView changes={suggestion.changes} />

      {isPending && (
        <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
          <button
            onClick={() => acceptSuggestion(suggestion)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-green-600 to-green-700 text-white text-xs font-medium hover:from-green-700 hover:to-green-800 transition-all shadow-sm hover:shadow-md"
          >
            <Check size={13} />
            Accept
          </button>
          <button
            onClick={() => rejectSuggestion(suggestion)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50 hover:border-slate-300 transition-all"
          >
            <X size={13} />
            Reject
          </button>
        </div>
      )}
    </div>
  );
}
