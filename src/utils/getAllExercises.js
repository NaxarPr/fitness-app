import { supabase } from "../supabase";

export const getAllExercises = async () => {
  const { data: exercises, error } = await supabase
    .from('exercises')
    .select('*')

  if (error) {
    console.error('Error fetching exercises:', error);
    return [];
  }

  return exercises || [];
}; 

export const addExercise = async (exercise) => {
  const { data, error } = await supabase
    .from('exercises')
    .insert([exercise]);

  if (error) {
    console.error('Error adding exercise:', error);
    return null;
  }
  return data;
};