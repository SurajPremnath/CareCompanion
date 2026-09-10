import { supabase } from "@/lib/supabase";
import { authService } from "@/lib/auth/authService";
import type { Result } from "@/lib/types/result";

export type InvitationLogEvent =
  | "INVITED"
  | "VALIDATION_FAILED"
  | "TEMP_PASSWORD_CHANGED"
  | "ACCEPTED"
  | "CONSENT_ACCEPTED"
  | "AUTHORISED"
  | "CLOSED"
  | "REJECTED"
  | "CANCELLED"
  | "EXPIRED";

export interface InvitationLogInput {
  invitationId: string;
  familyId: string;
  event: InvitationLogEvent;
  actorUserId?: string | null;
  reasonCode?: string | null;
  reason?: string | null;
  remarks?: string | null;
  metadata?: Record<string, unknown> | null;
}

class InvitationLog {
  async log(input: InvitationLogInput): Promise<Result<void>> {
    try {
      const currentUser = await authService.getCurrentUser();

      const actorUserId =
        input.actorUserId !== undefined
          ? input.actorUserId
          : currentUser?.id ?? null;

      const { error } = await supabase.from("carevr_invite_log").insert({
        invitation_id: input.invitationId,
        family_id: input.familyId,
        event_type: input.event,
        actor_user_id: actorUserId,
        reason_code: input.reasonCode ?? null,
        reason: input.reason ?? null,
        remarks: input.remarks ?? null,
        metadata: input.metadata ?? null,
      });

      if (error) throw error;

      return {
        success: true,
        message: "Invitation event logged successfully.",
      };
    } catch (error) {
      console.error("Invitation log failed:", error);

      return {
        success: false,
        code: "INVITATION_LOG_FAILED",
        message: "Unable to record the invitation event.",
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}

export const invitationLog = new InvitationLog();