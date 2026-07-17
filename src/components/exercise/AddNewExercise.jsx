import React, { useEffect, useRef, useState } from "react";
import { useTrainingStore } from "../../store/trainingStore";
import ContextMenu from "../common/ContextMenu";
import Select from "../common/Select";
import SystemButton from "../common/SystemButton";
import { useShallow } from "zustand/shallow";
import { PlusCircle, Filter } from "lucide-react";

const MUSCLES = ['Ноги', 'Спина', 'Плечі', 'Груди', 'Трицепс', 'Бицепс', 'Прес', 'Кисть', 'Кардіо'];

function AddNewExercise({ user, setExercises, absButton = true }) {
  const [exerciseName, setExerciseName] = useState("");
  const [step, setStep] = useState(1);
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [muscleMenuOpen, setMuscleMenuOpen] = useState(false);
  const [muscleMenuPosition, setMuscleMenuPosition] = useState({ x: 0, y: 0 });
  const muscleTriggerRef = useRef(null);

  const  allUserExercises  = useTrainingStore(useShallow((state) => state.allUserExercises));

  const handleAddExercise = () => {
    setStep(1);
    setExerciseName("");
    setExercises(prev => [...prev, { name: exerciseName }]);
  }

  const handleOpenMuscleMenu = () => {
    if (!muscleTriggerRef.current) return;
    const rect = muscleTriggerRef.current.getBoundingClientRect();
    setMuscleMenuPosition({ x: rect.left, y: rect.bottom + 4 });
    setMuscleMenuOpen(true);
  };

  const muscleMenuItems = MUSCLES.map((muscle) => ({
    label: muscle,
    onClick: () => {
      setSelectedMuscle((prev) => prev === muscle ? null : muscle);
      setMuscleMenuOpen(false);
    },
  }));

  const exerciseOptions = selectedMuscle
    ? allUserExercises
        .filter((ex) => (ex.muscle || "").trim() === selectedMuscle)
        .map((ex) => ex.name)
        .filter(Boolean)
    : allUserExercises.map((ex) => (typeof ex === "object" ? ex?.name : ex)).filter(Boolean);

  useEffect(() => {
    if (!selectedMuscle || !exerciseName) return;
    const forMuscle = allUserExercises
      .filter((ex) => (ex.muscle || "").trim() === selectedMuscle)
      .map((ex) => ex.name);
    if (forMuscle.length > 0 && !forMuscle.includes(exerciseName)) {
      setExerciseName("");
    }
  }, [selectedMuscle, allUserExercises, exerciseName]);

  switch (step) {
    case 1:
      return (
        <button className={`z-10 cursor-pointer leading-none text-green-500 hover:text-green-400 transition-colors ${absButton ? 'absolute top-2 right-2 sm:top-4 sm:right-4' : ''}`} onClick={() => setStep(2)} aria-label="Add exercise"><PlusCircle size={26} /></button>
      );
    case 2:
      return (
          <div className='flex justify-between items-center gap-2 w-full'>
            <Select
              options={exerciseOptions}
              value={exerciseName}
              onChange={(e) => setExerciseName(e.target.value)}
              placeholder="Exercise Name"
            />
            <button
              ref={muscleTriggerRef}
              type="button"
              onClick={handleOpenMuscleMenu}
              className=" h-8 w-fit px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-sm text-left focus:outline-none focus:border-primary transition-colors"
              aria-label="Choose muscle"
              aria-haspopup="menu"
              aria-expanded={muscleMenuOpen}
            >
              <span className="flex items-center text-gray-200">{selectedMuscle || <Filter size={16} />}</span>
            </button>
            <ContextMenu
              isOpen={muscleMenuOpen}
              position={muscleMenuPosition}
              onClose={()=> setMuscleMenuOpen(false)}
              items={muscleMenuItems}
              ariaLabel="Muscle list"
            />
            <SystemButton type="primary" onClick={handleAddExercise} disabled={exerciseName.length === 0}>Add</SystemButton>
            <SystemButton type="secondary" onClick={() => setStep(1)}>Cancel</SystemButton>
          </div>
      );
    default:
      return null;
  }
}

export default AddNewExercise;
