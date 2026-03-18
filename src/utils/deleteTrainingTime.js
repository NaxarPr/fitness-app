import { supabase } from "../supabase";

export const deleteTrainingTime = async (id) => {
  if (id == null || id === "") {
    return { success: false, error: new Error("id is required") };
  }

  const { error } = await supabase
    .from("training_time")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting training_time row:", error);
    return { success: false, error };
  }

  return { success: true };
};
