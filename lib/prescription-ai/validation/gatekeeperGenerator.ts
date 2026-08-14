//------------------------------------------------------------
// CareVR Gatekeeper Generator
//------------------------------------------------------------

import { ExtractedPrescription } from "@/lib/prescription-image/prescriptionImageTypes";

export interface ValidationField {
    name: string;
    extracted: unknown;
}

export interface ValidationCard {
    card: string;
    fields: ValidationField[];
}

export function generateValidationCards(
    extraction: ExtractedPrescription
): ValidationCard[] {

    return [

{
    card: "Patient Information",
    fields: [
        field(
            "Patient Name",
            extraction.patientIdentity.patientName
        ),

        field(
            "Age",
            extraction.patientIdentity.patientAge
        ),

        field(
            "Gender",
            extraction.patientIdentity.patientGender
        ),

        field(
            "UHID",
            extraction.patientIdentity.patientUHID
        ),
    ],
},

{
    card: "Consultation",
    fields: [
        field(
            "Doctor Name",
            extraction.encounterIdentity.doctorName
        ),

        field(
            "Doctor Type",
            extraction.encounterIdentity.doctorType
        ),

        field(
            "Hospital",
            extraction.encounterIdentity.hospitalOrClinic
        ),

        field(
            "Consultation Date",
            extraction.encounterIdentity.consultationDate
        ),

        field(
            "Consultation Mode",
            extraction.encounterIdentity.consultationMode
        ),
    ],
},

        {
            card: "Presenting Complaints",
            fields: [
                field(
                    "Presenting Complaints",
                    extraction.presentingComplaints ?? []
                ),
            ],
        },

        {
            card: "Symptoms",
            fields: [
                field(
                    "Symptoms",
                    extraction.symptoms ?? []
                ),
            ],
        },

        {
            card: "History",
            fields: [
                field(
                    "History",
                    extraction.history ?? []
                ),
            ],
        },

        {
            card: "Examination Findings",
            fields: [
                field(
                    "Examination Findings",
                    extraction.examinationFindings ?? []
                ),
            ],
        },

        {
            card: "Consultation Vitals",
            fields: [
                field(
                    "Vitals",
                    extraction.consultationVitals ?? {}
                ),
            ],
        },

        {
            card: "Diagnosis",
            fields: [
                field(
                    "Diagnosis",
                    extraction.diagnosisOrAssessment
                ),
            ],
        },

        {
            card: "Clinical Assessments",
            fields: [
                field(
                    "Clinical Assessments",
                    extraction.clinicalAssessments ?? []
                ),
            ],
        },

        {
            card: "Medicines",
            fields: [
                field(
                    "Medicines",
                    extraction.medicines ?? []
                ),
            ],
        },

        {
            card: "Investigations",
            fields: [
                field(
                    "Investigations",
                    extraction.investigations ?? []
                ),
            ],
        },

        {
            card: "Doctor Instructions",
            fields: [
                field(
                    "Doctor Instructions",
                    extraction.doctorInstructions ?? []
                ),
            ],
        },

        {
            card: "Follow Up",
            fields: [
                field(
                    "Follow Up",
                    extraction.followUpPlan ?? []
                ),
            ],
        },

        {
            card: "Clinical Plan",
            fields: [
                field(
                    "Clinical Plan",
                    extraction.clinicalPlan ?? []
                ),
            ],
        },

        {
            card: "Additional Notes",
            fields: [
                field(
                    "Additional Notes",
                    extraction.additionalNotes ?? []
                ),
            ],
        },

    ];
}

function field(
    name: string,
    extracted: unknown
): ValidationField {

    return {
        name,
        extracted,
    };
}