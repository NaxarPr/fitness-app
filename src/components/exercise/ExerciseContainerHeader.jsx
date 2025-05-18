import React, { useState } from 'react';

function ExerciseContainerHeader({ onDaySelect, selectedDay, days, lastDay }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(selectedDay || '');

  const handleDaySelect = (day) => {
    setSearchInput(day);
    setIsOpen(false);
    onDaySelect(day);
  };

  return (
    <div 
      className="flex justify-center items-center p-4 mb-4 border-b border-gray-700 select-none"
    >
      <h2 className="text-xl font-semibold mr-1">Choose day</h2>
      {lastDay && <span className='text-gray-400 text-sm mr-4'>({lastDay})</span>}
      <div className="relative">
        <button
          type="button"
          className="w-20 bg-gray-800 border border-gray-700 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-700"
          onClick={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        >
          {searchInput}
        </button>
        {isOpen && (
          <div className="absolute text-center w-full mt-1 bg-gray-800 border border-gray-700 rounded shadow-lg z-10">
            {days.map((day) => (
              <div 
                key={day}
                className="p-2 hover:bg-gray-700 cursor-pointer"
                onClick={() => handleDaySelect(day)}
              >
                {day}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ExerciseContainerHeader;