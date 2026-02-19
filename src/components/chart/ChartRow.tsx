import { clsx } from 'clsx';
import type { ClaimElement } from '../../types';
import { useChartStore } from '../../stores/chartStore';
import { useSuggestionStore } from '../../stores/suggestionStore';
import { Badge } from '../common/Badge';

interface ChartRowProps {
  element: ClaimElement;
  index: number;
}

export function ChartRow({ element, index }: ChartRowProps) {
  const selectedElementId = useChartStore((s) => s.selectedElementId);
  const highlightedElementIds = useChartStore((s) => s.highlightedElementIds);
  const selectElement = useChartStore((s) => s.selectElement);
  const evidenceGaps = useSuggestionStore((s) => s.evidenceGaps);

  const isSelected = selectedElementId === element.id;
  const isHighlighted = highlightedElementIds.includes(element.id);
  const hasGap = evidenceGaps.some(
    (g) => g.elementId === element.id && !g.resolved
  );

  function handleClick() {
    selectElement(isSelected ? null : element.id);
  }

  return (
    <tr
      onClick={handleClick}
      className={clsx(
        'cursor-pointer border-b border-slate-100/80 transition-all duration-200',
        isSelected && 'bg-primary-50/70 border-l-[3px] border-l-primary-500 shadow-sm',
        !isSelected && 'hover:bg-slate-50/80 border-l-[3px] border-l-transparent',
        isHighlighted && 'animate-pulse-green'
      )}
    >
      <td className="px-4 py-3.5 text-slate-400 font-mono text-xs align-top">
        <span className={clsx(
          'inline-flex items-center justify-center w-5 h-5 rounded-md text-[10px] font-semibold',
          isSelected ? 'bg-primary-200 text-primary-700' : 'bg-slate-100 text-slate-500'
        )}>
          {index + 1}
        </span>
      </td>
      <td className="px-4 py-3.5 text-slate-800 align-top whitespace-pre-wrap text-[13px] leading-relaxed">
        {element.claimElement}
      </td>
      <td className="px-4 py-3.5 text-slate-800 align-top whitespace-pre-wrap text-[13px] leading-relaxed">
        {element.productFeature}
      </td>
      <td className="px-4 py-3.5 text-slate-800 align-top whitespace-pre-wrap text-[13px] leading-relaxed">
        <div className="flex flex-col gap-1.5">
          {element.evidence || (
            <span className="text-slate-400 italic text-xs">No evidence provided</span>
          )}
          {hasGap && <Badge variant="warning">Gap</Badge>}
        </div>
      </td>
    </tr>
  );
}
