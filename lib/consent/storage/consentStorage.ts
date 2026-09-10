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
    >
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

    const authorizationHandoff =
        carevrAuthorizationHandoff.get();

    if (!authorizationHandoff) {

        throw new Error(
            "CareVR authorization handoff is missing."
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

    const {
        data: carevrAccess,
        error: carevrAccessError,
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
        .select("id")
        .single();

    if (carevrAccessError) {

        throw carevrAccessError;

    }

    const permissions =
        governanceModules.map(
            (governanceModule) => ({
                carevr_access_id:
                    carevrAccess.id,

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