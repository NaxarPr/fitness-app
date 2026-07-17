import { useEffect, useRef } from 'react';

/**
 * Detects a horizontal swipe that starts near the left screen edge and moves
 * right, invoking `onSwipeRight` — used to open a left drawer with a gesture.
 */
export const useEdgeSwipe = (onSwipeRight, { edgeSize = 30, threshold = 60 } = {}) => {
  const start = useRef(null);

  useEffect(() => {
    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      if (touch.clientX <= edgeSize) {
        start.current = { x: touch.clientX, y: touch.clientY };
      } else {
        start.current = null;
      }
    };

    const handleTouchEnd = (e) => {
      if (!start.current) {
        return;
      }
      const touch = e.changedTouches[0];
      const dx = touch.clientX - start.current.x;
      const dy = touch.clientY - start.current.y;

      if (dx > threshold && Math.abs(dx) > Math.abs(dy)) {
        onSwipeRight();
      }
      start.current = null;
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipeRight, edgeSize, threshold]);
};
