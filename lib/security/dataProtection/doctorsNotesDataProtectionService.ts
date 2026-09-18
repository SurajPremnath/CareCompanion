import "server-only";

import {
  dataProtectionBoundary,
} from "@/lib/security/dataProtection/dataProtectionBoundary";

export interface DoctorsNoteDataProtectionInput {
  note: string;
}

export interface DoctorsNoteDataProtectionResult {
  protectedData: {
    note_ciphertext?: string;
  };
  operationalData: Record<string, unknown>;
}

export function protectDoctorsNoteData(
  note: DoctorsNoteDataProtectionInput
): DoctorsNoteDataProtectionResult {

  const result =
    dataProtectionBoundary.protect(
      "DOCTORS_NOTE",
      note
    );

  return {
    protectedData:
      result.protectedData as DoctorsNoteDataProtectionResult["protectedData"],

    operationalData:
      result.operationalData,
  };
}

export function unprotectDoctorsNoteData(
  data: Record<string, unknown>
): Record<string, unknown> {

  return dataProtectionBoundary.unprotect(
    "DOCTORS_NOTE",
    data
  );
}