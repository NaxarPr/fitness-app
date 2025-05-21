import React, { useState, useEffect } from "react";
import ExerciseTable from "./ExerciseTable";
import ExerciseChart from "./ExerciseChart";

function ExerciseModal({
  isOpen,
  onClose,
  exerciseHistory,
  exerciseName,
  user,
  onDelete,
}) {
  const [view, setView] = useState("table");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleView = () => {
    setView((prev) => (prev === "table" ? "chart" : "table"));
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-hidden"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-800 rounded-lg p-6 w-[90%] max-w-2xl max-h-[80vh]"
      >
        {view === "table" ? (
          <ExerciseTable
            exerciseHistory={exerciseHistory}
            exerciseName={exerciseName}
            user={user}
            onDelete={onDelete}
            onToggleChart={handleToggleView}
          />
        ) : (
          <ExerciseChart
            exerciseHistory={exerciseHistory}
            exerciseName={exerciseName}
            onToggleTable={handleToggleView}
          />
        )}
      </div>
    </div>
  );
}

export default ExerciseModal;
