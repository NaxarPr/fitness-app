import { supabase } from "../supabase";

export const getExercisesByName = async (exerciseName, user) => {
  const { data: exercises, error } = await supabase
    .from('exercise_logs')
    .select('*')
    .eq('exercise', exerciseName)
    .eq('user_id', user.id)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching exercises:', error);
    return [];
  }

  return exercises || [];
}; 