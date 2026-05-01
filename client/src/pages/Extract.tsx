import { useEffect } from 'react';
import { usePdfStore } from '@/store/usePdfStore';
import { DragDropZone } from '@/components/pdf/DragDropZone';
import { PageGrid } from '@/components/pdf/PageGrid';
import { ExtractHeader, ExtractToolbar } from '@/components/pdf/ExtractHeader';
import { api } from '@/lib/axios';
import { pdfjs } from 'react-pdf';
import toast from 'react-hot-toast';
import axios from 'axios';

export const Extract = () => {
  const { 
    currentFile, 
    pages, 
    setIsUploading, 
    setUploadedPdfId, 
    setPages, 
    isUploading 
  } = usePdfStore();

  useEffect(() => {
    const processFile = async () => {
      if (!currentFile) return;

      setIsUploading(true);
      try {
        // 1. Get presigned URL
        const presignedResponse = await api.post('/pdfs/presigned-url', {
          originalName: currentFile.name,
          contentType: currentFile.type,
        });

        if (!presignedResponse.data.success) {
          throw new Error('Failed to get upload URL');
        }

        const { url:uploadUrl, key } = presignedResponse.data.data;

        // 2. Upload file directly to S3 using Axios PUT
        await axios.put(uploadUrl, currentFile, {
          headers: {
            'Content-Type': currentFile.type,
          },
        });

        console.log('File uploaded successfully to S3', { uploadUrl, key });

        // 3. Get total page count using pdfjs without full rendering
        const arrayBuffer = await currentFile.arrayBuffer();
        const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
        const numPages = pdf.numPages;
        console.log('PDF loaded, total pages:', numPages);
        
        const pagesArray = Array.from({ length: numPages }, (_, i) => ({
          pageNumber: i + 1,
        }));

        // 4. Save metadata to backend
        const metadataResponse = await api.post('/pdfs/metadata', {
          key,
          originalName: currentFile.name,
          totalPageCount: numPages,
        });

        if (!metadataResponse.data.success) {
          throw new Error('Failed to save PDF metadata');
        }

        // 5. Update state
        setUploadedPdfId(metadataResponse.data.data.id);
        setPages(pagesArray);
        toast.success('PDF processed successfully');

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error("Processing error:", error);
        toast.error(error.message || 'Error processing PDF');
      } finally {
        setIsUploading(false);
      }
    };

    if (currentFile && pages.length === 0 && !isUploading) {
      processFile();
    }
  }, [currentFile]); // only trigger when currentFile changes

  return (
    <div className="flex flex-col h-full relative">
      {/* If we have a file or are currently uploading one, show the workspace */}
      {(currentFile || pages.length > 0) ? (
        <div className="flex flex-col h-full">
          <ExtractHeader />
          <ExtractToolbar />
          <div className="flex-1 overflow-hidden relative">
            <PageGrid />
          </div>
        </div>
      ) : (
        /* Otherwise show the initial Drag and Drop zone */
        <DragDropZone />
      )}
    </div>
  );
};
