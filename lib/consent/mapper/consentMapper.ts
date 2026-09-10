import type {
    Consent,
} from "@/lib/consent/models/Consent";

export interface ConsentRow {

    id: string;

    user_id: string;

    consent_version: number;

    privacy_policy_version: number;

    terms_version: number;

    medical_disclaimer_version: number;

    ai_disclaimer_version: number;

    privacy_panel: boolean;

    family_panel: boolean;

    tracking_panel: boolean;

    security_panel: boolean;

    medical_panel: boolean;

    legal_data_protection_panel: boolean;

    storage_processing_panel: boolean;

    retention_deletion_panel: boolean;

    voluntary_processing_agreement: boolean;

    terms_medical_agreement: boolean;

    privacy_policy_acknowledgement: boolean;

    accepted: boolean;

    accepted_at: string | null;

    language: string;

    created_at: string;

    updated_at: string;

}

export class ConsentMapper {

    static toDomain(
        row: ConsentRow
    ): Consent {

        return {

            id: row.id,

            userId: row.user_id,

            consentVersion:
                row.consent_version,

            privacyPolicyVersion:
                row.privacy_policy_version,

            termsVersion:
                row.terms_version,

            medicalDisclaimerVersion:
                row.medical_disclaimer_version,

            aiDisclaimerVersion:
                row.ai_disclaimer_version,

            privacyPanel:
                row.privacy_panel,

            familyPanel:
                row.family_panel,

            trackingPanel:
                row.tracking_panel,

            securityPanel:
                row.security_panel,

            medicalPanel:
                row.medical_panel,

            legalDataProtectionPanel:
                row.legal_data_protection_panel,

            storageProcessingPanel:
                row.storage_processing_panel,

            retentionDeletionPanel:
                row.retention_deletion_panel,

            voluntaryProcessingAgreement:
                row.voluntary_processing_agreement,

            termsMedicalAgreement:
                row.terms_medical_agreement,

            privacyPolicyAcknowledgement:
                row.privacy_policy_acknowledgement,

            accepted:
                row.accepted,

            acceptedAt:
                row.accepted_at
                    ? new Date(
                        row.accepted_at
                    )
                    : null,

            language:
                row.language,

            createdAt:
                new Date(
                    row.created_at
                ),

            updatedAt:
                new Date(
                    row.updated_at
                ),

        };

    }

    static toInsert(
        consent: Omit<
            Consent,
            "id" |
            "createdAt" |
            "updatedAt"
        >
    ) {

        return {

            user_id:
                consent.userId,

            consent_version:
                consent.consentVersion,

            privacy_policy_version:
                consent.privacyPolicyVersion,

            terms_version:
                consent.termsVersion,

            medical_disclaimer_version:
                consent.medicalDisclaimerVersion,

            ai_disclaimer_version:
                consent.aiDisclaimerVersion,

            privacy_panel:
                consent.privacyPanel,

            family_panel:
                consent.familyPanel,

            tracking_panel:
                consent.trackingPanel,

            security_panel:
                consent.securityPanel,

            medical_panel:
                consent.medicalPanel,

            legal_data_protection_panel:
                consent.legalDataProtectionPanel,

            storage_processing_panel:
                consent.storageProcessingPanel,

            retention_deletion_panel:
                consent.retentionDeletionPanel,

            voluntary_processing_agreement:
                consent.voluntaryProcessingAgreement,

            terms_medical_agreement:
                consent.termsMedicalAgreement,

            privacy_policy_acknowledgement:
                consent.privacyPolicyAcknowledgement,

            accepted:
                consent.accepted,

            accepted_at:
                consent.acceptedAt
                    ? consent.acceptedAt.toISOString()
                    : null,

            language:
                consent.language,

        };

    }

}