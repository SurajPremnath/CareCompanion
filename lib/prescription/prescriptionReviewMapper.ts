import type {
    CompletePrescriptionRecord,
} from "@/lib/prescription/prescriptionTypes";

import type {
    ExtractedPrescription,
} from "@/lib/prescription-image/prescriptionImageTypes";

export function mapPrescriptionToReview(

    record: CompletePrescriptionRecord

): ExtractedPrescription {


return {

    //--------------------------------------------------------
    // Patient Identity
    //--------------------------------------------------------

patientIdentity: {

    patientName: null,

    patientDateOfBirth: null,

    patientAge: null,

    patientGender: null,

    patientUHID: null,

    patientNameVariations: [],

    //--------------------------------------------------------
    // Demographic Extraction Provenance
    //--------------------------------------------------------

    ageFlag: false,

    sexFlag: false,

    ageSource: null,

    sexSource: null,

},


    //--------------------------------------------------------
    // Encounter Identity
    //--------------------------------------------------------

    encounterIdentity: {

        doctorName:
            record.prescription.doctorName,

        doctorType:
            null,

        hospitalOrClinic:
            record.prescription.hospitalOrClinic,

        hospitalNameVariations: [],

        consultationDate:
            record.prescription.consultationDate,

        consultationMode:
            record.prescription.consultationMode,

    },


    //--------------------------------------------------------
    // Document Metadata
    //--------------------------------------------------------

    documentMetadata: {

        studyDateTime:
            null,

        reportDateTime:
            null,

        originalPatientName:
            null,

        originalHospitalName:
            null,

        documentType:
            "PRESCRIPTION",

    },


    //--------------------------------------------------------
    // Existing Clinical Data
    //--------------------------------------------------------

    consultationVitals:

        record.vitals
            ? {
                weight:
                    record.vitals.weight,

                height:
                    record.vitals.height,

                bmi:
                    record.vitals.bmi,

                bloodPressure:
                    record.vitals.bloodPressure,

                pulse:
                    record.vitals.pulse,

                respiratoryRate:
                    record.vitals.respiratoryRate,

                spo2:
                    record.vitals.spo2,

                temperature:
                    record.vitals.temperature,

            }
            : null,

    diagnosisOrAssessment:
        record.prescription.diagnosisOrAssessment,

    clinicalAssessments:

        record.assessments
            .filter(
                item =>
                    item.assessmentType ===
                    "CLINICAL_ASSESSMENT"
            )
            .map(
                item =>
                    item.value
            ),

    symptoms:

        record.symptoms.map(
            item =>
                item.symptom
        ),

    presentingComplaints:

        record.symptoms.map(
            item => ({

                complaint:
                    item.symptom,

                duration:
                    item.duration,

            })
        ),

    pastMedicalHistory: [],

    history:

        record.history.map(
            item => ({

                category:
                    item.category as
                    | "MEDICAL"
                    | "SURGICAL"
                    | "MEDICATION"
                    | "ALLERGY"
                    | "LIFESTYLE"
                    | "SOCIAL"
                    | "OTHER",

                value:
                    item.value,

            })
        ),

    examinationFindings: [],

    doctorInstructions:

        record.instructions.map(
            item =>
                item.instruction
        ),

    followUpPlan: [],

    medicines:

        record.medicines
            .filter(
                medicine =>
                    medicine.validationStatus ===
                    "VALIDATED"
            )
            .map(
                medicine => ({

                    name:
                        medicine.medicineName,

                    strength:
                        medicine.strength,

                    form:
                        medicine.form,

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

                    reviewStatus:
                        "VERIFIED",

                })
            ),

    additionalNotes:

        [

            ...(record.prescription.additionalNotes
                ? [
                    record.prescription.additionalNotes,
                ]
                : []),

            ...record.notes.map(
                item =>
                    item.note
            ),

        ],

    investigations:

        record.investigations.map(
            item =>
                item.investigation
        ),

    clinicalPlan:

        record.assessments
            .filter(
                item =>
                    item.assessmentType ===
                    "PLAN"
            )
            .map(
                item =>
                    item.value
            ),

};

}