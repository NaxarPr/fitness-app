import { supabase } from "../supabase";

export const getAllUserExercises = async () => {
  const { data: logsData, error: logsError } = await supabase
    .from("exercise_logs")
    .select("exercise")
    .order("date", { ascending: false });

  if (logsError) {
    console.error("Error fetching exercise logs:", logsError);
    return [];
  }

  if (!logsData || logsData.length === 0) {
    return [];
  }

  const uniqueNames = Array.from(new Set(logsData.map((item) => item.exercise)));

  const { data: exercisesData, error: exercisesError } = await supabase
    .from("exercises")
    .select("exercise_name, muscle");

  if (exercisesError) {
    console.error("Error fetching exercises:", exercisesError);
    return uniqueNames.map((name) => ({ name, muscle: "" }));
  }

  const muscleByExerciseName = (exercisesData || []).reduce((acc, row) => {
    if (!acc[row.exercise_name]) {
      acc[row.exercise_name] = row.muscle || "";
    }
    return acc;
  }, {});

  return uniqueNames.map((name) => ({
    name,
    muscle: muscleByExerciseName[name] ?? "",
  }));
};

