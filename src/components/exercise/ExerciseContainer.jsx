import React from "react";
import Exercise from "./Exercise";
import ExerciseContainerHeader from "./ExerciseContainerHeader";
import AddNewExersice from "./AddNewExersice";
import { SortableList } from "./sortable/SortableList.tsx";
import { useExercisesList } from "../../hooks/useExercisesList";

export default function ExerciseContainer({ index, user }) {
  const {
    selectedDay,
    setSelectedDay,
    exercises,
    setExercises,
    items,
    setItems,
    completedExercises,
    setCompletedExercises,
    days,
  } = useExercisesList({ index, user });
  
  return (
    <div className="container mx-auto py-4">
      <ExerciseContainerHeader
        selectedDay={selectedDay}
        onDaySelect={setSelectedDay}
        days={days}
        lastDay={user.last_day}
      />
      {exercises.length > 0 && <div className="relative flex flex-col justify-center items-center p-4 m-4 sm:m-8 border border-gray-700 rounded-lg">
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
                setExercises={setExercises}
              />
            </SortableList.Item>
          )}
        />
      </div>}
    </div>
  );
}
