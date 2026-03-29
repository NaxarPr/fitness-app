import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/shallow';
import { useTrainingStore } from '../../../store/trainingStore';
import { updateExerciseLog } from '../../../utils/updateExerciseLog';
import { deleteExerciseLogById } from '../../../utils/deleteExerciseLogById';
import { EXERCISE_LOG_DRAFT, INITIAL_VALUES } from '../../../const/exercises';
import SystemButton from '../../common/SystemButton';
import SwipeToAction from '../../common/SwipeToAction';
import Select from '../../common/Select';
import Input from '../../common/Input';

const formatRepeat = (value) => {
  if (value === null || value === undefined || value === '') return '–';
  return value;
};

const isFilled = (value) => {
  if (value === null || value === undefined) return false;
  return String(value).trim().length > 0;
};

const isExerciseDraftComplete = (draft) => {
  if (!isFilled(draft.exercise)) return false;
  return INITIAL_VALUES.every(({ key }) => isFilled(draft[key]));
};

const getTodayDateKey = () => new Date().toLocaleDateString('en-CA');

const DayModalExerciseItem = ({
  ex,
  dateKey,
  exclusiveEditId,
  onBeginEdit,
  onEndEdit,
  isModalOpen,
}) => {
  const { dayExercisesByDate, setDayExercisesForDate, allUserExercises } = useTrainingStore(
    useShallow((state) => ({
      dayExercisesByDate: state.dayExercisesByDate,
      setDayExercisesForDate: state.setDayExercisesForDate,
      allUserExercises: state.allUserExercises,
    }))
  );

  const [draft, setDraft] = useState(() => ({ ...EXERCISE_LOG_DRAFT }));
  const [isSaving, setIsSaving] = useState(false);

  const isEditing = exclusiveEditId === ex.id;
  const isTodayTraining = Boolean(dateKey && dateKey === getTodayDateKey());

  useEffect(() => {
    if (!isModalOpen) {
      setIsSaving(false);
    }
  }, [isModalOpen]);

  const handleContextMenu = (e) => {
    e.preventDefault();
    if (isTodayTraining || isEditing) return;
    setDraft({
      ...EXERCISE_LOG_DRAFT,
      exercise: ex.exercise ?? '',
      ...Object.fromEntries(INITIAL_VALUES.map(({ key }) => [key, ex[key] ?? ''])),
      comment: ex.comment ?? '',
    });
    onBeginEdit(ex.id);
  };

  const handleCancelEdit = () => {
    onEndEdit();
  };

  const handleSaveEdit = async () => {
    if (!dateKey) return;
    if (!isExerciseDraftComplete(draft)) return;
    setIsSaving(true);
    try {
      const { success, data } = await updateExerciseLog(ex.id, draft);
      if (!success || !data) return;
      const list = dayExercisesByDate[dateKey] ?? [];
      const next = list.map((row) => (row.id === ex.id ? { ...row, ...data } : row));
      setDayExercisesForDate(dateKey, next);
      useTrainingStore.getState().bumpExerciseLogs();
      onEndEdit();
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!dateKey) return;
    setIsSaving(true);
    try {
      const { success } = await deleteExerciseLogById(ex.id);
      if (!success) return;
      const list = dayExercisesByDate[dateKey] ?? [];
      setDayExercisesForDate(
        dateKey,
        list.filter((row) => row.id !== ex.id)
      );
      useTrainingStore.getState().bumpExerciseLogs();
      onEndEdit();
    } finally {
      setIsSaving(false);
    }
  };

  if (isEditing) {
    return (
      <li className="list-none rounded-lg bg-gray-900/80 p-2  text-white">
        <div className="flex flex-col gap-2">
          <Select
            options={allUserExercises.map((ex) => ex.name)}
            value={draft.exercise}
            onChange={(e) => setDraft((prev) => ({ ...prev, exercise: e.target.value }))}
            placeholder="Exercise Name"
          />
          <div className="flex justify-between gap-2">
            {INITIAL_VALUES.map(({ key }) => (
              <Input
                key={key}
                type="number"
                pattern="[0-9]*"
                value={draft[key]}
                onChange={(e) => setDraft((prev) => ({ ...prev, [key]: e.target.value }))}
                aria-label={`${key} repeat`}
              />
            ))}
          </div>
          <Input
            value={draft.comment}
            onChange={(e) => setDraft((prev) => ({ ...prev, comment: e.target.value }))}
            aria-label="Comment"
          />
          <div className="flex gap-2">
            <SystemButton
              onClick={handleSaveEdit}
              disabled={isSaving || !isExerciseDraftComplete(draft)}
              className="w-full"
            >
              {isSaving ? 'Saving…' : 'Save'}
            </SystemButton>
            <SystemButton
              onClick={handleCancelEdit}
              disabled={isSaving}
              className="w-full bg-gray-600"
            >
              Cancel
            </SystemButton>
          </div>
        </div>
      </li>
    );
  }

  return (
    <SwipeToAction
      onAction={handleConfirmDelete}
      confirmTitle="Delete this exercise?"
      confirmMessage="This removes this logged set from your history. You cannot undo this action."
    >
      <li
        className="list-none select-none rounded-lg bg-gray-700/60 px-3 py-2 text-white cursor-default touch-manipulation"
        onContextMenu={handleContextMenu}
        tabIndex={0}
        role="button"
        aria-label={`${ex.exercise || 'Exercise'}. Right-click to edit, or press Enter.`}
      >
        <span>{ex.exercise}</span>
        <span className="mt-1 block text-gray-300">
          {INITIAL_VALUES.map(({ key }) => formatRepeat(ex[key])).join(' / ')}
        </span>
        {ex.comment && <p className="mt-1 block text-sm text-gray-300">{ex.comment}</p>}
      </li>
    </SwipeToAction>
  );
};

export default DayModalExerciseItem;
