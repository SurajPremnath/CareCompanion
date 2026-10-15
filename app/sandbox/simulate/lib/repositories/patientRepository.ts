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
  // Resolve the Family for the authenticated user.
  //
  // PRIMARY users resolve their Family through
  // family_memberships.
  //
  // Invited CareVR users may not have a
  // family_memberships row. Their authorized Family is
  // established through the active carevr_access record.
  //------------------------------------------------------

  let familyId =
    membership?.family_id ?? null;

  if (!familyId) {
    const {
      data: access,
      error: accessError
    } = await supabase
      .from("carevr_access")
      .select("family_id")
      .eq("user_id", userId)
      .eq("access_status", "ACTIVE")
      .not("family_id", "is", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (accessError) {
      this.handleError(accessError);
    }

    familyId =
      access?.family_id ?? null;
  }

  //------------------------------------------------------
  // No established or authorized Family means there are
  // no Family Patients to return.
  //------------------------------------------------------

  if (!familyId) {
    return [];
  }

  //------------------------------------------------------
  // Retrieve all active Patients belonging to the
  // resolved Family.
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
    .eq("family_id", familyId)
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
  patientId: string,
  familyId?: string
): Promise<Patient | null> {

  let query = supabase
    .from("patients")
    .select("*")
    .eq("id", patientId)
    .eq("status", "ACTIVE");

  if (familyId) {

    query = query
      .eq("family_id", familyId);

  } else {

    const userId =
      await this.getCurrentUserId();

    query = query
      .eq("user_id", userId);

  }

  const { data, error } =
    await query.maybeSingle();

  if (error) {
    this.handleError(error);
  }

  if (!data) {
    return null;
  }

  return PatientMapper.fromDatabase(
    data as PatientRow
  );
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
  patient: Omit<Patient, "id" | "userId" | "createdAt" | "updatedAt">
): Promise<Patient> {

  const userId =
    await this.getCurrentUserId();

  //------------------------------------------------------
  // Resolve Family from the authenticated user's
  // active PRIMARY CareVR access.
  //
  // The Family ID is authoritative from carevr_access.
  // It is not supplied by the UI.
  //------------------------------------------------------

  const {
    data: access,
    error: accessError
  } = await supabase
    .from("carevr_access")
    .select("family_id")
    .eq("user_id", userId)
    .eq("access_type", "PRIMARY")
    .eq("access_status", "ACTIVE")
    .not("family_id", "is", null)
    .limit(1)
    .maybeSingle();

  if (accessError) {

    this.handleError(accessError);

  }

  if (!access?.family_id) {

    throw new Error(
      "Active PRIMARY CareVR Family could not be resolved."
    );

  }

  //------------------------------------------------------
  // Create Patient directly in the existing Family.
  //------------------------------------------------------

  const payload = {

    user_id:
      userId,

    family_id:
      access.family_id,

    ...PatientMapper.toDatabase(patient)

  };

  const {
    data,
    error
  } = await supabase
    .from("patients")
    .insert(payload)
    .select()
    .single();

  if (error) {

    this.handleError(error);

  }

  return PatientMapper.fromDatabase(
    data as PatientRow
  );
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