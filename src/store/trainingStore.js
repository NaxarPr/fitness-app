import { create } from 'zustand';
import { getAllUserExercises } from '../utils/getAllUserExercises';

export const useTrainingStore = create((set) => ({
  startTrainingTime: null,
  setStartTrainingTime: (startTrainingTime) => {
    set({ startTrainingTime });
  },

  trainingInfoByDate: {},
  setTrainingInfoForDate: (dateKey, info) => {
    set((state) => ({
      trainingInfoByDate: {
        ...state.trainingInfoByDate,
        [dateKey]: info,
      },
    }));
  },
  clearTrainingInfoForDate: (dateKey) => {
    set((state) => {
      const next = { ...state.trainingInfoByDate };
      delete next[dateKey];
      return { trainingInfoByDate: next };
    });
  },

  dayExercisesByDate: {},
  setDayExercisesForDate: (dateKey, exercises) => {
    set((state) => ({
      dayExercisesByDate: {
        ...state.dayExercisesByDate,
        [dateKey]: exercises,
      },
    }));
  },

  trainingDates: [],
  setTrainingDates: (dates) => {
    set({ trainingDates: dates });
  },

  exerciseHistoryByKey: {},
  setExerciseHistoryForExercise: (userId, exerciseName, exercises) => {
    const key = `${userId}::${exerciseName}`;
    set((state) => ({
      exerciseHistoryByKey: {
        ...state.exerciseHistoryByKey,
        [key]: exercises,
      },
    }));
  },

  allUserExercises: [],
  setAllUserExercises: (exercises) => {
    set({ allUserExercises: exercises });
  },

  fetchAllUserExercises: async () => {
    const exercises = await getAllUserExercises();
    set({ allUserExercises: exercises });
  },

  exerciseLogsTick: 0,
  bumpExerciseLogs: (opts = {}) =>
    set((state) => {
      const next = { exerciseLogsTick: state.exerciseLogsTick + 1 };
      if (opts.invalidateTodayDayCache) {
        const dateKey = new Date().toLocaleDateString('en-CA');
        const dayNext = { ...state.dayExercisesByDate };
        delete dayNext[dateKey];
        next.dayExercisesByDate = dayNext;
      }
      return next;
    }),
}));
