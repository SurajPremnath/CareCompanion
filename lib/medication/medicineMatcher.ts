import { supabase } from "@/lib/supabase";
import {
  MedicineMasterRow,
} from "@/lib/database";

import { normalizeMedicineName } from "@/lib/medication/medicineNormalizer";

export type MedicineMatchStatus =
  | "FOUND"
  | "SUGGESTIONS"
  | "NOT_FOUND";

export interface MedicineMatchResult {
  status: MedicineMatchStatus;
  originalText: string;
  medicine?: MedicineMasterRow;
  suggestions?: MedicineMasterRow[];
}

export async function matchMedicine(
  medicineName: string
): Promise<MedicineMatchResult> {

  const normalized = normalizeMedicineName(medicineName);

//
// STEP 1
// Alias Lookup
//

const { data: alias } = await supabase
  .from("medicine_alias")
  .select("medicine_id")
  .eq("alias", normalized)
  .maybeSingle();

if (alias) {
  const { data: medicine } = await supabase
    .from("medicine_master")
    .select("*")
    .eq("id", alias.medicine_id)
    .eq("is_active", true)
    .maybeSingle();

  if (medicine) {
    return {
      status: "FOUND",
      originalText: medicineName,
      medicine,
    };
  }
}

  //
  // STEP 2
  // Exact Search
  //

  const { data: exact } = await supabase
    .from("medicine_master")
    .select("*")
    .eq("alias", medicineName)
    .eq("is_active", true)
    .maybeSingle();

  if (exact) {
    return {
      status: "FOUND",
      originalText: medicineName,
      medicine: exact,
    };
  }

  //
  // STEP 3
  // Similar Search
  //

  const { data: medicines } = await supabase
    .from("medicine_master")
    .select("*")
    .eq("is_active", true)
    .ilike("search_key", `%${normalized}%`)
    .limit(5);

  if (medicines && medicines.length > 0) {
    return {
      status: "SUGGESTIONS",
      originalText: medicineName,
      suggestions: medicines,
    };
  }

  //
  // STEP 4
  // Not Found
  //

  return {
    status: "NOT_FOUND",
    originalText: medicineName,
  };
}