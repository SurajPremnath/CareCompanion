import { normalizeMedicineName } from "./medicineNormalizer";

/**
 * Converts medicine names into a normalized search key.
 *
 * Example:
 * "Olmezest 20 mg Tablet"
 * ->
 * "olmezest20mgtablet"
 */
/**
 * Builds the search key used by medicine_master.search_key
 */
export function buildMedicineSearchKey(
  brandName: string,
  strength?: string | null,
  formulation?: string | null
): string {
  return normalizeMedicineName(
    [
      brandName,
      strength ?? "",
      formulation ?? "",
    ].join(" ")
  );
}

/**
 * Case-insensitive comparison.
 */
export function medicineEquals(
  left: string,
  right: string
): boolean {
  return normalizeMedicineName(left) ===
         normalizeMedicineName(right);
}

/**
 * Returns true if one medicine name contains the other.
 *
 * Useful for quick fallback matching.
 */
export function medicineContains(
  source: string,
  search: string
): boolean {
  const sourceValue = normalizeMedicineName(source);
  const searchValue = normalizeMedicineName(search);

  return sourceValue.includes(searchValue);
}

/**
 * Removes duplicate medicines by ID.
 */
export function uniqueMedicines<T extends { id: string }>(
  medicines: T[]
): T[] {

  const map = new Map<string, T>();

  medicines.forEach(medicine => {
    map.set(medicine.id, medicine);
  });

  return [...map.values()];
}