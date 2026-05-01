import { create } from 'zustand';

export interface PageData {
  pageNumber: number;
  imageUrl?: string;
}

interface PdfState {
  currentFile: File | null;
  uploadedPdfId: string | null;
  pages: PageData[];
  selectedPages: number[];
  isUploading: boolean;
  isExtracting: boolean;
  setFile: (file: File) => void;
  setUploadedPdfId: (id: string) => void;
  setPages: (pages: PageData[]) => void;
  togglePageSelection: (pageNumber: number) => void;
  selectAll: () => void;
  clearSelection: () => void;
  setIsUploading: (status: boolean) => void;
  setIsExtracting: (status: boolean) => void;
  reset: () => void;
}

export const usePdfStore = create<PdfState>((set) => ({
  currentFile: null,
  uploadedPdfId: null,
  pages: [],
  selectedPages: [],
  isUploading: false,
  isExtracting: false,
  setFile: (file) => set({ currentFile: file, pages: [], selectedPages: [], uploadedPdfId: null }),
  setUploadedPdfId: (id) => set({ uploadedPdfId: id }),
  setPages: (pages) => set({ pages }),
  togglePageSelection: (pageNumber) =>
    set((state) => {
      const isSelected = state.selectedPages.includes(pageNumber);
      if (isSelected) {
        return { selectedPages: state.selectedPages.filter((p) => p !== pageNumber) };
      } else {
        return { selectedPages: [...state.selectedPages, pageNumber].sort((a, b) => a - b) };
      }
    }),
  selectAll: () => set((state) => ({ selectedPages: state.pages.map((p) => p.pageNumber) })),
  clearSelection: () => set({ selectedPages: [] }),
  setIsUploading: (status) => set({ isUploading: status }),
  setIsExtracting: (status) => set({ isExtracting: status }),
  reset: () => set({ currentFile: null, uploadedPdfId: null, pages: [], selectedPages: [], isUploading: false, isExtracting: false }),
}));
