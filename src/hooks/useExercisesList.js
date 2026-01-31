import { useState, useEffect, useCallback } from "react";
import { supabase } from "../supabase";

export function useExercisesList({ index, user }) {
  const [selectedDay, setSelectedDay] = useState(() => {
    const savedDays = JSON.parse(localStorage.getItem('selectedDays') || '{}');
    return savedDays[user.username] || "1";
  });
  const [exercises, setExercises] = useState([]);
  const [items, setItems] = useState([]);
  const [completedExercises, setCompletedExercises] = useState([]);

  const days = Object.keys(user.program);

  useEffect(() => {
    const savedDays = JSON.parse(localStorage.getItem('selectedDays') || '{}');
    savedDays[user.username] = selectedDay;
    localStorage.setItem('selectedDays', JSON.stringify(savedDays));
    const exercises = selectedDay ? user.program[selectedDay] : [];
    setExercises(exercises);
  }, [selectedDay, user.username, index, user.program]);

  useEffect(() => {
    setItems(exercises.map((exercise, index) => ({ id: index, name: exercise.name })));
  }, [exercises]);

  const handleDeleteExercise = useCallback((exerciseName) => {
    setItems(prev => prev.filter(item => item.name !== exerciseName));
    setExercises(prev => prev.filter(exercise => exercise.name !== exerciseName));
  }, []);

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
    setExercises,
    items,
    setItems,
    completedExercises,
    setCompletedExercises,
    days,
    handleDeleteExercise,
  };
} 