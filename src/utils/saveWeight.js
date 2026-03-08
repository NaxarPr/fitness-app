import { supabase } from "../supabase";

/**
 * @param {number} weight - Weight value (kg)
 * @param {object} user - User object with id
 * @param {string} [selectedDate] - Date string YYYY-MM-DD
 * @param {object} [params] - Optional object to store in params (jsonb) column, e.g. body measurements
 */
export const saveWeight = async (weight, user, selectedDate, params = null) => {
  const date = selectedDate || new Date().toISOString().split("T")[0];

  const { data: existingWeight } = await supabase
    .from("weight_logs")
    .select("*")
    .eq("user_id", user.id)
    .gte("date", date)
    .lt(
      "date",
      new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000).toISOString()
    )
    .maybeSingle();

  const payload = {
    weight,
    ...(params != null && { params }),
  };

  if (existingWeight) {
    await supabase
      .from("weight_logs")
      .update(payload)
      .eq("id", existingWeight.id);
  } else {
    await supabase.from("weight_logs").insert([
      {
        weight,
        user_id: user.id,
        date: new Date(date).toISOString(),
        ...(params != null && { params }),
      },
    ]);
  }
};