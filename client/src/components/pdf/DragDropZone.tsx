import React, { useCallback, useRef } from 'react';
import { UploadCloud } from 'lucide-react';
import { usePdfStore } from '@/store/usePdfStore';

export const DragDropZone = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setFile } = usePdfStore();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        setFile(file);
      } else {
        // Here you might want to show a toast error for invalid file type
        console.error('Please select a valid PDF file.');
      }
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        setFile(file);
      }
    }
  }, [setFile]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div 
        className="w-full max-w-4xl h-[600px] border border-blue-200 border-dashed rounded-lg bg-[#EBF3FF] flex flex-col items-center justify-center transition-colors hover:bg-blue-50"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <UploadCloud className="w-16 h-16 text-[#001433] mb-4" />
        
        <div className="flex items-center mb-6">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-[#1A56DB] hover:bg-blue-700 text-white px-6 py-3 rounded-l-md font-medium flex items-center gap-2 transition-colors"
          >
            <span className="text-xl leading-none font-light">+</span> Select files
          </button>
          <button className="bg-[#1A56DB] hover:bg-blue-700 text-white px-3 py-3 rounded-r-md border-l border-blue-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </button>
        </div>

        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileSelect} 
          accept="application/pdf" 
          className="hidden" 
        />

        <p className="text-gray-700 mb-2 font-medium">
          Add <span className="font-bold">PDF</span> files
        </p>
        
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="text-gray-500">Supported formats:</span>
          <span className="text-red-500 bg-red-50 px-1 rounded">PDF</span>
        </div>
      </div>
    </div>
  );
};
