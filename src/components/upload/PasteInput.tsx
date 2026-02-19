import { useState } from 'react';
import { Button } from '../common/Button';
import { parseCSV } from '../../services/csv';
import { useChartStore } from '../../stores/chartStore';
import { useAppStore } from '../../stores/appStore';
import { useChatStore } from '../../stores/chatStore';
import { generateId } from '../../lib/utils';

export function PasteInput() {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);

  async function handleLoad() {
    if (!text.trim()) {
      setError('Please paste some CSV data first.');
      return;
    }

    setError(null);
    setWarnings([]);

    try {
      const result = await parseCSV(text, 'Pasted Claim Chart');
      setWarnings(result.warnings);

      useChartStore.getState().loadChart(result.data);
      useAppStore.getState().setHasLoadedChart(true);
      useAppStore.getState().setShowUploadModal(false);

      useChatStore.getState().addMessage({
        id: generateId(),
        role: 'system',
        content: `Claim chart loaded with ${result.data.elements.length} elements. Select an element and start chatting to refine it.`,
        timestamp: Date.now(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse data.');
    }
  }

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={`Paste CSV data here. Example:\n\nClaim Element,Product Feature,Evidence\n"A method for processing...",Device Processing Pipeline,"Technical Documentation Section 3.2"`}
        className="w-full h-48 px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder:text-slate-400"
      />

      <div className="mt-3 flex justify-end">
        <Button onClick={handleLoad} disabled={!text.trim()}>
          Load Chart
        </Button>
      </div>

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
