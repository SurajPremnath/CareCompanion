import { supabase } from "@/lib/supabase";

/**
 * Returns true only when the user has an ACTIVE PRIMARY
 * CareVR access record.
 */
export async function hasPrimaryAccess(
  userId: string
): Promise<boolean> {
  if (!userId) {
    return false;
  }

  const { data, error } = await supabase
    .from("carevr_access")
    .select("id")
    .eq("user_id", userId)
    .eq("access_type", "PRIMARY")
    .eq("access_status", "ACTIVE")
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return !!data;
}