import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { invitationEmailService } from "@/lib/email/invitationEmailService";

type ReminderType =
    | "DAY_4"
    | "DAY_6"
    | "DAY_7_EXPIRING_TODAY";

type InvitationSource =
    | "PRODUCT"
    | "INVITATION";

type Role =
    | "PRIMARY"
    | "SECONDARY_FAMILY_MEMBER"
    | "CARETAKER"
    | "DOCTOR";

interface PendingInvitation {
    id: string;
    email: string;
    role: Role;
    source: InvitationSource;
    invitationSentAt: string;
    expiresAt: string;
}

interface ReminderResult {
    invitationId: string;
    email: string;
    role: Role;
    source: InvitationSource;
    reminderType: ReminderType;
    sent: boolean;
    reason?: string;
    emailId?: string;
}

const FOUR_DAYS_MS = 4 * 24 * 60 * 60 * 1000;
const SIX_DAYS_MS = 6 * 24 * 60 * 60 * 1000;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

class ReminderService {

async processPendingInvitations(): Promise<ReminderResult[]> {

    const now = new Date();

    const invitations =
        await this.loadPendingInvitations();

    if (!invitations.length) {
        return [];
    }

    const results: ReminderResult[] = [];

    for (const invitation of invitations) {

        const reminderType =
            this.getDueReminderType(
                invitation,
                now
            );

        if (!reminderType) {
            continue;
        }

        const claimed =
            await this.claimReminder(
                invitation,
                reminderType
            );

        if (!claimed) {
            continue;
        }

        const result =
            await this.sendReminder(
                invitation,
                reminderType
            );

        results.push(result);
    }

    return results;
}


    // ============================================================
    // Load both invitation systems.
    // ============================================================

    private async loadPendingInvitations():
        Promise<PendingInvitation[]> {

        const productInvitations =
            await this.loadProductInvitations();

        const roleInvitations =
            await this.loadRoleInvitations();

        return [
            ...productInvitations,
            ...roleInvitations,
        ];
    }


    // ============================================================
    // Founder → Primary
    //
    // role_clarification type:
    // PRODUCT
    // ============================================================

    private async loadProductInvitations():
        Promise<PendingInvitation[]> {

        const { data, error } =
            await supabaseAdmin
                .from("carevr_product_invitations")
                .select(`
                    id,
                    email,
                    status,
                    invitation_sent_at,
                    expires_at
                `)
                .eq(
                    "status",
                    "PENDING"
                )
                .gt(
                    "expires_at",
                    new Date().toISOString()
                );

        if (error) {
            throw new Error(
                `Unable to load product invitations: ${error.message}`
            );
        }

        return (data ?? []).map(
            (invitation) => ({
                id:
                    invitation.id,

                email:
                    invitation.email
                        .trim()
                        .toLowerCase(),

                role:
                    "PRIMARY",

                source:
                    "PRODUCT",

                invitationSentAt:
                    invitation.invitation_sent_at,

                expiresAt:
                    invitation.expires_at,
            })
        );
    }


    // ============================================================
    // Primary → Secondary / Caretaker / Doctor
    //
    // role_clarification type:
    // INVITATION
    // ============================================================

    private async loadRoleInvitations():
        Promise<PendingInvitation[]> {

        const { data, error } =
            await supabaseAdmin
                .from("carevr_invitation")
                .select(`
                    id,
                    invited_email,
                    role,
                    status,
                    created_at,
                    expires_at
                `)
                .eq(
                    "status",
                    "PENDING"
                )
                .gt(
                    "expires_at",
                    new Date().toISOString()
                );

        if (error) {
            throw new Error(
                `Unable to load role invitations: ${error.message}`
            );
        }

        return (data ?? [])
            .filter(
                (invitation) =>
                    invitation.role ===
                        "SECONDARY_FAMILY_MEMBER" ||
                    invitation.role ===
                        "CARETAKER" ||
                    invitation.role ===
                        "DOCTOR"
            )
            .map(
                (invitation) => ({
                    id:
                        invitation.id,

                    email:
                        invitation.invited_email
                            .trim()
                            .toLowerCase(),

                    role:
                        invitation.role as Role,

                    source:
                        "INVITATION",

                    invitationSentAt:
                        invitation.created_at,

                    expiresAt:
                        invitation.expires_at,
                })
            );
    }


    // ============================================================
    // Determine which reminder is currently due.
    //
    // Expiry is authoritative.
    // ============================================================

private getDueReminderType(
    invitation: PendingInvitation,
    now: Date
): ReminderType | null {

    const sentAt =
        new Date(
            invitation.invitationSentAt
        ).getTime();

    const expiresAt =
        new Date(
            invitation.expiresAt
        ).getTime();

    const current =
        now.getTime();

    const elapsed =
        current - sentAt;

    const timeUntilExpiry =
        expiresAt - current;


    // ----------------------------------------------------------
    // Final expiry window.
    //
    // The actual expiry timestamp remains authoritative.
    // ----------------------------------------------------------

    if (
        timeUntilExpiry > 0 &&
        timeUntilExpiry <= ONE_DAY_MS
    ) {
        return "DAY_7_EXPIRING_TODAY";
    }


    // ----------------------------------------------------------
    // Day 6.
    // ----------------------------------------------------------

    if (
        elapsed >= SIX_DAYS_MS &&
        timeUntilExpiry > 0
    ) {
        return "DAY_6";
    }


    // ----------------------------------------------------------
    // Day 4.
    // ----------------------------------------------------------

    if (
        elapsed >= FOUR_DAYS_MS &&
        timeUntilExpiry > 0
    ) {
        return "DAY_4";
    }


    return null;
}


    // ============================================================
    // Check reminder history.
    //
    // Product invitations can be recreated while keeping the
    // same invitation ID. Therefore an old reminder record from
    // before the latest invitation_sent_at must not block the
    // new reminder cycle.
    //
    // Role invitations receive a new invitation ID on recreation,
    // so their history naturally belongs to the new invitation.
    // ============================================================

private async claimReminder(
    invitation: PendingInvitation,
    reminderType: ReminderType
): Promise<boolean> {

    const table =
        invitation.source === "PRODUCT"
            ? "carevr_product_invitation_reminders"
            : "carevr_invitation_reminders";

    const invitationColumn =
        invitation.source === "PRODUCT"
            ? "product_invitation_id"
            : "invitation_id";


    // ----------------------------------------------------------
    // Product invitations keep the same invitation ID when
    // recreated. Remove a reminder belonging to the previous
    // send lifecycle.
    // ----------------------------------------------------------

    if (
        invitation.source === "PRODUCT"
    ) {

        const { data, error } =
            await supabaseAdmin
                .from(table)
                .select(
                    "id, sent_at"
                )
                .eq(
                    invitationColumn,
                    invitation.id
                )
                .eq(
                    "reminder_type",
                    reminderType
                )
                .maybeSingle();

        if (error) {
            throw new Error(
                `Unable to check reminder history: ${error.message}`
            );
        }

        if (data) {

            if (
                new Date(data.sent_at).getTime() >=
                new Date(
                    invitation.invitationSentAt
                ).getTime()
            ) {
                return false;
            }

            const { error: deleteError } =
                await supabaseAdmin
                    .from(table)
                    .delete()
                    .eq(
                        "id",
                        data.id
                    );

            if (deleteError) {
                throw new Error(
                    `Unable to reset stale product reminder history: ${deleteError.message}`
                );
            }
        }
    }


    // ----------------------------------------------------------
    // Atomic claim.
    //
    // The UNIQUE constraint on:
    //
    // invitation_id + reminder_type
    //
    // ensures that only one scheduler execution can claim
    // this reminder.
    // ----------------------------------------------------------

    const { error: claimError } =
        await supabaseAdmin
            .from(table)
            .insert({
                [invitationColumn]:
                    invitation.id,

                reminder_type:
                    reminderType,

                sent_at:
                    new Date().toISOString(),

                email_id:
                    null,
            });


    if (!claimError) {
        return true;
    }


    // A unique-constraint violation means another scheduler
    // execution already claimed this reminder.
    //
    // We therefore safely skip it.

    if (
        claimError.code === "23505"
    ) {
        return false;
    }


    throw new Error(
        `Unable to claim invitation reminder: ${claimError.message}`
    );
}


    // ============================================================
    // Send reminder.
    // ============================================================

private async sendReminder(
    invitation: PendingInvitation,
    reminderType: ReminderType
): Promise<ReminderResult> {

    const {
        subject,
        body,
    } =
        this.buildReminderEmail(
            invitation,
            reminderType
        );


    const emailResult =
        await invitationEmailService.send({
            to:
                invitation.email,

            subject,

            body,
        });


    const table =
        invitation.source === "PRODUCT"
            ? "carevr_product_invitation_reminders"
            : "carevr_invitation_reminders";


    const invitationColumn =
        invitation.source === "PRODUCT"
            ? "product_invitation_id"
            : "invitation_id";


    const { error } =
        await supabaseAdmin
            .from(table)
            .update({
                sent_at:
                    new Date().toISOString(),

                email_id:
                    emailResult.emailId,
            })
            .eq(
                invitationColumn,
                invitation.id
            )
            .eq(
                "reminder_type",
                reminderType
            );


    if (error) {
        throw new Error(
            `Reminder email was sent but audit recording failed: ${error.message}`
        );
    }


    return {
        invitationId:
            invitation.id,

        email:
            invitation.email,

        role:
            invitation.role,

        source:
            invitation.source,

        reminderType,

        sent:
            true,

        emailId:
            emailResult.emailId,
    };
}


    // ============================================================
    // Reminder email content.
    // ============================================================

    private buildReminderEmail(
        invitation: PendingInvitation,
        reminderType: ReminderType
    ): {
        subject: string;
        body: string;
    } {

        const expiresAt =
            new Date(
                invitation.expiresAt
            );


        const roleLabel =
            this.getRoleLabel(
                invitation.role
            );


        if (
            reminderType ===
            "DAY_7_EXPIRING_TODAY"
        ) {

            return {
                subject:
                    invitation.source === "PRODUCT"
                        ? "Your CareVR invitation expires today"
                        : `Your CareVR ${roleLabel} invitation expires today`,

                body:
                    `Your CareVR invitation expires today.

Please complete your CareVR registration using the activation link from your original CareVR invitation email.

If you have already completed your registration, no further action is required.`,
            };
        }


        if (
            reminderType ===
            "DAY_6"
        ) {

            return {
                subject:
                    invitation.source === "PRODUCT"
                        ? "Reminder: Complete your CareVR invitation"
                        : `Reminder: Complete your CareVR ${roleLabel} invitation`,

                body:
                    `This is a reminder to complete your CareVR invitation.

Please use the activation link from your original CareVR invitation email to continue your CareVR registration.

Your invitation expires on ${expiresAt.toLocaleDateString()}.`,
            };
        }


        return {
            subject:
                invitation.source === "PRODUCT"
                    ? "Reminder: Your CareVR invitation is waiting"
                    : `Reminder: Your CareVR ${roleLabel} invitation is waiting`,

            body:
                `This is a reminder that your CareVR invitation is waiting for you.

Please use the activation link from your original CareVR invitation email to continue your CareVR registration.

Your invitation expires on ${expiresAt.toLocaleDateString()}.`,
        };
    }


    // ============================================================
    // Role labels used only for reminder wording.
    // ============================================================

    private getRoleLabel(
        role: Role
    ): string {

        switch (role) {

            case "PRIMARY":
                return "Primary";

            case "SECONDARY_FAMILY_MEMBER":
                return "Secondary Family Member";

            case "CARETAKER":
                return "Caretaker";

            case "DOCTOR":
                return "Doctor";

            default:
                return "CareVR";
        }
    }
}


export const reminderService =
    new ReminderService();