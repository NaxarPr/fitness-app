import React, { useState, useEffect } from 'react';
import { useUsers } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { StartStopTraining } from './StartStopTraining';
import CalendarModal from './modal/calendar/CalendarModal';
import ContextMenu from '../components/common/ContextMenu';
import { useContextMenu } from '../hooks/useContextMenu';

const THEMES = ['dark-blue', 'dark-green'];

export function TopBar() {
  const navigate = useNavigate();
  const { column, setColumn, handleHideWeights, hideWeights } = useUsers();
  const { contextMenu, handleContextMenu, closeContextMenu } = useContextMenu();

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('dark-blue');

  useEffect(() => {
    const saved = localStorage.getItem('user-theme');
    if (saved && THEMES.includes(saved)) {
      setCurrentTheme(saved);
    }
  }, []);

  const handleReverse = () => {
    const newColumn = column === 'flex-col' ? 'flex-col-reverse' : 'flex-col';
    setColumn(newColumn);
  };

  const handleCalendar = () => {
    setIsCalendarOpen((prev) => !prev);
  };

  const setTheme = (themeName) => {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('user-theme', themeName);
    setCurrentTheme(themeName);
  };

  const handleToggleTheme = () => {
    const next = currentTheme === 'dark-blue' ? 'dark-green' : 'dark-blue';
    setTheme(next);
  };

  const contextMenuItems = [
    {
      label: 'Calendar',
      icon: '📅',
      onClick: handleCalendar,
    },
    {
      label: 'Exercises',
      icon: '📝',
      onClick: () => navigate('/exercises'),
    },
    {
      label: 'Reverse',
      icon: '🔄',
      onClick: handleReverse,
    },
    {
      label: hideWeights ? 'Show weights' : 'Hide weights',
      icon: '⚖️',
      onClick: () => handleHideWeights(),
    },
  ];

  return (
    <>
      <div className='flex relative items-center justify-between p-3'>
        <StartStopTraining />
        <div className='flex items-center gap-2'>
          <button
            type="button"
            role="switch"
            aria-checked={currentTheme === 'dark-green'}
            aria-label="Theme: left is Blue, right is Green"
            onClick={handleToggleTheme}
            className="relative flex h-7 w-14 shrink-0 items-center rounded-full border border-gray-600 bg-surface p-1 focus:outline-none focus:ring-2 focus:ring-main"
          >
            {currentTheme != 'dark-blue' ? ( 
              <span className="absolute left-1.5 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-[#60a5fa]" aria-hidden />
            ) : ( 
              <span className="absolute right-1.5 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-[#1fa132]" aria-hidden />
            )}
          </button>
          <button
            type="button"
            className='text-3xl select-none leading-none focus:outline-none focus:ring-2 focus:ring-main rounded pb-[6px]'
            onClick={handleContextMenu}
            aria-label="Open menu"
          >
            ☰
          </button>
        </div>
      </div>
      <ContextMenu
        isOpen={contextMenu.isOpen}
        position={{ x: contextMenu.x, y: contextMenu.y }}
        onClose={closeContextMenu}
        items={contextMenuItems}
        ariaLabel="Exercise context menu"
      />
      <CalendarModal isOpen={isCalendarOpen} onClose={handleCalendar}/>
    </>

  );
}
