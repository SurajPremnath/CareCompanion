import type { PrescriptionExample } from "../prescriptionExamples";

export const CONSULTATION_EXAMPLES: PrescriptionExample[] = [

    {

        title:
            "Consultation Note with Symptoms and Clinical Plan",

        doctorWrites: `

Tiredness x 1 week

Dry cough

Chest congestion

Shortness of breath on exertion

Mild chest tightness

Likely Viral URTI

CBC

Chest X-Ray

Steam inhalation

Paracetamol SOS

`,

        expectedExtraction: {

            diagnosis:
                "Likely Viral URTI",

            clinicalAssessments: [

                "Likely Viral URTI",

            ],

            consultationVitals: {

                weight:
                    "72.2 kg",

                height:
                    null,

                bmi:
                    null,

                bloodPressure:
                    "114/78",

                pulse:
                    "115",

                respiratoryRate:
                    null,

                spo2:
                    "95%",

                temperature:
                    "35.4°C",

            },

            presentingComplaints: [

                {

                    complaint:
                        "Tiredness",

                    duration:
                        "1 week",

                },

                {

                    complaint:
                        "Dry cough",

                    duration:
                        null,

                },

                {

                    complaint:
                        "Chest congestion",

                    duration:
                        null,

                },

                {

                    complaint:
                        "Shortness of breath on exertion",

                    duration:
                        null,

                },

                {

                    complaint:
                        "Mild chest tightness",

                    duration:
                        null,

                },

            ],

            history: [

                {

                    category:
                        "MEDICAL",

                    value:
                        "Hypertension",

                },

                {

                    category:
                        "MEDICAL",

                    value:
                        "Diabetes Mellitus",

                },

                {

                    category:
                        "MEDICATION",

                    value:
                        "Stopped Statin",

                },

                {

                    category:
                        "LIFESTYLE",

                    value:
                        "Vegetarian",

                },

                {

                    category:
                        "SOCIAL",

                    value:
                        "Lives in apartment",

                },

            ],

            medicines: [

                {

                    name:
                        "Paracetamol",

                    strength:
                        null,

                    dose:
                        null,

                    frequency:
                        "SOS",

                    duration:
                        null,

                },

            ],

            doctorInstructions: [

                "Steam inhalation",

            ],

            investigations: [

                "CBC",

                "Chest X-Ray",

            ],

additionalNotes:
    [],

        },

    },

];