import { supabase } from "../supabase";

export const getTrainingData = async (date) => {
  const { data: trainingData } = await supabase
    .from('training_time')
    .select('*')
    .eq('date', date )
    .maybeSingle();

  if (trainingData) {
    return trainingData;
  } else {
    return [];
  }
}