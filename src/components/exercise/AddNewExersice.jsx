import React, { useState } from "react";
import Exercise from "./Exercise";
import Input from "../common/Input";
import SystemButton from "../common/SystemButton";

function AddNewExersice({ user }) {
  const [exerciseName, setExerciseName] = useState("");
  const [step, setStep] = useState(1);

  switch (step) {
    case 1:
      return (
        <button className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 rotate-45 cursor-pointer" onClick={() => setStep(2)}>❎</button>
      );
    case 2:
      return (
          <div className='flex justify-between items-center gap-2 w-full'>
            <Input
              type="text" 
              value={exerciseName} 
              onChange={(e) => setExerciseName(e.target.value)} 
              placeholder="Exercise Name"
            />
            <SystemButton type="primary" onClick={() => setStep(3)} disabled={exerciseName.length === 0}>Add</SystemButton>
            <SystemButton type="secondary" onClick={() => setStep(1)}>Cancel</SystemButton>
          </div>
      );
    case 3:
      return (
        <Exercise name={exerciseName} user={user} isCompleted={false}/>
      );
  }
}

export default AddNewExersice;
