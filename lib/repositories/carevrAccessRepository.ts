import { supabase } from "@/lib/supabase";
import { BaseRepository } from "@/lib/repositories/BaseRepository";

export class CareVRAccessRepository extends BaseRepository {
  async createPrimaryAccess(userId: string): Promise<string> {
    const { data, error } = await supabase
      .from("carevr_access")
      .insert({
        user_id: userId,
        family_id: null,
        patient_id: null,
        access_type: "PRIMARY",
        access_status: "ACTIVE",
        granted_by: userId,
      })
      .select("id")
      .single();

    if (error) {
      this.handleError(error);
    }

    return data.id;
  }
}

export const carevrAccessRepository = new CareVRAccessRepository();