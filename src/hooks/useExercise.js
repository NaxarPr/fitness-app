import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase';
import { addExercise } from '../utils/addExercise';
import { getExercisesByName } from '../utils/getExercisesByName';
import EXERCISES from '../const/exercises';
import INITIAL_VALUES from '../const/exercisesInitialValues';
import { useTraining } from './useTraining';

export function useExercise(name, user, setCompletedExercises, setComment) {

  const { startTrainingTime, handleStartTraining } = useTraining();

  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [exerciseName, setExerciseName] = useState(name);
  const [oldValues, setOldValues] = useState(INITIAL_VALUES);
  const [exerciseHistory, setExerciseHistory] = useState([]);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [alternatives, setAlternatives] = useState([]);
  const [values, setValues] = useState({
    first: '',
    second: '',
    third: '',
    fourth: ''
  });

  const findAlternatives = useCallback((exerciseName) => {
    let foundAlternatives = [];
    
    for (const program of EXERCISES) {
      for (const day in program) {
        const exercises = program[day];
        const exercise = exercises.find(ex => ex.name === exerciseName);
        
        if (exercise && exercise.alternatives) {
          foundAlternatives = exercise.alternatives;
          break;
        }
      }
      if (foundAlternatives.length > 0) break;
    }
    
    return foundAlternatives;
  }, []);

  useEffect(() => {
    setExerciseName(name);
    const foundAlternatives = findAlternatives(name);
    setAlternatives(foundAlternatives);
  }, [name, findAlternatives]);

  const handleChange = (field, value) => {
    if (/^\d{0,2}$/.test(value)) {
      setValues(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleAdd = async (comment = null) => {
    setIsLoading(true);
    if (!startTrainingTime) {
      await handleStartTraining(true);
    }
    try {
      await addExercise(name, values, user, comment);      
      setCompletedExercises(prev => [...prev, name]);
      fetchExerciseHistory();
      setIsReady(false);
    } catch (error) {
      console.error('Error adding exercise:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const switchExercise = (newName) => {
    setExerciseName(newName);
    setShowAlternatives(false);
    fetchExerciseHistory();
  };

  useEffect(() => {
    if (values.first && values.second && values.third && values.fourth) {
      setIsReady(true);
    } else if (values.first || values.second || values.third || values.fourth) {
      setIsReady(false);
    }
  }, [values]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data: exerciseData } = await supabase
        .from('exercise_logs')
        .select('*')
        .eq('exercise', exerciseName) 
        .eq('user_id', user.id);
        
      if (exerciseData && exerciseData.length > 0) {
        const lastExercise = exerciseData[exerciseData.length - 1];
        setComment(lastExercise.comment || '');
        setOldValues([
          { key: 'first', placeholder: lastExercise.first },
          { key: 'second', placeholder: lastExercise.second },
          { key: 'third', placeholder: lastExercise.third },
          { key: 'fourth', placeholder: lastExercise.fourth }
        ]);
      } else {
        setOldValues(INITIAL_VALUES);
      }
    };

    fetchUsers();
    fetchExerciseHistory();
    // eslint-disable-next-line 
  }, [exerciseName, user.id]);

  const fetchExerciseHistory = async () => {
    const exercises = await getExercisesByName(exerciseName, user);
    setExerciseHistory(exercises);
  };

  return {
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
  };
} 