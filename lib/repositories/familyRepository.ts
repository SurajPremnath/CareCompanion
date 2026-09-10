import { supabase } from "../supabase";
import { BaseRepository } from "./BaseRepository";

export class FamilyRepository extends BaseRepository {
  async getOrCreateFamilyForPrimary(): Promise<string> {
    const userId = await this.getCurrentUserId();

    // Return the Primary's existing active Family.
    const { data: membership, error: membershipError } = await supabase
      .from("family_memberships")
      .select("family_id")
      .eq("user_id", userId)
      .eq("status", "ACTIVE")
      .maybeSingle();

    if (membershipError) {
      this.handleError(membershipError);
    }

    if (membership?.family_id) {
      return membership.family_id;
    }

    // No Family exists yet — create one for the Primary.
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", userId)
      .single();

    if (profileError) {
      this.handleError(profileError);
    }

    const familyName = `${profile.full_name.trim()}'s Family`;

    const { data: family, error: familyError } = await supabase
      .from("families")
      .insert({
        name: familyName,
        created_by: userId,
        status: "ACTIVE",
      })
      .select("id")
      .single();

    if (familyError) {
      this.handleError(familyError);
    }

    // Establish the Primary's membership in the new Family.
    const { error: newMembershipError } = await supabase
      .from("family_memberships")
      .insert({
        family_id: family.id,
        user_id: userId,
        role: "ADMIN",
        status: "ACTIVE",
      });

    if (newMembershipError) {
      this.handleError(newMembershipError);
    }

    return family.id;
  }
}

export const familyRepository = new FamilyRepository();