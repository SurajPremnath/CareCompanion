import { supabase } from "@/lib/supabase";

import {
    ConsentMapper,
    type ConsentRow,
} from "@/lib/consent/mapper/consentMapper";

import type {
    Consent,
} from "@/lib/consent/models/Consent";

import { BaseRepository } from "@/lib/repositories/BaseRepository";

export class ConsentRepository
    extends BaseRepository {

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