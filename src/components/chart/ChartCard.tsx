import { clsx } from 'clsx';
import type { ClaimElement } from '../../types';
import { useChartStore } from '../../stores/chartStore';
import { useSuggestionStore } from '../../stores/suggestionStore';

interface ChartCardProps {
  element: ClaimElement;
  index: number;
}

export function ChartCard({ element }: ChartCardProps) {
  const selectedElementId = useChartStore((s) => s.selectedElementId);
  const highlightedElementIds = useChartStore((s) => s.highlightedElementIds);
  const selectElement = useChartStore((s) => s.selectElement);
  const evidenceGaps = useSuggestionStore((s) => s.evidenceGaps);

  const isSelected = selectedElementId === element.id;
  const isHighlighted = highlightedElementIds.includes(element.id);
  const hasGap = evidenceGaps.some(
    (g) => g.elementId === element.id && !g.resolved
  );
  const hasEvidence = element.evidence && element.evidence.trim() !== '';
  const isStrong = hasEvidence && !hasGap;

  function handleClick() {
    selectElement(isSelected ? null : element.id);
  }

  return (
    <div
      onClick={handleClick}
      className={clsx(
        'rounded-xl border px-4 py-3.5 cursor-pointer transition-all duration-200 animate-fade-in',
        isSelected
          ? 'border-primary-300 bg-primary-50/60 shadow-md shadow-primary-100/50 ring-1 ring-primary-200'
          : 'border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-sm',
        isHighlighted && 'animate-pulse-green'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 min-w-0 flex-1">
          <span
            className={clsx(
              'mt-1 w-2 h-2 rounded-full shrink-0',
              isStrong ? 'bg-green-500' : 'bg-amber-400'
            )}
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-800 leading-snug">
              {element.claimElement}
            </p>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              {element.productFeature}
            </p>
          </div>
        </div>
        <span
          className={clsx(
            'text-[11px] font-semibold px-2.5 py-0.5 rounded-md shrink-0',
            isStrong
              ? 'bg-green-100 text-green-700'
              : 'bg-amber-100 text-amber-700'
          )}
        >
          {isStrong ? 'Strong' : 'Weak'}
        </span>
      </div>
    </div>
  );
}
