import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../supabase';
import { addExercise } from '../../utils/addExercise';
import { getExercisesByName } from '../../utils/getExercisesByName';
import ExerciseHistoryModal from '../modal/ExerciseHistoryModal';
import EXERCISES from '../../const/exercises';

const INITIAL_VALUES = [
  { key: 'first', placeholder: '1st' },
  { key: 'second', placeholder: '2nd' },
  { key: 'third', placeholder: '3rd' },
  { key: 'fourth', placeholder: '4th' }
];

function Exercise({ name, user, isCompleted }) {
  const [isReady, setIsReady] = useState(false);
  const [exerciseName, setExerciseName] = useState(name);
  const [oldValues, setOldValues] = useState(INITIAL_VALUES);
  const [exerciseHistory, setExerciseHistory] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [alternatives, setAlternatives] = useState([]);
  const [values, setValues] = useState({
    first: '',
    second: '',
    third: '',
    fourth: ''
  });

  const findAlternatives = useCallback((exerciseName) => {
    let foundAlternatives = [];
    
    for (const program of EXERCISES) {
      for (const day in program) {
        const exercises = program[day];
        const exercise = exercises.find(ex => ex.name === exerciseName);
        
        if (exercise && exercise.alternatives) {
          foundAlternatives = exercise.alternatives;
          break;
        }
      }
      if (foundAlternatives.length > 0) break;
    }
    
    return foundAlternatives;
  }, []);

  useEffect(() => {
    setExerciseName(name);
    const foundAlternatives = findAlternatives(name);
    setAlternatives(foundAlternatives);
  }, [name, findAlternatives]);

  const handleChange = (field, value) => {
    if (/^\d{0,2}$/.test(value)) {
      setValues(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleAdd = async () => {
    await addExercise(name, values, user);
    setIsReady(false);
    fetchExerciseHistory();
  };

  const switchExercise = (newName) => {
    setExerciseName(newName);
    setShowAlternatives(false);
    fetchExerciseHistory();
  };

  useEffect(() => {
    if (values.first && values.second && values.third && values.fourth) {
      setIsReady(true);
    } else if (values.first || values.second || values.third || values.fourth) {
      setIsReady(false);
    }
  }, [values]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data: exerciseData } = await supabase
        .from('exercise_logs')
        .select('*')
        .eq('exercise', exerciseName) 
        .eq('user_id', user.id);
        
      if (exerciseData && exerciseData.length > 0) {
        const lastExercise = exerciseData[exerciseData.length - 1];
        setOldValues([
          { key: 'first', placeholder: lastExercise.first },
          { key: 'second', placeholder: lastExercise.second },
          { key: 'third', placeholder: lastExercise.third },
          { key: 'fourth', placeholder: lastExercise.fourth }
        ]);
      } else {
        setOldValues(INITIAL_VALUES);
      }
    };

    fetchUsers();
    fetchExerciseHistory();
  }, [exerciseName, user.id]);

  const fetchExerciseHistory = async () => {
    const exercises = await getExercisesByName(exerciseName, user);
    setExerciseHistory(exercises);
  };
  
  return (
    <div className="flex flex-col gap-2 w-full select-none">
      <div className='flex justify-between items-center gap-2'>
          <div className='flex justify-center items-center gap-2'>
            {isCompleted && <span>✅</span>}
            <p className="font-medium text-sm sm:text-base" onDoubleClick={() => setShowAlternatives(!showAlternatives)}>{exerciseName}</p>
            {exerciseHistory.length > 0 && (
                <button
                  className="text-xs text-gray-400"
                  onClick={() => setShowHistoryModal(true)}
                >
                  📊
                </button>
            )}

          </div>
        <button className='bg-blue-500 text-white px-3 py-1 rounded' disabled={!isReady} style={{ opacity: isReady ? 1 : 0 }} onClick={handleAdd}>Add</button>
      </div>
      
      {showAlternatives && alternatives.length > 0 && (
        <div className="bg-gray-800 rounded p-2 mt-1">
            {alternatives.map((alt, index) => (
              <button
                key={index}
                className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
                onClick={() => switchExercise(alt)}
              >
                {alt}
              </button>
            ))}
            {exerciseName !== name && (
              <button
                className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
                onClick={() => switchExercise(name)}
              >
                {name}
              </button>
            )}
        </div>
      )}
      
      <div className="flex max-w-96 space-x-2 h-8">
        {oldValues.map((field) => (
          <input
            key={field.key}
            placeholder={field.placeholder}
            pattern='[0-9]*'
            type='number'
            className="w-16 h-8 px-2 bg-gray-800 border border-gray-700 rounded text-sm focus:outline-none focus:border-blue-500"
            value={values[field.key]}
            onChange={(e) => handleChange(field.key, e.target.value)}
          />
        ))}
      </div>
      
      <ExerciseHistoryModal 
        isOpen={showHistoryModal} 
        onClose={() => setShowHistoryModal(false)} 
        exerciseHistory={exerciseHistory}
        exerciseName={exerciseName}
      />
    </div>
  );
}

export default Exercise;