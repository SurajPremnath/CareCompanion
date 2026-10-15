import { Patient } from "../types/patient";
import { PatientRow } from "../database";

/**
 * PatientMapper
 *
 * Responsible for converting between
 * PostgreSQL rows and Patient domain models.
 */
export class PatientMapper {

  /**
   * Converts a database row into a Patient model.
   */
  static fromDatabase(row: PatientRow): Patient {

    return {
      id: row.id,
      userId: row.user_id,
      fullName: row.full_name,
      dateOfBirth: row.date_of_birth,
      gender: row.gender,
      relationship: row.relationship,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };

  }

  /**
   * Converts a Patient model into a database payload.
   */
  static toDatabase(
    patient: Partial<Patient>
  ): Partial<PatientRow> {

    return {

      full_name: patient.fullName,

      date_of_birth: patient.dateOfBirth,

      gender: patient.gender,

      relationship: patient.relationship,

      status: patient.status

    };

  }

}