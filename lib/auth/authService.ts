import {
  User,
  Session,
  AuthChangeEvent,
} from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";

export class AuthService {

  /**
   * Registers a new user.
   *
   * The PostgreSQL trigger automatically creates
   * the profile in the users table.
   */
async register(
  fullName: string,
  email: string,
  password: string,
  familyMemberType: "PRIMARY" | "SECONDARY" | "OTHER",
  captchaToken: string
): Promise<{
  user: User;
  session: Session | null;
}> {

  const { data, error } =
    await supabase.auth.signUp({

      email,

      password,

options: {

  captchaToken,

  data: {

    full_name: fullName,

    family_member_type: familyMemberType

  }

}

    });

  if (error) {
    throw error;
  }

  if (!data.user) {
    throw new Error("Unable to create account.");
  }

  return {

    user: data.user,

    session: data.session

  };

}

  /**
   * Authenticates an existing Supabase identity so an
   * incomplete CareVR registration can be resumed.
   *
   * This does not establish CareVR authorization,
   * consent, invitation acceptance, or dashboard access.
   */
  async resumeRegistration(
    email: string,
    password: string,
    captchaToken: string
  ): Promise<User> {

    const response =
      await fetch(
        "/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            captchaToken,
          }),
        }
      );

    let result: {
      message?: string;
      user?: User;
      session?: Session;
    };

    try {
      result =
        await response.json();
    } catch {
      throw new Error(
        "Unable to resume registration."
      );
    }

    if (!response.ok) {
      throw new Error(
        result.message ??
        "Unable to resume registration."
      );
    }

    if (!result.user || !result.session) {
      throw new Error(
        "Unable to resume registration."
      );
    }

    const { error: sessionError } =
      await supabase.auth.setSession({
        access_token:
          result.session.access_token,
        refresh_token:
          result.session.refresh_token,
      });

    if (sessionError) {
      throw sessionError;
    }

    return result.user;
  }

  async enrollTOTP(): Promise<{
    id: string;
    type: "totp";
    totp: {
      qr_code: string;
      secret: string;
      uri: string;
    };
  }> {

    const { data: factors, error: listError } =
      await supabase.auth.mfa.listFactors();

    if (listError) {
      throw listError;
    }

    const existingTotpFactors =
      factors?.all?.filter(
        (factor) =>
          factor.factor_type === "totp"
      ) ?? [];

    const unverifiedTotpFactors =
      existingTotpFactors.filter(
        (factor) =>
          factor.status !== "verified"
      );

    for (const factor of unverifiedTotpFactors) {
      const { error: unenrollError } =
        await supabase.auth.mfa.unenroll({
          factorId: factor.id,
        });

      if (unenrollError) {
        throw unenrollError;
      }
    }

    const { data, error } =
      await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: "CareVR Authenticator",
      });

    if (error) {
      throw error;
    }

    if (!data?.id || !data.totp) {
      throw new Error("Unable to enroll TOTP.");
    }

    return {
      id: data.id,
      type: "totp",
      totp: {
        qr_code: data.totp.qr_code,
        secret: data.totp.secret,
        uri: data.totp.uri,
      },
    };
  }

  /**
   * Creates a TOTP challenge for an enrolled factor.
   */
  async challengeTOTP(
    factorId: string
  ): Promise<string> {

    const { data, error } =
      await supabase.auth.mfa.challenge({
        factorId,
      });

    if (error) {
      throw error;
    }

    if (!data?.id) {
      throw new Error("Unable to create TOTP challenge.");
    }

    return data.id;
  }

  /**
   * Verifies a TOTP code for an enrolled factor.
   */
  async verifyTOTP(
    factorId: string,
    challengeId: string,
    code: string
  ): Promise<void> {

    const { error } =
      await supabase.auth.mfa.verify({
        factorId,
        challengeId,
        code,
      });

    if (error) {
      throw error;
    }
  }

  /**
   * Enrolls a WebAuthn passkey as an MFA factor.
   *
   * The browser WebAuthn ceremony is handled by Supabase Auth.
   * This method does not alter CareVR authorization, consent,
   * invitation, or dashboard handling.
   */
  async enrollWebAuthn(
    friendlyName: string
  ) {
    const { data, error } =
      await supabase.auth.mfa.enroll({
        factorType: "webauthn",
        friendlyName,
      });

    if (error) {
      throw error;
    }

    if (!data?.id) {
      throw new Error(
        "Unable to enroll a CareVR passkey."
      );
    }

    return data;
  }

  /**
   * Creates a WebAuthn MFA challenge.
   *
   * Supabase Auth determines whether the ceremony is
   * credential creation or credential assertion.
   */
  async challengeWebAuthn(
    factorId: string
  ) {
    const { data, error } =
      await supabase.auth.mfa.challenge({
        factorId,
        webauthn: {
          rpId: window.location.hostname,
          rpOrigins: [window.location.origin],
        },
      });

    if (error) {
      throw error;
    }

    if (!data?.id) {
      throw new Error(
        "Unable to create a CareVR passkey challenge."
      );
    }

    return data;
  }

  /**
   * Verifies a WebAuthn MFA challenge.
   */
async verifyWebAuthn(
  params: {
    factorId: string;
    challengeId: string;
  } & import("@supabase/auth-js").MFAVerifyWebauthnParams
): Promise<void> {
  const { error } =
    await supabase.auth.mfa.verify(params);

  if (error) throw error;
}

async enrollAndVerifyWebAuthn(
  friendlyName: string
): Promise<void> {
  const { data, error } =
    await supabase.auth.mfa.webauthn.register({
      friendlyName,
      webauthn: {
        rpId: window.location.hostname,
        rpOrigins: [window.location.origin],
      },
    });

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error(
      "Unable to register your CareVR passkey."
    );
  }
}

async authenticateWebAuthn(factorId: string) {
  const { data, error } =
    await supabase.auth.mfa.webauthn.authenticate({
      factorId,
      webauthn: {
        rpId: window.location.hostname,
        rpOrigins: [window.location.origin],
      },
    });

  if (error) throw error;

  if (!data) {
    throw new Error(
      "Unable to authenticate with your CareVR passkey."
    );
  }

  return data;
}

  /**
   * Login.
  **/
async login(
  email: string,
  password: string,
  captchaToken: string
): Promise<User> {

  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      captchaToken,
    }),
  });

  let result: {
    message?: string;
    user?: User;
    session?: Session;
  };

  try {
    result = await response.json();
  } catch {
    throw new Error("Unable to login.");
  }

  if (!response.ok) {
    throw new Error(
      result.message || "Unable to login."
    );
  }

  if (!result.user || !result.session) {
    throw new Error("Invalid login.");
  }

  const { error: sessionError } =
    await supabase.auth.setSession({
      access_token: result.session.access_token,
      refresh_token: result.session.refresh_token,
    });

  if (sessionError) {
    throw sessionError;
  }

  return result.user;
}

/**
 * Sign in using Google OAuth.
 */
  async signInWithGoogle(
    selectedRole: "SELF" | "DOCTOR" | "CARETAKER" | "FAMILY"
  ): Promise<void> {
    const callbackUrl =
      `${window.location.origin}/auth/callback?role=${encodeURIComponent(selectedRole)}`;

    const { error } =
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: callbackUrl,
          queryParams: {
            prompt: "select_account",
          },
        },
      });

    if (error) throw error;
  }

  /**
   * Logout.
   */
  async logout(): Promise<void> {

    const { error } =
      await supabase.auth.signOut();

    if (error) {
      throw error;
    }

  }

  /**
   * Returns authenticated user.
   * Returns null when no session exists.
   */
  async getCurrentUser(): Promise<User | null> {

    const { data, error } =
      await supabase.auth.getUser();

    if (error) {

      if (error.name === "AuthSessionMissingError") {
        return null;
      }

      throw error;

    }

    return data.user;

  }

  /**
   * Returns authenticated user id.
   */
  async getCurrentUserId(): Promise<string> {

    const user =
      await this.getCurrentUser();

    if (!user) {
      throw new Error(
        "User is not authenticated."
      );
    }

    return user.id;

  }

  /**
   * Returns authenticated user.
   * Throws if unauthenticated.
   */
  async requireAuthenticatedUser(): Promise<User> {

    const user =
      await this.getCurrentUser();

    if (!user) {
      throw new Error(
        "Authentication required."
      );
    }

    return user;

  }

  /**
   * Returns true if user is logged in.
   */
  async isAuthenticated(): Promise<boolean> {

    const user =
      await this.getCurrentUser();

    return user !== null;

  }

  /**
   * Returns active session.
   */
  async getCurrentSession(): Promise<Session | null> {

    const { data, error } =
      await supabase.auth.getSession();

    if (error) {
      throw error;
    }

    return data.session;

  }

  /**
   * Refresh current session.
   */
  async refreshSession(): Promise<Session | null> {

    const { data, error } =
      await supabase.auth.refreshSession();

    if (error) {
      throw error;
    }

    return data.session;

  }

  /**
   * Sends password reset email.
   */
async requestPasswordReset(
  email: string,
  captchaToken: string
): Promise<void> {

  const redirectTo =
    `${window.location.origin}/reset-password`;

  const { error } =
    await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo,
        captchaToken,
      }
    );

  if (error) {
    throw error;
  }

}

  /**
   * Updates password for the active
   * password recovery session.
   */
  async updatePassword(
    newPassword: string
  ): Promise<void> {

    const { error } =
      await supabase.auth.updateUser({
        password: newPassword,
      });

    if (error) {
      throw error;
    }

  }

  /**
   * Listen for auth changes.
   */
  onAuthStateChange(
    callback: (
      event: AuthChangeEvent,
      session: Session | null
    ) => void
  ) {

    return supabase.auth.onAuthStateChange(
      callback
    );

  }

}

export const authService =
  new AuthService();