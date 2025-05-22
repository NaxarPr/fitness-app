import React from 'react';
import { deleteLastExercise } from '../../../utils/deleteLastExercise';

function ExerciseTable({ onToggleChart, exerciseHistory, exerciseName, user, onDelete }) {

  const handleDelete = async () => {
    const deleted = await deleteLastExercise(exerciseName, user);
    if (deleted) {
      onDelete();
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
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left p-2">Date</th>
                <th className="text-left p-2">1st</th>
                <th className="text-left p-2">2nd</th>
                <th className="text-left p-2">3rd</th>
                <th className="text-left p-2">4th</th>
              </tr>
            </thead>
            <tbody>
              {exerciseHistory.map((log) => (
                <tr key={log.id} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="p-2">
                    {new Date(log.date).toLocaleDateString()}
                  </td>
                  <td className="p-2">{log.first}</td>
                  <td className="p-2">{log.second}</td>
                  <td className="p-2">{log.third}</td>
                  <td className="p-2">{log.fourth}</td>
                  <td className="p-2">
                    {isToday(log.date) && (
                      <button
                        onClick={handleDelete}
                        title="Delete this entry"
                        className="text-red-400 hover:text-red-300"
                      >
                        ❌
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
  );
}

export default ExerciseTable; 