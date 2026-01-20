import React from 'react';
import { useUsers } from '../context/UserContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StartStopTraining } from './StartStopTraining';
import CalendarModal from './modal/calendar/CalendarModal';
import ContextMenu from '../components/common/ContextMenu';
import { useContextMenu } from '../hooks/useContextMenu';

export function TopBar() {

  const navigate = useNavigate();
  const { column, setColumn } = useUsers();
  const { contextMenu, handleContextMenu, closeContextMenu } = useContextMenu();

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleReverse = () => {
    const newColumn = column === 'flex-col' ? 'flex-col-reverse' : 'flex-col';
    setColumn(newColumn);
  }

  const handleCalendar = async () => {
    setIsCalendarOpen((prev) => !prev);
  }

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
  ];
  return (
    <>
      <div className='flex relative items-center justify-between p-3'>
        <StartStopTraining />
        <button className='text-2xl select-none leading-none' onClick={handleContextMenu}>
        ☰
        </button>
        <ContextMenu
          isOpen={contextMenu.isOpen}
          position={{ x: contextMenu.x, y: contextMenu.y }}
          onClose={closeContextMenu}
          items={contextMenuItems}
          ariaLabel="Exercise context menu"
        />
      </div>
      <CalendarModal isOpen={isCalendarOpen} onClose={handleCalendar}/>
    </>

  );
}
