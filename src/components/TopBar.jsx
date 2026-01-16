import React from 'react';
import { useUsers } from '../context/UserContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StartStopTraining } from './StartStopTraining';
import CalendarModal from './modal/calendar/CalendarModal';

export function TopBar() {

  const navigate = useNavigate();
  const { column, setColumn } = useUsers();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleReverse = () => {
    const newColumn = column === 'flex-col' ? 'flex-col-reverse' : 'flex-col';
    setColumn(newColumn);
  }

  const openExercises = (e) => {
    navigate('/exercises');
  }

  const openCalendar = async () => {
    setIsCalendarOpen(true);
  }

  const closeCalendar = () => {
    setIsCalendarOpen(false);
  }
  return (
    <>
      <div className='flex relative items-center justify-between p-3'>
        <StartStopTraining />
        <div className='flex items-center gap-2 leading-none'>
          <button onClick={openCalendar}>📅</button>
          <button onClick={openExercises}>📝</button>
          <button onClick={handleReverse} className='sm:hidden block'>🔃</button>
        </div>
      </div>
      <CalendarModal isOpen={isCalendarOpen} onClose={closeCalendar}/>
    </>

  );
}
