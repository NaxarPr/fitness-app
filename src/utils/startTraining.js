import { supabase } from "../supabase";

export const startTraining = async () => {
  const now = new Date();
  const localDate = now.toLocaleDateString('en-CA');

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
        created_at: now.toISOString(),
        date: localDate
      })
  }
}