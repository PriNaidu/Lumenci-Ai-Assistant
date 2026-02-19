import { useAppStore } from './stores/appStore';
import { UploadModal } from './components/upload/UploadModal';
import { AppLayout } from './components/layout/AppLayout';
import { Header } from './components/layout/Header';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { Spinner } from './components/common/Spinner';
import { useChatStore } from './stores/chatStore';
import { Upload, FileText, Sparkles, ShieldCheck } from 'lucide-react';

function App() {
  const hasLoadedChart = useAppStore((s) => s.hasLoadedChart);
  const showUploadModal = useAppStore((s) => s.showUploadModal);
  const isLoading = useChatStore((s) => s.isLoading);

  useKeyboardShortcuts();

  return (
    <div className="flex flex-col h-screen">
      <Header />
      {hasLoadedChart ? (
        <AppLayout />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 via-primary-50/30 to-slate-100">
          <div className="text-center max-w-lg animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary-200">
              <Sparkles size={28} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-3 tracking-tight">
              Welcome to Lumenci AI
            </h2>
            <p className="text-slate-500 mb-8 text-base leading-relaxed">
              AI-powered patent claim chart analysis. Upload your chart and let AI
              help you strengthen evidence, refine language, and identify gaps.
            </p>

            <button
              onClick={() => useAppStore.getState().setShowUploadModal(true)}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all font-semibold shadow-lg shadow-primary-200 hover:shadow-xl hover:shadow-primary-300 hover:-translate-y-0.5"
            >
              <Upload size={18} />
              Upload Claim Chart
            </button>

            <div className="mt-12 grid grid-cols-3 gap-6 text-left">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <FileText size={18} className="text-primary-600" />
                </div>
                <p className="text-xs font-semibold text-slate-700">Smart Analysis</p>
                <p className="text-xs text-slate-400">AI reviews every element of your claim chart</p>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                  <ShieldCheck size={18} className="text-green-600" />
                </div>
                <p className="text-xs font-semibold text-slate-700">Evidence Gaps</p>
                <p className="text-xs text-slate-400">Automatically flags weak or missing citations</p>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                  <Sparkles size={18} className="text-amber-600" />
                </div>
                <p className="text-xs font-semibold text-slate-700">Refinements</p>
                <p className="text-xs text-slate-400">Accept or reject AI suggestions with one click</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {showUploadModal && <UploadModal />}
      {isLoading && (
        <div className="fixed bottom-4 left-4 flex items-center gap-2.5 bg-white/90 backdrop-blur-sm shadow-lg rounded-xl px-4 py-2.5 border border-slate-200/80 animate-slide-up">
          <Spinner size="sm" />
          <span className="text-sm font-medium text-slate-600">AI is thinking...</span>
        </div>
      )}
    </div>
  );
}

export default App;
