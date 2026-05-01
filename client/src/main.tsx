import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { Toaster } from 'react-hot-toast';
import { pdfjs } from 'react-pdf';


pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
createRoot(document.getElementById('root')!).render(
  <StrictMode>

    <App />
    <Toaster position="top-right" />

  </StrictMode>,
)
