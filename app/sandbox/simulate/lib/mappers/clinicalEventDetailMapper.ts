import type {
    ClinicalEventDetail,
    CreateClinicalEventDetailRequest,
} from "@/lib/types/clinicalEventDetail";


export class ClinicalEventDetailMapper {

    //------------------------------------------------------------
    // Domain -> Database Insert
    //------------------------------------------------------------

    static toInsert(
        detail: CreateClinicalEventDetailRequest
    ) {

        return {

            clinical_event_id:
                detail.clinicalEventId,

            journey_id:
                detail.journeyId,

            sequence_number:
                detail.sequenceNumber,

            facility_name:
                detail.facilityName,

            provider_name:
                detail.providerName,

            provider_type:
                detail.providerType,

            interaction_mode:
                detail.interactionMode,

            encounter_type:
                detail.encounterType,

            diagnosis:
                detail.diagnosis,

            disease_stage:
                detail.diseaseStage,

            diagnostics:
                detail.diagnostics,

            biomarkers_genetics:
                detail.biomarkersGenetics,

            medications:
                detail.medications,

        };

    }


    //------------------------------------------------------------
    // Database -> Domain
    //------------------------------------------------------------

    static toDomain(
        row: any
    ): ClinicalEventDetail {

        return {

            id:
                row.id,

            clinicalEventId:
                row.clinical_event_id,

            journeyId:
                row.journey_id,

            sequenceNumber:
                row.sequence_number,

            facilityName:
                row.facility_name,

            providerName:
                row.provider_name,

            providerType:
                row.provider_type,

            interactionMode:
                row.interaction_mode,

            encounterType:
                row.encounter_type,

            diagnosis:
                row.diagnosis,

            diseaseStage:
                row.disease_stage,

            diagnostics:
                row.diagnostics,

            biomarkersGenetics:
                row.biomarkers_genetics,

            medications:
                row.medications,

            createdAt:
                row.created_at,

        };

    }

}