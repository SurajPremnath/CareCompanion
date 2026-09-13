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

  async enrollTOTP(): Promise<{
    id: string;
    type: "totp";
    totp: {
      qr_code: string;
      secret: string;
      uri: string;
    };
  }> {
    const { data, error } = await supabase.auth.mfa.enroll({
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
   * Login.
   */
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
   * Returns the MFA state required for login.
   *
   * No TOTP secret or enrollment data is exposed.
   */
  async getTOTPLoginStatus(): Promise<{
    requiresMFA: boolean;
    factorId: string | null;
  }> {

    const { data, error } =
      await supabase.auth.mfa.listFactors();

    if (error) {
      throw error;
    }

    const totpFactor =
      data?.totp?.find(
        (factor) =>
          factor.status === "verified"
      );

    return {
      requiresMFA: Boolean(totpFactor),
      factorId: totpFactor?.id ?? null,
    };
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