import React from 'react';
import AddNewExersice from '../exercise/AddNewExersice';
import SwipeToAction from '../common/SwipeToAction';

export const EditDayProgram = ({ user, dayNumber, setDayNumber, exercises, setExercises, handleSaveClick }) => {
  return (
    <div className='relative flex flex-col gap-4 min-w-[300px]'>
      <input type="number" placeholder='Enter day number' className='bg-gray-800 rounded-md px-2 py-1 max-w-[50px]' value={dayNumber} onChange={(e) => setDayNumber(e.target.value)} />
      {exercises.length > 0 && (
      <div>
          <ul className="flex flex-col gap-2">
              {exercises.map((exercise, index) => (
                <SwipeToAction
                  key={index}
                  onAction={() => setExercises(prev => prev.filter(ex => ex.name !== exercise.name))}
                  block={false}
                >
                  <li className="flex items-center px-2 py-1 border border-gray-700 rounded-lg">
                      <span>
                         {index + 1}. {exercise.name}
                      </span>
                  </li>
                </SwipeToAction>
              ))}
          </ul>
      </div>
      )}
      <AddNewExersice user={user} setExercises={setExercises} absButton={false}/>
      <button className='bg-gray-800 rounded-md hover:text-gray-300 hover:bg-gray-700 px-2 py-1' onClick={() => handleSaveClick(user)}>
          Save
      </button>
    </div>
  );
}
