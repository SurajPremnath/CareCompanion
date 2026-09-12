import { supabase } from "../supabase";
import { BaseRepository } from "./BaseRepository";

export class FamilyRepository extends BaseRepository {
async getOrCreateFamilyForPrimary(): Promise<string> {
  const userId =
    await this.getCurrentUserId();

  //------------------------------------------------------
  // Resolve the Primary's authoritative Family from
  // active PRIMARY CareVR access.
  //
  // Family is created during Primary registration.
  // Patient registration must never create another Family.
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

  const familyId =
    access.family_id;

  //------------------------------------------------------
  // Establish the Primary's membership in the existing
  // Family if it does not already exist.
  //
  // The Family ID comes directly from carevr_access.
  // No new Family is created here.
  //------------------------------------------------------

  const {
    data: membership,
    error: membershipError
  } = await supabase
    .from("family_memberships")
    .select("id")
    .eq("family_id", familyId)
    .eq("user_id", userId)
    .eq("status", "ACTIVE")
    .maybeSingle();

  if (membershipError) {

    this.handleError(membershipError);

  }

  if (!membership) {

    const {
      error: newMembershipError
    } = await supabase
      .from("family_memberships")
      .insert({
        family_id: familyId,
        user_id: userId,
        role: "ADMIN",
        status: "ACTIVE",
      });

    if (newMembershipError) {

      this.handleError(
        newMembershipError
      );

    }

  }

  //------------------------------------------------------
  // Return the same authoritative Family ID.
  //------------------------------------------------------

  return familyId;
}
}

export const familyRepository = new FamilyRepository();