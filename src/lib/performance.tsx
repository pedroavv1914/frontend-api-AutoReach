// Performance optimization utilities
import { useEffect, useRef, useState } from 'react';
import React from 'react';

/**
 * Lazy loading utility for components
 */
export const lazyLoad = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) => {
  const LazyComponent = React.lazy(importFunc);
  const LazyWrapper = React.forwardRef<any, React.ComponentProps<T>>((props, ref) => (
    <React.Suspense fallback={<div className="animate-pulse bg-muted h-8 w-full rounded" />}>
      <LazyComponent {...props as any} ref={ref} />
    </React.Suspense>
  ));
  LazyWrapper.displayName = 'LazyWrapper';
  return LazyWrapper;
};

/**
 * Debounce utility for search and input optimization
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle utility for scroll and resize events
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Image optimization utility
 */
export const optimizeImage = (src: string, width?: number, quality = 75) => {
  if (!src) return '';
  
  // For Next.js Image optimization
  const params = new URLSearchParams();
  if (width) params.set('w', width.toString());
  params.set('q', quality.toString());
  
  return `${src}?${params.toString()}`;
};

/**
 * Preload critical resources
 */
export const preloadResource = (href: string, as: string, type?: string) => {
  if (typeof window === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (type) link.type = type;
  document.head.appendChild(link);
};

/**
 * Intersection Observer hook for lazy loading
 */
export const useIntersectionObserver = (
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      { threshold: 0.1, ...options }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [hasIntersected, options]);

  return { elementRef, isIntersecting, hasIntersected };
};

/**
 * Virtual scrolling utility for large lists
 */
export const useVirtualScroll = <T,>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) => {
  const [scrollTop, setScrollTop] = useState(0);
  
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );
  
  const visibleItems = items.slice(startIndex, endIndex);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;
  
  return {
    visibleItems,
    totalHeight,
    offsetY,
    onScroll: (e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(e.currentTarget.scrollTop);
    },
  };
};

/**
 * Performance monitoring utilities
 */
export const measurePerformance = (name: string, fn: () => void) => {
  if (typeof window === 'undefined') return fn();
  
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  console.log(`${name} took ${end - start} milliseconds`);
  return result;
};

/**
 * Memory usage monitoring
 */
export const getMemoryUsage = () => {
  if (typeof window === 'undefined' || !('memory' in performance)) {
    return null;
  }
  
  const memory = (performance as Performance & { memory: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
  return {
    used: Math.round(memory.usedJSHeapSize / 1048576), // MB
    total: Math.round(memory.totalJSHeapSize / 1048576), // MB
    limit: Math.round(memory.jsHeapSizeLimit / 1048576), // MB
  };
};

/**
 * Bundle size analyzer (development only)
 */
export const analyzeBundleSize = () => {
  if (process.env.NODE_ENV !== 'development') return;
  
  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const totalSize = scripts.reduce((acc, script) => {
    const src = script.getAttribute('src');
    if (src && src.includes('_next/static')) {
      // Estimate size based on script length (rough approximation)
      return acc + (script.innerHTML?.length || 0);
    }
    return acc;
  }, 0);
  
  console.log(`Estimated bundle size: ${Math.round(totalSize / 1024)} KB`);
};