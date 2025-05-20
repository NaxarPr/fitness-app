import { supabase } from "../supabase";

export const deleteLastExercise = async (name, user) => {
  const { data: lastExercise } = await supabase
    .from('exercise_logs')
    .select('*')
    .eq('exercise', name)
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .limit(1)
    .single();

  if (lastExercise) {
    await supabase
      .from('exercise_logs')
      .delete()
      .eq('id', lastExercise.id);
    
    return true;
  }
  
  return false;
} 