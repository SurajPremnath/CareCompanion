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
 * Validates a CareVR Passkey for the user who has
 * already completed the first authentication factor.
 *
 * The first-factor user is established before this method
 * is called. Only Passkeys registered to that user are
 * allowed in the WebAuthn ceremony.
 */
async validatePasskeyForUser(
  captchaToken: string,
  expectedUserId: string
) {
  const {
    data: currentUserData,
    error: currentUserError,
  } = await supabase.auth.getUser();

  if (currentUserError) {
    throw currentUserError;
  }

  if (
    !currentUserData?.user ||
    currentUserData.user.id !== expectedUserId
  ) {
    throw new Error(
      "CareVR Passkey identity could not be verified."
    );
  }

  const {
    data: passkeys,
    error: passkeyListError,
  } =
    await supabase.auth.passkey.list();

  if (passkeyListError) {
    throw passkeyListError;
  }

  if (!passkeys.length) {
    throw new Error(
      "No CareVR Passkey is registered for this user."
    );
  }

  const {
    data: authenticationOptions,
    error: startError,
  } =
    await supabase.auth.passkey.startAuthentication({
      options: {
        captchaToken,
      },
    });

  if (startError) {
    throw startError;
  }

  if (
    !authenticationOptions?.options
  ) {
    throw new Error(
      "Unable to obtain CareVR Passkey authentication options."
    );
  }

  const serverOptions =
    authenticationOptions.options;

  const allowCredentials =
    passkeys.map((passkey) => ({
      id: passkey.id,
      type: "public-key" as const,
    }));

  let publicKeyOptions:
    PublicKeyCredentialRequestOptions;

  if (
    typeof PublicKeyCredential !==
      "undefined" &&
    "parseRequestOptionsFromJSON" in
      PublicKeyCredential &&
    typeof (
      PublicKeyCredential as typeof PublicKeyCredential & {
        parseRequestOptionsFromJSON?: (
          options: unknown
        ) => PublicKeyCredentialRequestOptions;
      }
    ).parseRequestOptionsFromJSON ===
      "function"
  ) {
    publicKeyOptions =
      (
        PublicKeyCredential as typeof PublicKeyCredential & {
          parseRequestOptionsFromJSON: (
            options: unknown
          ) => PublicKeyCredentialRequestOptions;
        }
      ).parseRequestOptionsFromJSON({
        ...serverOptions,
        allowCredentials,
        userVerification: "required",
      });
  } else {
    throw new Error(
      "This browser does not support the required WebAuthn Passkey API."
    );
  }

  const credential =
    await navigator.credentials.get({
      publicKey: publicKeyOptions,
    });

  if (
    !credential ||
    !(
      credential instanceof
      PublicKeyCredential
    )
  ) {
    throw new Error(
      "CareVR Passkey authentication was not completed."
    );
  }

  const credentialJson =
    typeof credential.toJSON ===
      "function"
      ? credential.toJSON()
      : null;

  if (!credentialJson) {
    throw new Error(
      "Unable to serialize the CareVR Passkey response."
    );
  }

  const {
    data: verificationData,
    error: verificationError,
  } =
    await supabase.auth.passkey.verifyAuthentication(
      {
        challengeId:
          authenticationOptions.challenge_id,
        credential:
          credentialJson,
      }
    );

  if (verificationError) {
    throw verificationError;
  }

  if (
    !verificationData?.user
  ) {
    throw new Error(
      "CareVR Passkey authentication did not return a user."
    );
  }

  if (
    verificationData.user.id !==
    expectedUserId
  ) {
    await supabase.auth.signOut();

    throw new Error(
      "The CareVR Passkey does not belong to the authenticated user."
    );
  }

  return verificationData.user;
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