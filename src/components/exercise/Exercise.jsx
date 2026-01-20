import React, { useState } from 'react';
import { useExercise } from '../../hooks/useExercise';
import ExerciseModal from '../modal/exercise/ExerciseModal';
import Input from '../common/Input';
import SystemButton from '../common/SystemButton';
import { Loader } from '../common/Loader';
import ContextMenu from '../common/ContextMenu';
import { useContextMenu } from '../../hooks/useContextMenu';

function Exercise({ name, user, isCompleted, setCompletedExercises, active, setExercises }) {
  const [showLogsModal, setShowLogsModal] = useState(false);
  const { contextMenu, handleContextMenu, closeContextMenu } = useContextMenu();
  const [isFocused, setIsFocused] = useState(false);

  const {
    isReady,
    exerciseName,
    oldValues,
    exerciseHistory,
    showAlternatives,
    alternatives,
    values,
    isLoading,
    setShowAlternatives,
    handleChange,
    handleAdd,
    switchExercise,
    fetchExerciseHistory
  } = useExercise(name, user, setCompletedExercises);
  
  const handleShowAlternatives = () => {
    setShowAlternatives(prev => !prev);
  };

  const handleDelete = () => {
    setExercises(prev => prev.filter(exercise => exercise.name !== exerciseName));
  };

  const contextMenuItems = [
    ...(alternatives.length > 0 ? [{
      icon: '🔄',
      label: showAlternatives ? 'Hide alternatives' : 'Show alternatives',
      onClick: handleShowAlternatives,
    }] : []),
    ...(exerciseHistory.length > 0 ? [{
      icon: '📊',
      label: 'Show all exercises data',
      onClick: () => setShowLogsModal(true),
    }] : []),
    {
      icon: '🗑️',
      label: 'Delete exercise',
      onClick: handleDelete,
      variant: 'danger',
    },
  ];

  return (
    <div className={`p-2 flex flex-col gap-2 w-full select-none rounded-lg ${isFocused ? 'shadow-lg shadow-gray-700' : ''}`} 
      onContextMenu={handleContextMenu} 
      onTouchStart={() => setIsFocused(true)}
      onTouchEnd={() => setIsFocused(false)}
    >
      <div className='flex justify-between items-center gap-2'>
        <div className='flex justify-center items-center gap-2'>
          {(isCompleted) ? ( <span>✅</span> ) : null}
          <p className='font-medium text-sm sm:text-base'>{exerciseName}{alternatives.length ? '*' : null}</p>
        </div>
    </div>
      
      {showAlternatives && alternatives.length > 0 && (
        <div className='flex items-center justify-between gap-2'>
          <div className="flex flex-wrap gap-2 bg-gray-800 rounded p-2 mt-1 w-full">
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
          <button
            onClick={() => setShowAlternatives(false)}
          >
            ❌
          </button>
        </div>
      )}
      
      {!active &&<div className="flex max-w-96 space-x-2 h-8">
        {oldValues.map((field) => (
          <Input
            key={field.key}
            placeholder={field.placeholder}
            pattern='[0-9]*'
            type='number'
            className="!w-12 sm:!w-16 h-8"
            value={values[field.key]}
            onChange={(e) => handleChange(field.key, e.target.value)}
            onDoubleClick={()=>  handleChange(field.key, field.placeholder)}
          />
        ))}
        {isLoading ? ( 
          <div className='flex justify-center items-center'>
            <Loader /> 
          </div>
        ) : (
          <SystemButton
            type="primary" 
            className='z-10'
            disabled={!isReady} 
            style={{ opacity: isReady ? 1 : 0 }} 
            onClick={handleAdd}
          >
            Add
          </SystemButton> 
        )}
      </div>}

      <ContextMenu
        isOpen={contextMenu.isOpen}
        position={{ x: contextMenu.x, y: contextMenu.y }}
        onClose={closeContextMenu}
        items={contextMenuItems}
        ariaLabel="Exercise context menu"
      />

      <ExerciseModal
        isOpen={showLogsModal}
        onClose={() => setShowLogsModal(false)}
        exerciseHistory={exerciseHistory}
        exerciseName={exerciseName}
        user={user}
        onDelete={() => {
          fetchExerciseHistory();
          setCompletedExercises(prev => prev.filter(exercise => exercise !== exerciseName));
        }}
      />
    </div>
  );
}

export default Exercise;