import { useState, useEffect, useCallback } from "react";
import { supabase } from "../supabase";

const TRAINING_EXERCISES_KEY = 'trainingExercises';

const isTrainingActive = () => {
  return localStorage.getItem('isTrainingStarted') !== null;
};

const getTrainingData = () => {
  try {
    return JSON.parse(localStorage.getItem(TRAINING_EXERCISES_KEY) || '{}');
  } catch {
    return {};
  }
};

const saveTrainingData = (data) => {
  localStorage.setItem(TRAINING_EXERCISES_KEY, JSON.stringify(data));
};

export function useExercisesList({ index, user }) {
  const [selectedDay, setSelectedDay] = useState(() => {
    const savedDays = JSON.parse(localStorage.getItem('selectedDays') || '{}');
    return savedDays[user.username] || "1";
  });
  const [exercises, setExercises] = useState([]);
  const [items, setItems] = useState([]);
  const [completedExercises, setCompletedExercises] = useState([]);

  const days = Object.keys(user.program);
  const username = user.username;

  // Save user's exercises to localStorage
  const saveUserToLocalStorage = useCallback((exercisesToSave, itemsToSave, day) => {
    if (isTrainingActive()) {
      const allData = getTrainingData();
      allData[username] = {
        exercises: exercisesToSave,
        items: itemsToSave,
        selectedDay: day,
      };
      saveTrainingData(allData);
    }
  }, [username]);

  // Clear user's exercises from localStorage
  const clearUserFromLocalStorage = useCallback(() => {
    const allData = getTrainingData();
    delete allData[username];
    saveTrainingData(allData);
  }, [username]);

  // Load exercises - from localStorage if training is active, otherwise from program
  useEffect(() => {
    const savedDays = JSON.parse(localStorage.getItem('selectedDays') || '{}');
    savedDays[user.username] = selectedDay;
    localStorage.setItem('selectedDays', JSON.stringify(savedDays));

    // Check if training is active and we have saved exercises for this user
    if (isTrainingActive()) {
      const allData = getTrainingData();
      const userData = allData[username];
      if (userData && userData.selectedDay === selectedDay) {
        setExercises(userData.exercises || []);
        setItems(userData.items || []);
        return;
      }
    }

    // Fall back to program exercises
    const programExercises = selectedDay ? user.program[selectedDay] : [];
    setExercises(programExercises);
  }, [selectedDay, user.username, index, user.program, username]);

  // Sync items from exercises when exercises change from program (not during training)
  useEffect(() => {
    // Skip if training is active and we already have saved data
    const allData = getTrainingData();
    const userData = allData[username];
    if (isTrainingActive() && userData) {
      return;
    }
    setItems(exercises.map((exercise, idx) => ({ id: idx, name: exercise.name })));
  }, [exercises, username]);

  // Handle reordering items (drag and drop)
  const handleSetItems = useCallback((newItemsOrUpdater) => {
    setItems((prevItems) => {
      const newItems = typeof newItemsOrUpdater === 'function' 
        ? newItemsOrUpdater(prevItems) 
        : newItemsOrUpdater;
      
      // Also update exercises to match the new order
      const newExercises = newItems.map(item => ({ name: item.name }));
      setExercises(newExercises);
      
      // Save to localStorage if training is active
      saveUserToLocalStorage(newExercises, newItems, selectedDay);
      
      return newItems;
    });
  }, [saveUserToLocalStorage, selectedDay]);

  // Handle adding/modifying exercises
  const handleSetExercises = useCallback((newExercisesOrUpdater) => {
    setExercises((prevExercises) => {
      const newExercises = typeof newExercisesOrUpdater === 'function'
        ? newExercisesOrUpdater(prevExercises)
        : newExercisesOrUpdater;
      
      // Update items to match
      const newItems = newExercises.map((exercise, idx) => ({ id: idx, name: exercise.name }));
      setItems(newItems);
      
      // Save to localStorage if training is active
      saveUserToLocalStorage(newExercises, newItems, selectedDay);
      
      return newExercises;
    });
  }, [saveUserToLocalStorage, selectedDay]);

  // Handle deleting an exercise
  const handleDeleteExercise = useCallback((exerciseName) => {
    setItems(prev => {
      const newItems = prev.filter(item => item.name !== exerciseName);
      setExercises(prevEx => {
        const newExercises = prevEx.filter(exercise => exercise.name !== exerciseName);
        
        // Save to localStorage if training is active
        saveUserToLocalStorage(newExercises, newItems, selectedDay);
        
        return newExercises;
      });
      return newItems;
    });
  }, [saveUserToLocalStorage, selectedDay]);

  useEffect(() => {
    const fetchCompletedExercises = async () => {
      const today = new Date().toISOString().split("T")[0];

      const { data } = await supabase
        .from("exercise_logs")
        .select("exercise")
        .eq("user_id", user.id)
        .gte("date", today)
        .lt(
          "date",
          new Date(
            new Date(today).getTime() + 24 * 60 * 60 * 1000
          ).toISOString()
        );

      if (data) {
        setCompletedExercises(data.map((item) => item.exercise));
      }
    };

    fetchCompletedExercises();
  }, [user.id]);

  return {
    selectedDay,
    setSelectedDay,
    exercises,
    setExercises: handleSetExercises,
    items,
    setItems: handleSetItems,
    completedExercises,
    setCompletedExercises,
    days,
    handleDeleteExercise,
    clearUserFromLocalStorage,
  };
}
