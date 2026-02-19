import { useChartStore } from '../../stores/chartStore';
import { useSuggestionStore } from '../../stores/suggestionStore';
import { ChartCard } from './ChartCard';
import { TableProperties } from 'lucide-react';

export function ClaimChart() {
  const data = useChartStore((s) => s.data);
  const evidenceGaps = useSuggestionStore((s) => s.evidenceGaps);

  if (!data) return null;

  const strongCount = data.elements.filter((el) => {
    const hasGap = evidenceGaps.some(
      (g) => g.elementId === el.id && !g.resolved
    );
    return el.evidence && el.evidence.trim() !== '' && !hasGap;
  }).length;

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <div className="px-5 py-3 border-b border-slate-200/80 bg-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center">
            <TableProperties size={13} className="text-slate-600" />
          </div>
          <h2 className="text-sm font-semibold text-slate-700">Claim Chart</h2>
          <span className="text-xs text-slate-500 font-medium">
            {strongCount}/{data.elements.length} elements strong
          </span>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {data.elements.map((element, index) => (
          <ChartCard key={element.id} element={element} index={index} />
        ))}
      </div>
    </div>
  );
}
