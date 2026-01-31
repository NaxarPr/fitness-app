import React, { useState } from 'react';
import { deleteLastExercise } from '../../../utils/deleteLastExercise';
import { Loader } from '../../common/Loader';
import SwipeToAction from '../../common/SwipeToAction';

function ExerciseTable({ onToggleChart, exerciseHistory, exerciseName, user, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(null);
  
  const handleDelete = async (id) => {
    setIsDeleting(id);
    try {
      const deleted = await deleteLastExercise(exerciseName, user);
      if (deleted) {
        onDelete();
      }
    } catch (error) {
      console.error('Error deleting last exercise:', error);
    } finally {
      setIsDeleting(null);
    }
  };

  const isToday = (dateString) => {
    const today = new Date();
    const date = new Date(dateString);
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  return (
    <div className='max-h-[80vh] overflow-y-auto'>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{exerciseName}</h2>
        <div className="flex gap-2">
          <button
            onClick={onToggleChart}
            className="px-3 py-1 rounded bg-gray-700 text-gray-300 hover:bg-gray-600"
          >
            📈
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <div className="flex border-b border-gray-700 text-sm font-semibold">
          <div className="flex-1 p-2 min-w-[100px]">Date</div>
          <div className="w-12 p-2 text-center">1st</div>
          <div className="w-12 p-2 text-center">2nd</div>
          <div className="w-12 p-2 text-center">3rd</div>
          <div className="w-12 p-2 text-center">4th</div>
        </div>
        
        <div className="text-sm">
          {exerciseHistory.map((log) => {
            const canDelete = isToday(log.date) && !isDeleting;
            
            return (
              <SwipeToAction
                key={log.id}
                onAction={() => handleDelete(log.id)}
                block={!canDelete}
                backgroundColor={canDelete ? 'bg-green-900' : 'bg-gray-800'}
              >
                <div className="flex items-center border-b border-gray-700 hover:bg-gray-700/50">
                  <div className="flex-1 p-2 min-w-[100px]">
                    {new Date(log.date).toLocaleDateString()}
                  </div>
                  <div className="w-12 p-2 text-center">{log.first}</div>
                  <div className="w-12 p-2 text-center">{log.second}</div>
                  <div className="w-12 p-2 text-center">{log.third}</div>
                  <div className="w-12 p-2 text-center">{log.fourth}</div>
                  {isDeleting === log.id && (
                    <div className="w-8 flex justify-center items-center">
                      <Loader size={14} color='red'/>
                    </div>
                  )}
                </div>
              </SwipeToAction>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ExerciseTable;
