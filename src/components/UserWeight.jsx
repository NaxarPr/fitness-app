import React, { useEffect, useState } from 'react';
import { saveWeight } from '../utils/saveWeight';
import WeightHistoryModal from './modal/WeightHistoryModal';
import { getWeightHistory } from '../utils/getWeightHistory';

function UserWeight({ user }) {
  const [editWeight, setEditWeight] = useState(false);
  const [weight, setWeight] = useState(null);
  const [weightHistory, setWeightHistory] = useState([]);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const handleWeightChange = (weight) => {
    setWeight(weight);
    setEditWeight(true)
  }

  const handleSaveWeightClick = async () => {
    await saveWeight(weight, user, selectedDate);
    setEditWeight(false);
    fetchWeightHistory();
  }
  
  const fetchWeightHistory = async () => {
    const history = await getWeightHistory(user);
    setWeightHistory(history);
  }

  useEffect(() => {
    fetchWeightHistory();
  }, [user]);
  
  return (
    <div>
      <div className="flex items-center justify-center gap-2">
        {editWeight ? ( 
          <div className='flex flex-col w-full gap-2'>
            <div className='flex items-center justify-around w-full'>
              <input 
                className='w-16 h-8 px-2 bg-gray-800 border border-gray-700 rounded text-sm focus:outline-none focus:border-blue-500' 
                pattern='[0-9]*'
                type='number'
                value={weight} 
                onChange={(e) => setWeight(e.target.value)} 
              />
              <input
                className='h-8 px-2 bg-gray-800 border border-gray-700 rounded text-sm focus:outline-none focus:border-blue-500'
                type='date'
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div className='flex justify-center gap-2'>
              <button className='bg-blue-500 text-white px-4 py-1 rounded' onClick={handleSaveWeightClick}>Save</button>
              <button className='bg-gray-500 text-white px-4 py-1 rounded' onClick={() => setEditWeight(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <div className='flex items-center justify-center gap-2 h-8'>
            <p className="text-center text-gray-400 select-none" onDoubleClick={() => handleWeightChange(user.weight)}>
              Weight: {user.weight} kg
            </p>
            {weightHistory.length > 0 && (
              <button
                className="text-xs text-gray-400"
                onClick={() => setShowWeightModal(true)}
              >
                📊
              </button>
            )}
          </div>
        )}
      </div>

      <WeightHistoryModal
        isOpen={showWeightModal}
        onClose={() => setShowWeightModal(false)}
        weightHistory={weightHistory}
      />
    </div>
  );
}

export default UserWeight;