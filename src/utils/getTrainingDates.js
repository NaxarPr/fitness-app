import { supabase } from "../supabase";

export const getTrainingDates = async () => {
  const { data: trainingDates, error } = await supabase
    .from('exercise_logs')
    .select('date, user_id')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching training dates:', error);
    return [];
  }

  if (!trainingDates) return [];

  const uniqueDates = [...new Set(trainingDates.map((record) => record.date.split('T')[0]))];

  return uniqueDates.sort((a, b) => b.localeCompare(a));
}; 