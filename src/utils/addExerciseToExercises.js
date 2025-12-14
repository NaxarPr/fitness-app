import { supabase } from "../supabase";

export const addExerciseToExercises = async ({ exerciseName, user, dayNumber, muscle }) => {
  const normalizedExerciseName = exerciseName?.trim();

  if (!normalizedExerciseName) {
    return {
      success: false,
      added: false,
      data: null,
      error: new Error("Exercise name is required"),
    };
  }

  const existingQuery = supabase.from("exercises").select("*").eq("exercise_name", normalizedExerciseName);

  if (user?.id) {
    existingQuery.eq("user_id", user.id);
  }

  if (dayNumber !== undefined) {
    existingQuery.eq("day_number", dayNumber);
  }
  if (muscle !== undefined) {
    existingQuery.eq("muscle", muscle);
  }

  const { data: existingExercise, error: existingExerciseError } = await existingQuery.maybeSingle();

  if (existingExerciseError) {
    return {
      success: false,
      added: false,
      data: null,
      error: existingExerciseError,
    };
  }

  if (existingExercise) {
    return {
      success: true,
      added: false,
      data: existingExercise,
      error: null,
    };
  }

  const insertPayload = { exercise_name: normalizedExerciseName };

  if (user?.id) {
    insertPayload.user_id = user.id;
  }

  if (dayNumber !== undefined) {
    insertPayload.day_number = dayNumber;
  }
  if (muscle !== undefined) {
    insertPayload.muscle = muscle;
  }

  const { data, error } = await supabase
    .from("exercises")
    .insert([insertPayload])
    .select()
    .maybeSingle();

  if (error) {
    return {
      success: false,
      added: false,
      data: null,
      error,
    };
  }

  return {
    success: true,
    added: true,
    data,
    error: null,
  };
};

