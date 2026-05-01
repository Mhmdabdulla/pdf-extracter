import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import { FileText,  Download, Trash2, UploadCloud } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

interface Document {
  id: string;
  originalName: string;
  totalPageCount: number;
  createdAt: string;
  s3Key: string;
}

export const Documents = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await api.get('/pdfs');
        if (response.data.success) {
          setDocuments(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch documents:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleDownload = async (pdfId: string, originalName: string) => {
    try {
      const response = await api.get(`/pdfs/${pdfId}/download`);
      if (response.data.success) {
        const downloadUrl = response.data.data.downloadUrl;
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = originalName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Failed to download document:', error);
    }
  };

  return (
    <div className="p-4 md:p-8 h-full bg-[#F4F7FB] overflow-y-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-4 md:px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-lg font-bold text-gray-800">My Documents</h2>
          <Link 
            to="/extract"
            className="w-full sm:w-auto bg-brand-blue hover:bg-blue-700 text-white px-4 py-2 rounded font-medium flex items-center justify-center gap-2 text-sm transition-colors"
          >
            <UploadCloud className="w-4 h-4" /> Upload
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </Link>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading documents...</div>
        ) : documents.length === 0 ? (
          <div className="p-16 text-center text-gray-500 flex flex-col items-center">
             <FileText className="w-16 h-16 text-gray-300 mb-4" />
             <p className="text-lg font-medium text-gray-900 mb-2">No documents found</p>
             <p className="text-sm">Upload a PDF to get started.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 text-sm">
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium w-32">Pages</th>
                    <th className="px-6 py-3 font-medium w-48">Date <span className="text-xs">↑</span></th>
                    <th className="px-6 py-3 font-medium w-24 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr key={doc.id} className="border-b border-gray-100 hover:bg-gray-50 group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-red-50 text-red-500 rounded flex items-center justify-center font-bold text-[10px]">
                            PDF
                          </div>
                          <span className="font-medium text-gray-700 truncate max-w-xs">{doc.originalName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {doc.totalPageCount} pages
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {format(new Date(doc.createdAt), 'MMMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => handleDownload(doc.id, doc.originalName)}
                            className="p-1.5 text-gray-400 hover:text-brand-blue rounded transition-colors"
                            title="Download"
                          >
                            <Download className="w-5 h-5" />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-red-500 rounded transition-colors" title="Delete">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-100">
              {documents.map((doc) => (
                <div key={doc.id} className="p-4 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 bg-red-50 text-red-500 rounded flex items-center justify-center font-bold text-[10px] shrink-0">
                        PDF
                      </div>
                      <span className="font-medium text-gray-700 truncate">{doc.originalName}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button 
                        onClick={() => handleDownload(doc.id, doc.originalName)}
                        className="p-2 text-gray-400 hover:text-brand-blue rounded border border-gray-100"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-500 rounded border border-gray-100">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 px-1">
                    <span>{doc.totalPageCount} pages</span>
                    <span>{format(new Date(doc.createdAt), 'MMM d, yyyy')}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
