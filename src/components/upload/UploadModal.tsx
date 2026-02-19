import { useState } from 'react';
import { Modal } from '../common/Modal';
import { FileDropZone } from './FileDropZone';
import { PasteInput } from './PasteInput';
import { useAppStore } from '../../stores/appStore';
import { clsx } from 'clsx';

type Tab = 'upload' | 'paste';

export function UploadModal() {
  const [activeTab, setActiveTab] = useState<Tab>('upload');
  const setShowUploadModal = useAppStore((s) => s.setShowUploadModal);

  return (
    <Modal title="Load Claim Chart" onClose={() => setShowUploadModal(false)}>
      <div className="flex gap-1 mb-4 bg-slate-100 rounded-lg p-1">
        {(['upload', 'paste'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors',
              activeTab === tab
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            )}
          >
            {tab === 'upload' ? 'Upload File' : 'Paste Data'}
          </button>
        ))}
      </div>

      {activeTab === 'upload' ? <FileDropZone /> : <PasteInput />}
    </Modal>
  );
}
