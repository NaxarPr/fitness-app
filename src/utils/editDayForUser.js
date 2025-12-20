import { supabase } from "../supabase";

export const editDayForUser = async ({ exercises, dayNumber, user }) => {
  const normalizedExercises = Array.isArray(exercises)
    ? exercises
        .map((exercise) => {
          if (!exercise) {
            return "";
          }

          if (typeof exercise === "string") {
            return exercise.trim();
          }

          if (typeof exercise === "object") {
            return exercise.name?.trim() || "";
          }

          return "";
        })
        .filter(Boolean)
    : [];

  if (!normalizedExercises.length) {
    return {
      success: false,
      added: false,
      data: null,
      error: new Error("Exercises array is required"),
    };
  }

  const parsedDayNumber = Number(dayNumber);

  if (!user?.id) {
    return {
      success: false,
      added: false,
      data: null,
      error: new Error("User id is required"),
    };
  }

  if (Number.isNaN(parsedDayNumber)) {
    return {
      success: false,
      added: false,
      data: null,
      error: new Error("Valid day number is required"),
    };
  }

  const deleteResult = await supabase
    .from("exercises")
    .delete()
    .eq("user_id", user.id)
    .eq("day_number", parsedDayNumber);

  if (deleteResult.error) {
    return {
      success: false,
      added: false,
      data: null,
      error: deleteResult.error,
    };
  }

  const insertPayload = normalizedExercises.map((exerciseName) => ({
    exercise_name: exerciseName,
    day_number: parsedDayNumber,
    user_id: user.id,
  }));

  const { data, error } = await supabase.from("exercises").insert(insertPayload).select();

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

