import React, { useMemo } from 'react';
import AddNewExersice from '../exercise/AddNewExersice';
import SwipeToAction from '../common/SwipeToAction';
import { SortableList } from '../exercise/sortable/SortableList.tsx';

const normalizeExercise = (ex) => (typeof ex === 'string' ? { name: ex } : ex);

export const EditDayProgram = ({ user, dayNumber, setDayNumber, exercises, setExercises, handleSaveClick }) => {
  const items = useMemo(
    () =>
      exercises.map((ex, index) => {
        const normalized = normalizeExercise(ex);
        return { ...normalized, id: normalized.id ?? `edit-${index}-${normalized.name}` };
      }),
    [exercises]
  );

  const handleReorder = (newItems) => {
    setExercises(newItems.map(({ id, ...rest }) => rest));
  };

  const handleRemove = (item) => {
    setExercises((prev) => prev.filter((ex) => (typeof ex === 'string' ? ex : ex.name) !== item.name));
  };

  return (
    <div className="relative flex flex-col gap-4 min-w-[300px]">
      <input
        type="number"
        placeholder="Enter day number"
        className="bg-gray-800 rounded-md px-2 py-1 max-w-[50px]"
        value={dayNumber}
        onChange={(e) => setDayNumber(e.target.value)}
      />
      {exercises.length > 0 && (
        <div>
          <SortableList
            items={items}
            onChange={handleReorder}
            renderItem={(item, active) => {
              const position = items.findIndex((i) => i.id === item.id) + 1;
              return (
                <div className="border border-gray-700 rounded-lg px-2">                
                  <SortableList.Item id={item.id}>
                    <SortableList.DragHandle />
                    <SwipeToAction onAction={() => handleRemove(item)} block={false}>
                      <span className={`flex flex-1 items-center px-2 py-1 rounded-lg ${active ? 'opacity-90' : ''}`}>
                        {position}. {item.name}
                      </span>
                    </SwipeToAction>
                  </SortableList.Item>
                </div>
              );
            }}
          />
        </div>
      )}
      <AddNewExersice user={user} setExercises={setExercises} absButton={false} />
      <button
        className="bg-gray-800 rounded-md hover:text-gray-300 hover:bg-gray-700 px-2 py-1"
        onClick={() => handleSaveClick(user)}
      >
        Save
      </button>
    </div>
  );
}
