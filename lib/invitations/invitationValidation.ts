import { supabase } from "@/lib/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Result } from "@/lib/types/result";

export type InvitationRole =
  | "SECONDARY_FAMILY_MEMBER"
  | "CARETAKER"
  | "DOCTOR";

export interface InvitationModuleRequest {
  module: string;
  permission: "VIEW" | "CONTRIBUTE" | "ADMIN";
}

export interface InvitationValidationInput {
  email: string;
  role: InvitationRole;
  modules: InvitationModuleRequest[];
}

export interface InvitationValidationData {
  familyId: string;
  userId: string;
  governanceId: string;
  governanceVersion: string;
permittedModules: Array<{
  id: string;
  module: string;
  requestedPermission: "VIEW" | "CONTRIBUTE" | "ADMIN";
  permittedPermission: "VIEW" | "CONTRIBUTE" | "ADMIN";
}>;
  invitationAttemptNumber: number;
}

class InvitationValidation {

async validate(
  input: InvitationValidationInput,
  client: SupabaseClient = supabase
): Promise<Result<InvitationValidationData>> {

    // ----------------------------------------------------------
    // 1. Validate authenticated user.
    // ----------------------------------------------------------

const {
  data: { user },
  error: userError
} = await client.auth.getUser();

if (userError) {
  if (userError.name === "AuthSessionMissingError") {
    return {
      success: false,
      code: "AUTHENTICATION_REQUIRED",
      message: "Authentication is required to create an invitation."
    };
  }

  throw userError;
}

if (!user) {
  return {
    success: false,
    code: "AUTHENTICATION_REQUIRED",
    message: "Authentication is required to create an invitation."
  };
}

    // ----------------------------------------------------------
    // 2. Validate Primary profile.
    // ----------------------------------------------------------

    const { data: profile, error: profileError } = await client
      .from("profiles")
      .select("id, family_member_type")
      .eq("id", user.id)
      .single();

    if (profileError) {
      throw profileError;
    }

    if (profile.family_member_type !== "PRIMARY") {
      return {
        success: false,
        code: "PRIMARY_REQUIRED",
        message: "Only the Primary family member can create an invitation."
      };
    }

    // ----------------------------------------------------------
    // 3. Validate invitee email.
    // ----------------------------------------------------------

    const email = input.email.trim().toLowerCase();

    if (!email) {
      return {
        success: false,
        code: "EMAIL_REQUIRED",
        message: "Invitee email is required."
      };
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return {
        success: false,
        code: "INVALID_EMAIL",
        message: "Please enter a valid invitee email address."
      };
    }

    // ----------------------------------------------------------
    // 4. Validate invitation role.
    // ----------------------------------------------------------

    const allowedRoles: InvitationRole[] = [
      "SECONDARY_FAMILY_MEMBER",
      "CARETAKER",
      "DOCTOR"
    ];

    if (!allowedRoles.includes(input.role)) {
      return {
        success: false,
        code: "INVALID_INVITATION_ROLE",
        message: "The selected invitation role is not permitted."
      };
    }

    // ----------------------------------------------------------
    // 5. Resolve the Primary's existing Family.
    //
    // Do NOT create a Family here.
    // Invitation creation requires an established Family.
    // ----------------------------------------------------------

    const { data: membership, error: membershipError } = await client
      .from("family_memberships")
      .select("family_id")
      .eq("user_id", user.id)
      .eq("status", "ACTIVE")
      .maybeSingle();

    if (membershipError) {
      throw membershipError;
    }

    if (!membership?.family_id) {
      return {
        success: false,
        code: "FAMILY_REQUIRED",
        message: "A Family must be established before creating an invitation."
      };
    }

    const familyId = membership.family_id;

    // ----------------------------------------------------------
    // 6. Resolve the active Care Family governance policy.
    // ----------------------------------------------------------

    const { data: governance, error: governanceError } = await client
      .from("carevr_access_governance")
      .select("id, version")
      .eq("access_type", "CARE_FAMILY")
      .lte("effective_at", new Date().toISOString())
      .order("effective_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (governanceError) {
      throw governanceError;
    }

    if (!governance) {
      return {
        success: false,
        code: "GOVERNANCE_NOT_FOUND",
        message: "No active Care Family governance policy is available."
      };
    }

    // ----------------------------------------------------------
    // 7. Get permitted modules for the selected role.
    // ----------------------------------------------------------

    const { data: governanceModules, error: modulesError } = await client
      .from("carevr_access_governance_modules")
      .select("id, module, permission")
      .eq("carevr_access_governance_id", governance.id)
      .eq("role", input.role)
      .eq("status", "ACTIVE");

    if (modulesError) {
      throw modulesError;
    }

    if (!governanceModules || governanceModules.length === 0) {
      return {
        success: false,
        code: "ROLE_GOVERNANCE_NOT_FOUND",
        message: "No active governance configuration exists for the selected role."
      };
    }

    // ----------------------------------------------------------
    // 8. Validate requested modules against governance.
    // ----------------------------------------------------------

    const permittedModules = input.modules.map((requested) => {

      const permitted = governanceModules.find(
        (module) =>
          module.module === requested.module
      );

      if (!permitted) {
        throw new Error(
          `Module "${requested.module}" is not permitted for the selected role.`
        );
      }

      const permissionRank = {
        VIEW: 1,
        CONTRIBUTE: 2,
        ADMIN: 3
      };

      if (
        permissionRank[requested.permission] >
        permissionRank[permitted.permission as "VIEW" | "CONTRIBUTE" | "ADMIN"]
      ) {
        throw new Error(
          `Permission "${requested.permission}" exceeds the permitted governance level for module "${requested.module}".`
        );
      }

return {
  id: permitted.id,
  module: permitted.module,
  requestedPermission:
    requested.permission,
  permittedPermission:
    permitted.permission as
      | "VIEW"
      | "CONTRIBUTE"
      | "ADMIN"
};
    });

    // ----------------------------------------------------------
    // 9. Check existing invitations for:
    //
    // Family + invitee email + role
    // ----------------------------------------------------------

    const { data: existingInvitations, error: invitationError } =
      await client
        .from("carevr_invitation")
        .select(
          "id, invitation_attempt_number, status, created_at, sent_at, expires_at"
        )
        .eq("family_id", familyId)
        .eq("invited_email", email)
        .eq("role", input.role)
        .order("created_at", { ascending: false });

    if (invitationError) {
      throw invitationError;
    }

    const latestInvitation = existingInvitations?.[0];

    // ----------------------------------------------------------
    // 10. Evaluate latest invitation.
    // ----------------------------------------------------------

    if (latestInvitation) {

      const now = new Date();
      const expiresAt = new Date(latestInvitation.expires_at);

      if (
        latestInvitation.status === "PENDING" &&
        expiresAt > now
      ) {
        return {
          success: false,
          code: "INVITATION_ALREADY_ACTIVE",
          message:
            `An invitation for this person and role is already active. ` +
            `The existing invitation was created on ${new Date(
              latestInvitation.created_at
            ).toLocaleString()}.`
        };
      }

      if (latestInvitation.status === "ACCEPTED") {
        return {
          success: false,
          code: "INVITATION_ALREADY_ACCEPTED",
          message:
            "This person has already accepted an invitation for this role."
        };
      }
    }

    // ----------------------------------------------------------
    // 11. Determine next invitation attempt number.
    // ----------------------------------------------------------

    const invitationAttemptNumber =
      latestInvitation
        ? latestInvitation.invitation_attempt_number + 1
        : 1;

    // ----------------------------------------------------------
    // 12. Validation passed.
    //
    // No password is generated here.
    // No invitation is created here.
    // ----------------------------------------------------------

    return {
      success: true,
      data: {
        familyId,
        userId: user.id,
        governanceId: governance.id,
        governanceVersion: governance.version,
        permittedModules,
        invitationAttemptNumber
      },
      message: "Invitation validation passed."
    };
  }
}

export const invitationValidation =
  new InvitationValidation();