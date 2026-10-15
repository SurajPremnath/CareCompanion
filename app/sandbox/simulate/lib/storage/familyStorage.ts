import { familyRepository } from "../repositories/familyRepository";
import { supabase } from "../supabase";
import type { Result } from "@/lib/types/result";
import { StorageResult } from "./storageResult";

class FamilyStorage {

  /**
   * Establishes or retrieves the Primary's Family
   * and associates the saved Patient with it.
   */
  async savePatientToFamily(
    patientId: string,
    relationship: string
  ): Promise<Result<void>> {

    try {

      //------------------------------------------------------
      // Get existing Family or create a new Family.
      //------------------------------------------------------

      const familyId =
        await familyRepository.getOrCreateFamilyForPrimary();

      //------------------------------------------------------
      // Associate Patient with Family.
      //------------------------------------------------------

      const { error: patientError } = await supabase
        .from("patients")
        .update({
          family_id: familyId
        })
        .eq("id", patientId);

      if (patientError) {
        throw patientError;
      }

      //------------------------------------------------------
      // Associate Primary's CareVR access with Family.
      //------------------------------------------------------

      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData.user) {
        throw userError ?? new Error("Authenticated user not found.");
      }

      const { error: accessError } = await supabase
        .from("carevr_access")
        .update({
          family_id: familyId
        })
        .eq("user_id", userData.user.id)
        .eq("access_type", "PRIMARY")
        .eq("access_status", "ACTIVE");

      if (accessError) {
        throw accessError;
      }

      //------------------------------------------------------
      // Create Primary → Patient Family relationship.
      //------------------------------------------------------

      const { error: relationshipError } = await supabase
        .from("family_member_patient_relationships")
        .insert({
          family_id: familyId,
          user_id: userData.user.id,
          patient_id: patientId,
          relationship
        });

      if (relationshipError) {
        throw relationshipError;
      }

      return StorageResult.success(
        undefined,
        "Patient added to Family successfully."
      );

    }
    catch (error) {

      console.error(error);

      return StorageResult.failure(
        "FAMILY_SAVE_FAILED",
        "Unable to add patient to Family.",
        error
      );

    }
  }
}

export const familyStorage =
  new FamilyStorage();