import { Patient } from "../types/patient";
import { Result } from "../types/result";
import { StorageResult } from "../storage/storageResult";

/**
 * PatientValidator
 *
 * Responsible for validating Patient business rules.
 *
 * This class performs validation only.
 * It does NOT access the database.
 * It does NOT call repositories.
 */
export class PatientValidator {

    /**
     * Validates patient details before saving.
     */
validate(
    patient: Omit<
        Patient,
        "id" | "userId" | "createdAt" | "updatedAt"
    >
): Result<void> {

    if (!patient.fullName.trim()) {

        return StorageResult.failure(
            "PATIENT_NAME_REQUIRED",
            "Patient name is required."
        );

    }

    if (patient.fullName.trim().length < 2) {

        return StorageResult.failure(
            "PATIENT_NAME_TOO_SHORT",
            "Patient name must contain at least 2 characters."
        );

    }

    if (!patient.dateOfBirth) {

        return StorageResult.failure(
            "DATE_OF_BIRTH_REQUIRED",
            "Date of birth is required."
        );

    }

    const dob =
        new Date(patient.dateOfBirth);

    if (isNaN(dob.getTime())) {

        return StorageResult.failure(
            "INVALID_DATE_OF_BIRTH",
            "Invalid date of birth."
        );

    }

    if (dob > new Date()) {

        return StorageResult.failure(
            "DATE_OF_BIRTH_IN_FUTURE",
            "Date of birth cannot be in the future."
        );

    }

    if (!patient.relationship?.trim()) {

        return StorageResult.failure(
            "RELATIONSHIP_REQUIRED",
            "Relationship is required."
        );

    }

    if (!patient.gender) {

        return StorageResult.failure(
            "GENDER_REQUIRED",
            "Gender is required."
        );

    }

    return StorageResult.success();

}

}

export const patientValidator = new PatientValidator();