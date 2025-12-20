import React from 'react';
import { useTraining } from '../hooks/useTraining';
import { Loader } from './common/Loader';

export function StartStopTraining() {
  const { isTrainingStarted, isLoading, handleStartTraining, handleFinishTraining } = useTraining();

  return (
    <div className='flex absolute top-3 left-3 gap-2'>
      {isLoading ? <Loader size={20} color='green'/> : isTrainingStarted ? (
        <button 
          className='bg-red-500 text-white px-2 rounded' 
          onClick={handleFinishTraining}
        >
          Finish
        </button>
      ) : (
        <button 
          className='bg-green-500 text-white px-2 rounded' 
          onClick={handleStartTraining}
        >
          Start
        </button>
      )}
    </div>
  );
}
