import { useState, useEffect, useCallback, useRef } from 'react';
import { addExercise } from '../utils/addExercise';
import { addExercise as addExerciseToCatalog } from '../utils/getAllExercises';
import { useAppStore } from '../store/appStore';
import { getExercisesByName } from '../utils/getExercisesByName';
import { DEFAULT_EXERCISE_VALUES, EXERCISES, INITIAL_VALUES } from '../const/exercises';
import { useTraining } from './useTraining';
import { useTrainingStore } from '../store/trainingStore';


export function useExercise(name, user, setCompletedExercises, setComment, savedValues = null, onValuesChange = null) {
  const { startTrainingTime, handleStartTraining } = useTraining();

  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [exerciseName, setExerciseName] = useState(name);
  const [oldValues, setOldValues] = useState(INITIAL_VALUES);
  const [exerciseHistory, setExerciseHistory] = useState([]);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [alternatives, setAlternatives] = useState([]);
  const [values, setValues] = useState(() => ({
    ...DEFAULT_EXERCISE_VALUES,
    ...(savedValues && typeof savedValues === 'object' ? savedValues : {})
  }));

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

  useEffect(() => {
    if (savedValues != null && typeof savedValues === 'object') {
      setValues((prev) => ({ ...DEFAULT_EXERCISE_VALUES, ...prev, ...savedValues }));
    }
  }, [name, savedValues]);

  const fetchExerciseHistory = useCallback(
    async ({ force = false, name: nameOverride } = {}) => {
      if (!user?.id) return;
      const targetName = nameOverride ?? exerciseName;
      const cacheKey = `${user.id}::${targetName}`;
      const { exerciseHistoryByKey, setExerciseHistoryForExercise } = useTrainingStore.getState();

      const applyLogsToUi = (exercises) => {
        setExerciseHistory(exercises);
        if (exercises && exercises.length > 0) {
          const lastExercise = exercises[0];
          setComment(lastExercise.comment || '');
          setOldValues([
            { key: 'first', placeholder: lastExercise.first },
            { key: 'second', placeholder: lastExercise.second },
            { key: 'third', placeholder: lastExercise.third },
            { key: 'fourth', placeholder: lastExercise.fourth },
          ]);
        } else {
          setOldValues(INITIAL_VALUES);
        }
      };

      if (!force && Object.prototype.hasOwnProperty.call(exerciseHistoryByKey, cacheKey)) {
        applyLogsToUi(exerciseHistoryByKey[cacheKey]);
        return;
      }

      const exercises = await getExercisesByName(targetName, user);
      setExerciseHistoryForExercise(user.id, targetName, exercises);
      applyLogsToUi(exercises);
    },
    [exerciseName, user, setComment]
  );

  const handleChange = (field, value) => {
    if (/^\d{0,2}$/.test(value)) {
      setValues((prev) => {
        const next = { ...prev, [field]: value };
        if (typeof onValuesChange === 'function') {
          onValuesChange(name, next);
        }
        return next;
      });
    }
  };

  const handleAdd = async (comment = null) => {
    setIsLoading(true);
    if (!startTrainingTime) {
      await handleStartTraining(true);
    }
    try {
      const existingExercises = useAppStore.getState().exercises;
      const alreadyInCatalog = existingExercises.some(
        (ex) => (ex?.exercise_name || '').trim().toLowerCase() === name.trim().toLowerCase()
      );
      if (!alreadyInCatalog) {
        const inserted = await addExerciseToCatalog({ exercise_name: name.trim(), muscle: null });
        if (inserted?.[0]) {
          useAppStore.getState().addExerciseToStore(inserted[0]);
        }
      }
      await addExercise(name, values, user, comment);
      setCompletedExercises((prev) => [...prev, name]);
      useTrainingStore.getState().bumpExerciseLogs({ invalidateTodayDayCache: true });
      await fetchExerciseHistory({ force: true });
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
    fetchExerciseHistory({ name: newName });
  };

  useEffect(() => {
    if (values.first && values.second && values.third && values.fourth) {
      setIsReady(true);
    } else if (values.first || values.second || values.third || values.fourth) {
      setIsReady(false);
    }
  }, [values]);

  const exerciseLogsTick = useTrainingStore((state) => state.exerciseLogsTick);
  const prevExerciseLogsTickRef = useRef(null);

  useEffect(() => {
    const tickChanged =
      prevExerciseLogsTickRef.current !== null &&
      prevExerciseLogsTickRef.current !== exerciseLogsTick;
    prevExerciseLogsTickRef.current = exerciseLogsTick;
    fetchExerciseHistory({ force: tickChanged });
  }, [exerciseName, user.id, exerciseLogsTick, fetchExerciseHistory]);

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