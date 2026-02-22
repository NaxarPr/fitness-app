
export const normalizeProgramForDb = (program) => {
  if (!program || typeof program !== 'object') {
    return {};
  }

  const normalized = {};

  Object.entries(program).forEach(([dayKey, exercises]) => {
    const key = String(dayKey);
    if (!Array.isArray(exercises)) {
      normalized[key] = [];
      return;
    }

    normalized[key] = exercises
      .map((ex) => {
        if (typeof ex === 'string') {
          return ex.trim() ? { name: ex.trim() } : null;
        }
        if (ex && typeof ex === 'object' && ex.name) {
          return {
            name: String(ex.name).trim(),
            ...(ex.muscle ? { muscle: String(ex.muscle).trim() } : {}),
          };
        }
        return null;
      })
      .filter(Boolean);
  });

  return normalized;
};
