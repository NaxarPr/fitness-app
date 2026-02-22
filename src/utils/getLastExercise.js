import { supabase } from '../supabase';

const getExerciseName = (ex) => (typeof ex === 'string' ? ex : (ex && ex.name));

export const getLastExercise = async (user, program) => {
  const { data: lastExercise } = await supabase
    .from('exercise_logs')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .limit(1)
    .single();

  if (!lastExercise || !lastExercise.exercise) return null;

  const searchName = lastExercise.exercise;

  for (const [dayKey, exercises] of Object.entries(program || {})) {
    if (!Array.isArray(exercises)) continue;
    const hasMatch = exercises.some((ex) => getExerciseName(ex) === searchName);
    if (hasMatch) {
      return Number(dayKey) || 1;
    }
  }

  return 1;
}; 