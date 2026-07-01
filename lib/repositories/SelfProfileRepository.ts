import { supabase } from "../supabase";
import { BaseRepository } from "./BaseRepository";

import { SelfProfile } from "../selfProfile";
import { SelfProfileRow } from "../database";
import { SelfProfileMapper } from "../mappers/SelfProfileMapper";

export class SelfProfileRepository extends BaseRepository {

  //----------------------------------------------------
  // Get Self Profile
  //----------------------------------------------------

  async getSelfProfile(): Promise<SelfProfile | null> {

    const userId =
      await this.getCurrentUserId();

    const {
      data,
      error
    } = await supabase
      .from("self_profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {

      this.handleError(error);

    }

    if (!data) {

      return null;

    }

    return SelfProfileMapper.fromDatabase(
      data as SelfProfileRow
    );

  }

  //----------------------------------------------------
  // Create Self Profile
  //----------------------------------------------------

  async createSelfProfile(
    profile: Omit<
      SelfProfile,
      "id" |
      "userId" |
      "createdAt" |
      "updatedAt"
    >
  ): Promise<SelfProfile> {

    const userId =
      await this.getCurrentUserId();

    const payload = {

      user_id: userId,

      ...SelfProfileMapper.toDatabase(profile)

    };

    const {
      data,
      error
    } = await supabase
      .from("self_profiles")
      .insert(payload)
      .select()
      .single();

    if (error) {

      this.handleError(error);

    }

    return SelfProfileMapper.fromDatabase(
      data as SelfProfileRow
    );

  }

  //----------------------------------------------------
  // Update Self Profile
  //----------------------------------------------------

  async updateSelfProfile(
    profile: SelfProfile
  ): Promise<SelfProfile> {

    const payload =
      SelfProfileMapper.toDatabase(profile);

    const {
      data,
      error
    } = await supabase
      .from("self_profiles")
      .update(payload)
      .eq("id", profile.id)
      .eq("user_id", profile.userId)
      .select()
      .single();

    if (error) {

      this.handleError(error);

    }

    return SelfProfileMapper.fromDatabase(
      data as SelfProfileRow
    );

  }

}

export const selfProfileRepository =
  new SelfProfileRepository();