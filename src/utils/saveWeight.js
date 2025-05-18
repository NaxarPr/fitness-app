import { supabase } from "../supabase";

export const saveWeight = async (weight, user, selectedDate) => {
  const date = selectedDate || new Date().toISOString().split('T')[0];
  
  const { data: existingWeight } = await supabase
    .from('weight_logs')
    .select('*')
    .eq('user_id', user.id)
    .gte('date', date)
    .lt('date', new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000).toISOString())
    .maybeSingle();

  if (existingWeight) {
    await supabase
      .from('weight_logs')
      .update({
        weight: weight
      })
      .eq('id', existingWeight.id);
  } else {
    await supabase
      .from('weight_logs')
      .insert([{
        weight: weight,
        user_id: user.id,
        date: new Date(date).toISOString()
      }]);
  }
};