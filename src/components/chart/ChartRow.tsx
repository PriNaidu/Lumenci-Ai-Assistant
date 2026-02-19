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
        'cursor-pointer border-b border-slate-100 transition-colors',
        isSelected && 'bg-primary-50 border-l-4 border-l-primary-500',
        !isSelected && 'hover:bg-slate-50 border-l-4 border-l-transparent',
        isHighlighted && 'animate-pulse-green'
      )}
    >
      <td className="px-4 py-3 text-slate-400 font-mono text-xs align-top">
        {index + 1}
      </td>
      <td className="px-4 py-3 text-slate-800 align-top whitespace-pre-wrap">
        {element.claimElement}
      </td>
      <td className="px-4 py-3 text-slate-800 align-top whitespace-pre-wrap">
        {element.productFeature}
      </td>
      <td className="px-4 py-3 text-slate-800 align-top whitespace-pre-wrap">
        <div className="flex flex-col gap-1">
          {element.evidence || (
            <span className="text-slate-400 italic">No evidence</span>
          )}
          {hasGap && <Badge variant="warning">Gap</Badge>}
        </div>
      </td>
    </tr>
  );
}
