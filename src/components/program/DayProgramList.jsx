import React from 'react';

export const DayProgramList = ({ user, setEditDayUser, handleEditClick }) => {
  return (
    <>
      <button className='bg-gray-800 rounded-md hover:text-gray-300 hover:bg-gray-700 px-2 py-1' onClick={() => setEditDayUser(user.id)}>
          Create new day for <span className='text-green-400 font-bold'>{user.username}</span>
      </button>
      {Object.entries(user.program).map(([day, exercises]) => (
          exercises.length > 0 && (
          <div key={day} className="mb-6">
              <div className='flex items-center gap-4'>
                  <h3 className="text-lg font-medium">Day {day}</h3> 
                  <button onClick={() => handleEditClick(user, day)}>
                      ✏️
                  </button>
              </div>
              <ul className="list-disc pl-6">
                  {exercises.map((exercise, index) => (
                  <li key={index} className="mb-2">
                      {exercise.name}
                  </li>
                  ))}
              </ul>
          </div>
      )))}
  </>
  );
}
