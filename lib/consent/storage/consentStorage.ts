import {
    consentRepository,
} from "@/lib/consent/repository/consentRepository";

import type {
    Consent,
} from "@/lib/consent/models/Consent";

export class ConsentStorage {

    async getCurrentUserConsent():
        Promise<Consent | null> {

        return await consentRepository
            .getCurrentUserConsent();

    }

}

export const consentStorage =
    new ConsentStorage();