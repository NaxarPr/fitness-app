import React, { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '../store/appStore';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { StartStopTraining } from './StartStopTraining';
import CalendarModal from './modal/calendar/CalendarModal';
import Sidebar from '../components/common/Sidebar';
import { useEdgeSwipe } from '../hooks/useEdgeSwipe';
import { useShallow } from 'zustand/shallow';
import {
  Menu,
  CalendarDays,
  ClipboardList,
  ArrowUpDown,
  Eye,
  EyeOff,
  Palette,
  LogOut,
} from 'lucide-react';

const THEMES = ['dark-blue', 'dark-green'];

export function TopBar() {
  const navigate = useNavigate();
  const { column, setColumn, handleHideWeights, hideWeights } = useAppStore(
    useShallow((state) => ({
      column: state.column,
      setColumn: state.setColumn,
      handleHideWeights: state.handleHideWeights,
      hideWeights: state.hideWeights,
    }))
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const openMenu = useCallback(() => setIsMenuOpen(true), []);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  useEdgeSwipe(openMenu);

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
    setTheme(currentTheme === 'dark-blue' ? 'dark-green' : 'dark-blue');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const menuItems = [
    {
      label: 'Calendar',
      icon: <CalendarDays size={18} />,
      onClick: handleCalendar,
    },
    {
      label: 'Exercises',
      icon: <ClipboardList size={18} />,
      onClick: () => navigate('/exercises'),
    },
    {
      label: 'Reverse',
      icon: <ArrowUpDown size={18} />,
      pin: 'bottom',
      onClick: handleReverse,
    },
    {
      label: hideWeights ? 'Show weights' : 'Hide weights',
      icon: hideWeights ? <Eye size={18} /> : <EyeOff size={18} />,
      pin: 'bottom',
      onClick: () => handleHideWeights(),
    },
    {
      type: 'toggle',
      label: 'Theme',
      icon: <Palette size={18} />,
      checked: currentTheme === 'dark-green',
      ariaLabel: 'Theme: left is Blue, right is Green',
      pin: 'bottom',
      onClick: handleToggleTheme,
    },
    {
      label: 'Sign out',
      icon: <LogOut size={18} />,
      variant: 'danger',
      pin: 'bottom',
      onClick: handleSignOut,
    }
  ];

  return (
    <>
      <div className='flex relative items-center justify-between p-3'>
        <button
          type="button"
          className='select-none focus:outline-none focus:ring-2 focus:ring-main rounded p-1'
          onClick={openMenu}
          aria-label="Open menu"
        >
          <Menu size={28} />
        </button>
        <StartStopTraining />
      </div>
      <Sidebar
        isOpen={isMenuOpen}
        onClose={closeMenu}
        items={menuItems}
        ariaLabel="Main menu"
      />
      <CalendarModal isOpen={isCalendarOpen} onClose={handleCalendar}/>
    </>

  );
}
