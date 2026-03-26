import { useEffect, useMemo, useState } from 'react';
import { useAppStore } from '../../../store/appStore';
import { useTrainingStore } from '../../../store/trainingStore';
import { getTrainingData } from '../../../utils/getTrainingData';
import { deleteTrainingTime } from '../../../utils/deleteTrainingTime';
import { useShallow } from 'zustand/shallow';
import SwipeToAction from '../../common/SwipeToAction';
import DayModalExerciseItem from './DayModalExerciseItem';

function DayModal({ isOpen, onClose, date }) {
  const users = useAppStore(useShallow((state) => state.users));
  const {
    dayExercisesByDate,
    trainingInfoByDate,
    setTrainingInfoForDate,
    clearTrainingInfoForDate,
  } = useTrainingStore(
    useShallow((state) => ({
      dayExercisesByDate: state.dayExercisesByDate,
      trainingInfoByDate: state.trainingInfoByDate,
      setTrainingInfoForDate: state.setTrainingInfoForDate,
      clearTrainingInfoForDate: state.clearTrainingInfoForDate,
    }))
  );
  const dateKey = date ? new Date(date).toLocaleDateString('en-CA') : null;
  const cachedTrainingInfo = dateKey ? trainingInfoByDate[dateKey] : undefined;
  const [trainingInfo, setTrainingInfo] = useState(cachedTrainingInfo ?? null);

  const [exclusiveEditId, setExclusiveEditId] = useState(null);

  const groupedExercises = useMemo(() => {
    const dayExercises = dateKey ? dayExercisesByDate[dateKey] ?? [] : [];
    if (!Array.isArray(dayExercises)) return {};
    const sortedExercises = [...dayExercises].sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateA - dateB;
    });

    return sortedExercises.reduce((acc, ex) => {
      const userId = ex.user_id || 'unknown';
      if (!acc[userId]) acc[userId] = [];
      acc[userId].unshift(ex);
      return acc;
    }, {});
  }, [dateKey, dayExercisesByDate]);
  useEffect(() => {
    if (!isOpen) {
      setExclusiveEditId(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchTrainingData = async () => {
      if (!isOpen || !dateKey) return;

      if (cachedTrainingInfo !== undefined) {
        setTrainingInfo(cachedTrainingInfo ?? null);
        return;
      }

      setTrainingInfo(null);
      try {
        const trainingData = await getTrainingData(dateKey);
        if (!trainingData || Array.isArray(trainingData)) {
          setTrainingInfoForDate(dateKey, null);
          return;
        }
        const duration = getDuration(trainingData.created_at, trainingData.finished_at);
        const info = { ...trainingData, duration };
        setTrainingInfo(info);
        setTrainingInfoForDate(dateKey, info);
      } catch (error) {
        console.error('Error loading training data:', error);
      }
    };

    fetchTrainingData();
  }, [isOpen, dateKey, cachedTrainingInfo, setTrainingInfoForDate]);

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

  const handleDeleteTraining = async () => {
    if (!trainingInfo?.id) return;
    try {
      const { success } = await deleteTrainingTime(trainingInfo.id);
      if (success) {
        setTrainingInfo(null);
        if (dateKey) clearTrainingInfoForDate(dateKey);
        onClose();
      }
    } catch (error) {
      console.error('Error deleting training time:', error);
    }
  };

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
          <SwipeToAction
            onAction={handleDeleteTraining}
            confirmTitle="Delete this training?"
            confirmMessage="This will remove the training record for this day. This action cannot be undone."
          >
            <p className='text-white text-sm text-center pt-2'>{date.toLocaleDateString()}</p>
            <div className="flex justify-between gap-1 w-full px-4 py-2 text-white text-sm">
              <p className='text-green-500'>Start: {formatTime(trainingInfo.created_at)}</p>
              <p>
                Duration: {trainingInfo.duration}
              </p>
              <p className='text-red-500'>
                Finish: {trainingInfo.finished_at ? formatTime(trainingInfo.finished_at) : 'In progress'}
              </p>
            </div>
          </SwipeToAction>
        ) : null}

        {Object.keys(groupedExercises).length === 0 ? (
          <p className="text-gray-400">No exercises found for this day.</p>
        ) : (
          Object.entries(groupedExercises).map(([userId, exercises]) => (
            <div key={userId} className="my-4">
              <h3 className="text-lg font-medium text-blue-400 mb-2">
                {users?.find((u) => u.id === userId)?.username ?? userId}
              </h3>
              <ul className="flex flex-col gap-1 text-white">
                {[...exercises].reverse().map((ex) => (
                  <DayModalExerciseItem
                    key={ex.id}
                    ex={ex}
                    dateKey={dateKey}
                    exclusiveEditId={exclusiveEditId}
                    onBeginEdit={setExclusiveEditId}
                    onEndEdit={() => setExclusiveEditId(null)}
                    isModalOpen={isOpen}
                  />
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
