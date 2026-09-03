import { supabase } from "@/lib/supabase";
import { BaseRepository } from "@/lib/repositories/BaseRepository";

export class CareVRModulePermissionsRepository extends BaseRepository {

  async createPrimaryPermissions(
    carevrAccessId: string,
    userId: string
  ): Promise<void> {

    const permissions = [
      {
        carevr_access_id: carevrAccessId,
        module: "RECORD_HEALTH",
        permission: "ADMIN",
        status: "ACTIVE",
        granted_by: userId,
      },
      {
        carevr_access_id: carevrAccessId,
        module: "ASSESSMENT",
        permission: "ADMIN",
        status: "ACTIVE",
        granted_by: userId,
      },
      {
        carevr_access_id: carevrAccessId,
        module: "CARE_JOURNEY",
        permission: "ADMIN",
        status: "ACTIVE",
        granted_by: userId,
      },
      {
        carevr_access_id: carevrAccessId,
        module: "HEALTH_TIMELINE",
        permission: "ADMIN",
        status: "ACTIVE",
        granted_by: userId,
      },
      {
        carevr_access_id: carevrAccessId,
        module: "ADD_PATIENT",
        permission: "ADMIN",
        status: "ACTIVE",
        granted_by: userId,
      },
      {
        carevr_access_id: carevrAccessId,
        module: "ACCESS_MANAGEMENT",
        permission: "ADMIN",
        status: "ACTIVE",
        granted_by: userId,
      },
    ];

    const { error } = await supabase
      .from("carevr_module_permissions")
      .insert(permissions);

    if (error) {
      this.handleError(error);
    }
  }
}

export const carevrModulePermissions =
  new CareVRModulePermissionsRepository();