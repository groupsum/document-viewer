import React, { useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import './PDFDocumentView.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export interface PDFDocumentViewProps {
  file: File | string;
  pageNumber: number;
  scale: number;
  rotation: number;
  isLoading: boolean;
  onDocumentLoadSuccess: (info: { numPages: number }) => void;
  numPages: number | null;
}

export function PDFDocumentView({
  file,
  pageNumber,
  scale,
  rotation,
  isLoading,
  onDocumentLoadSuccess,
  numPages
}: PDFDocumentViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-auto bg-gray-100/50 relative document-scrollbar"
      role="region"
      aria-label="Active Document Viewport"
      tabIndex={0}
    >
      {isLoading && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-gray-100/80 z-10 backdrop-blur-sm"
          role="status"
          aria-live="assertive"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" aria-hidden="true"></div>
            <p className="text-sm font-medium text-gray-600">Loading your document securely...</p>
          </div>
        </div>
      )}

      <div className="min-h-full min-w-full flex p-4 sm:p-8">
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          className="m-auto flex flex-col items-center justify-center shadow-2xl bg-white"
          loading={null}
        >
          {numPages && (
            <Page
              pageNumber={pageNumber}
              scale={scale}
              rotate={rotation}
              className="max-w-full"
              renderTextLayer={true}
              renderAnnotationLayer={true}
              loading={
                <div
                  className="w-[600px] h-[800px] flex items-center justify-center self-center max-w-full"
                  role="status"
                  aria-live="polite"
                >
                  <span className="sr-only">Rendering requested PDF page data...</span>
                  <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                </div>
              }
            />
          )}
        </Document>
      </div>
    </div>
  );
}
