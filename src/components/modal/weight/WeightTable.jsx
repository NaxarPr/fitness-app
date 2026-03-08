import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { PARAM_FIELDS } from '../../../const/params';

function WeightTable({ weightHistory, onToggleChart }) {
  const [showParams, setShowParams] = useState(false);
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className='flex items-center gap-2'>
          <h2 className="text-xl font-semibold">Weight History</h2>
          <button onClick={() => setShowParams(!showParams)} className={`rotate-[135deg] ${showParams ? 'line-through' : ''}`}>
            ☀️
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onToggleChart}
            className="px-3 py-1 rounded bg-gray-700 text-gray-300 hover:bg-gray-600"
          >
            📈
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left p-2">Date</th>
              <th className="text-left p-2">Weight (kg)</th>
            </tr>
          </thead>
          <tbody>
            {weightHistory.map((record) => (
              <tr key={record.id} className="border-b border-gray-700 hover:bg-gray-700">
                <td className="p-2 gap-2">
                  {format(parseISO(record.date), 'PP')}
                  {showParams && record.params && Object.entries(record.params).map(([key, value]) => (
                    <div key={key} className="text-xs text-gray-400">
                      {PARAM_FIELDS.find((field) => field.key === key)?.label}: {value}
                    </div>
                  ))}
                </td>
                <td className="p-2" style={{ width: '120px' }}>{record.weight}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WeightTable; 