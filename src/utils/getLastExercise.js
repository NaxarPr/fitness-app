import { supabase } from "../supabase";
import EXERCISES from "../const/exercises";

export const getLastExercise = async (user) => {
  const { data: lastExercise } = await supabase
    .from('exercise_logs')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .limit(1)
    .single();

  if (!lastExercise) return null;

  const programIndex = EXERCISES.findIndex(program => 
    Object.values(program).some(dayExercises => 
      dayExercises.some(ex => ex.name === lastExercise.exercise)
    )
  );

  if (programIndex === -1) return 1;

  const day = Object.entries(EXERCISES[programIndex]).find(([_, exercises]) =>
    exercises.some(ex => ex.name === lastExercise.exercise)
  )?.[0];
  
  return day;
}; 