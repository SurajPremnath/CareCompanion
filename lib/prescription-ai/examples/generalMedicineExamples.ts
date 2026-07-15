import type { PrescriptionExample } from "../prescriptionExamples";

export const GENERAL_MEDICINE_EXAMPLES: PrescriptionExample[] = [

{
    title:
        "Past Medical History Extraction",

    doctorWrites: `

Past

HTN ×20 yrs

Add. Hernia

`,

expectedExtraction: {

    diagnosis:
        null,

    clinicalAssessments: [],

    medicines: [],

    investigations: [],

    doctorInstructions: [],

    additionalNotes: [],

    history: [

        {
            category: "MEDICAL",
            value: "Hypertension (20 years)",
        },

        {
            category: "SURGICAL",
            value: "Hernia",
        },

    ],

},

},

    {

        title:
            "Medicine With Investigation",

        doctorWrites: `

Hypertension

Tab. Telma 40

1-0-0

Continue

CBC

ECG

`,

        expectedExtraction: {

            diagnosis:
                "Hypertension",

            medicines: [

                {

                    name:
                        "Telma",

                    strength:
                        "40",

                    dose:
                        "1-0-0",

                    frequency:
                        "Continue",

                    duration:
                        null,

                },

            ],

            additionalNotes:
    [],

            investigations: [

                "CBC",

                "ECG",

            ],

        },

    },

];