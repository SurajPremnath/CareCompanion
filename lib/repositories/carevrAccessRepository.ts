import { supabase } from "@/lib/supabase";
import { BaseRepository } from "@/lib/repositories/BaseRepository";

export type CareVRLoginRole =
  | "SELF"
  | "DOCTOR"
  | "CARETAKER"
  | "FAMILY";

export type CareVRAccessType =
  | "PRIMARY"
  | "SECONDARY_FAMILY_MEMBER"
  | "CARETAKER"
  | "DOCTOR";

export interface ActiveCareVRAccess {
  id: string;
  userId: string;
  familyId: string | null;
  patientId: string | null;
  accessType: CareVRAccessType;
  accessStatus: "ACTIVE";
}

export interface CareVRPatientScope {
  scope: "SELF_ONLY" | "PATIENTS";
  patients: Array<{
    id: string;
    userId: string | null;
    fullName: string;
    relationship: string | null;
  }>;
}

export class CareVRAccessRepository extends BaseRepository {

  async createPrimaryAccess(userId: string): Promise<string> {
    const { data, error } = await supabase
      .from("carevr_access")
      .insert({
        user_id: userId,
        family_id: null,
        patient_id: null,
        access_type: "PRIMARY",
        access_status: "ACTIVE",
        granted_by: userId,
      })
      .select("id")
      .single();

    if (error) {
      this.handleError(error);
    }

    return data.id;
  }

  /**
   * Returns an ACTIVE CareVR access record that is valid
   * for the role selected at Login.
   *
   * Login role mapping:
   * SELF       -> PRIMARY
   * FAMILY     -> PRIMARY or SECONDARY_FAMILY_MEMBER
   * CARETAKER  -> CARETAKER
   * DOCTOR     -> DOCTOR
   *
   * This method only validates active role access.
   * Module permissions and Patient scope are checked separately.
   */
  async getActiveAccessForLoginRole(
    userId: string,
    selectedRole: CareVRLoginRole
  ): Promise<ActiveCareVRAccess | null> {

    const accessTypes: CareVRAccessType[] =
      selectedRole === "SELF"
        ? ["PRIMARY"]
        : selectedRole === "FAMILY"
          ? [
              "PRIMARY",
              "SECONDARY_FAMILY_MEMBER",
            ]
          : selectedRole === "CARETAKER"
            ? ["CARETAKER"]
            : ["DOCTOR"];

    const {
      data,
      error,
    } = await supabase
      .from("carevr_access")
      .select(`
        id,
        user_id,
        family_id,
        patient_id,
        access_type,
        access_status
      `)
      .eq("user_id", userId)
      .eq("access_status", "ACTIVE")
      .in("access_type", accessTypes)
      .limit(1)
      .maybeSingle();

    if (error) {
      this.handleError(error);
    }

    if (!data) {
      return null;
    }

    return {
      id: data.id,
      userId: data.user_id,
      familyId: data.family_id,
      patientId: data.patient_id,
      accessType: data.access_type as CareVRAccessType,
      accessStatus: "ACTIVE",
    };
  }

  async getPatientScope(
    access: ActiveCareVRAccess,
    selectedRole: CareVRLoginRole
  ): Promise<CareVRPatientScope> {

if (selectedRole === "SELF") {

  if (access.familyId) {

    const { data, error } = await supabase
      .from("patients")
      .select("id, user_id, full_name, relationship")
      .eq("family_id", access.familyId)
      .eq("status", "ACTIVE")
      .order("full_name");

    if (error) {
      this.handleError(error);
    }

    return {
      scope: "SELF_ONLY",
      patients: (data ?? []).map((patient) => ({
        id: patient.id,
        userId: patient.user_id,
        fullName: patient.full_name,
        relationship: patient.relationship,
      })),
    };
  }

  return {
    scope: "SELF_ONLY",
    patients: [],
  };
}

    if (access.patientId) {
      const { data, error } = await supabase
        .from("patients")
        .select("id, user_id, full_name, relationship")
        .eq("id", access.patientId)
        .eq("status", "ACTIVE")
        .maybeSingle();

      if (error) {
        this.handleError(error);
      }

      return {
        scope: data ? "PATIENTS" : "PATIENTS",
        patients: data
          ? [
              {
                id: data.id,
                userId: data.user_id,
                fullName: data.full_name,
                relationship: data.relationship,
              },
            ]
          : [],
      };
    }

    if (access.familyId) {
      const { data, error } = await supabase
        .from("patients")
        .select("id, user_id, full_name, relationship")
        .eq("family_id", access.familyId)
        .eq("status", "ACTIVE")
        .order("full_name");

      if (error) {
        this.handleError(error);
      }

      return {
        scope: "PATIENTS",
        patients: (data ?? []).map((patient) => ({
          id: patient.id,
          userId: patient.user_id,
          fullName: patient.full_name,
          relationship: patient.relationship,
        })),
      };
    }

    return {
      scope: "PATIENTS",
      patients: [],
    };
  }


}

export const carevrAccessRepository =
  new CareVRAccessRepository();