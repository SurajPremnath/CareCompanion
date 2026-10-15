import { SelfProfile } from "../selfProfile";
import { StorageResult } from "./storageResult";

import { selfProfileRepository } from "../repositories/SelfProfileRepository";
import type { Result } from "@/lib/types/result";

class SelfProfileStorage {

  //------------------------------------------------------
  // Save Self Profile
  //------------------------------------------------------

  async saveProfile(
    profile: Omit<
      SelfProfile,
      "id" |
      "userId" |
      "createdAt" |
      "updatedAt"
    >
  ): Promise<Result<SelfProfile>> {

    try {

      //--------------------------------------------------
      // Check if profile already exists
      //--------------------------------------------------

      const existingProfile =
        await selfProfileRepository.getSelfProfile();

      if (existingProfile) {

        return StorageResult.failure(

          "PROFILE_ALREADY_EXISTS",

          "Your Personal Health Profile already exists."

        );

      }

      //--------------------------------------------------
      // Save
      //--------------------------------------------------

      const savedProfile =
        await selfProfileRepository.createSelfProfile(
          profile
        );

      return StorageResult.success(

        savedProfile,

        "Personal Health Profile created successfully."

      );

    }
    catch (error) {

      return StorageResult.failure(

        "PROFILE_SAVE_FAILED",

        "Unable to save Personal Health Profile.",

        error

      );

    }

  }

  //------------------------------------------------------
  // Get Profile
  //------------------------------------------------------

  async getProfile(): Promise<Result<SelfProfile>> {

    try {

      const profile =
        await selfProfileRepository.getSelfProfile();

      if (!profile) {

        return StorageResult.failure(

          "PROFILE_NOT_FOUND",

          "Personal Health Profile not found."

        );

      }

      return StorageResult.success(profile);

    }
    catch (error) {

      return StorageResult.failure(

        "PROFILE_LOAD_FAILED",

        "Unable to load Personal Health Profile.",

        error

      );

    }

}

  //------------------------------------------------------
  // Profile Exists
  //------------------------------------------------------

async profileExists(): Promise<boolean> {

  try {

    const profile =
      await selfProfileRepository.getSelfProfile();

    return profile !== null;

  }
  catch {

    return false;

  }

}

  //------------------------------------------------------
  // Update Profile
  //------------------------------------------------------

  async updateProfile(
    profile: SelfProfile
  ): Promise<Result<SelfProfile>> {

    try {

      const updated =
        await selfProfileRepository.updateSelfProfile(
          profile
        );

      return StorageResult.success(

        updated,

        "Personal Health Profile updated successfully."

      );

    }
    catch (error) {

      return StorageResult.failure(

        "PROFILE_UPDATE_FAILED",

        "Unable to update Personal Health Profile.",

        error

      );

    }

  }

}

export const selfProfileStorage =
  new SelfProfileStorage();