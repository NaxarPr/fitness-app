import React, { useState, useEffect } from "react";
import Exercise from "./Exercise";
import ExerciseContainerHeader from "./ExerciseContainerHeader";
import EXERCISES from "../../const/exercises";
import { supabase } from "../../supabase";
import AddNewExersice from "./AddNewExersice";

export default function ExerciseContainer({ index, user }) {
  const [selectedDay, setSelectedDay] = useState(() => {
    const savedDays = JSON.parse(localStorage.getItem('selectedDays') || '{}');
    return savedDays[user.username] || "1";
  });
  const [exercises, setExercises] = useState([]);
  const [completedExercises, setCompletedExercises] = useState([]);

  const days = Object.keys(EXERCISES[index]);

  useEffect(() => {
    const savedDays = JSON.parse(localStorage.getItem('selectedDays') || '{}');
    savedDays[user.username] = selectedDay;
    localStorage.setItem('selectedDays', JSON.stringify(savedDays));
    setExercises(selectedDay ? EXERCISES[index][selectedDay] : []);
  }, [selectedDay, user.username]);

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

  return (
    <div className="container mx-auto py-4">
      <ExerciseContainerHeader
        selectedDay={selectedDay}
        onDaySelect={setSelectedDay}
        days={days}
        lastDay={user.last_day}
      />
      <div className="relative flex flex-col justify-center items-center p-4 gap-4 m-4 sm:m-8 border border-gray-700 rounded-lg">
        <AddNewExersice user={user} setExercises={setExercises}/>
        {exercises.map((exercise, index) => (
          <div key={index} className="w-full">
            <Exercise
              name={exercise.name}
              user={user}
              isCompleted={completedExercises.includes(exercise.name)}
              setCompletedExercises={setCompletedExercises}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
