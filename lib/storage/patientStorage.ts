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
      // Validation
      //------------------------------------------------------

      const validation = patientValidator.validate(patient);

if (!validation.success) {

  return StorageResult.failure(

    "VALIDATION_FAILED",

    validation.error ?? "Validation failed."

  );

}

      //------------------------------------------------------
      // Duplicate check
      //------------------------------------------------------

      if (patient.dateOfBirth) {

        const existingPatient =
          await patientRepository.findPatientByNameAndDob(
            patient.fullName,
            patient.dateOfBirth
          );

        if (existingPatient) {

          return StorageResult.failure(
            "PATIENT_ALREADY_EXISTS",
            "A patient with the same name and date of birth already exists."
          );

        }

      }

//------------------------------------------------------
// Patient Limit Validation
//------------------------------------------------------

const access =
  await patientRepository.getPatientAccess();

if (
  access.role === "STANDARD" &&
  access.patientCount >= 1
) {

  return StorageResult.failure(

    "PATIENT_LIMIT_REACHED",

    "Standard accounts can manage only one family member. Please contact the CareVR administrator if you need additional family members."

  );

}

      //------------------------------------------------------
      // Save
      //------------------------------------------------------

      const savedPatient =
        await patientRepository.createPatient(patient);

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
    patientId: string
  ): Promise<Result<Patient>> {

    try {

      const patient =
        await patientRepository.getPatientById(
          patientId
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