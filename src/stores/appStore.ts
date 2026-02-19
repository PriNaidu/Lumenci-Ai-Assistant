import { create } from 'zustand';

interface AppStore {
  hasLoadedChart: boolean;
  showUploadModal: boolean;

  setHasLoadedChart: (value: boolean) => void;
  setShowUploadModal: (value: boolean) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  hasLoadedChart: false,
  showUploadModal: true,

  setHasLoadedChart: (value) => set({ hasLoadedChart: value }),
  setShowUploadModal: (value) => set({ showUploadModal: value }),
}));
