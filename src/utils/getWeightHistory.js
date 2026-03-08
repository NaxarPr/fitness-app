import { supabase } from "../supabase";

export const getWeightHistory = async (user) => {
  const { data: weightHistory, error } = await supabase
    .from("weight_logs")
    .select("id, user_id, date, weight, params")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  if (error) {
    console.error('Error fetching weight history:', error);
    return [];
  }

  return weightHistory || [];
}; 