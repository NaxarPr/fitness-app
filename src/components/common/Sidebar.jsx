import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Sidebar = ({ isOpen, onClose, items, ariaLabel = 'Menu' }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      const previous = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = previous;
      };
    }
  }, [isOpen]);

  const getItemClasses = (variant) => {
    const baseClasses = 'flex items-center gap-3 w-full px-4 py-3 text-sm transition-colors text-left';

    if (variant === 'danger') {
      return `${baseClasses} text-red-400 hover:bg-gray-700 hover:text-red-300`;
    }

    return `${baseClasses} text-gray-200 hover:bg-gray-700`;
  };

  const handleItemClick = (onClick) => {
    onClick();
    onClose();
  };

  const renderItem = (item, index) =>
    item.type === 'toggle' ? (
      <div
        key={index}
        className={`${getItemClasses(item.variant)} justify-between cursor-default`}
      >
        <span className="flex items-center gap-3">
          {item.icon && <span>{item.icon}</span>}
          <span>{item.label}</span>
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={item.checked}
          aria-label={item.ariaLabel || item.label}
          onClick={item.onClick}
          className="relative flex h-7 w-14 shrink-0 items-center rounded-full border border-gray-600 bg-surface p-1 focus:outline-none focus:ring-2 focus:ring-main"
        >
          {item.checked ? (
            <span className="absolute left-1.5 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-[#60a5fa]" aria-hidden />
          ) : (
            <span className="absolute right-1.5 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-[#1fa132]" aria-hidden />
          )}
        </button>
      </div>
    ) : (
      <button
        key={index}
        className={getItemClasses(item.variant)}
        onClick={() => handleItemClick(item.onClick)}
        role="menuitem"
        tabIndex={isOpen ? 0 : -1}
      >
        {item.icon && <span>{item.icon}</span>}
        <span>{item.label}</span>
      </button>
    );

  const topItems = items.filter((item) => item.pin !== 'bottom');
  const bottomItems = items.filter((item) => item.pin === 'bottom');

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden
      />
      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-64 max-w-[80%] flex-col bg-main shadow-xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="menu"
        aria-label={ariaLabel}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between border-b border-gray-700 px-4 py-3">
          <span className="text-sm font-semibold text-gray-200">Menu</span>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-main rounded p-1"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {topItems.map((item, index) => renderItem(item, index))}
        </div>
        {bottomItems.length > 0 && (
          <div className="border-t border-gray-700 py-2">
            {bottomItems.map((item, index) => renderItem(item, index))}
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
