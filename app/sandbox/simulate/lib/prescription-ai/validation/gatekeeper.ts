//------------------------------------------------------------
// CareVR Gatekeeper
//------------------------------------------------------------

import { ValidationCard } from "./gatekeeperGenerator";
import { GATEKEEPER_PROMPT } from "./gatekeeperPrompt";

export interface GatekeeperCardResult {
    card: string;
    accurate: boolean;
}

export interface GatekeeperReport {
    overallAccurate: boolean;
    cards: GatekeeperCardResult[];
}

export async function validateCards(
    originalPrescription: string,
    cards: ValidationCard[]
): Promise<GatekeeperReport> {

    const results: GatekeeperCardResult[] = [];

    for (const card of cards) {

        const result = await validateSingleCard(
            originalPrescription,
            card
        );

        results.push(result);
    }

    return {
        overallAccurate: results.every(result => result.accurate),
        cards: results,
    };
}

async function validateSingleCard(
    originalPrescription: string,
    card: ValidationCard
): Promise<GatekeeperCardResult> {

// TODO:
// Replace this stub with OpenAI validation.

const accurate = true;

// Prevent unused variable warnings.
void originalPrescription;
void card;
void GATEKEEPER_PROMPT;

    return {
        card: card.card,
        accurate,
    };
}