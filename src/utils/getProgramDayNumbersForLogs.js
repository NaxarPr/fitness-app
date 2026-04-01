const getProgramExerciseName = (ex) => (typeof ex === 'string' ? ex : ex?.name);

const findProgramDayForExerciseName = (exerciseName, program) => {
  const search = (exerciseName || '').trim();
  if (!search) return null;
  for (const [dayKey, exercises] of Object.entries(program || {})) {
    if (!Array.isArray(exercises)) continue;
    const match = exercises.some(
      (ex) => getProgramExerciseName(ex) === search
    );
    if (match) {
      const n = Number(dayKey);
      if (Number.isFinite(n)) return n;
      const parsed = Number.parseInt(String(dayKey), 10);
      return Number.isFinite(parsed) ? parsed : null;
    }
  }
  return null;
};

export const getProgramDayNumbersForLogs = (logs, program) => {
  const days = new Set();
  for (const log of logs) {
    const d = findProgramDayForExerciseName(log?.exercise, program);
    if (d != null) days.add(d);
  }
  return [...days].sort((a, b) => a - b);
};

export const formatProgramDaysLabel = (dayNumbers) => {
  if (!dayNumbers?.length) return null;
  if (dayNumbers.length === 1) return `Day ${dayNumbers[0]}`;
  return `Days ${dayNumbers.join(', ')}`;
};
