import React, { useState, useEffect } from 'react';
import WeightTable from './WeightTable';
import WeightChart from './WeightChart';

const WeightModal = ({ isOpen, onClose, weightHistory }) => {
  const [view, setView] = useState("chart");

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
    <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div onClick={e => e.stopPropagation()} className="bg-main p-6 rounded-lg shadow-xl w-[90%] max-w-4xl relative max-h-[80vh] overflow-y-auto" >
        {view === "table" ? (
          <WeightTable
            weightHistory={weightHistory}
            onToggleChart={handleToggleView}
          />
        ) : (
          <WeightChart
            weightHistory={weightHistory}
            onToggleTable={handleToggleView}
          />
        )}
      </div>
    </div>
  );
};

export default WeightModal; 