import { useAppStore } from './stores/appStore';
import { UploadModal } from './components/upload/UploadModal';
import { AppLayout } from './components/layout/AppLayout';
import { Header } from './components/layout/Header';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { Spinner } from './components/common/Spinner';
import { useChatStore } from './stores/chatStore';

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
        <div className="flex-1 flex items-center justify-center bg-slate-50">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-slate-700 mb-2">
              Welcome to Lumenci AI Assistant
            </h2>
            <p className="text-slate-500 mb-6">
              Upload a claim chart to get started with AI-powered refinement.
            </p>
            <button
              onClick={() => useAppStore.getState().setShowUploadModal(true)}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Upload Claim Chart
            </button>
          </div>
        </div>
      )}
      {showUploadModal && <UploadModal />}
      {isLoading && (
        <div className="fixed bottom-4 left-4 flex items-center gap-2 bg-white shadow-lg rounded-lg px-4 py-2 border border-slate-200">
          <Spinner size="sm" />
          <span className="text-sm text-slate-600">AI is thinking...</span>
        </div>
      )}
    </div>
  );
}

export default App;
