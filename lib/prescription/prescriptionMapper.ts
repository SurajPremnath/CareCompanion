import type {
    ExtractedPrescription,
} from "@/lib/prescription-image/prescriptionImageTypes";

import type {
    PrescriptionRecordContext,
    PrescriptionSaveInput,
} from "@/lib/prescription/prescriptionTypes";


//------------------------------------------------------------
// Mapper Context
//------------------------------------------------------------

interface PrescriptionMapperContext {

    userId: string;

    patientId: string | null;

    familyId: string | null;

    recordContext:
        PrescriptionRecordContext;

}


//------------------------------------------------------------
// Normalise Optional Text
//------------------------------------------------------------

function normaliseOptionalText(
    value: string | null
): string | null {

    if (value === null) {

        return null;

    }


    const trimmedValue =
        value.trim();


    return trimmedValue.length > 0
        ? trimmedValue
        : null;

}


//------------------------------------------------------------
// Map Reviewed Prescription To Save Input
//------------------------------------------------------------

export function mapReviewedPrescriptionToSaveInput(

    reviewedPrescription:
        ExtractedPrescription,

    context:
        PrescriptionMapperContext

): PrescriptionSaveInput {


    //--------------------------------------------------------
    // Map Medicines
    //--------------------------------------------------------

    const medicines =
        reviewedPrescription
            .medicines
            .map(
                (
                    medicine,
                    index
                ) => ({

                    medicineName:
                        medicine.name.trim(),

                    strength:
                        normaliseOptionalText(
                            medicine.strength
                        ),

                    form:
                        normaliseOptionalText(
                            medicine.form
                        ),

                    dose:
                        normaliseOptionalText(
                            medicine.dose
                        ),

                    frequency:
                        normaliseOptionalText(
                            medicine.frequency
                        ),

                    timings:
                        medicine.timings
                            .map(
                                timing =>
                                    timing.trim()
                            )
                            .filter(Boolean),

                    duration:
                        normaliseOptionalText(
                            medicine.duration
                        ),

                    instructions:
                        normaliseOptionalText(
                            medicine.instructions
                        ),

                    displayOrder:
                        index,

                })
            )
            .filter(
                medicine =>
                    medicine.medicineName.length > 0
            );


    //--------------------------------------------------------
    // Build Save Input
    //--------------------------------------------------------

    return {

        userId:
            context.userId,

        patientId:
            context.recordContext === "SELF"
                ? null
                : context.patientId,

        familyId:
            context.familyId,

        recordContext:
            context.recordContext,

        doctorName:
            normaliseOptionalText(
                reviewedPrescription.doctorName
            ),

        consultationDate:
            normaliseOptionalText(
                reviewedPrescription.consultationDate
            ),

        consultationMode:
            reviewedPrescription.consultationMode,

        hospitalOrClinic:
            normaliseOptionalText(
                reviewedPrescription.hospitalOrClinic
            ),

        diagnosisOrAssessment:
            normaliseOptionalText(
                reviewedPrescription
                    .diagnosisOrAssessment
            ),

        additionalInstructions:
            normaliseOptionalText(
                reviewedPrescription
                    .additionalInstructions
            ),

        medicines,

    };

}