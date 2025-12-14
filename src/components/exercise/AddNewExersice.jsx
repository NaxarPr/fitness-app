import React, { useEffect, useState } from "react";
import Select from "../common/Select";
import SystemButton from "../common/SystemButton";
import { getAllUserExercises } from "../../utils/getAllUserExercises";
import { addExerciseToExercises } from "../../utils/addExerciseToExercises";
import MUSCLES from "../../const/muscles";

function AddNewExersice({ user, setExercises }) {
  const [exerciseName, setExerciseName] = useState("");
  const [step, setStep] = useState(1);
  const [muscle, setMuscle] = useState('');
  const [allUserExercises, setAllUserExercises] = useState([]);

  useEffect(() => {
    if (step === 2) {
      const fetchAllUserExercises = async () => {
        const uniqueUserExercises = await getAllUserExercises({ userId: user.id });
        setAllUserExercises(uniqueUserExercises);
      };

      fetchAllUserExercises();
    }
  }, [step, user.id]);

  const handleAddExercise = () => {
    addExerciseToExercises({ exerciseName: exerciseName, user: user, dayNumber: null, muscle: muscle });
    setStep(1);
    setExerciseName("");
    setExercises(prev => [...prev, { name: exerciseName }]);
  }

  switch (step) {
    case 1:
      return (
        <button className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 rotate-45 cursor-pointer" onClick={() => setStep(2)}>❎</button>
      );
    case 2:
      return (
          <div className='flex justify-between items-center gap-2 w-full'>
            <Select
              options={allUserExercises}
              value={exerciseName} 
              onChange={(e) => setExerciseName(e.target.value)} 
              placeholder="Exercise Name"
            />
            <Select
              options={MUSCLES}
              value={muscle}
              onChange={(e) => setMuscle(e.target.value)}
              placeholder="Muscle"
            />
            <SystemButton type="primary" onClick={handleAddExercise} disabled={exerciseName.length === 0}>Add</SystemButton>
            <SystemButton type="secondary" onClick={() => setStep(1)}>Cancel</SystemButton>
          </div>
      );
    default:
      return null;
  }
}

export default AddNewExersice;
