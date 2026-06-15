import React from 'react';
import { ChevronLeft, ChevronRight, RotateCw, Minus, Plus } from 'lucide-react';
import './PDFToolbar.css';

export interface PDFToolbarProps {
  pageNumber: number;
  numPages: number | null;
  scale: number;
  isLoading: boolean;
  onPrevPage: () => void;
  onNextPage: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotate: () => void;
}

export function PDFToolbar({
  pageNumber,
  numPages,
  scale,
  isLoading,
  onPrevPage,
  onNextPage,
  onZoomIn,
  onZoomOut,
  onRotate
}: PDFToolbarProps) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 z-10 shrink-0"
      role="toolbar"
      aria-label="PDF Document Formatting Controls"
    >
      <div className="flex items-center gap-1">
        <button
          onClick={onPrevPage}
          disabled={pageNumber <= 1 || isLoading}
          aria-label="Navigate to previous page"
          aria-disabled={pageNumber <= 1 || isLoading}
          className="p-1.5 rounded-md text-gray-600 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
          <ChevronLeft className="w-5 h-5" aria-hidden="true" />
        </button>

        <div
          className="flex items-center gap-2 px-2 text-sm font-medium text-gray-700 tabular-nums"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="sr-only">Page</span>
          <span className="w-8 text-center">{pageNumber}</span>
          <span className="text-gray-400" aria-hidden="true">/</span>
          <span className="sr-only">out of total</span>
          <span className="w-8 text-center">{numPages || '-'}</span>
        </div>

        <button
          onClick={onNextPage}
          disabled={pageNumber >= (numPages || 1) || isLoading}
          aria-label="Navigate to next page"
          aria-disabled={pageNumber >= (numPages || 1) || isLoading}
          className="p-1.5 rounded-md text-gray-600 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
          <ChevronRight className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>

      <div className="flex items-center justify-center gap-4">
        <div className="flex items-center bg-gray-50 rounded-lg p-0.5 border border-gray-200">
          <button
            onClick={onZoomOut}
            disabled={scale <= 0.5 || isLoading}
            aria-label="Zoom document out"
            aria-disabled={scale <= 0.5 || isLoading}
            className="p-1.5 rounded-md text-gray-600 hover:bg-white hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-30 transition-all"
          >
            <Minus className="w-4 h-4" aria-hidden="true" />
          </button>

          <span
            className="text-xs font-semibold text-gray-600 w-12 text-center tabular-nums"
            aria-live="polite"
            aria-atomic="true"
            aria-label={`Current zoom level is ${Math.round(scale * 100)} percent`}
          >
            {Math.round(scale * 100)}%
          </span>

          <button
            onClick={onZoomIn}
            disabled={scale >= 3.0 || isLoading}
            aria-label="Zoom document in"
            aria-disabled={scale >= 3.0 || isLoading}
            className="p-1.5 rounded-md text-gray-600 hover:bg-white hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-30 transition-all"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1">
         <button
          onClick={onRotate}
          disabled={isLoading}
          aria-label="Rotate document layout 90 degrees"
          className="p-1.5 rounded-md text-gray-600 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-30 transition-colors"
        >
          <RotateCw className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
