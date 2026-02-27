import React from 'react';
import { useTraining } from '../hooks/useTraining';
import { Loader } from './common/Loader';

export function StartStopTraining() {
  const { startTrainingTime, elapsedTime, isLoading, handleStartTraining, handleFinishTraining } = useTraining();

  return (
    <>
      <div className='flex top-3 left-3 gap-2'>
        {isLoading ? <Loader size={20} color='green'/> : startTrainingTime ? (
          <button 
            className='bg-red-500 text-white px-2 rounded' 
            onClick={handleFinishTraining}
          >
            Finish
          </button>
        ) : (
          <button 
            className='bg-green-500 text-white px-2 rounded' 
            onClick={() => handleStartTraining(false)}
          >
            Start
          </button>
        )}
      </div>
      {startTrainingTime &&<div className='flex absolute top-3 left-1/2 -translate-x-1/2 gap-2'>
        <p className='text-white font-mono text-lg'>{elapsedTime}</p>
      </div>}
    </>
  );
}
