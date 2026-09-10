export interface Consent {

    id: string;

    userId: string;

    consentVersion: number;

    privacyPolicyVersion: number;

    termsVersion: number;

    medicalDisclaimerVersion: number;

    aiDisclaimerVersion: number;

    privacyPanel: boolean;

    familyPanel: boolean;

    trackingPanel: boolean;

    securityPanel: boolean;

    medicalPanel: boolean;

    legalDataProtectionPanel: boolean;

    storageProcessingPanel: boolean;

    retentionDeletionPanel: boolean;

    voluntaryProcessingAgreement: boolean;

    termsMedicalAgreement: boolean;

    privacyPolicyAcknowledgement: boolean;

    accepted: boolean;

    acceptedAt: Date | null;

    language: string;

    createdAt: Date;

    updatedAt: Date;

}