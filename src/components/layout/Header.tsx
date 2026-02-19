import { Upload, Undo2, Redo2, Download, Sparkles } from 'lucide-react';
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
    <header className="h-14 border-b border-slate-200/80 bg-gradient-to-r from-white via-white to-primary-50/40 flex items-center justify-between px-5 shrink-0 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-md shadow-primary-200">
            <Sparkles size={16} className="text-white" />
          </div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">
            Lumenci<span className="text-primary-600"> AI</span>
          </h1>
        </div>
        {data && (
          <>
            <div className="w-px h-6 bg-slate-200" />
            <span className="text-sm text-slate-500 font-medium">
              {data.title}
            </span>
          </>
        )}
      </div>

      {hasLoadedChart && (
        <div className="flex items-center gap-1.5">
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
