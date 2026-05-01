import { useState } from 'react';
import { usePdfStore } from '@/store/usePdfStore';
import { Plus,  Maximize2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

export const PageGrid = () => {
  const { pages, selectedPages, togglePageSelection, isUploading, currentFile } = usePdfStore();
  const [previewPage, setPreviewPage] = useState<number | null>(null);

  if (isUploading) {
    return (
      <div className="p-8 h-full bg-[#F4F7FB]">
        <div className="flex flex-wrap gap-8 items-start">
          {/* Skeleton loading state */}
          <div className="relative group w-[220px]">
             <div className="w-full aspect-[1/1.4] bg-white border-2 border-dashed border-blue-300 rounded shadow-sm flex items-center justify-center relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 pattern-diagonal-lines-sm opacity-50"></div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-blue-500 animate-spin mb-4"></div>
                </div>
             </div>
             <div className="mt-3 text-center">
               <div className="inline-block px-3 py-1 bg-red-100 text-red-500 text-xs font-medium rounded-full mb-1 w-3/4 h-5 animate-pulse"></div>
               <div className="text-gray-400 text-xs w-1/2 h-4 mx-auto bg-gray-200 animate-pulse rounded"></div>
             </div>
          </div>
          
          <div className="w-[220px] aspect-[1/1.4] border-2 border-dashed border-blue-200 rounded flex flex-col items-center justify-center text-blue-500 bg-[#EBF3FF] opacity-50">
             <Plus className="w-8 h-8 mb-2" />
             <p className="text-xs text-center px-4 font-medium">Add PDF, image, Word, Excel, and PowerPoint files</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 h-full bg-[#F4F7FB] overflow-y-auto">
      <Document file={currentFile} className="flex flex-wrap gap-x-8 gap-y-10">
        {pages.map((page) => {
          const isSelected = selectedPages.includes(page.pageNumber);
          return (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: page.pageNumber * 0.05 }}
              key={page.pageNumber} 
              className="relative group w-[200px]"
            >
              <div 
                className={cn(
                  "w-full aspect-[1/1.4] bg-white border rounded shadow-sm relative cursor-pointer overflow-hidden transition-all duration-200 flex items-center justify-center",
                  isSelected ? "border-brand-blue border-2 shadow-md" : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                )}
                onClick={() => togglePageSelection(page.pageNumber)}
              >
                <Page 
                  pageNumber={page.pageNumber} 
                  width={150} 
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  loading={
                    <div className="flex items-center justify-center h-full">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  }
                />
                
                <div className="absolute top-2 left-2 z-10">
                  <div className={cn(
                    "w-5 h-5 rounded flex items-center justify-center border",
                    isSelected ? "bg-brand-blue border-brand-blue" : "bg-white border-gray-300"
                  )}>
                    {isSelected && <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                  </div>
                </div>

                <div className="absolute top-2 right-2 bg-white rounded shadow flex items-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button 
                    className="p-1.5 hover:bg-gray-100 text-gray-600" 
                    title="Zoom"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewPage(page.pageNumber);
                    }}
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                  {/* <button className="p-1.5 hover:bg-gray-100 text-gray-600" title="Rotate"><RotateCw className="w-3.5 h-3.5" /></button>
                  <button className="p-1.5 hover:bg-gray-100 text-gray-600" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button> */}
                </div>
              </div>
              
              <div className="mt-3 text-center">
                <div className="inline-block px-3 py-0.5 bg-red-100 text-red-500 text-[10px] font-medium rounded-full mb-1 truncate max-w-full">
                  Page {page.pageNumber}
                </div>
                <div className="text-gray-400 text-xs">{page.pageNumber}</div>
              </div>

              <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-6 h-6 bg-blue-100 text-brand-blue rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm hover:bg-brand-blue hover:text-white z-10">
                <Plus className="w-4 h-4" />
              </div>
            </motion.div>
          );
        })}
      </Document>

      <AnimatePresence>
        {previewPage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={() => setPreviewPage(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full shadow-md text-gray-800 z-10"
                onClick={() => setPreviewPage(null)}
              >
                <X className="w-6 h-6" />
              </button>
              
              <Document file={currentFile} className="flex justify-center">
                <Page 
                  pageNumber={previewPage} 
                  scale={2}
                  className="shadow-lg"
                  renderAnnotationLayer={false}
                  renderTextLayer={true}
                />
              </Document>
              
              <div className="p-4 text-center border-t border-gray-100 bg-gray-50 mt-2 rounded-b-lg">
                <p className="font-semibold text-gray-800">Page {previewPage}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
