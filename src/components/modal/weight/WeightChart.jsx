import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO } from "date-fns";
import { PARAM_FIELDS } from "../../../const/params";

const WeightChart = ({ weightHistory, onToggleTable }) => {
  const [selectedParam, setSelectedParam] = useState("weight");

  const chartData = weightHistory
    .map((record) => {
      const weightVal =
        record.weight != null && record.weight !== ""
          ? Number(record.weight)
          : null;
      const paramValues = {};
      PARAM_FIELDS.forEach(({ key }) => {
        if (key === "weight") {
          paramValues[key] = weightVal;
        } else {
          const raw = record.params?.[key];
          paramValues[key] =
            raw != null && raw !== "" ? Number(raw) : null;
        }
      });
      return {
        date: record.date,
        formattedDate: format(parseISO(record.date), "MMM dd"),
        ...paramValues,
      };
    })
    .reverse();

  const selectedLabel =
    PARAM_FIELDS.find((p) => p.key === selectedParam)?.label ?? selectedParam;

  const handleParamChange = (e) => {
    setSelectedParam(e.target.value);
  };

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
        <h2 className="text-xl font-bold text-white">Weight History</h2>
        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="chart-param-select" className="text-gray-400 text-sm">
            Param:
          </label>
          <select
            id="chart-param-select"
            value={selectedParam}
            onChange={handleParamChange}
            className="bg-gray-700 text-gray-200 rounded px-3 py-1.5 text-sm border border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-500"
            aria-label="Select param to display"
          >
            {PARAM_FIELDS.map(({ key, label }) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
          <button
            onClick={onToggleTable}
            className="px-3 py-1 rounded bg-gray-700 text-gray-300 hover:bg-gray-600"
            aria-label="Show table view"
          >
            📊
          </button>
        </div>
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
              domain={["dataMin - 1", "dataMax + 1"]}
            />
            <Tooltip
              contentStyle={{ backgroundColor: "#333", border: "none" }}
              labelStyle={{ color: "#fff" }}
              formatter={(value) =>
                value != null ? [`${value}`, selectedLabel] : ["—", selectedLabel]
              }
              labelFormatter={(date) =>
                format(
                  parseISO(
                    chartData.find((d) => d.formattedDate === date)?.date ?? ""
                  ),
                  "PP"
                )
              }
            />
            <Line
              type="monotone"
              dataKey={selectedParam}
              name={selectedLabel}
              stroke="#8884d8"
              activeDot={{ r: 8 }}
              strokeWidth={2}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeightChart; 