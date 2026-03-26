import { supabase } from '../supabase';

export const deleteExerciseLogById = async (id) => {
  const { error } = await supabase.from('exercise_logs').delete().eq('id', id);

  if (error) {
    console.error('deleteExerciseLogById:', error);
    return { success: false, error };
  }

  return { success: true };
};
