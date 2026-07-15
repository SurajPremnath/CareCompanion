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

    //--------------------------------------------------------
    // New Normalized Sections
    //--------------------------------------------------------

    vitals:
        reviewedPrescription.consultationVitals
            ? {

                weight:
                    normaliseOptionalText(
                        reviewedPrescription.consultationVitals.weight
                    ),

                height:
                    normaliseOptionalText(
                        reviewedPrescription.consultationVitals.height
                    ),

                bmi:
                    normaliseOptionalText(
                        reviewedPrescription.consultationVitals.bmi
                    ),

                bloodPressure:
                    normaliseOptionalText(
                        reviewedPrescription.consultationVitals.bloodPressure
                    ),

                pulse:
                    normaliseOptionalText(
                        reviewedPrescription.consultationVitals.pulse
                    ),

                respiratoryRate:
                    normaliseOptionalText(
                        reviewedPrescription.consultationVitals.respiratoryRate
                    ),

                spo2:
                    normaliseOptionalText(
                        reviewedPrescription.consultationVitals.spo2
                    ),

                temperature:
                    normaliseOptionalText(
                        reviewedPrescription.consultationVitals.temperature
                    ),

            }
            : null,

    symptoms:

        reviewedPrescription.presentingComplaints.map(
            (item, index) => ({

                symptom: item.complaint,

                duration:
                    normaliseOptionalText(
                        item.duration
                    ),

                displayOrder:
                    index,

            })
        ),

    history:

        reviewedPrescription.history.map(
            (item, index) => ({

                category:
                    item.category,

                value:
                    item.value,

                displayOrder:
                    index,

            })
        ),

    assessments: [

        ...(reviewedPrescription.diagnosisOrAssessment
            ? [{
                assessmentType: "DIAGNOSIS" as const,
                value: reviewedPrescription.diagnosisOrAssessment,
                displayOrder: 0,
            }]
            : []),

        ...reviewedPrescription.clinicalAssessments.map(
            (item, index) => ({

                assessmentType:
                    "CLINICAL_ASSESSMENT" as const,

                value: item,

                displayOrder:
                    index + 1,

            })
        ),

        ...reviewedPrescription.examinationFindings.map(
            (item, index) => ({

                assessmentType:
                    "EXAMINATION_FINDING" as const,

                value:
                    item.finding,

                displayOrder:
                    index,

            })
        ),

        ...reviewedPrescription.clinicalPlan.map(
            (item, index) => ({

                assessmentType:
                    "PLAN" as const,

                value:
                    item,

                displayOrder:
                    index,

            })
        ),

    ],

    investigations:

        reviewedPrescription.investigations.map(
            (item, index) => ({

                investigation:
                    item,

                displayOrder:
                    index,

            })
        ),

    instructions:

        reviewedPrescription.doctorInstructions.map(
            (item, index) => ({

                instruction:
                    item,

                displayOrder:
                    index,

            })
        ),

notes:

    reviewedPrescription.additionalNotes

        .map(
            (note, index) => ({

                note,

                displayOrder: index,

            })
        ),

    //--------------------------------------------------------

additionalNotes: null,

    medicines,

};

}