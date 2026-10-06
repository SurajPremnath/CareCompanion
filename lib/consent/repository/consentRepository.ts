import { supabase } from "@/lib/supabase";

import {
    ConsentMapper,
    type ConsentRow,
} from "@/lib/consent/mapper/consentMapper";

import type {
    Consent,
} from "@/lib/consent/models/Consent";

import { BaseRepository } from "@/lib/repositories/BaseRepository";

import {
    CURRENT_CONSENT_VERSION,
} from "@/lib/constants/consentVersions";


export class ConsentRepository
    extends BaseRepository {


async hasAcceptedCurrentConsent(): Promise<boolean> {

    const consent =
        await this.getCurrentUserConsent();

    if (!consent) {

        return false;

    }

    return (

        consent.accepted &&

        consent.consentVersion ===
CURRENT_CONSENT_VERSION

    );

}

async create(
    consent: Omit<
        Consent,
        "id" |
        "createdAt" |
        "updatedAt"
    >
): Promise<Consent> {

    const payload =
        ConsentMapper.toInsert(
            consent
        );

    const {
        data,
        error,
    } = await supabase
        .from("user_consents")
        .insert(payload)
        .select()
        .single();

    if (error) {

        throw error;

    }

    return ConsentMapper.toDomain(
        data as ConsentRow
    );

}

async getCurrentUserConsent(): Promise<Consent | null> {

    const userId =
        await this.getCurrentUserId();

    const {
        data,
        error,
    } = await supabase
        .from("user_consents")
        .select("*")
        .eq("user_id", userId)
        .order(
    "accepted_at",
    {
        ascending: false,
    }
)
.limit(1)
.maybeSingle();

    if (error) {

        this.handleError(error);

    }

    if (!data) {

        return null;

    }

    return ConsentMapper.toDomain(
        data as ConsentRow
    );

}

}

export const consentRepository =
    new ConsentRepository();