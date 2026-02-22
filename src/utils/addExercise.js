import { supabase } from "../supabase";

export const addExercise = async (name, values, user, comment = null) => {
  const today = new Date().toISOString().split('T')[0];
  
  const { data: existingExercise } = await supabase
    .from('exercise_logs')
    .select('*')
    .eq('exercise', name)
    .eq('user_id', user.id)
    .gte('date', today)
    .lt('date', new Date(new Date(today).getTime() + 24 * 60 * 60 * 1000).toISOString())
    .maybeSingle();

  if (existingExercise) {
    await supabase
      .from('exercise_logs')
      .update({
        first: values.first,
        second: values.second,
        third: values.third,
        fourth: values.fourth,
        comment: comment
      })
      .eq('id', existingExercise.id);
  } else {
    const dateWithTime = new Date().toISOString();
    await supabase
      .from('exercise_logs')
      .insert([{
        exercise: name,
        first: values.first,
        second: values.second,
        third: values.third,
        fourth: values.fourth,
        user_id: user.id,
        date: dateWithTime,
        comment: comment
      }]);
  }
}