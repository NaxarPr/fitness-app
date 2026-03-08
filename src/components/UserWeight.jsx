import React, { useEffect, useState } from "react";
import { saveWeight } from "../utils/saveWeight";
import WeightModal from "./modal/weight/WeightModal";
import { getWeightHistory } from "../utils/getWeightHistory";
import Input from "./common/Input";
import SystemButton from "./common/SystemButton";
import { useUsers } from "../context/UserContext";
import { PARAM_FIELDS, INITIAL_PARAMS } from "../const/params";


function UserWeight({ user }) {
  const { hideWeights } = useUsers();

  const [editWeight, setEditWeight] = useState(false);
  const [params, setParams] = useState(INITIAL_PARAMS);
  const [weightHistory, setWeightHistory] = useState([]);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const handleParamChange = (key, value) => {
    setParams((prev) => ({ ...prev, [key]: value }));
    setEditWeight(true);
  };

  const handleSaveClick = async () => {
    await saveWeight(params.weight, user, selectedDate, params);
    setEditWeight(false);
    fetchWeightHistory();
  };

  const fetchWeightHistory = async () => {
    const history = await getWeightHistory(user);
    setWeightHistory(history);
    const latest = history[0];
    if (latest) {
      setParams({
        ...INITIAL_PARAMS,
        ...(latest.params && typeof latest.params === "object"
          ? latest.params
          : {}),
        weight: latest.weight ?? latest.params?.weight ?? null,
      });
    }
  };

  useEffect(() => {
    fetchWeightHistory();
    // eslint-disable-next-line 
  }, [user]);

  return (
    <div>
      <div className="flex items-center justify-center gap-2">
        {editWeight ? (
          <div className="flex flex-col w-full gap-3 px-4">
            <Input
              className="!w-32 h-8"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              aria-label="Date"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
              {PARAM_FIELDS.map(({ key, label }) => (
                <div key={key} className="flex items-center gap-2">
                  <label className="text-gray-400 text-sm shrink-0 min-w-[120px]" htmlFor={`param-${key}`}>
                    {label}
                  </label>
                  <Input
                    id={`param-${key}`}
                    className="!w-20 h-8"
                    pattern="[0-9.]*"
                    type="number"
                    value={params[key] ?? ""}
                    onChange={(e) => handleParamChange(key, e.target.value)}
                    aria-label={label}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-2">
              <SystemButton type="primary" onClick={handleSaveClick}>
                Save
              </SystemButton>
              <SystemButton
                type="secondary"
                onClick={() => setEditWeight(false)}
              >
                Cancel
              </SystemButton>
            </div>
          </div>
        ) : !hideWeights ? (
          <div className="flex items-center justify-center gap-2 h-8">
            <p
              className="text-center text-gray-400 select-none"
              onDoubleClick={() => handleParamChange("weight", user.weight ?? params.weight)}
            >
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
        ) : null}
      </div>

      <WeightModal
        isOpen={showWeightModal}
        onClose={() => setShowWeightModal(false)}
        weightHistory={weightHistory}
      />
    </div>
  );
}

export default UserWeight;
