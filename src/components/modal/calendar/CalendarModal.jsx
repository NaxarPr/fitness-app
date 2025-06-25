import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import addMonths from 'date-fns/addMonths';
import subMonths from 'date-fns/subMonths';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getTrainingDates } from '../../../utils/getTrainingDates';


const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const dayPropGetter = (date, trainingDates) => {  
  const hasTraining = trainingDates?.some(trainingDate => {
    const eventDate = new Date(trainingDate);
    return eventDate.toDateString() === date.toDateString();
  });

  if (hasTraining) {
    return {
      className: 'bg-green-500 text-white rounded-xl'
    };
  } 
  return {};
};

const CalendarModal = ({ isOpen, onClose }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const monthName = format(currentDate, 'MMMM yyyy');
  const [trainingDates, setTrainingDates] = useState([]);
  useEffect(() => {
    const getTraining = async () => {
      const dates = await getTrainingDates();
      setTrainingDates(dates);
    }
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
       getTraining();
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  return (
    <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div onClick={e => e.stopPropagation()} className="bg-gray-900 p-6 rounded-lg shadow-xl w-[90%] max-w-4xl relative max-h-[80vh] overflow-y-auto">
        <div className="flex justify-center items-center gap-4 mb-4">
          <button
            onClick={goToPreviousMonth} 
            className="bg-transparent border-none text-lg cursor-pointer hover:text-gray-400 text-white"
          >
            ◀
          </button>
          <h3 className="text-xl font-medium text-white">{monthName}</h3>
          <button 
            onClick={goToNextMonth} 
            className="bg-transparent border-none text-lg cursor-pointer hover:text-gray-400 text-white"
          >
            ▶
          </button>
        </div>
        <div className="h-96">
          <Calendar
            localizer={localizer}
            startAccessor="start"
            endAccessor="end"
            className="h-full"
            views={['month']}
            defaultView="month"
            toolbar={false}
            dayPropGetter={(date) => dayPropGetter(date, trainingDates)}
            date={currentDate}
            onNavigate={setCurrentDate}
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarModal; 