import type {
    CompletePrescriptionRecord,
} from "@/lib/prescription/prescriptionTypes";

import type {
    CreateClinicalEventDetailRequest,
} from "@/lib/types/clinicalEventDetail";


export class ClinicalEventDetailBuilder {

    //------------------------------------------------------------
    // Prescription -> Clinical Event Detail
    //------------------------------------------------------------

    static fromPrescription(

        record:
            CompletePrescriptionRecord,

        clinicalEventId:
            string

    ): CreateClinicalEventDetailRequest {

        const prescription =
            record.prescription;


        //--------------------------------------------------------
        // Medicines
        //--------------------------------------------------------

        const medications =
            record.medicines.map(
                medicine => ({

                    name:
                        medicine.medicineName,

                    strength:
                        medicine.strength,

                    dose:
                        medicine.dose,

                    frequency:
                        medicine.frequency,

                    timings:
                        medicine.timings,

                    duration:
                        medicine.duration,

                    instructions:
                        medicine.instructions,

                })
            );


        //--------------------------------------------------------
        // Initial Journey
        //
        // Journey intelligence will be added later.
        //--------------------------------------------------------

        return {

            clinicalEventId,

            journeyId:
                "JNY-001",

            sequenceNumber:
                1,

            facilityName:
                prescription.hospitalOrClinic,

            providerName:
                prescription.doctorName,

            providerType:
                null,

            interactionMode:
                prescription.consultationMode,

            encounterType:
                "FIRST_DOCUMENT",

            diagnosis:
                prescription.diagnosisOrAssessment,

            diseaseStage:
                null,

            diagnostics:
                null,

            biomarkersGenetics:
                null,

            medications,

        };

    }

}