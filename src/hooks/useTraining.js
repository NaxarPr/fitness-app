import { useEffect, useState} from 'react';
import { startTraining } from '../utils/startTraining';
import { finishTraining } from '../utils/finishTraining';

export function useTraining() {
  const [isTrainingStarted, setIsTrainingStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleStartTraining = async () => {
    setIsLoading(true);
    try{
      await startTraining();
      localStorage.setItem('isTrainingStarted', new Date().toLocaleTimeString());
      setIsTrainingStarted(true);
    } catch(error){
      console.error('Error starting training:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleFinishTraining = async () => {
    setIsLoading(true);
    try{
      await finishTraining();
      setIsTrainingStarted(false);
      localStorage.removeItem('isTrainingStarted');
    } catch(error){
      console.error('Error finishing training:', error);
    } finally {
      setIsLoading(false);
    }
  }  

  useEffect(() => {
    const isTrainingStarted = localStorage.getItem('isTrainingStarted');
    if (isTrainingStarted) {
      setIsTrainingStarted(true);
    }
  },[isTrainingStarted]);

  return {
    isTrainingStarted,
    isLoading,
    handleStartTraining,
    handleFinishTraining,
  };
} 