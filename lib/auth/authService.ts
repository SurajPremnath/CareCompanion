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
    password: string
  ): Promise<{
    user: User;
    session: Session | null;
  }> {

    const { data, error } =
      await supabase.auth.signUp({

        email,

        password,

        options: {

          data: {

            full_name: fullName

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
   * Login.
   */
  async login(
    email: string,
    password: string
  ): Promise<User> {

    const { data, error } =
      await supabase.auth.signInWithPassword({

        email,

        password

      });

    if (error) {
      throw error;
    }

    if (!data.user) {
      throw new Error("Invalid login.");
    }

    return data.user;

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