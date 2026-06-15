import React from 'react';
import { cn } from '../lib/utils';
import { useDocumentViewer } from '../hooks/useDocumentViewer';
import { PDFToolbar } from './subcomponents/PDFToolbar';
import { PDFDocumentView } from './subcomponents/PDFDocumentView';
import './DocumentViewer.css';

export interface DocumentViewerProps {
  file: File | string | null;
  className?: string;
}

export function DocumentViewer({ file, className }: DocumentViewerProps) {
  const {
    numPages,
    pageNumber,
    scale,
    rotation,
    isLoading,
    onDocumentLoadSuccess,
    handleZoomIn,
    handleZoomOut,
    handleRotate,
    handlePrevPage,
    handleNextPage,
  } = useDocumentViewer(file);

  if (!file) {
    return (
      <div className={cn("flex items-center justify-center bg-gray-50 border border-dashed border-gray-300 rounded-xl text-gray-400 font-medium", className)}>
        No PDF selected
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-sm", className)}>
      <PDFToolbar
        pageNumber={pageNumber}
        numPages={numPages}
        scale={scale}
        isLoading={isLoading}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onRotate={handleRotate}
      />

      <PDFDocumentView
        file={file}
        pageNumber={pageNumber}
        scale={scale}
        rotation={rotation}
        isLoading={isLoading}
        onDocumentLoadSuccess={onDocumentLoadSuccess}
        numPages={numPages}
      />
    </div>
  );
}

// Export the subcomponents and hooks as first-class APIs
export * from './subcomponents/PDFToolbar';
export * from './subcomponents/PDFDocumentView';
export * from '../hooks/useDocumentViewer';
