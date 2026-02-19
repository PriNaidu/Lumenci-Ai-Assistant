import { useChartStore } from '../../stores/chartStore';
import { ChartTable } from './ChartTable';

export function ClaimChart() {
  const data = useChartStore((s) => s.data);

  if (!data) return null;

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold text-slate-700">Claim Chart</h2>
          <span className="text-xs text-slate-400">
            {data.elements.length} elements
          </span>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <ChartTable elements={data.elements} />
      </div>
    </div>
  );
}
