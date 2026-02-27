import { supabase } from "../supabase";
export const startTraining = async (minusTenMinutes) => {
  let trainingStartTime;
  if (minusTenMinutes) {
    trainingStartTime = new Date(Date.now() - 10 * 60 * 1000);
  } else {
    trainingStartTime = new Date();
  }
  const localDate = trainingStartTime.toLocaleDateString('en-CA');

  const { data: existingStart } = await supabase
    .from('training_time')
    .select('*')
    .eq('date', localDate)
    .maybeSingle();

  if (existingStart) {
    console.error('Start training already exists for today');
    return;
  } else {
    await supabase
      .from('training_time')
      .insert({
        created_at: trainingStartTime.toISOString(),
        date: localDate
      })
  }
}