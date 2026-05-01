import { usePdfStore } from '@/store/usePdfStore';
import { api } from '@/lib/axios';
import {  FileDigit,   } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const ExtractHeader = () => {
  const { 
    pages, 
    selectedPages, 
 
    uploadedPdfId, 
    isExtracting, 
    setIsExtracting,
    reset
  } = usePdfStore();
  
  const navigate = useNavigate();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const allSelected = pages.length > 0 && selectedPages.length === pages.length;

  const handleExtract = async () => {
    if (selectedPages.length === 0) {
      toast.error('Please select at least one page to extract.');
      return;
    }
    if (!uploadedPdfId) {
      toast.error('PDF file ID is missing. Please upload the file again.');
      return;
    }

    setIsExtracting(true);
    try {
      const loadingToast = toast.loading('Extracting pages...');
      const response = await api.post('/pdfs/extract', {
        pdfId: uploadedPdfId,
        pagesArray: selectedPages,
      });
      
      toast.dismiss(loadingToast);
      if (response.data.success) {
        toast.success('Pages extracted successfully!');
        
        // Fetch download URL for the newly created PDF
        const pdfId = response.data.data.id;
        const downloadResponse = await api.get(`/pdfs/${pdfId}/download`);
        
        if (downloadResponse.data.success) {
          const downloadUrl = downloadResponse.data.data.downloadUrl;
          
          // Create an anchor element and trigger download
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = response.data.data.originalName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          toast.success('Download started');
        }

        reset();
        navigate('/documents');
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Failed to extract pages.');
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between overflow-x-auto">
      <div className="flex items-center gap-2">
        {/* Top left tools */}
        <div className="flex items-center border border-gray-300 rounded overflow-hidden shrink-0">
          {/* <button className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium border-r border-gray-300">
            <Scissors className="w-4 h-4" /> <span className="hidden sm:inline">Split</span>
          </button> */}
          <button className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 bg-blue-50 text-brand-blue text-sm font-medium border-r border-gray-300">
            <FileDigit className="w-4 h-4" /> <span className="hidden sm:inline">Extract</span>
          </button>
          {/* <button className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium">
            <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Add</span>
          </button> */}
        </div>

        {/* <div className="flex items-center gap-1 ml-1 md:ml-2 shrink-0">
           <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded" title="Rotate left"><RotateCw className="w-4 h-4 md:w-5 md:h-5 -scale-x-100" /></button>
           <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded" title="Rotate right"><RotateCw className="w-4 h-4 md:w-5 md:h-5" /></button>
           <button className="hidden sm:block p-1.5 text-gray-600 hover:bg-gray-100 rounded" title="Delete"><Trash2 className="w-5 h-5" /></button>
        </div> */}
      </div>

      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        {/* Toggle Separate PDFs */}
        {/* <label className="hidden md:flex items-center gap-2 cursor-pointer opacity-50">
          <div className="relative">
            <input type="checkbox" className="sr-only" disabled />
            <div className="w-8 h-4 bg-gray-200 rounded-full shadow-inner"></div>
            <div className="absolute w-4 h-4 bg-white rounded-full shadow inset-y-0 left-0"></div>
          </div>
          <span className="text-sm text-gray-400 font-medium whitespace-nowrap">Separate PDFs</span>
        </label> */}

        {/* Finish Button */}
        <button 
          onClick={handleExtract}
          disabled={isExtracting || selectedPages.length === 0}
          className="bg-brand-blue hover:bg-blue-700 text-white px-4 md:px-6 py-1.5 rounded font-medium flex items-center gap-2 disabled:opacity-50 transition-colors text-sm whitespace-nowrap"
        >
          {isExtracting ? 'Wait...' : 'Finish'} <span className="hidden sm:inline text-lg leading-none">&rarr;</span>
        </button>
      </div>
    </div>
  );
};

export const ExtractToolbar = () => {
  const { pages, selectedPages, selectAll, clearSelection } = usePdfStore();
  const allSelected = pages.length > 0 && selectedPages.length === pages.length;

  return (
    <div className="bg-white border-b border-gray-200 px-4 md:px-8 py-3 flex items-center justify-between shadow-sm z-10 shrink-0">
      <label className="flex items-center gap-2 cursor-pointer">
        <input 
          type="checkbox" 
          checked={allSelected} 
          onChange={allSelected ? clearSelection : selectAll}
          className="w-4 h-4 text-brand-blue border-gray-300 rounded focus:ring-brand-blue" 
        />
        <span className="text-xs md:text-sm font-medium text-gray-700">Select all</span>
      </label>

      {/* <div className="flex items-center gap-3 text-gray-400">
         <button className="hover:text-gray-600"><LayoutList className="w-4 h-4 md:w-5 md:h-5" /></button>
         <div className="w-px h-4 bg-gray-300"></div>
         <button className="text-brand-blue"><Grip className="w-4 h-4 md:w-5 md:h-5" /></button>
      </div> */}
    </div>
  );
};
