import { useEffect, useMemo, useState } from 'react';
import { useUsers } from '../../../context/UserContext';
import { getTrainingData } from '../../../utils/getTrainingData';

function DayModal({ isOpen, onClose, dayExercises, date }) {
  const { users } = useUsers();
  const [trainingInfo, setTrainingInfo] = useState(null);
  
  const groupedExercises = useMemo(() => {
    if (!Array.isArray(dayExercises)) return {};
    return dayExercises.reduce((acc, ex) => {
      const userId = ex.user_id || 'unknown';
      if (!acc[userId]) acc[userId] = [];
      acc[userId].push(ex);
      return acc;
    }, {});
  }, [dayExercises]);
  
  
  useEffect(() => {
    const fetchTrainingData = async () => {
      if (!isOpen || !date) return;
      const normalizedDate = new Date(date);
      try {
        const formattedDate = normalizedDate.toLocaleDateString('en-CA');
        const trainingData = await getTrainingData(formattedDate);
        if (!trainingData || Array.isArray(trainingData)) {
          setTrainingInfo(null);
          return;
        }
        const duration = getDuration(trainingData.created_at, trainingData.finished_at);
        setTrainingInfo({ ...trainingData, duration });
      } catch (error) {
        console.error('Error loading training data:', error);
      } 
    };

    fetchTrainingData();
  }, [isOpen, date]);

  const formatTime = (value) => {
    if (!value) return '--';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return '--';
    return parsed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getDuration = (start, end) => {
    if (!start || !end) return null;
    const diffMs = Math.abs(new Date(end) - new Date(start));
    if (diffMs === 0) return '0 min';

    const totalMinutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours === 0) return `${minutes} min`;
    if (minutes === 0) return `${hours} h`;
    return `${hours} h ${minutes} min`;
  };
  if (!isOpen) return null;

  const hasTrainingInfo =
    trainingInfo && typeof trainingInfo === 'object' && Object.keys(trainingInfo).length > 0;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-hidden"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-800 rounded-lg p-6 w-[90%] max-w-2xl max-h-[80vh] overflow-y-auto"
      >
        {hasTrainingInfo ? (
          <div className="flex flex-col gap-1 mb-4 rounded-lg bg-gray-700 p-4 text-white">
            <p className="text-sm">Start: {formatTime(trainingInfo.created_at)}</p>
            <p className="text-sm">
              Finish: {trainingInfo.finished_at ? formatTime(trainingInfo.finished_at) : 'In progress'}
            </p>
            <p className="text-sm">
              Duration: {trainingInfo.duration}
            </p>
          </div>
        ) : null}

        {Object.keys(groupedExercises).length === 0 ? (
          <p className="text-gray-400">No exercises found for this day.</p>
        ) : (
          Object.entries(groupedExercises).map(([userId, exercises]) => (
            <div key={userId} className="mb-4">
              <h3 className="text-lg font-medium text-blue-400 mb-2">
                {users?.find((u) => u.id === userId).username}
              </h3>
              <ul className="list-disc list-inside text-white">
                {exercises.reverse().map((ex, i) => (
                  <li key={i}>
                    {ex.exercise}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DayModal;
