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
    CURRENT_CONSENT_VERSION,
    CURRENT_PRIVACY_POLICY_VERSION,
    CURRENT_TERMS_VERSION,
    CURRENT_MEDICAL_DISCLAIMER_VERSION,
    CURRENT_AI_DISCLAIMER_VERSION,
    DEFAULT_CONSENT_LANGUAGE,
} from "@/lib/constants/consentVersions";

export class ConsentStorage {

    async acceptConsent(): Promise<void> {

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

language:
    DEFAULT_CONSENT_LANGUAGE,

    accepted: true,

    acceptedAt: new Date(),

});

    }

async hasAcceptedCurrentConsent(): Promise<boolean> {

    return await consentRepository
        .hasAcceptedCurrentConsent();

}

}

export const consentStorage =
    new ConsentStorage();