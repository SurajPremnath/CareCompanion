import type { PrescriptionExample } from "../prescriptionExamples";

export const ONCOLOGY_EXAMPLES: PrescriptionExample[] = [

    {

        title:
            "Simple Oncology Prescription",

        doctorWrites: `

A Ca Lung

Tab. Capmatinib 200 mg

1-0-1

Daily

x One Month

`,

        expectedExtraction: {

            diagnosis:
                "A Ca Lung",

            medicines: [

                {

                    name:
                        "Capmatinib",

                    strength:
                        "200 mg",

                    dose:
                        "1-0-1",

                    frequency:
                        "Daily",

                    duration:
                        "One Month",

                },

            ],

            additionalNotes:
                null,

            investigations: [],

        },

    },

];