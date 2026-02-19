import { Upload, Undo2, Redo2, Download } from 'lucide-react';
import { Button } from '../common/Button';
import { useChartStore } from '../../stores/chartStore';
import { useAppStore } from '../../stores/appStore';
import { exportToDocx } from '../../services/docx';

export function Header() {
  const undoStack = useChartStore((s) => s.undoStack);
  const redoStack = useChartStore((s) => s.redoStack);
  const data = useChartStore((s) => s.data);
  const undo = useChartStore((s) => s.undo);
  const redo = useChartStore((s) => s.redo);
  const hasLoadedChart = useAppStore((s) => s.hasLoadedChart);

  async function handleExport() {
    if (data) {
      await exportToDocx(data);
    }
  }

  return (
    <header className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-bold text-slate-900">
          Lumenci<span className="text-primary-600"> AI</span>
        </h1>
        {data && (
          <span className="text-sm text-slate-500 border-l border-slate-200 pl-3">
            {data.title}
          </span>
        )}
      </div>

      {hasLoadedChart && (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={undo}
            disabled={undoStack.length === 0}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={redo}
            disabled={redoStack.length === 0}
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2 size={16} />
          </Button>

          <div className="w-px h-6 bg-slate-200 mx-1" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => useAppStore.getState().setShowUploadModal(true)}
          >
            <Upload size={16} />
            Upload New
          </Button>
          <Button variant="primary" size="sm" onClick={handleExport}>
            <Download size={16} />
            Export .docx
          </Button>
        </div>
      )}
    </header>
  );
}
