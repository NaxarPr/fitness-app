import React, { useEffect, useRef, useState } from 'react';

const ContextMenu = ({
  isOpen,
  position,
  onClose,
  items,
  ariaLabel = 'Context menu',
}) => {
  const menuRef = useRef(null);
  const [adjustedPosition, setAdjustedPosition] = useState(null);

  const handleKeyDown = (e, onClick) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
      onClose();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleItemClick = (onClick) => {
    onClick();
    onClose();
  };

  useEffect(() => {
    setAdjustedPosition(null);
  }, [position.x, position.y]);

  useEffect(() => {
    if (!isOpen || !menuRef.current) {
      return;
    }

    const menu = menuRef.current;
    const menuRect = menu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const padding = 8;

    let newX = position.x;
    let newY = position.y;

    if (position.x + menuRect.width > viewportWidth - padding) {
      newX = viewportWidth - menuRect.width - padding;
    }

    if (position.y + menuRect.height > viewportHeight - padding) {
      newY = viewportHeight - menuRect.height - padding;
    }

    newX = Math.max(padding, newX);
    newY = Math.max(padding, newY);

    setAdjustedPosition({ x: newX, y: newY });
  }, [isOpen, position, items.length]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('scroll', onClose);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('scroll', onClose);
    };
  }, [isOpen, onClose]);

  if (!isOpen || items.length === 0) {
    return null;
  }

  const getItemClasses = (variant) => {
    const baseClasses = 'flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors text-left';
    
    if (variant === 'danger') {
      return `${baseClasses} text-red-400 hover:bg-gray-700 hover:text-red-300`;
    }
    
    return `${baseClasses} text-gray-200 hover:bg-gray-700`;
  };

  const displayPosition = adjustedPosition ?? position;

  return (
    <div
      ref={menuRef}
      className="fixed z-50 min-w-[180px] bg-gray-800 border border-gray-700 rounded-lg shadow-xl"
      style={{ top: displayPosition.y, left: displayPosition.x }}
      role="menu"
      aria-label={ariaLabel}
    >
      {items.map((item, index) => (
        <button
          key={index}
          className={getItemClasses(item.variant)}
          onClick={() => handleItemClick(item.onClick)}
          onKeyDown={(e) => handleKeyDown(e, item.onClick)}
          role="menuitem"
          tabIndex={0}
        >
          {item.icon && <span>{item.icon}</span>}
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ContextMenu;
