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
   * A user may access a Patient either because the Patient
   * was registered by that user or because the user has an
   * explicit Family Member → Patient relationship.
   */
  async getPatients(): Promise<Patient[]> {

    const userId = await this.getCurrentUserId();

    //----------------------------------------------------
    // Patients registered by the current user
    //----------------------------------------------------

    const {
      data: ownedPatients,
      error: ownedPatientsError
    } = await supabase
      .from("patients")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "ACTIVE");

    if (ownedPatientsError) {
      this.handleError(ownedPatientsError);
    }

    //----------------------------------------------------
    // Patients explicitly linked to the current user
    //----------------------------------------------------

    const {
      data: relationships,
      error: relationshipsError
    } = await supabase
      .from("family_member_patient_relationships")
      .select("patient_id")
      .eq("user_id", userId);

    if (relationshipsError) {
      this.handleError(relationshipsError);
    }

    const relationshipPatientIds =
      (relationships ?? []).map(
        (relationship) => relationship.patient_id
      );

    //----------------------------------------------------
    // Load relationship-linked Patients
    //----------------------------------------------------

    let linkedPatients: PatientRow[] = [];

    if (relationshipPatientIds.length > 0) {

      const {
        data,
        error
      } = await supabase
        .from("patients")
        .select("*")
        .in("id", relationshipPatientIds)
        .eq("status", "ACTIVE");

      if (error) {
        this.handleError(error);
      }

      linkedPatients = (data ?? []) as PatientRow[];
    }

    //----------------------------------------------------
    // Combine both access paths without duplicates
    //----------------------------------------------------

    const patientsById = new Map<string, PatientRow>();

    for (const patient of (ownedPatients ?? []) as PatientRow[]) {
      patientsById.set(patient.id, patient);
    }

    for (const patient of linkedPatients) {
      patientsById.set(patient.id, patient);
    }

    return Array.from(patientsById.values())
      .sort((a, b) =>
        a.full_name.localeCompare(b.full_name)
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