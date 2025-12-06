import { supabase } from "../supabase";

export const getAllUserExercises = async () => {
  const { data, error } = await supabase
    .from("exercise_logs")
    .select("exercise")
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching all user exercises:", error);
    return [];
  }

  if (!data) {
    return [];
  }

  const allUserExercises = data.map((item) => item.exercise);
  const uniqueUserExercises = Array.from(new Set(allUserExercises));

  return uniqueUserExercises;
};

