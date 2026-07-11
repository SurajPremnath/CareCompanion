export interface Consent {

    id: string;

    userId: string;

    consentVersion: number;

    privacyPolicyVersion: number;

    termsVersion: number;

    medicalDisclaimerVersion: number;

    aiDisclaimerVersion: number;

    accepted: boolean;

    acceptedAt: Date | null;

    language: string;

    createdAt: Date;

    updatedAt: Date;

}