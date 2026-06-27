import { supabase } from "../supabase";
import { BaseRepository } from "./BaseRepository";
import { Patient } from "../types/patient";
import { PatientRow } from "../database";
import { PatientMapper } from "../mappers/PatientMapper";

export class PatientRepository extends BaseRepository {

  /**
   * Returns all active patients belonging to the
   * currently authenticated user.
   */
  async getPatients(): Promise<Patient[]> {

    const userId = await this.getCurrentUserId();

    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "ACTIVE")
      .order("full_name", { ascending: true });

    if (error) {
      this.handleError(error);
    }

    return ((data ?? []) as PatientRow[])
      .map(PatientMapper.fromDatabase);
  }

  /**
   * Returns a patient by id.
   */
  async getPatientById(
    patientId: string
  ): Promise<Patient | null> {

    const userId = await this.getCurrentUserId();

    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .eq("id", patientId)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      this.handleError(error);
    }

    if (!data) {
      return null;
    }

    return PatientMapper.fromDatabase(data as PatientRow);
  }

  /**
   * Finds a patient using full name and date of birth.
   *
   * Used to prevent duplicate patient creation.
   */
  async findPatientByNameAndDob(
    fullName: string,
    dateOfBirth: string
  ): Promise<Patient | null> {

    const userId = await this.getCurrentUserId();

    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "ACTIVE")
      .ilike("full_name", fullName.trim())
      .eq("date_of_birth", dateOfBirth)
      .maybeSingle();

    if (error) {
      this.handleError(error);
    }

    if (!data) {
      return null;
    }

    return PatientMapper.fromDatabase(data as PatientRow);
  }

  /**
   * Creates a new patient.
   */
  async createPatient(
    patient: Omit<
      Patient,
      "id" | "userId" | "createdAt" | "updatedAt"
    >
  ): Promise<Patient> {

    const userId = await this.getCurrentUserId();

    const payload = {
      user_id: userId,
      ...PatientMapper.toDatabase(patient)
    };

    const { data, error } = await supabase
      .from("patients")
      .insert(payload)
      .select()
      .single();

    if (error) {
      this.handleError(error);
    }

    return PatientMapper.fromDatabase(data as PatientRow);
  }

  /**
   * Updates an existing patient.
   */
  async updatePatient(
    patient: Patient
  ): Promise<Patient> {

    const payload = PatientMapper.toDatabase(patient);

    const { data, error } = await supabase
      .from("patients")
      .update(payload)
      .eq("id", patient.id)
      .eq("user_id", patient.userId)
      .select()
      .single();

    if (error) {
      this.handleError(error);
    }

    return PatientMapper.fromDatabase(data as PatientRow);
  }

  /**
   * Soft deletes a patient.
   *
   * Patients are never physically removed.
   */
  async deactivatePatient(
    patientId: string
  ): Promise<void> {

    const userId = await this.getCurrentUserId();

    const { error } = await supabase
      .from("patients")
      .update({
        status: "INACTIVE"
      })
      .eq("id", patientId)
      .eq("user_id", userId);

    if (error) {
      this.handleError(error);
    }
  }

}

export const patientRepository = new PatientRepository();