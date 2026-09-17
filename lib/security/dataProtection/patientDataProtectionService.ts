import "server-only";

import {
  dataProtectionBoundary,
} from "@/lib/security/dataProtection/dataProtectionBoundary";

export interface PatientDataProtectionInput {
  fullName: string;
  dateOfBirth?: string | null;
  gender?: string | null;
  relationship?: string | null;
  status?: string | null;
}

export interface PatientDataProtectionResult {
  protectedData: {
    full_name_ciphertext?: string;
    full_name_lookup_hash?: string;
    date_of_birth_ciphertext?: string;
    date_of_birth_lookup_hash?: string;
  };
  operationalData: Record<string, unknown>;
}

export function protectPatientData(
  patient: PatientDataProtectionInput
): PatientDataProtectionResult {

const result =
  dataProtectionBoundary.protect(
    "PATIENT",
    patient
  );

  return {
    protectedData:
      result.protectedData,

    operationalData:
      result.operationalData,
  };
}

export function unprotectPatientData(
  data: Record<string, unknown>
): Record<string, unknown> {

  return dataProtectionBoundary.unprotect(
    "PATIENT",
    data
  );
}