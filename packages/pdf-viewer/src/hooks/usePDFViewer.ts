import { useState, useEffect, useCallback } from 'react';

export function usePDFViewer(file: File | string | null) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Reset state when file changes
  useEffect(() => {
    setPageNumber(1);
    setScale(1.0);
    setRotation(0);
    setIsLoading(true);
  }, [file]);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
  }, []);

  const handleZoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev + 0.2, 3.0));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  }, []);

  const handleRotate = useCallback(() => {
    setRotation((prev) => (prev + 90) % 360);
  }, []);

  const handlePrevPage = useCallback(() => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setPageNumber((prev) => Math.min(prev + 1, numPages || 1));
  }, [numPages]);

  return {
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
  };
}
