import { supabase } from "../supabase";
import { BaseRepository } from "./BaseRepository";
import { Profile } from "../types/profile";
import { authService } from "../auth/authService";

export class ProfileRepository extends BaseRepository {

  /**
   * Returns the currently authenticated user's profile.
   */
  async getCurrentProfile(): Promise<Profile | null> {

    const user = await authService.getCurrentUser();

    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {

      if (error.code === "PGRST116") {
        return null;
      }

      this.handleError(error);
    }

return {
  id: data.id,
  email: data.email,
  fullName: data.full_name,
  role: data.role,
  createdAt: data.created_at,
  updatedAt: data.updated_at
};
  }

  /**
   * Updates the current user's profile.
   */
  async updateProfile(fullName: string): Promise<Profile> {

    const userId = await this.getCurrentUserId();

    const { data, error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      this.handleError(error);
    }

return {
  id: data.id,
  email: data.email,
  fullName: data.full_name,
  role: data.role,
  createdAt: data.created_at,
  updatedAt: data.updated_at
};
  }

}

export const profileRepository = new ProfileRepository();