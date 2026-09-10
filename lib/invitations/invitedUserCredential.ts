import { supabaseAdmin } from "@/lib/supabaseAdmin";

export type InvitedUserCredentialRole =
  | "SECONDARY_FAMILY_MEMBER"
  | "CARETAKER"
  | "DOCTOR";

export interface CreateInvitedUserCredentialInput {
  email: string;
  temporaryPassword: string;
  temporaryPasswordExpiresAt: string;
  role: InvitedUserCredentialRole;
}

export interface ReplaceInvitedUserCredentialInput {
  email: string;
  temporaryPassword: string;
  temporaryPasswordExpiresAt: string;
}

export interface InvitedUserCredentialResult {
  userId: string;
  email: string;
}

function deriveFullNameFromEmail(
  email: string
): string {
  const localPart =
    email
      .split("@")[0]
      ?.trim() ?? "";

  const parts =
    localPart
      .replace(/[._-]+/g, " ")
      .split(/\s+/)
      .filter(Boolean);

  return parts
    .map(
      (part) =>
        part.charAt(0).toUpperCase() +
        part.slice(1)
    )
    .join(" ");
}

class InvitedUserCredential {

  /**
   * Creates the Supabase Auth account for a new invited user.
   *
   * Supabase Auth remains the authoritative store for the
   * authentication credential. The plaintext temporary password
   * is never persisted in CareVR database tables.
   *
   * The existing auth.users INSERT trigger creates the
   * corresponding profiles row.
   */
  async create(
    input: CreateInvitedUserCredentialInput
  ): Promise<InvitedUserCredentialResult> {

    const email =
      input.email
        .trim()
        .toLowerCase();

    const familyMemberType =
      input.role ===
        "SECONDARY_FAMILY_MEMBER"
        ? "SECONDARY"
        : "OTHER";

    const fullName =
      deriveFullNameFromEmail(email);

    const {
      data,
      error
    } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password:
          input.temporaryPassword,
        email_confirm: true,
        user_metadata: {
          full_name:
            fullName,

          family_member_type:
            familyMemberType
        }
      });

    if (error) {
      throw new Error(
        error.message ||
        "Unable to create the invited user's authentication account."
      );
    }

    if (!data.user?.id) {
      throw new Error(
        "Invited user authentication account was not created."
      );
    }

    const {
      error: profileError
    } =
      await supabaseAdmin
        .from("profiles")
        .update({
          temporary_password_issued_at:
            new Date().toISOString(),

          temporary_password_expires_at:
            input.temporaryPasswordExpiresAt
        })
        .eq(
          "id",
          data.user.id
        );

    if (profileError) {
      throw new Error(
        profileError.message ||
        "Unable to initialize the invited user's password lifecycle."
      );
    }

    return {
      userId:
        data.user.id,

      email
    };
  }


  /**
   * Replaces the authentication credential for an existing
   * invited user during invitation regeneration.
   *
   * The previous temporary password is replaced in Supabase Auth.
   * The plaintext password is never stored in CareVR tables.
   */
  async replace(
    input: ReplaceInvitedUserCredentialInput
  ): Promise<InvitedUserCredentialResult> {

    const email =
      input.email
        .trim()
        .toLowerCase();

    const {
      data: users,
      error: listError
    } =
      await supabaseAdmin.auth.admin.listUsers();

    if (listError) {
      throw new Error(
        listError.message ||
        "Unable to locate the invited user's authentication account."
      );
    }

    const user =
      users.users.find(
        (candidate) =>
          candidate.email
            ?.trim()
            .toLowerCase() ===
          email
      );

    if (!user?.id) {
      throw new Error(
        "The invited user's authentication account could not be found."
      );
    }

    const {
      data,
      error
    } =
      await supabaseAdmin.auth.admin.updateUserById(
        user.id,
        {
          password:
            input.temporaryPassword
        }
      );

    if (error) {
      throw new Error(
        error.message ||
        "Unable to replace the invited user's temporary password."
      );
    }

    if (!data.user?.id) {
      throw new Error(
        "The invited user's authentication credential was not updated."
      );
    }

    const {
      error: profileError
    } =
      await supabaseAdmin
        .from("profiles")
        .update({
          temporary_password_issued_at:
            new Date().toISOString(),

          temporary_password_expires_at:
            input.temporaryPasswordExpiresAt
        })
        .eq(
          "id",
          data.user.id
        );

    if (profileError) {
      throw new Error(
        profileError.message ||
        "Unable to update the invited user's password lifecycle."
      );
    }

    return {
      userId:
        data.user.id,

      email
    };
  }

  /**
   * Removes a newly-created invited user's authentication account
   * when invitation creation cannot be completed.
   *
   * This is a compensating cleanup operation. It is intentionally
   * limited to the Auth account created by the invitation flow.
   */
  async remove(
    userId: string
  ): Promise<{
    error: Error | null;
  }> {

    const {
      error
    } =
      await supabaseAdmin.auth.admin.deleteUser(
        userId
      );

    if (error) {
      return {
        error:
          new Error(
            error.message ||
            "Unable to remove the invited user's authentication account."
          )
      };
    }

    return {
      error:
        null
    };
  }

}

export const invitedUserCredential =
  new InvitedUserCredential();