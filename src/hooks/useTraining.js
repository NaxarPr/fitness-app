import { useEffect, useState} from 'react';
import { startTraining } from '../utils/startTraining';
import { finishTraining } from '../utils/finishTraining';

export function useTraining() {
  const [isLoading, setIsLoading] = useState(false);
  const [startTrainingTime, setStartTrainingTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState('00:00:00');

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleStartTraining = async () => {
    setIsLoading(true);
    try{
      await startTraining();
      const now = new Date().toISOString();
      localStorage.setItem('isTrainingStarted', now);
      setStartTrainingTime(now);
      setElapsedTime('00:00:00');
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
      setStartTrainingTime(null);
      setElapsedTime('00:00:00');
      localStorage.removeItem('isTrainingStarted');
      
      localStorage.removeItem('trainingExercises');
    } catch(error){
      console.error('Error finishing training:', error);
    } finally {
      setIsLoading(false);
    }
  }  

  useEffect(() => {
    const isTrainingStarted = localStorage.getItem('isTrainingStarted');
    if (isTrainingStarted) {
      const parsedDate = new Date(isTrainingStarted);
      
      if (isNaN(parsedDate.getTime())) {
        localStorage.removeItem('isTrainingStarted');
        return;
      }
      
      setStartTrainingTime(isTrainingStarted);
    }
  }, []);

  useEffect(() => {
    if (!startTrainingTime) {
      setElapsedTime('00:00:00');
      return;
    }

    const calculateElapsedTime = (startTimestamp) => {
      if (!startTimestamp) return '00:00:00';
      
      try {
        const startDate = new Date(startTimestamp);
        
        if (isNaN(startDate.getTime())) {
          return '00:00:00';
        }
        
        const now = new Date();
        const elapsedSeconds = Math.floor((now - startDate) / 1000);
        
        if (elapsedSeconds < 0 || isNaN(elapsedSeconds)) return '00:00:00';
        
        return formatTime(elapsedSeconds);
      } catch (error) {
        return '00:00:00';
      }
    };

    const updateTimer = () => {
      setElapsedTime(calculateElapsedTime(startTrainingTime));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [startTrainingTime]);

  return {
    startTrainingTime,
    elapsedTime,
    isLoading,
    handleStartTraining,
    handleFinishTraining,
  };
} 