import "server-only";

import {
    createSupabaseServerClient,
} from "@/lib/supabase/server";

export async function runVerifyPinAccessDiagnostic() {
    const supabase =
        await createSupabaseServerClient();

    /*
     * =========================================================
     * AUTHENTICATED USER
     * =========================================================
     */

    const {
        data: {
            user,
        },
        error: userError,
    } =
        await supabase.auth.getUser();

    if (userError) {
        throw userError;
    }

    if (!user) {
        throw new Error(
            "User is not authenticated."
        );
    }

    const authenticatedUserId =
        user.id;

    const authenticatedEmail =
        user.email?.trim().toLowerCase() ?? "";


    /*
     * =========================================================
     * 1. carevr_access
     *
     * Same broad access query used by
     * getActiveAccessForUser()
     * =========================================================
     */

    const {
        data: accessRows,
        error: accessError,
    } =
        await supabase
            .from("carevr_access")
            .select(`
                id,
                user_id,
                family_id,
                patient_id,
                access_type,
                access_status
            `)
            .eq(
                "user_id",
                authenticatedUserId
            )
            .eq(
                "access_status",
                "ACTIVE"
            )
            .order(
                "created_at",
                {
                    ascending: true,
                }
            );

    if (accessError) {
        throw accessError;
    }

    const accessRecords =
        accessRows ?? [];


    /*
     * =========================================================
     * 2. carevr_invitation
     *
     * Latest ACCEPTED invitation by email.
     *
     * Same lookup used to resolve role when
     * selectedRole is not supplied.
     * =========================================================
     */

    const {
        data:
            latestAcceptedInvitation,
        error:
            latestAcceptedInvitationError,
    } =
        await supabase
            .from("carevr_invitation")
            .select(`
                id,
                family_id,
                invited_user_id,
                invited_by,
                invited_email,
                role,
                invitation_attempt_number,
                status,
                expires_at,
                consent_accepted_at,
                authorised_at,
                governance_id
            `)
            .eq(
                "invited_email",
                authenticatedEmail
            )
            .eq(
                "status",
                "ACCEPTED"
            )
            .order(
                "created_at",
                {
                    ascending: false,
                }
            )
            .limit(1)
            .maybeSingle();

    if (latestAcceptedInvitationError) {
        throw latestAcceptedInvitationError;
    }


    /*
     * =========================================================
     * 3. carevr_access
     *
     * Active access for the role resolved above.
     *
     * This reproduces the role-specific access lookup.
     * =========================================================
     */

    let resolvedAccessType:
        | "PRIMARY"
        | "SECONDARY_FAMILY_MEMBER"
        | "CARETAKER"
        | "DOCTOR"
        | null = null;

    if (
        latestAcceptedInvitation?.role ===
        "SELF"
    ) {
        resolvedAccessType =
            "PRIMARY";
    } else if (
        latestAcceptedInvitation?.role ===
        "SECONDARY_FAMILY_MEMBER"
    ) {
        resolvedAccessType =
            "SECONDARY_FAMILY_MEMBER";
    } else if (
        latestAcceptedInvitation?.role ===
        "CARETAKER"
    ) {
        resolvedAccessType =
            "CARETAKER";
    } else if (
        latestAcceptedInvitation?.role ===
        "DOCTOR"
    ) {
        resolvedAccessType =
            "DOCTOR";
    }

    let roleAccessRecord = null;

    if (resolvedAccessType) {
        const {
            data,
            error,
        } =
            await supabase
                .from("carevr_access")
                .select(`
                    id,
                    user_id,
                    family_id,
                    patient_id,
                    access_type,
                    access_status
                `)
                .eq(
                    "user_id",
                    authenticatedUserId
                )
                .eq(
                    "access_status",
                    "ACTIVE"
                )
                .eq(
                    "access_type",
                    resolvedAccessType
                )
                .limit(1)
                .maybeSingle();

        if (error) {
            throw error;
        }

        roleAccessRecord =
            data ?? null;
    }


    /*
     * =========================================================
     * 4. profiles
     *
     * Primary profile lookup used by
     * invitedUserLoginValidation().
     * =========================================================
     */

    const {
        data: primaryProfile,
        error: primaryProfileError,
    } =
        await supabase
            .from("profiles")
            .select("id")
            .eq(
                "id",
                authenticatedUserId
            )
            .eq(
                "family_member_type",
                "PRIMARY"
            )
            .maybeSingle();

    if (primaryProfileError) {
        throw primaryProfileError;
    }


    /*
     * =========================================================
     * 5. carevr_invitation
     *
     * Accepted invitation for authenticated
     * user + resolved role + consent accepted.
     * =========================================================
     */

    let acceptedInvitationForUser =
        null;

    if (
        latestAcceptedInvitation?.role
    ) {
        const {
            data,
            error,
        } =
            await supabase
                .from("carevr_invitation")
                .select(`
                    id,
                    family_id,
                    invited_user_id,
                    invited_email,
                    role,
                    governance_id,
                    status,
                    consent_accepted_at,
                    authorised_at
                `)
                .eq(
                    "invited_user_id",
                    authenticatedUserId
                )
                .eq(
                    "role",
                    latestAcceptedInvitation.role
                )
                .eq(
                    "status",
                    "ACCEPTED"
                )
                .not(
                    "consent_accepted_at",
                    "is",
                    null
                )
                .order(
                    "created_at",
                    {
                        ascending: false,
                    }
                )
                .limit(1)
                .maybeSingle();

        if (error) {
            throw error;
        }

        acceptedInvitationForUser =
            data ?? null;
    }


    /*
     * =========================================================
     * 6. carevr_invitation
     *
     * Latest invitation by email.
     *
     * This reproduces the fallback invitation lookup.
     * =========================================================
     */

    const {
        data: latestInvitation,
        error: latestInvitationError,
    } =
        await supabase
            .from("carevr_invitation")
            .select(`
                id,
                family_id,
                invited_by,
                invited_email,
                role,
                invitation_attempt_number,
                status,
                expires_at,
                consent_accepted_at,
                authorised_at
            `)
            .eq(
                "invited_email",
                authenticatedEmail
            )
            .order(
                "created_at",
                {
                    ascending: false,
                }
            )
            .limit(1)
            .maybeSingle();

    if (latestInvitationError) {
        throw latestInvitationError;
    }


    /*
     * =========================================================
     * 7. carevr_access
     *
     * Active PRIMARY access belonging to
     * the inviter.
     * =========================================================
     */

    let inviterPrimaryAccess = null;

    if (
        latestInvitation?.invited_by
    ) {
        const {
            data,
            error,
        } =
            await supabase
                .from("carevr_access")
                .select("id")
                .eq(
                    "user_id",
                    latestInvitation.invited_by
                )
                .eq(
                    "access_type",
                    "PRIMARY"
                )
                .eq(
                    "access_status",
                    "ACTIVE"
                )
                .limit(1)
                .maybeSingle();

        if (error) {
            throw error;
        }

        inviterPrimaryAccess =
            data ?? null;
    }


    /*
     * =========================================================
     * 8. carevr_module_permissions
     *
     * Reproduces Dashboard Handoff permission lookup.
     * =========================================================
     */

    let modulePermissions: Array<{
        module: string;
        permission:
            | "VIEW"
            | "CONTRIBUTE"
            | "ADMIN";
        status: string;
    }> = [];

    const dashboardAccessId =
        roleAccessRecord?.id ??
        accessRecords[0]?.id ??
        null;

    if (dashboardAccessId) {
        const {
            data,
            error,
        } =
            await supabase
                .from(
                    "carevr_module_permissions"
                )
                .select(`
                    module,
                    permission,
                    status
                `)
                .eq(
                    "carevr_access_id",
                    dashboardAccessId
                )
                .eq(
                    "status",
                    "ACTIVE"
                );

        if (error) {
            throw error;
        }

        modulePermissions =
            data ?? [];
    }


    /*
     * =========================================================
     * 9. patients
     *
     * Reproduces the patient-scope query using
     * the selected access record.
     *
     * We intentionally do NOT select or print
     * encrypted fields, DOB, or other unnecessary PHI.
     * =========================================================
     */

    let patientRecords: Array<{
        id: string;
        user_id: string | null;
        family_id: string | null;
        relationship: string | null;
        status: string;
    }> = [];

    const selectedAccess =
        roleAccessRecord ??
        accessRecords[0] ??
        null;

    if (selectedAccess) {
        let patientQuery =
            supabase
                .from("patients")
                .select(`
                    id,
                    user_id,
                    family_id,
                    relationship,
                    status
                `)
                .eq(
                    "status",
                    "ACTIVE"
                );

        if (
            latestAcceptedInvitation?.role ===
            "SELF"
        ) {
            if (
                selectedAccess.family_id
            ) {
                patientQuery =
                    patientQuery.eq(
                        "family_id",
                        selectedAccess.family_id
                    );
            }
        } else if (
            selectedAccess.patient_id
        ) {
            patientQuery =
                patientQuery.eq(
                    "id",
                    selectedAccess.patient_id
                );
        } else if (
            selectedAccess.family_id
        ) {
            patientQuery =
                patientQuery.eq(
                    "family_id",
                    selectedAccess.family_id
                );
        }

        const {
            data,
            error,
        } =
            await patientQuery;

        if (error) {
            throw error;
        }

        patientRecords =
            data ?? [];
    }


    /*
     * =========================================================
     * SAFE DIAGNOSTIC LOG
     * =========================================================
     */

    console.log(
        "[SECURITY-DIAGNOSTIC] authenticated user",
        {
            userId:
                authenticatedUserId,
            email:
                authenticatedEmail,
        }
    );

    console.log(
        "[SECURITY-DIAGNOSTIC] carevr_access / all active",
        accessRecords
    );

    console.log(
        "[SECURITY-DIAGNOSTIC] carevr_invitation / accepted by email",
        latestAcceptedInvitation
    );

    console.log(
        "[SECURITY-DIAGNOSTIC] carevr_access / resolved role",
        roleAccessRecord
    );

    console.log(
        "[SECURITY-DIAGNOSTIC] profiles / primary",
        primaryProfile
    );

    console.log(
        "[SECURITY-DIAGNOSTIC] carevr_invitation / accepted user + role",
        acceptedInvitationForUser
    );

    console.log(
        "[SECURITY-DIAGNOSTIC] carevr_invitation / latest by email",
        latestInvitation
    );

    console.log(
        "[SECURITY-DIAGNOSTIC] carevr_access / inviter primary",
        inviterPrimaryAccess
    );

    console.log(
        "[SECURITY-DIAGNOSTIC] carevr_module_permissions",
        modulePermissions
    );

    console.log(
        "[SECURITY-DIAGNOSTIC] patients",
        patientRecords
    );


    /*
     * =========================================================
     * RETURN SAFE DIAGNOSTIC DATA
     * =========================================================
     */

    return {
        authenticatedUser: {
            userId:
                authenticatedUserId,
            email:
                authenticatedEmail,
        },

        carevrAccess: {
            allActive:
                accessRecords,
            resolvedRole:
                latestAcceptedInvitation?.role ??
                null,
            resolvedAccessType,
            roleAccess:
                roleAccessRecord,
            inviterPrimary:
                inviterPrimaryAccess,
        },

        invitations: {
            latestAcceptedByEmail:
                latestAcceptedInvitation,
            acceptedForUserAndRole:
                acceptedInvitationForUser,
            latestByEmail:
                latestInvitation,
        },

        profile: {
            primary:
                primaryProfile,
        },

        modulePermissions,

        patients: {
            selectedAccess:
                selectedAccess,
            records:
                patientRecords,
        },
    };
}