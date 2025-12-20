import React, { useState, useEffect } from "react";
import Exercise from "./Exercise";
import ExerciseContainerHeader from "./ExerciseContainerHeader";
import { supabase } from "../../supabase";
import AddNewExersice from "./AddNewExersice";
import { SortableList } from "./sortable/SortableList.tsx";

export default function ExerciseContainer({ index, user }) {
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
    
  }, [selectedDay, user.username, index]);

  useEffect(() => {
    setItems(exercises.map((exercise, index) => ({ id: index, name: exercise.name })));
  }, [exercises]);

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
      {exercises.length > 0 && <div className="relative flex flex-col justify-center items-center p-4 gap-4 m-4 sm:m-8 border border-gray-700 rounded-lg">
        <AddNewExersice user={user} setExercises={setExercises}/>
        <SortableList
          items={items}
          onChange={setItems}
          renderItem={(item, active) => (
            <SortableList.Item id={item.id}>
              <SortableList.DragHandle />
              <Exercise
                name={item.name}
                user={user}
                isCompleted={completedExercises.includes(item.name)}
                setCompletedExercises={setCompletedExercises}
                active={active}
              />
            </SortableList.Item>
          )}
        />
      </div>}
    </div>
  );
}
