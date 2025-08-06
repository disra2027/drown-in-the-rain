"use client";

import { useEffect, useRef } from "react";

/**
 * Custom hook to prevent body scroll when modal is open
 * @param isLocked - Whether to lock the scroll
 */
export function useScrollLock(isLocked: boolean) {
  const scrollPositionRef = useRef(0);

  useEffect(() => {
    if (isLocked) {
      // Save current scroll position before locking
      scrollPositionRef.current = window.pageYOffset || document.documentElement.scrollTop;
      
      // Lock body scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll styles
      const scrollY = scrollPositionRef.current;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      
      // Restore scroll position
      if (scrollY > 0) {
        window.scrollTo(0, scrollY);
      }
    }
  }, [isLocked]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, []);
}