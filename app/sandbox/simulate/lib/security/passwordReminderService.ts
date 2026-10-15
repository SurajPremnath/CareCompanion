import { supabaseAdmin } from "@/lib/supabaseAdmin";
import {
    passwordReminderEmailService,
} from "@/lib/email/passwordReminderEmailService";

type PasswordReminderType =
    | "DAY_7"
    | "DAY_3"
    | "DAY_1"
    | "DAY_0";

interface PasswordExpiryProfile {
    id: string;
    email: string;
    full_name: string | null;
    permanent_password_expires_at: string;
}

interface PasswordReminderResult {
    userId: string;
    email: string;
    reminderType: PasswordReminderType;
    sent: boolean;
    emailId?: string;
    reason?: string;
}

const CAREVR_TIME_ZONE =
    "Asia/Kolkata";


class PasswordReminderService {

    async processPendingPasswordReminders():
        Promise<PasswordReminderResult[]> {

        const now =
            new Date();

        const profiles =
            await this.loadProfiles();

        if (!profiles.length) {
            return [];
        }

        const results:
            PasswordReminderResult[] = [];

        for (const profile of profiles) {

            const reminderType =
                this.getDueReminderType(
                    profile,
                    now
                );

            if (!reminderType) {
                continue;
            }

            const alreadySent =
                await this.hasReminderBeenSent(
                    profile,
                    reminderType
                );

            if (alreadySent) {
                continue;
            }


        const emailResult =
            await passwordReminderEmailService.send({
                to:
                    profile.email,

                daysRemaining:

                    reminderType === "DAY_7"
                        ? 7
                        : reminderType === "DAY_3"
                            ? 3
                            : reminderType === "DAY_1"
                                ? 1
                                : 0,

                expiresAt:
                    profile.permanent_password_expires_at,
            });



            await this.recordReminder(
                profile,
                reminderType,
                emailResult.emailId
            );

            results.push({
                userId:
                    profile.id,

                email:
                    profile.email,

                reminderType,

                sent:
                    true,

                emailId:
                    emailResult.emailId,
            });
        }

        return results;
    }


    // ============================================================
    // Load active users with a permanent password expiry.
    // ============================================================

    private async loadProfiles():
        Promise<PasswordExpiryProfile[]> {

        const { data, error } =
            await supabaseAdmin
                .from("profiles")
                .select(`
                    id,
                    email,
                    full_name,
                    permanent_password_expires_at
                `)
                .eq(
                    "is_active",
                    true
                )
                .eq(
                    "account_status",
                    "ACTIVE"
                )
                .not(
                    "permanent_password_expires_at",
                    "is",
                    null
                )
                .gte(
                    "permanent_password_expires_at",
                    new Date(
                        new Date().toLocaleDateString(
                            "en-CA",
                            { timeZone: CAREVR_TIME_ZONE }
                        ) + "T00:00:00+05:30"
                    ).toISOString()
                );

        if (error) {
            throw new Error(
                `Unable to load password expiry profiles: ${error.message}`
            );
        }

        return (data ?? [])
            .filter(
                (profile) =>
                    Boolean(
                        profile.email
                    ) &&
                    Boolean(
                        profile.permanent_password_expires_at
                    )
            )
            .map(
                (profile) => ({
                    id:
                        profile.id,

                    email:
                        profile.email
                            .trim()
                            .toLowerCase(),

                    full_name:
                        profile.full_name,

                    permanent_password_expires_at:
                        profile.permanent_password_expires_at,
                })
            );
    }


    // ============================================================
    // Determine whether the 7, 3, or 1 day reminder is due.
    //
    // The permanent password expiry timestamp is authoritative.
    // ============================================================

private getDueReminderType(
    profile: PasswordExpiryProfile,
    now: Date
): PasswordReminderType | null {

    const expiryDate =
        this.getCareVRDate(
            new Date(
                profile.permanent_password_expires_at
            )
        );

    const currentDate =
        this.getCareVRDate(
            now
        );

    const daysUntilExpiry =
        this.getCalendarDayDifference(
            currentDate,
            expiryDate
        );

    if (
        daysUntilExpiry === 7
    ) {
        return "DAY_7";
    }

    if (
        daysUntilExpiry === 3
    ) {
        return "DAY_3";
    }

    if (
        daysUntilExpiry === 1
    ) {
        return "DAY_1";
    }
    if (
        daysUntilExpiry === 0
    ) {
        return "DAY_0";
    }

    return null;
}


private getCareVRDate(
    date: Date
): string {

    return new Intl.DateTimeFormat(
        "en-CA",
        {
            timeZone:
                CAREVR_TIME_ZONE,

            year:
                "numeric",

            month:
                "2-digit",

            day:
                "2-digit",
        }
    ).format(date);
}


private getCalendarDayDifference(
    currentDate: string,
    expiryDate: string
): number {

    const current =
        new Date(
            `${currentDate}T00:00:00Z`
        );

    const expiry =
        new Date(
            `${expiryDate}T00:00:00Z`
        );

    return Math.round(
        (
            expiry.getTime() -
            current.getTime()
        ) /
        (
            24 * 60 * 60 * 1000
        )
    );
}


    // ============================================================
    // Check reminder history.
    //
    // expires_at is part of the unique cycle, so after a
    // password change creates a new expiry date, the user can
    // receive a new 7 / 3 / 1 day reminder cycle.
    // ============================================================

    private async hasReminderBeenSent(
        profile: PasswordExpiryProfile,
        reminderType: PasswordReminderType
    ): Promise<boolean> {

        const { data, error } =
            await supabaseAdmin
                .from(
                    "carevr_password_reminders"
                )
                .select("id")
                .eq(
                    "user_id",
                    profile.id
                )
                .eq(
                    "reminder_type",
                    reminderType
                )
                .eq(
                    "expires_at",
                    profile.permanent_password_expires_at
                )
                .maybeSingle();

        if (error) {
            throw new Error(
                `Unable to check password reminder history: ${error.message}`
            );
        }

        return Boolean(data);
    }


    // ============================================================
    // Record successful reminder.
    // ============================================================

    private async recordReminder(
        profile: PasswordExpiryProfile,
        reminderType: PasswordReminderType,
        emailId: string
    ): Promise<void> {

        const { error } =
            await supabaseAdmin
                .from(
                    "carevr_password_reminders"
                )
                .insert({
                    user_id:
                        profile.id,

                    reminder_type:
                        reminderType,

                    expires_at:
                        profile.permanent_password_expires_at,

                    sent_at:
                        new Date().toISOString(),

                    email_id:
                        emailId,
                });

        if (error) {

            if (
                error.code === "23505"
            ) {
                return;
            }

            throw new Error(
                `Password reminder was sent but audit recording failed: ${error.message}`
            );
        }
    }
}


export const passwordReminderService =
    new PasswordReminderService();