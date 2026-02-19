import { diffWords } from 'diff';
import { FIELD_LABELS } from '../../lib/constants';
import type { FieldChange } from '../../types';

interface DiffViewProps {
  changes: FieldChange[];
}

export function DiffView({ changes }: DiffViewProps) {
  return (
    <div className="space-y-2">
      {changes.map((change, i) => {
        const parts = diffWords(change.oldValue, change.newValue);

        return (
          <div key={i}>
            <p className="text-xs font-medium text-slate-500 mb-1">
              {FIELD_LABELS[change.field] ?? change.field}
            </p>
            <div className="text-sm bg-slate-50 rounded p-2 leading-relaxed">
              {parts.map((part, j) => {
                if (part.added) {
                  return (
                    <span
                      key={j}
                      className="bg-green-100 text-green-800 underline decoration-green-400"
                    >
                      {part.value}
                    </span>
                  );
                }
                if (part.removed) {
                  return (
                    <span
                      key={j}
                      className="bg-red-100 text-red-600 line-through"
                    >
                      {part.value}
                    </span>
                  );
                }
                return <span key={j}>{part.value}</span>;
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
