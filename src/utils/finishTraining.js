import { supabase } from "../supabase";

export const finishTraining = async () => {
  const now = new Date();
  const localDate = now.toLocaleDateString('en-CA');

  const { data: existingStart } = await supabase
    .from('training_time')
    .select('*')
    .eq('date', localDate)
    .maybeSingle();

  if (!existingStart) {
    console.error('No start found for today');
    return { success: false };
  }

  const { error } = await supabase
    .from('training_time')
    .update({
      finished_at: now.toISOString(),
    })
    .eq('id', existingStart.id);

  if (error) {
    console.error(error);
    return { success: false };
  }

  return { success: true, dateKey: localDate };
};