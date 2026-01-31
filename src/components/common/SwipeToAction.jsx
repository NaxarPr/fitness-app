import React, { useState, useRef, useCallback, useMemo } from 'react';

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : { r: 220, g: 38, b: 38 }; // fallback to red-600
};

const SwipeToAction = ({
  children,
  block = false,
  onAction,
  onLongPress,
  actionLabel = 'Move to delete',
  actionLabelActive = 'Release to delete 🗑️',
  threshold = 0.75,
  longPressDuration = 2000,
  actionColor = '#DC2626', // red-600
  backgroundColor = 'bg-gray-900',
}) => {
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isActioning, setIsActioning] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  
  const containerRef = useRef(null);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const swipeActivatedRef = useRef(false);
  const longPressTimerRef = useRef(null);

  const SWIPE_ACTIVATION_THRESHOLD = 15;

  const getClientX = (e) => {
    if (e.touches && e.touches.length > 0) {
      return e.touches[0].clientX;
    }
    return e.clientX;
  };

  const getClientY = (e) => {
    if (e.touches && e.touches.length > 0) {
      return e.touches[0].clientY;
    }
    return e.clientY;
  };

  const handleSwipeStart = useCallback((e) => {
    if (isActioning || block) return;
    
    const clientX = getClientX(e);
    const clientY = getClientY(e);
    startXRef.current = clientX;
    startYRef.current = clientY;
    swipeActivatedRef.current = false;
    setIsTouching(true);
    
    // Start long press timer
    if (onLongPress) {
      longPressTimerRef.current = setTimeout(() => {
        onLongPress({ x: clientX, y: clientY });
        handleSwipeEnd();
      }, longPressDuration);
    }
  }, [isActioning, onLongPress, longPressDuration]);

  const handleSwipeMove = useCallback((e) => {
    if (!isTouching || isActioning) return;
    
    const clientX = getClientX(e);
    const clientY = getClientY(e);
    const diffX = clientX - startXRef.current;
    const diffY = clientY - startYRef.current;

    // Cancel long press if user moves more than a small threshold
    if (Math.abs(diffX) > 10 || Math.abs(diffY) > 10) {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
    }

    // Check if swipe should be activated (horizontal movement > threshold)
    if (!swipeActivatedRef.current) {
      // If vertical movement is greater, don't activate swipe (allow scrolling)
      if (Math.abs(diffY) > Math.abs(diffX)) {
        return;
      }
      
      // Only activate if moved left beyond threshold
      if (diffX < -SWIPE_ACTIVATION_THRESHOLD) {
        swipeActivatedRef.current = true;
        setIsDragging(true);
      } else {
        return;
      }
    }

    // Only allow swiping to the left (negative X)
    const newTranslateX = Math.min(0, diffX);
    setTranslateX(newTranslateX);
  }, [isTouching, isActioning]);

  const handleSwipeEnd = useCallback(() => {
    // Cancel long press timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    
    setIsTouching(false);
    
    if (!isDragging || isActioning) {
      return;
    }
    
    setIsDragging(false);
    swipeActivatedRef.current = false;
    
    const containerWidth = containerRef.current?.offsetWidth || 0;
    const actionThreshold = containerWidth * threshold;
    
    if (Math.abs(translateX) > actionThreshold) {
      // Animate out and trigger action
      setIsActioning(true);
      setTranslateX(-containerWidth);
      
      setTimeout(() => {
        onAction?.();
      }, 300);
    } else {
      // Snap back
      setTranslateX(0);
    }
  }, [isDragging, isActioning, translateX, threshold, onAction]);

  // Calculate if we're past the action threshold for visual feedback
  const containerWidth = containerRef.current?.offsetWidth || 0;
  const actionThreshold = containerWidth * threshold;
  const isPastThreshold = Math.abs(translateX) > actionThreshold;
  
  // Convert hex color to RGB
  const rgb = useMemo(() => hexToRgb(actionColor), [actionColor]);
  
  // Calculate swipe progress for gradual color change (0 to 1)
  const swipeProgress = actionThreshold > 0 
    ? Math.min(1, Math.abs(translateX) / actionThreshold) 
    : 0;
  // Interpolate opacity from 0.1 to 1 based on progress
  const backgroundOpacity = 0.1 + (swipeProgress * 0.9);

  return (
    <div 
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-lg"
    >
      <div 
        className="absolute inset-0 flex items-center justify-end pr-4 rounded-lg"
        style={{ 
          backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${backgroundOpacity})`,
          opacity: translateX < 0 && !isActioning ? 1 : 0,
          transition: isActioning ? 'opacity 0.3s' : 'none',
        }}
      >
        <span className="text-white font-medium text-sm">
          {isPastThreshold ? actionLabelActive : actionLabel}
        </span>
      </div>
      
      <div 
        className={`w-full select-none rounded-lg ${backgroundColor} ${
          isActioning ? 'transition-transform duration-300' : isDragging ? '' : 'transition-transform duration-200'
        }`}
        style={{ transform: `translateX(${translateX}px)` }}
        onTouchStart={handleSwipeStart}
        onTouchMove={handleSwipeMove}
        onTouchEnd={handleSwipeEnd}
      >
        {children}
      </div>
    </div>
  );
};

export default SwipeToAction;
