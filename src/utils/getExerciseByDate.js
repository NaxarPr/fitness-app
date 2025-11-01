import { supabase } from "../supabase";

export const getExercisesByDate = async (date) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const { data, error } = await supabase
    .from("exercise_logs")
    .select("*")
    .gte("date", startOfDay.toISOString())
    .lte("date", endOfDay.toISOString())
    .order("id", { ascending: true });

  if (error) {
    console.error("Error fetching exercises:", error);
    return [];
  }

  return data || [];
};
