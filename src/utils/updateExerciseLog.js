import { supabase } from '../supabase';

const normalizeRepeat = (value) => {
  if (value === '' || value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : String(value).trim();
};

export const updateExerciseLog = async (id, { exercise, first, second, third, fourth, comment }) => {
  const row = {};
  if (exercise !== undefined) row.exercise = String(exercise).trim();
  if (first !== undefined) row.first = normalizeRepeat(first);
  if (second !== undefined) row.second = normalizeRepeat(second);
  if (third !== undefined) row.third = normalizeRepeat(third);
  if (fourth !== undefined) row.fourth = normalizeRepeat(fourth);
  if (comment !== undefined) {
    const trimmed = comment === null || comment === '' ? '' : String(comment).trim();
    row.comment = trimmed === '' ? null : trimmed;
  }

  const { data, error } = await supabase
    .from('exercise_logs')
    .update(row)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('updateExerciseLog:', error);
    return { success: false, error };
  }

  return { success: true, data };
};
