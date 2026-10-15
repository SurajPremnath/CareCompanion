import {
  matchMedicine,
  MedicineMatchResult,
} from "@/lib/medication/medicineMatcher";

export interface ResolveMedicineRequest {
  medicineName: string;
}

export async function resolveMedicine(
  request: ResolveMedicineRequest
): Promise<MedicineMatchResult> {

  const medicineName = request.medicineName.trim();


  if (!medicineName) {
    return {
      status: "NOT_FOUND",
      originalText: "",
    };
  }

  return matchMedicine(medicineName);
}