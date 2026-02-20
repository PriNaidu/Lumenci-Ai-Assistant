import type { ClaimElement } from '../../types';
import { ChartRow } from './ChartRow';

interface ChartTableProps {
  elements: ClaimElement[];
}

export function ChartTable({ elements }: ChartTableProps) {
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="bg-gradient-to-r from-slate-50 to-slate-100/50 sticky top-0 z-10">
          <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200 w-8">
            #
          </th>
          <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
            Claim Element
          </th>
          <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
            Product Feature
          </th>
          <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
            Evidence
          </th>
          <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200 w-24">
            Status
          </th>
        </tr>
      </thead>
      <tbody>
        {elements.map((element, index) => (
          <ChartRow key={element.id} element={element} index={index} />
        ))}
      </tbody>
    </table>
  );
}
