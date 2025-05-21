import React from 'react';
import { format, parseISO } from 'date-fns';

function WeightTable({ weightHistory, onToggleChart }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Weight History</h2>
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
                <td className="p-2">
                  {format(parseISO(record.date), 'PP')}
                </td>
                <td className="p-2">{record.weight}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WeightTable; 