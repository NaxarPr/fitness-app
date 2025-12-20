import { supabase } from "../supabase";

export const deleteDayForUser = async ({ dayNumber, user }) => {
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

  const { error } = await supabase
    .from("exercises")
    .delete()
    .eq("user_id", user.id)
    .eq("day_number", parsedDayNumber);

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
    added: false,
    data: null,
    error: null,
  };
};

