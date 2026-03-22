import { create } from 'zustand';

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
}));
