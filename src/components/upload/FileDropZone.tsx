import { useState, useRef } from 'react';
import { Upload, FileText } from 'lucide-react';
import { parseCSV } from '../../services/csv';
import { useChartStore } from '../../stores/chartStore';
import { useAppStore } from '../../stores/appStore';
import { useChatStore } from '../../stores/chatStore';
import { generateId } from '../../lib/utils';
import { clsx } from 'clsx';

export function FileDropZone() {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file.');
      return;
    }

    setError(null);
    setWarnings([]);

    try {
      const title = file.name.replace(/\.csv$/i, '');
      const result = await parseCSV(file, title);
      setWarnings(result.warnings);

      useChartStore.getState().loadChart(result.data);
      useAppStore.getState().setHasLoadedChart(true);
      useAppStore.getState().setShowUploadModal(false);

      useChatStore.getState().addMessage({
        id: generateId(),
        role: 'system',
        content: `Claim chart "${result.data.title}" loaded with ${result.data.elements.length} elements. Select an element and start chatting to refine it.`,
        timestamp: Date.now(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse CSV file.');
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => fileInputRef.current?.click()}
        className={clsx(
          'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors',
          isDragging
            ? 'border-primary-400 bg-primary-50'
            : 'border-slate-300 hover:border-primary-300 hover:bg-slate-50'
        )}
      >
        <div className="flex flex-col items-center gap-3">
          {isDragging ? (
            <FileText size={40} className="text-primary-500" />
          ) : (
            <Upload size={40} className="text-slate-400" />
          )}
          <div>
            <p className="text-sm font-medium text-slate-700">
              {isDragging ? 'Drop your CSV file here' : 'Drag & drop a CSV file'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              or click to browse. Expects 3 columns: Claim Element, Product Feature, Evidence
            </p>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {error && (
        <p className="mt-3 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {warnings.length > 0 && (
        <div className="mt-3 text-sm text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
          {warnings.map((w, i) => (
            <p key={i}>{w}</p>
          ))}
        </div>
      )}
    </div>
  );
}
