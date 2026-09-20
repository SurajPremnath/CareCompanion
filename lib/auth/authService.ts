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



/**
 * Returns whether the currently signed-in CareVR user
 * has at least one registered Supabase Passkey.
 *
 * The Supabase Passkey registry is the authoritative
 * source for this check. No CareVR database table
 * is required.
 */
async hasPasskey(): Promise<boolean> {

  const {
    data,
    error,
  } = await supabase.auth.passkey.list();

  if (error) {
    throw error;
  }

  return data.length > 0;
}

/**
 * Authenticates the currently signed-in CareVR user
 * with a registered Supabase Passkey.
 *
 * Passkey authentication is a complete WebAuthn
 * authentication ceremony. The caller must compare
 * the returned user ID with the identity established
 * by the preceding authentication step.
 */
async authenticatePasskey() {
  const { data, error } =
    await supabase.auth.signInWithPasskey();

  if (error) {
    throw error;
  }

  if (!data?.user) {
    throw new Error(
      "Unable to authenticate with your CareVR Passkey."
    );
  }

  return data.user;
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