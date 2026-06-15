import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { usePDFViewer } from '../hooks/usePDFViewer';

describe('usePDFViewer hook', () => {
  it('should initialize with default states securely', () => {
    const { result } = renderHook(() => usePDFViewer(null));
    expect(result.current.pageNumber).toBe(1);
    expect(result.current.scale).toBe(1.0);
    expect(result.current.rotation).toBe(0);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.numPages).toBe(null);
  });

  it('should update numPages and unlock loading strictly on success event', () => {
    const { result } = renderHook(() => usePDFViewer('mock.pdf'));

    act(() => {
      result.current.onDocumentLoadSuccess({ numPages: 12 });
    });

    expect(result.current.numPages).toBe(12);
    expect(result.current.isLoading).toBe(false);
  });

  it('should respect hard bounds when zooming (min 0.5 to max 3.0)', () => {
    const { result } = renderHook(() => usePDFViewer('mock.pdf'));

    act(() => {
      result.current.handleZoomIn();
    });
    expect(result.current.scale).toBeCloseTo(1.2);

    // Attempt extreme zoom out bounds
    act(() => {
      for (let i = 0; i < 10; i++) {
        result.current.handleZoomOut();
      }
    });
    expect(result.current.scale).toBeGreaterThanOrEqual(0.5);

    // Attempt extreme zoom in bounds
    act(() => {
      for (let i = 0; i < 20; i++) {
        result.current.handleZoomIn();
      }
    });
    expect(result.current.scale).toBeLessThanOrEqual(3.0);
  });

  it('should ensure page transitions never break beyond total PDF length bounds', () => {
    const { result } = renderHook(() => usePDFViewer('mock.pdf'));
    act(() => {
      result.current.onDocumentLoadSuccess({ numPages: 2 });
    });

    // Valid forward navigation
    act(() => result.current.handleNextPage());
    expect(result.current.pageNumber).toBe(2);

    // Bound intercept on forward overflow
    act(() => result.current.handleNextPage());
    expect(result.current.pageNumber).toBe(2);

    // Valid backwards navigation
    act(() => result.current.handlePrevPage());
    expect(result.current.pageNumber).toBe(1);

    // Bound intercept on negative overflow
    act(() => result.current.handlePrevPage());
    expect(result.current.pageNumber).toBe(1);
  });
});
