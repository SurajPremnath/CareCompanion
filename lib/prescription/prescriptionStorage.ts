import type {
    ExtractedPrescription,
} from "@/lib/prescription-image/prescriptionImageTypes";

import {
    mapReviewedPrescriptionToSaveInput,
} from "@/lib/prescription/prescriptionMapper";

import {
    prescriptionRepository,
} from "@/lib/prescription/prescriptionRepository";

import type {
    CompletePrescriptionRecord,
    PrescriptionRecordContext,
} from "@/lib/prescription/prescriptionTypes";


//------------------------------------------------------------
// Save Context
//------------------------------------------------------------

export interface PrescriptionSaveContext {

    userId: string;

    patientId: string | null;

    familyId: string | null;

    recordContext:
        PrescriptionRecordContext;

}


//------------------------------------------------------------
// Normalise Consultation Date
//------------------------------------------------------------

function normaliseConsultationDate(
    value: string | null
): string | null {

    if (!value) {

        return null;

    }


    const trimmedValue =
        value.trim();


    if (!trimmedValue) {

        return null;

    }


    //--------------------------------------------------------
    // Already ISO YYYY-MM-DD
    //--------------------------------------------------------

    const isoDatePattern =
        /^\d{4}-\d{2}-\d{2}$/;


    if (
        isoDatePattern.test(
            trimmedValue
        )
    ) {

        const parsedDate =
            new Date(
                `${trimmedValue}T00:00:00Z`
            );


        if (
            !Number.isNaN(
                parsedDate.getTime()
            )
        ) {

            return trimmedValue;

        }

    }


    //--------------------------------------------------------
    // DD/MM/YYYY or DD-MM-YYYY
    //--------------------------------------------------------

    const dayFirstMatch =
        trimmedValue.match(
            /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/
        );


    if (dayFirstMatch) {

        const day =
            Number(
                dayFirstMatch[1]
            );

        const month =
            Number(
                dayFirstMatch[2]
            );

        const year =
            Number(
                dayFirstMatch[3]
            );


        const candidate =
            new Date(
                Date.UTC(
                    year,
                    month - 1,
                    day
                )
            );


        const isValid =
            candidate.getUTCFullYear() === year &&
            candidate.getUTCMonth() === month - 1 &&
            candidate.getUTCDate() === day;


        if (isValid) {

            return [
                year.toString().padStart(
                    4,
                    "0"
                ),

                month.toString().padStart(
                    2,
                    "0"
                ),

                day.toString().padStart(
                    2,
                    "0"
                ),

            ].join("-");

        }

    }


    //--------------------------------------------------------
    // Do Not Guess Ambiguous / Unrecognised Dates
    //--------------------------------------------------------

    return null;

}


//------------------------------------------------------------
// Validate Context
//------------------------------------------------------------

function validateContext(
    context:
        PrescriptionSaveContext
): void {


    if (
        !context.userId.trim()
    ) {

        throw new Error(
            "Authenticated user is required."
        );

    }


    if (
        context.recordContext === "SELF" &&
        context.patientId !== null
    ) {

        throw new Error(
            "Self prescription cannot have a patient."
        );

    }


    if (
        context.recordContext === "FAMILY" &&
        !context.patientId
    ) {

        throw new Error(
            "Please select a patient before saving the prescription."
        );

    }

}


//------------------------------------------------------------
// Prescription Storage
//------------------------------------------------------------

export const prescriptionStorage = {

    async savePrescription(

        prescription:
            ExtractedPrescription,

        context:
            PrescriptionSaveContext

    ): Promise<CompletePrescriptionRecord> {


        //----------------------------------------------------
        // Validate Context
        //----------------------------------------------------

        validateContext(
            context
        );


        //----------------------------------------------------
        // Prepare Reviewed Copy
        //----------------------------------------------------

        const preparedPrescription:
            ExtractedPrescription = {

                ...prescription,

                consultationDate:
                    normaliseConsultationDate(
                        prescription
                            .consultationDate
                    ),

            };


        //----------------------------------------------------
        // Map To Persistence Input
        //----------------------------------------------------

        const saveInput =
            mapReviewedPrescriptionToSaveInput(

                preparedPrescription,

                {

                    userId:
                        context.userId,

                    patientId:
                        context.patientId,

                    familyId:
                        context.familyId,

                    recordContext:
                        context.recordContext,

                }

            );


        //----------------------------------------------------
        // Save Structured Data
        //----------------------------------------------------

        return prescriptionRepository
            .create(
                saveInput
            );

    },

};