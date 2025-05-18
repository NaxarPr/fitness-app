import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { format, parseISO } from 'date-fns';

const WeightHistoryModal = ({ isOpen, onClose, weightHistory }) => {
  if (!isOpen) return null;
  
  const chartData = weightHistory.map(record => ({
    date: record.date,
    formattedDate: format(parseISO(record.date), 'MMM dd'),
    weight: Number(record.weight) || 0,
  })).reverse();
  
  return (
    <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div onClick={e => e.stopPropagation()} className="bg-gray-900 p-6 rounded-lg shadow-xl w-11/12 max-w-4xl relative" >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Weight History</h2>
        </div>
        
        <div className="h-80 w-full select-none">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis 
                dataKey="formattedDate" 
                stroke="#aaa"
                angle={-45}
                textAnchor="end"
                height={70}
              />
              <YAxis 
                stroke="#aaa" 
                domain={['dataMin - 1', 'dataMax + 1']}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#333', border: 'none' }}
                labelStyle={{ color: '#fff' }}
                formatter={(value, name) => [`${value} kg`, '']}
                labelFormatter={(date) => format(parseISO(chartData.find(d => d.formattedDate === date)?.date), 'PP')}
              />
              <Line 
                type="monotone" 
                dataKey="weight" 
                name="Weight" 
                stroke="#8884d8" 
                activeDot={{ r: 8 }} 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default WeightHistoryModal; 