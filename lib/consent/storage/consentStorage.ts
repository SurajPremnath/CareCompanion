import type {
    Consent,
} from "@/lib/consent/models/Consent";

import {
    authService,
} from "@/lib/auth/authService";

import {
    consentRepository,
} from "@/lib/consent/repository/consentRepository";

import {
    carevrAccessRepository,
} from "@/lib/repositories/carevrAccessRepository";

import {
    carevrModulePermissions,
} from "@/lib/repositories/carevrModulePermissions";

import {
    carevrAuthorizationHandoff,
} from "@/lib/authorization/carevrAuthorizationHandoff";

import {
    supabase,
} from "@/lib/supabase";

import {
    CURRENT_CONSENT_VERSION,
    CURRENT_PRIVACY_POLICY_VERSION,
    CURRENT_TERMS_VERSION,
    CURRENT_MEDICAL_DISCLAIMER_VERSION,
    CURRENT_AI_DISCLAIMER_VERSION,
    DEFAULT_CONSENT_LANGUAGE,
} from "@/lib/constants/consentVersions";

export class ConsentStorage {

async acceptConsent(
    consentState: Pick<
        Consent,
        | "privacyPanel"
        | "familyPanel"
        | "trackingPanel"
        | "securityPanel"
        | "medicalPanel"
        | "legalDataProtectionPanel"
        | "storageProcessingPanel"
        | "retentionDeletionPanel"
        | "voluntaryProcessingAgreement"
        | "termsMedicalAgreement"
        | "privacyPolicyAcknowledgement"
    >,
    registrationContext: string | null
): Promise<void> {

    const allConsentRequirementsAccepted =
        consentState.privacyPanel &&
        consentState.familyPanel &&
        consentState.trackingPanel &&
        consentState.securityPanel &&
        consentState.medicalPanel &&
        consentState.legalDataProtectionPanel &&
        consentState.storageProcessingPanel &&
        consentState.retentionDeletionPanel &&
        consentState.voluntaryProcessingAgreement &&
        consentState.termsMedicalAgreement &&
        consentState.privacyPolicyAcknowledgement;

    if (!allConsentRequirementsAccepted) {

        throw new Error(
            "All Consent Management sections and agreements must be completed before access can be granted."
        );

    }

const userId =
    await authService.getCurrentUserId();


const {
    data: existingConsent,
    error: existingConsentError,
} = await supabase
    .from("user_consents")
    .select("id")
    .eq(
        "user_id",
        userId
    )
    .order(
        "accepted_at",
        {
            ascending: false,
        }
    )
    .limit(1)
    .maybeSingle();


if (existingConsentError) {

    throw existingConsentError;

}


if (existingConsent) {

    const {
        error: consentUpdateError,
    } = await supabase
        .from("user_consents")
        .update({

            consent_version:
                CURRENT_CONSENT_VERSION,

            privacy_policy_version:
                CURRENT_PRIVACY_POLICY_VERSION,

            terms_version:
                CURRENT_TERMS_VERSION,

            medical_disclaimer_version:
                CURRENT_MEDICAL_DISCLAIMER_VERSION,

            ai_disclaimer_version:
                CURRENT_AI_DISCLAIMER_VERSION,

            privacy_panel:
                consentState.privacyPanel,

            family_panel:
                consentState.familyPanel,

            tracking_panel:
                consentState.trackingPanel,

            security_panel:
                consentState.securityPanel,

            medical_panel:
                consentState.medicalPanel,

            legal_data_protection_panel:
                consentState.legalDataProtectionPanel,

            storage_processing_panel:
                consentState.storageProcessingPanel,

            retention_deletion_panel:
                consentState.retentionDeletionPanel,

            voluntary_processing_agreement:
                consentState.voluntaryProcessingAgreement,

            terms_medical_agreement:
                consentState.termsMedicalAgreement,

            privacy_policy_acknowledgement:
                consentState.privacyPolicyAcknowledgement,

            language:
                DEFAULT_CONSENT_LANGUAGE,

            accepted:
                true,

            accepted_at:
                new Date().toISOString(),

            updated_at:
                new Date().toISOString(),

        })
        .eq(
            "id",
            existingConsent.id
        );


    if (consentUpdateError) {

        throw consentUpdateError;

    }

} else {

    await consentRepository.create({

        userId,

        consentVersion:
            CURRENT_CONSENT_VERSION,

        privacyPolicyVersion:
            CURRENT_PRIVACY_POLICY_VERSION,

        termsVersion:
            CURRENT_TERMS_VERSION,

        medicalDisclaimerVersion:
            CURRENT_MEDICAL_DISCLAIMER_VERSION,

        aiDisclaimerVersion:
            CURRENT_AI_DISCLAIMER_VERSION,

        privacyPanel:
            consentState.privacyPanel,

        familyPanel:
            consentState.familyPanel,

        trackingPanel:
            consentState.trackingPanel,

        securityPanel:
            consentState.securityPanel,

        medicalPanel:
            consentState.medicalPanel,

        legalDataProtectionPanel:
            consentState.legalDataProtectionPanel,

        storageProcessingPanel:
            consentState.storageProcessingPanel,

        retentionDeletionPanel:
            consentState.retentionDeletionPanel,

        voluntaryProcessingAgreement:
            consentState.voluntaryProcessingAgreement,

        termsMedicalAgreement:
            consentState.termsMedicalAgreement,

        privacyPolicyAcknowledgement:
            consentState.privacyPolicyAcknowledgement,

        language:
            DEFAULT_CONSENT_LANGUAGE,

        accepted: true,

        acceptedAt: new Date(),

    });

}

const existingAuthorizationHandoff =
    carevrAuthorizationHandoff.get();

let authorizationHandoff =
    existingAuthorizationHandoff;

if (!authorizationHandoff) {

    const {
        data: digitalHealthProfile,
        error: digitalHealthProfileError,
    } = await supabase
        .from("digital_health_profile")
        .select(
            "family_id, role, invitation_status, consent_status, carevr_access_id"
        )
        .eq(
            "user_id",
            userId
        )
        .eq(
            "invitation_status",
            "ACCEPTED"
        )
        .limit(1)
        .maybeSingle();

    if (digitalHealthProfileError) {

        throw digitalHealthProfileError;

    }

    if (!digitalHealthProfile) {

        throw new Error(
            "Digital health profile is missing."
        );

    }

    const carevrRole =
        digitalHealthProfile.role ===
        "DOCTOR"
            ? "DOCTOR"
            : digitalHealthProfile.role ===
                "CARETAKER"
                ? "CARETAKER"
                : digitalHealthProfile.role ===
                    "SECONDARY_FAMILY_MEMBER"
                    ? "SECONDARY_FAMILY_MEMBER"
                    : "PRIMARY";

    authorizationHandoff = {

        userId:

            userId,

        carevrRole,

        familyId:

            digitalHealthProfile.family_id ??
            null,

        patientId:

            null,

        consentStage:

            "POST_LOGIN",

        governanceId:

            null,

        governanceVersion:

            null,

    };

    carevrAuthorizationHandoff.set(
        authorizationHandoff
    );

}

    if (authorizationHandoff.userId !== userId) {

        throw new Error(
            "CareVR authorization handoff does not match the authenticated user."
        );

    }

    if (
        authorizationHandoff.carevrRole !==
            "PRIMARY" &&
        authorizationHandoff.carevrRole !==
            "SECONDARY_FAMILY_MEMBER" &&
        authorizationHandoff.carevrRole !==
            "CARETAKER" &&
        authorizationHandoff.carevrRole !==
            "DOCTOR"
    ) {

        throw new Error(
            "Unsupported CareVR authorization role."
        );

    }

    if (
        authorizationHandoff.carevrRole !==
            "PRIMARY" &&
        !authorizationHandoff.familyId
    ) {

        throw new Error(
            "CareVR family context is required for this authorization."
        );

    }

    const {
        data: governance,
        error: governanceError,
    } = await supabase
        .from("carevr_access_governance")
        .select(
            "id, version"
        )
        .eq(
            "access_type",
            "CARE_FAMILY"
        )
        .lte(
            "effective_at",
            new Date().toISOString()
        )
        .order(
            "effective_at",
            {
                ascending: false,
            }
        )
        .limit(1)
        .maybeSingle();

    if (governanceError) {

        throw governanceError;

    }

    if (!governance) {

        throw new Error(
            "Active CareVR governance configuration was not found."
        );

    }

    const {
        data: governanceModules,
        error: governanceModulesError,
    } = await supabase
        .from("carevr_access_governance_modules")
        .select(
            "module, permission"
        )
        .eq(
            "carevr_access_governance_id",
            governance.id
        )
        .eq(
            "role",
            authorizationHandoff.carevrRole
        )
        .eq(
            "status",
            "ACTIVE"
        );

    if (governanceModulesError) {

        throw governanceModulesError;

    }

    if (
        !governanceModules ||
        governanceModules.length === 0
    ) {

        throw new Error(
            "No active CareVR permissions were found for the authorized role."
        );

    }

    let carevrAccessId: string;

    let digitalHealthProfileRole: string;


    if (
        authorizationHandoff.carevrRole ===
        "PRIMARY"
    ) {

        const existingPrimaryAccess =
            await carevrAccessRepository
                .getActiveAccessForLoginRole(
                    userId,
                    "SELF"
                );

        if (!existingPrimaryAccess) {

            throw new Error(
                "Primary CareVR access is not provisioned."
            );

        }

        carevrAccessId =
            existingPrimaryAccess.id;

        digitalHealthProfileRole =
            "SELF";


    } else {

        let carevrAccess:
            {
                id: string;
                access_status: string | null;
            } | null = null;


        let carevrAccessError:
            Error | null = null;


        if (
            authorizationHandoff.familyId !==
            null
        ) {

            const {
                data: existingCarevrAccess,
                error: existingCarevrAccessError,
            } = await supabase
                .from("carevr_access")
                .select(
                    "id, access_status"
                )
                .eq(
                    "user_id",
                    authorizationHandoff.userId
                )
                .eq(
                    "family_id",
                    authorizationHandoff.familyId
                )
                .eq(
                    "access_type",
                    authorizationHandoff.carevrRole
                )
                .maybeSingle();


            if (
                existingCarevrAccessError
            ) {

                throw existingCarevrAccessError;

            }


            if (
                existingCarevrAccess
            ) {

                carevrAccess =
                    existingCarevrAccess;


                if (
                    existingCarevrAccess.access_status !==
                    "ACTIVE"
                ) {

                    const {
                        data: updatedCarevrAccess,
                        error: updateCarevrAccessError,
                    } = await supabase
                        .from("carevr_access")
                        .update({
                            access_status:
                                "ACTIVE",
                        })
                        .eq(
                            "id",
                            existingCarevrAccess.id
                        )
                        .select(
                            "id, access_status"
                        )
                        .single();


                    if (
                        updateCarevrAccessError
                    ) {

                        throw updateCarevrAccessError;

                    }


                    carevrAccess =
                        updatedCarevrAccess;

                }

            }

        } else {

            const {
                data: existingCarevrAccess,
                error: existingCarevrAccessError,
            } = await supabase
                .from("carevr_access")
                .select(
                    "id, access_status"
                )
                .eq(
                    "user_id",
                    authorizationHandoff.userId
                )
                .is(
                    "family_id",
                    null
                )
                .eq(
                    "access_type",
                    authorizationHandoff.carevrRole
                )
                .maybeSingle();


            if (
                existingCarevrAccessError
            ) {

                throw existingCarevrAccessError;

            }


            if (
                existingCarevrAccess
            ) {

                carevrAccess =
                    existingCarevrAccess;


                if (
                    existingCarevrAccess.access_status !==
                    "ACTIVE"
                ) {

                    const {
                        data: updatedCarevrAccess,
                        error: updateCarevrAccessError,
                    } = await supabase
                        .from("carevr_access")
                        .update({
                            access_status:
                                "ACTIVE",
                        })
                        .eq(
                            "id",
                            existingCarevrAccess.id
                        )
                        .select(
                            "id, access_status"
                        )
                        .single();


                    if (
                        updateCarevrAccessError
                    ) {

                        throw updateCarevrAccessError;

                    }


                    carevrAccess =
                        updatedCarevrAccess;

                }

            }

        }


        if (!carevrAccess) {

            const {
                data: insertedCarevrAccess,
                error: insertedCarevrAccessError,
            } = await supabase
                .from("carevr_access")
                .insert({
                    user_id:
                        authorizationHandoff.userId,

                    family_id:
                        authorizationHandoff.familyId,

                    patient_id:
                        authorizationHandoff.patientId,

                    access_type:
                        authorizationHandoff.carevrRole,

                    access_status:
                        "ACTIVE",

                    granted_by:
                        userId,

                })
                .select("id, access_status")
                .single();


            if (
                insertedCarevrAccessError
            ) {

                throw insertedCarevrAccessError;

            }


            carevrAccess =
                insertedCarevrAccess;

        }


        carevrAccessId =
            carevrAccess.id;


        digitalHealthProfileRole =
            authorizationHandoff.carevrRole;


    }

    const permissions =
        governanceModules.map(
            (governanceModule) => ({
                carevr_access_id:
                    carevrAccessId,

                module:
                    governanceModule.module,

                permission:
                    governanceModule.permission,

                status:
                    "ACTIVE",

                granted_by:
                    userId,

            })
        );

if (registrationContext !== "PRODUCT") {

    const {
        error: permissionsError,
    } = await supabase
        .from("carevr_module_permissions")
        .insert(
            permissions
        );

    if (permissionsError) {

        throw permissionsError;

    }

}

const {
    error: digitalHealthProfileError,
} = await supabase
    .from("digital_health_profile")
    .update({
        carevr_access_id:
            carevrAccessId,

        role:
            digitalHealthProfileRole,
    })
    .eq(
        "user_id",
        userId
    );

if (digitalHealthProfileError) {

    throw digitalHealthProfileError;

}


    /*
     * Consent has now been accepted and the CareVR
     * authorization has been successfully provisioned.
     *
     * For invited users, persist the completed consent
     * and authorization state on the invitation so the
     * next Login does not return the user to Consent.
     *
     * The Primary/self path has no invitation and is
     * therefore intentionally left unchanged.
     */
    if (
        authorizationHandoff.carevrRole !==
        "PRIMARY"
    ) {

        const {
            data: invitation,
            error: invitationError,
        } = await supabase
            .from("carevr_invitation")
            .select("id")
            .eq(
                "invited_user_id",
                userId
            )
            .eq(
                "family_id",
                authorizationHandoff.familyId
            )
            .eq(
                "role",
                authorizationHandoff.carevrRole
            )
            .eq(
                "status",
                "ACCEPTED"
            )
            .is(
                "consent_accepted_at",
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

        if (invitationError) {

            throw invitationError;

        }

        if (!invitation) {

            throw new Error(
                "Accepted CareVR invitation was not found for the authorized user."
            );

        }

        const authorizationCompletedAt =
            new Date().toISOString();

        const {
            error: invitationUpdateError,
        } = await supabase
            .from("carevr_invitation")
            .update({
                consent_accepted_at:
                    authorizationCompletedAt,

                authorised_at:
                    authorizationCompletedAt,

                updated_at:
                    authorizationCompletedAt,
            })
            .eq(
                "id",
                invitation.id
            );

        if (invitationUpdateError) {

            throw invitationUpdateError;

        }

    }

}

    async hasAcceptedCurrentConsent(): Promise<boolean> {

        return await consentRepository
            .hasAcceptedCurrentConsent();

    }

}

export const consentStorage =
    new ConsentStorage();