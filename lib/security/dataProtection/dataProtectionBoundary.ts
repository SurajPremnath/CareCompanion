import "server-only";

import {
  encryptValue,
  decryptValue,
  createLookupHash,
} from "@/lib/security/encryption/encryptionService";

type SupportedEntity =
  | "PATIENT";

type ProtectedField =
  | "fullName"
  | "dateOfBirth";

interface PatientInput {
  fullName?: string;
  dateOfBirth?: string | null;
  [key: string]: unknown;
}

interface ProtectedPatientData {
  full_name_ciphertext?: string;
  full_name_lookup_hash?: string;
  date_of_birth_ciphertext?: string;
  date_of_birth_lookup_hash?: string;
}

interface PatientPersistenceResult {
  protectedData: ProtectedPatientData;
  operationalData: Record<string, unknown>;
}

const PROTECTED_FIELDS: Record<
  SupportedEntity,
  readonly ProtectedField[]
> = {
  PATIENT: [
    "fullName",
    "dateOfBirth",
  ],
};

function isProtectedField(
  entity: SupportedEntity,
  field: string
): field is ProtectedField {

  return PROTECTED_FIELDS[entity]
    .includes(field as ProtectedField);
}

function protectPatient(
  data: PatientInput
): PatientPersistenceResult {

  const protectedData:
    ProtectedPatientData = {};

  const operationalData:
    Record<string, unknown> = {};

  for (const [field, value] of Object.entries(data)) {

    if (!isProtectedField("PATIENT", field)) {

      operationalData[field] = value;

      continue;
    }

    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {

      continue;
    }

    if (typeof value !== "string") {

      throw new Error(
        `Protected patient field "${field}" must be a string.`
      );

    }

    if (field === "fullName") {

      protectedData.full_name_ciphertext =
        encryptValue(value);

      protectedData.full_name_lookup_hash =
        createLookupHash(value);

      continue;
    }

    if (field === "dateOfBirth") {

      protectedData.date_of_birth_ciphertext =
        encryptValue(value);

      protectedData.date_of_birth_lookup_hash =
        createLookupHash(value);

      continue;
    }
  }

  return {
    protectedData,
    operationalData,
  };
}

function unprotectPatient(
  data: Record<string, unknown>
): Record<string, unknown> {

  const result:
    Record<string, unknown> = {
    ...data,
  };

  if (
    typeof data.full_name_ciphertext ===
    "string"
  ) {

    result.fullName =
      decryptValue(
        data.full_name_ciphertext
      );
  }

  if (
    typeof data.date_of_birth_ciphertext ===
    "string"
  ) {

    result.dateOfBirth =
      decryptValue(
        data.date_of_birth_ciphertext
      );
  }

  delete result.full_name_ciphertext;
  delete result.full_name_lookup_hash;
  delete result.date_of_birth_ciphertext;
  delete result.date_of_birth_lookup_hash;

  return result;
}

export const dataProtectionBoundary = {

  protect(
    entity: SupportedEntity,
    data: object
  ): PatientPersistenceResult {

    switch (entity) {

      case "PATIENT":

        return protectPatient(
          data as PatientInput
        );

      default:

        throw new Error(
          `Unsupported CareVR data entity: ${entity}`
        );
    }
  },

  unprotect(
    entity: SupportedEntity,
    data: Record<string, unknown>
  ): Record<string, unknown> {

    switch (entity) {

      case "PATIENT":

        return unprotectPatient(data);

      default:

        throw new Error(
          `Unsupported CareVR data entity: ${entity}`
        );
    }
  },
};