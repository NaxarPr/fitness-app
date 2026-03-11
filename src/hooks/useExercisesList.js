import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "../supabase";

const USER_EXERCISES_BY_DAY_KEY = 'userExercisesByDay';

const getPersistentExercisesData = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_EXERCISES_BY_DAY_KEY) || '{}');
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[useExercisesList] Failed to parse persistent exercises:', e);
    }
    return {};
  }
};

const savePersistentExercisesData = (data) => {
  localStorage.setItem(USER_EXERCISES_BY_DAY_KEY, JSON.stringify(data));
};

const getPersistentExercisesForUserAndDay = (username, day) => {
  const all = getPersistentExercisesData();
  const userData = all[username];
  return userData?.[day] ?? null;
};

export function useExercisesList({ user }) {
  const [selectedDay, setSelectedDay] = useState(() => {
    const savedDays = JSON.parse(localStorage.getItem('selectedDays') || '{}');
    return savedDays[user.username] || "1";
  });
  const [items, setItems] = useState([]);
  const [completedExercises, setCompletedExercises] = useState([]);

  const days = Object.keys(user.program);
  const username = user.username;

  const exercises = useMemo(
    () => items.map((i) => ({ name: i.name })),
    [items]
  );

  // Save only items (with optional values per exercise) per user per day
  const saveUserToLocalStorage = useCallback((itemsToSave, day) => {
    const persistent = getPersistentExercisesData();
    if (!persistent[username]) persistent[username] = {};
    persistent[username][day] = { items: itemsToSave };
    savePersistentExercisesData(persistent);
  }, [username]);

  // Load items: persistent per user/day first, then program
  useEffect(() => {
    const savedDays = JSON.parse(localStorage.getItem('selectedDays') || '{}');
    savedDays[user.username] = selectedDay;
    localStorage.setItem('selectedDays', JSON.stringify(savedDays));

    const persistent = getPersistentExercisesForUserAndDay(username, selectedDay);
    if (persistent?.items?.length > 0) {
      setItems(persistent.items);
      return;
    }

    const programExercises = selectedDay ? user.program[selectedDay] : [];
    setItems(programExercises.map((ex, idx) => ({ id: idx, name: ex.name })));
  }, [selectedDay, user.username, user.program, username]);

  // Update a single exercise's repeat/sets input values and persist
  const handleExerciseValuesChange = useCallback((exerciseName, values) => {
    setItems((prev) => {
      const next = prev.map((item) =>
        item.name === exerciseName ? { ...item, values } : item
      );
      saveUserToLocalStorage(next, selectedDay);
      return next;
    });
  }, [saveUserToLocalStorage, selectedDay]);

  // Handle reordering items (drag and drop)
  const handleSetItems = useCallback((newItemsOrUpdater) => {
    setItems((prevItems) => {
      const newItems = typeof newItemsOrUpdater === 'function'
        ? newItemsOrUpdater(prevItems)
        : newItemsOrUpdater;
      saveUserToLocalStorage(newItems, selectedDay);
      return newItems;
    });
  }, [saveUserToLocalStorage, selectedDay]);

  // Handle adding/modifying exercises (preserve existing item values)
  const handleSetExercises = useCallback((newExercisesOrUpdater) => {
    setItems((prevItems) => {
      const newExercises = typeof newExercisesOrUpdater === 'function'
        ? newExercisesOrUpdater(prevItems.map((i) => ({ name: i.name })))
        : newExercisesOrUpdater;
      const newItems = newExercises.map((exercise, idx) => {
        const existing = prevItems.find((i) => i.name === exercise.name);
        return {
          id: idx,
          name: exercise.name,
          ...(existing?.values && { values: existing.values }),
        };
      });
      saveUserToLocalStorage(newItems, selectedDay);
      return newItems;
    });
  }, [saveUserToLocalStorage, selectedDay]);

  // Handle deleting an exercise
  const handleDeleteExercise = useCallback((exerciseName) => {
    setItems((prev) => {
      const newItems = prev.filter((item) => item.name !== exerciseName);
      saveUserToLocalStorage(newItems, selectedDay);
      return newItems;
    });
  }, [saveUserToLocalStorage, selectedDay]);

  useEffect(() => {
    const fetchCompletedExercises = async () => {
      const today = new Date().toISOString().split("T")[0];
      try {        
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
      } catch (error) {
        console.error("Error fetching completed exercises:", error);
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
    handleExerciseValuesChange,
  };
}
