import type { PrescriptionExample } from "../prescriptionExamples";

export const GENERAL_MEDICINE_EXAMPLES: PrescriptionExample[] = [

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
                null,

            investigations: [

                "CBC",

                "ECG",

            ],

        },

    },

];