/**
 * ============================================================
 * CAREVR
 * Medication Resolver Trace
 * ============================================================
 * Internal AI matching metadata.
 * Never displayed directly to users.
 * ============================================================
 */

export type ResolverMethod =
  | "EXACT"
  | "ALIAS"
  | "SEARCH_KEY"
  | "FUZZY"
  | "MANUAL";

export interface ResolverTrace {

  normalizedInput: string;

  matchedMedicineId?: string;

  matchedMedicineName?: string;

  method: ResolverMethod;

  confidence: number;

  candidateMedicineIds: string[];

  candidateMedicineNames: string[];

}