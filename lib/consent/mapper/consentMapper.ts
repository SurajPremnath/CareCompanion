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