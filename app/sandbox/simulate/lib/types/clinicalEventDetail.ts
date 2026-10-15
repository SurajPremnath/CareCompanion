export interface ClinicalEventDetail {

    id: string;

    clinicalEventId: string;

    journeyId: string;

    sequenceNumber: number;

    facilityName: string | null;

    providerName: string | null;

    providerType: string | null;

    interactionMode: string | null;

    encounterType: string | null;

    diagnosis: string | null;

    diseaseStage: string | null;

    diagnostics: unknown[] | null;

    biomarkersGenetics: unknown[] | null;

    medications: unknown[] | null;

    createdAt: string;

}


export interface CreateClinicalEventDetailRequest {

    clinicalEventId: string;

    journeyId: string;

    sequenceNumber: number;

    facilityName: string | null;

    providerName: string | null;

    providerType: string | null;

    interactionMode: string | null;

    encounterType: string | null;

    diagnosis: string | null;

    diseaseStage: string | null;

    diagnostics: unknown[] | null;

    biomarkersGenetics: unknown[] | null;

    medications: unknown[] | null;

}