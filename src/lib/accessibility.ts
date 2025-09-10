// Accessibility utilities and hooks

import { useEffect, useRef, useState } from 'react';

/**
 * Hook for managing focus trap in modals and dialogs
 */
export const useFocusTrap = (isActive: boolean) => {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const closeButton = container.querySelector('[data-close-modal]') as HTMLElement;
        closeButton?.click();
      }
    };

    document.addEventListener('keydown', handleTabKey);
    document.addEventListener('keydown', handleEscapeKey);
    firstElement?.focus();

    return () => {
      document.removeEventListener('keydown', handleTabKey);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isActive]);

  return containerRef;
};

/**
 * Hook for managing keyboard navigation in lists
 */
export const useKeyboardNavigation = (itemCount: number, onSelect?: (index: number) => void) => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex(prev => (prev + 1) % itemCount);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex(prev => (prev - 1 + itemCount) % itemCount);
          break;
        case 'Home':
          e.preventDefault();
          setActiveIndex(0);
          break;
        case 'End':
          e.preventDefault();
          setActiveIndex(itemCount - 1);
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (activeIndex >= 0 && onSelect) {
            onSelect(activeIndex);
          }
          break;
        case 'Escape':
          setActiveIndex(-1);
          break;
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, itemCount, onSelect]);

  return { containerRef, activeIndex, setActiveIndex };
};

/**
 * Hook for screen reader announcements
 */
export const useScreenReader = () => {
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.setAttribute('class', 'sr-only');
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  return { announce };
};

/**
 * Hook for managing reduced motion preferences
 */
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

/**
 * Hook for managing high contrast preferences
 */
export const useHighContrast = () => {
  const [prefersHighContrast, setPrefersHighContrast] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setPrefersHighContrast(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersHighContrast(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersHighContrast;
};

/**
 * Utility functions for accessibility
 */
export const a11yUtils = {
  // Generate unique IDs for form elements
  generateId: (prefix: string = 'a11y') => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  },

  // Check if element is visible to screen readers
  isVisibleToScreenReader: (element: HTMLElement) => {
    const style = window.getComputedStyle(element);
    return (
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      style.opacity !== '0' &&
      element.getAttribute('aria-hidden') !== 'true'
    );
  },

  // Get accessible name for an element
  getAccessibleName: (element: HTMLElement) => {
    // Check aria-label first
    const ariaLabel = element.getAttribute('aria-label');
    if (ariaLabel) return ariaLabel;

    // Check aria-labelledby
    const labelledBy = element.getAttribute('aria-labelledby');
    if (labelledBy) {
      const labelElement = document.getElementById(labelledBy);
      if (labelElement) return labelElement.textContent || '';
    }

    // Check associated label
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
      const id = element.getAttribute('id');
      if (id) {
        const label = document.querySelector(`label[for="${id}"]`);
        if (label) return label.textContent || '';
      }
    }

    // Fallback to text content
    return element.textContent || '';
  },

  // Check color contrast ratio
  checkColorContrast: (foreground: string, background: string) => {
    // This is a simplified version - in production, use a proper color contrast library
    const getLuminance = (color: string) => {
      // Convert hex to RGB and calculate luminance
      const hex = color.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16) / 255;
      const g = parseInt(hex.substr(2, 2), 16) / 255;
      const b = parseInt(hex.substr(4, 2), 16) / 255;
      
      const [rs, gs, bs] = [r, g, b].map(c => {
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    const l1 = getLuminance(foreground);
    const l2 = getLuminance(background);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    
    return {
      ratio,
      AA: ratio >= 4.5,
      AAA: ratio >= 7,
    };
  },
};

/**
 * Accessibility validation utilities
 */
export const a11yValidation = {
  // Check if images have alt text
  validateImages: () => {
    const images = document.querySelectorAll('img');
    const issues: string[] = [];
    
    images.forEach((img, index) => {
      if (!img.getAttribute('alt') && img.getAttribute('role') !== 'presentation') {
        issues.push(`Image ${index + 1} is missing alt text`);
      }
    });
    
    return issues;
  },

  // Check if form inputs have labels
  validateFormLabels: () => {
    const inputs = document.querySelectorAll('input, textarea, select');
    const issues: string[] = [];
    
    inputs.forEach((input, index) => {
      const accessibleName = a11yUtils.getAccessibleName(input as HTMLElement);
      if (!accessibleName.trim()) {
        issues.push(`Form input ${index + 1} is missing a label`);
      }
    });
    
    return issues;
  },

  // Check heading hierarchy
  validateHeadingHierarchy: () => {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const issues: string[] = [];
    let previousLevel = 0;
    
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      
      if (index === 0 && level !== 1) {
        issues.push('Page should start with an h1 heading');
      }
      
      if (level > previousLevel + 1) {
        issues.push(`Heading level ${level} skips levels (previous was ${previousLevel})`);
      }
      
      previousLevel = level;
    });
    
    return issues;
  },

  // Run all validations
  validateAll: () => {
    return {
      images: a11yValidation.validateImages(),
      formLabels: a11yValidation.validateFormLabels(),
      headingHierarchy: a11yValidation.validateHeadingHierarchy(),
    };
  },
};

/**
 * ARIA utilities
 */
export const ariaUtils = {
  // Set expanded state for collapsible elements
  setExpanded: (element: HTMLElement, expanded: boolean) => {
    element.setAttribute('aria-expanded', expanded.toString());
  },

  // Set selected state for selectable elements
  setSelected: (element: HTMLElement, selected: boolean) => {
    element.setAttribute('aria-selected', selected.toString());
  },

  // Set pressed state for toggle buttons
  setPressed: (element: HTMLElement, pressed: boolean) => {
    element.setAttribute('aria-pressed', pressed.toString());
  },

  // Set disabled state
  setDisabled: (element: HTMLElement, disabled: boolean) => {
    if (disabled) {
      element.setAttribute('aria-disabled', 'true');
      element.setAttribute('tabindex', '-1');
    } else {
      element.removeAttribute('aria-disabled');
      element.removeAttribute('tabindex');
    }
  },

  // Set loading state
  setLoading: (element: HTMLElement, loading: boolean, label?: string) => {
    if (loading) {
      element.setAttribute('aria-busy', 'true');
      if (label) {
        element.setAttribute('aria-label', label);
      }
    } else {
      element.removeAttribute('aria-busy');
    }
  },
};