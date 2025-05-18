import { supabase } from "../supabase";

export const getWeightHistory = async (user) => {
  const { data: weightHistory, error } = await supabase
    .from('weight_logs')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching weight history:', error);
    return [];
  }

  return weightHistory || [];
}; 