import { useMemo } from 'react';
import { useUsers } from '../../../context/UserContext';

function DayModal({ isOpen, onClose, dayExercises }) {
  const { users } = useUsers();

  const groupedExercises = useMemo(() => {
    if (!Array.isArray(dayExercises)) return {};
    return dayExercises.reduce((acc, ex) => {
      const userId = ex.user_id || 'unknown';
      if (!acc[userId]) acc[userId] = [];
      acc[userId].push(ex);
      return acc;
    }, {});
  }, [dayExercises]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-hidden"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-800 rounded-lg p-6 w-[90%] max-w-2xl max-h-[80vh] overflow-y-auto"
      >
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
