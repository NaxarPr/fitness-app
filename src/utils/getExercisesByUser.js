import { supabase } from "../supabase";

/**
 * Fetch all exercises for a user across all days.
 *
 * @param {{ userId: string }} params
 * @returns {Promise<{ data: any[], error: Error | null }>}
 */
export const getExercisesByUser = async ({ userId }) => {
  if (!userId) {
    return { data: [], error: new Error("userId is required") };
  }

  const { data, error } = await supabase
    .from("exercises")
    .select("*")
    .eq("user_id", userId)
    .order("day_number", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    console.error("Error fetching exercises by user:", error);
    return { data: [], error };
  }

  return { data: data || [], error: null };
};


