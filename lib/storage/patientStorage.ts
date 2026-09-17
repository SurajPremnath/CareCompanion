import { Patient } from "../types/patient";
import { StorageResult } from "./storageResult";

import { patientValidator } from "../validators/patientValidator";
import { patientRepository } from "../repositories/patientRepository";
import type { Result } from "@/lib/types/result";



/**
 * PatientStorage
 *
 * Business layer responsible for:
 *
 * - Validation
 * - Business rules
 * - Duplicate detection
 * - Repository orchestration
 * - Returning Result<T>
 *
 * This class contains NO database code.
 */
class PatientStorage {

  /**
   * Save a patient.
   */
  async savePatient(
    patient: Omit<
      Patient,
      "id" | "userId" | "createdAt" | "updatedAt"
    >
  ): Promise<Result<Patient>> {

    try {

      //------------------------------------------------------
      // Client-side validation
      // -----------------------------------------------------
      // Kept for immediate UX feedback.
      // Server validation remains authoritative.
      //------------------------------------------------------

      const validation =
        patientValidator.validate(patient);

      if (!validation.success) {

        return StorageResult.failure(
          "VALIDATION_FAILED",
          validation.error ?? "Validation failed."
        );

      }

      //------------------------------------------------------
      // Create Patient through protected server boundary
      //------------------------------------------------------

      const response =
        await fetch(
          "/api/patients/create",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              fullName:
                patient.fullName,

              dateOfBirth:
                patient.dateOfBirth,

              gender:
                patient.gender,

              relationship:
                patient.relationship,

              status:
                patient.status,
            }),
          }
        );

      //------------------------------------------------------
      // Read API response
      //------------------------------------------------------

      const result =
        await response.json();

      if (!response.ok) {

        if (
          response.status === 409 &&
          result.error ===
            "A patient with the same name and date of birth already exists."
        ) {

          return StorageResult.failure(
            "PATIENT_ALREADY_EXISTS",
            result.error
          );

        }

        if (
          response.status === 409 &&
          result.error ===
            "Standard accounts can manage only one family member."
        ) {

          return StorageResult.failure(
            "PATIENT_LIMIT_REACHED",
            "Standard accounts can manage up to two family members. Please upgrade your CareVR plan to add more."
          );

        }

        if (response.status === 403) {

          return StorageResult.failure(
            "PATIENT_SAVE_FAILED",
            result.error ??
              "You are not authorized to create this patient."
          );

        }

        return StorageResult.failure(
          "PATIENT_SAVE_FAILED",
          result.error ??
            "Unable to save patient."
        );

      }

      //------------------------------------------------------
      // The server intentionally returns only the ID.
      // The existing Patient domain object is not available
      // yet because retrieval/decryption is a later step.
      //------------------------------------------------------

      if (
        !result?.success ||
        !result?.data?.id
      ) {

        return StorageResult.failure(
          "PATIENT_SAVE_FAILED",
          "Patient was created but no patient identifier was returned."
        );

      }

      //------------------------------------------------------
      // Return a temporary domain object.
      // Full protected retrieval/decryption will be wired
      // separately.
      //------------------------------------------------------

      const now =
        new Date().toISOString();

      const savedPatient:
        Patient = {

        id:
          result.data.id,

        userId:
          "",

        fullName:
          patient.fullName,

        dateOfBirth:
          patient.dateOfBirth,

        gender:
          patient.gender,

        relationship:
          patient.relationship,

        status:
          patient.status,

        createdAt:
          now,

        updatedAt:
          now,
      };

      return StorageResult.success(
        savedPatient,
        "Patient saved successfully."
      );

    }
    catch (error) {

      console.error(error);

      return StorageResult.failure(
        "PATIENT_SAVE_FAILED",
        "Unable to save patient. Please try again.",
        error
      );

    }

  }

  /**
   * Returns all patients.
   */
  async getPatients(): Promise<Result<Patient[]>> {

    try {

      const patients =
        await patientRepository.getPatients();

      return StorageResult.success(patients);

    }
    catch (error) {

      return StorageResult.failure(

        "PATIENT_LOAD_FAILED",

        "Unable to load patients.",

        error

      );

    }

  }

  /**
   * Returns one patient.
   */
async getPatient(
  patientId: string,
  familyId?: string
): Promise<Result<Patient>> {

  try {

    const patient =
      await patientRepository.getPatientById(
        patientId,
        familyId
      );

    if (!patient) {

      return StorageResult.failure(

        "PATIENT_NOT_FOUND",

        "Patient not found."

      );

    }

    return StorageResult.success(patient);

  }
  catch (error) {

    return StorageResult.failure(

      "PATIENT_LOAD_FAILED",

      "Unable to load patient.",

      error

    );

  }

}

  /**
   * Updates an existing patient.
   */
  async updatePatient(
    patient: Patient
  ): Promise<Result<Patient>> {

    try {

      const validation =
        patientValidator.validate(patient);

 if (!validation.success) {

  return StorageResult.failure(

    "VALIDATION_FAILED",

    validation.error ?? "Validation failed."

  );

}

      const updatedPatient =
        await patientRepository.updatePatient(patient);

      return StorageResult.success(

        updatedPatient,

        "Patient updated successfully."

      );

    }
    catch (error) {

      return StorageResult.failure(

        "PATIENT_UPDATE_FAILED",

        "Unable to update patient.",

        error

      );

    }

  }

  /**
   * Soft delete.
   */
  async deactivatePatient(
    patientId: string
  ): Promise<Result<void>> {

    try {

      await patientRepository.deactivatePatient(
        patientId
      );

      return StorageResult.success(
        undefined,
        "Patient deactivated successfully."
      );

    }
    catch (error) {

      return StorageResult.failure(

        "PATIENT_DELETE_FAILED",

        "Unable to deactivate patient.",

        error

      );

    }

  }

}

export const patientStorage =
  new PatientStorage();