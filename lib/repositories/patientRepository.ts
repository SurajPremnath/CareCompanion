import { supabase } from "../supabase";
import { BaseRepository } from "./BaseRepository";
import { Patient } from "../types/patient";
import { PatientRow } from "../database";
import { PatientMapper } from "../mappers/PatientMapper";

interface PatientAccess {

  role: "STANDARD" | "FAMILY" | "ADMIN";

  patientCount: number;

}

export class PatientRepository extends BaseRepository {

/**
 * Returns all active patients available to the
 * currently authenticated user.
 *
 * A user may have patients through direct ownership
 * or through an explicit family-member/patient relationship.
 * Both paths are combined and de-duplicated by patient id.
 */
async getPatients(): Promise<Patient[]> {

  const userId = await this.getCurrentUserId();

  //------------------------------------------------------
  // Determine the Family of the currently authenticated
  // user. Once a Family is established, Family Patient
  // retrieval is governed by family_id.
  //------------------------------------------------------

  const {
    data: membership,
    error: membershipError
  } = await supabase
    .from("family_memberships")
    .select("family_id")
    .eq("user_id", userId)
    .eq("status", "ACTIVE")
    .maybeSingle();

  if (membershipError) {
    this.handleError(membershipError);
  }

  //------------------------------------------------------
  // No established Family means there are no Family
  // Patients to return.
  //------------------------------------------------------

  if (!membership?.family_id) {
    return [];
  }

  //------------------------------------------------------
  // Retrieve all active Patients belonging to the
  // authenticated user's established Family.
  //
  // Family mode is governed by patients.family_id,
  // not patients.user_id.
  //------------------------------------------------------

  const {
    data,
    error
  } = await supabase
    .from("patients")
    .select("*")
    .eq("family_id", membership.family_id)
    .eq("status", "ACTIVE");


  if (error) {
    this.handleError(error);
  }

  //------------------------------------------------------
  // Return a stable, alphabetically ordered result.
  //------------------------------------------------------

  return ((data ?? []) as PatientRow[])
    .sort((a, b) =>
      a.full_name.localeCompare(
        b.full_name
      )
    )
    .map(PatientMapper.fromDatabase);
}

async getPatientAccess(): Promise<PatientAccess> {

  const userId =
    await this.getCurrentUserId();

  //----------------------------------------------------
  // Load role
  //----------------------------------------------------

  const {
    data: profile,
    error: profileError
  } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (profileError) {

    this.handleError(profileError);

  }

  //----------------------------------------------------
  // Count active patients
  //----------------------------------------------------

  const {
    count,
    error: countError
  } = await supabase
    .from("patients")
    .select("*", {
      count: "exact",
      head: true
    })
    .eq("user_id", userId)
    .eq("status", "ACTIVE");

  if (countError) {

    this.handleError(countError);

  }

  return {

    role:
      (profile?.role ??
        "STANDARD") as PatientAccess["role"],

    patientCount:
      count ?? 0

  };

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