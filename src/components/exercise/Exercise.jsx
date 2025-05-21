import React, { useState } from 'react';
import { useExercise } from '../../hooks/useExercise';
import ExerciseModal from '../modal/ExerciseModal';

function Exercise({ name, user, isCompleted }) {
  const [showLogsModal, setShowLogsModal] = useState(false);
  
  const {
    isReady,
    isFinished,
    exerciseName,
    oldValues,
    exerciseHistory,
    showAlternatives,
    alternatives,
    values,
    setShowAlternatives,
    handleChange,
    handleAdd,
    switchExercise,
    fetchExerciseHistory
  } = useExercise(name, user);
  

  const handleShowAlternatives = () => {
    setShowAlternatives(prev => !prev);
  }

  return (
    <div className="flex flex-col gap-2 w-full select-none">
      <div className='flex justify-between items-center gap-2'>
          <div className='flex justify-center items-center gap-2'>
            {(isCompleted || isFinished) ? ( <span>✅</span> ) : (
              alternatives.length > 0 && (
                <span className='text-xs' onClick={handleShowAlternatives}>
                  🔅
                </span>
              )
            )}
            <p className="font-medium text-sm sm:text-base" onDoubleClick={handleShowAlternatives}>{exerciseName}</p>
            {exerciseHistory.length > 0 && (
              <div className="flex gap-1">
                <button
                  className="text-xs text-gray-400"
                  onClick={() => setShowLogsModal(true)}
                >
                  📋
                </button>
              </div>
            )}
          </div>
        <button className='bg-blue-500 text-white px-3 py-1 rounded' disabled={!isReady} style={{ opacity: isReady ? 1 : 0 }} onClick={handleAdd}>Add</button>
      </div>
      
      {showAlternatives && alternatives.length > 0 && (
        <div className="flex flex-wrap gap-2 bg-gray-800 rounded p-2 mt-1">
            {alternatives.filter(alt => alt !== exerciseName).map((alt, index) => (
              <button
                key={index}
                className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
                onClick={() => switchExercise(alt)}
              >
                {alt}
              </button>
            ))}
            {exerciseName !== name && (
              <button
                className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
                onClick={() => switchExercise(name)}
              >
                {name}
              </button>
            )}
        </div>
      )}
      
      <div className="flex max-w-96 space-x-2 h-8">
        {oldValues.map((field) => (
          <input
            key={field.key}
            placeholder={field.placeholder}
            pattern='[0-9]*'
            type='number'
            className="w-16 h-8 px-2 bg-gray-800 border border-gray-700 rounded text-sm focus:outline-none focus:border-blue-500"
            value={values[field.key]}
            onChange={(e) => handleChange(field.key, e.target.value)}
          />
        ))}
      </div>

      <ExerciseModal
        isOpen={showLogsModal}
        onClose={() => setShowLogsModal(false)}
        exerciseHistory={exerciseHistory}
        exerciseName={exerciseName}
        user={user}
        onDelete={fetchExerciseHistory}
      />
    </div>
  );
}

export default Exercise;