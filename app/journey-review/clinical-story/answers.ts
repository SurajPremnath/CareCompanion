import {
    ClinicalStoryContext
}
from "./storyContext";

import {
    symptomLabels
} from "./symptomMapper";


export interface ClinicalAnswers {

    Q1: string;

    Q2: string;

    Q3: string;

    Q4: string;

}



function generateVitalObservation(
    week:any
): string {



const vitals =
    week.vitals || {};


const temperatures =
    vitals.temperature || [];


const pulses =
    vitals.pulse || [];


const spo2 =
    vitals.spo2 || [];



let result = "";


    const observations = [];



    if (
        spo2.length
    ) {

        const lowest =
            Math.min(
                ...spo2
            );


        if (
            lowest < 94
        ) {

            observations.push(
    `Lowest SpO₂\n${lowest}%`
);

        }

    }



    if (
        pulses.length
    ) {

        const highest =
            Math.max(
                ...pulses
            );


        if (
            highest > 110
        ) {

            observations.push(
    `Highest Pulse\n${highest} bpm`
);

        }

    }



    if (
        observations.length
    ) {

        result +=
            "\n\nNotable observations:\n• "
            +
            observations.join(
                "\n• "
            );

    }
    else {

        result +=
            "\n\nNo significant variations were observed during this period.";

    }


    return result;

}

function generateTreatmentObservation(
    symptoms:any[]
): string {


    const treatmentSymptoms = [
        "WEAKNESS",
        "LOSS_OF_APPETITE",
        "NAUSEA",
        "VOMITING",
        "FATIGUE",
        "EDEMA"
    ];


    const recorded =
        symptoms.filter(
            symptom =>
                treatmentSymptoms.includes(
                    symptom
                )
        );


    if (
        recorded.length === 0
    ) {

        return (
            "No treatment-related symptoms were recorded during this period."
        );

    }


    return (
        `Treatment-related symptoms recorded: ${
            [
                ...new Set(recorded)
            ].join(", ")
        }.`
    );

}


function generateObjectiveMeasurements(
    week:any
): string {


    const measurements = [];


    const vitals =
        week.vitals || {};



    if (
        vitals.temperature &&
        vitals.temperature.length > 0
    ) {

        measurements.push(
            "Temperature"
        );

    }


    if (
        vitals.pulse &&
        vitals.pulse.length > 0
    ) {

        measurements.push(
            "Pulse"
        );

    }


    if (
        vitals.spo2 &&
        vitals.spo2.length > 0
    ) {

        measurements.push(
            "Oxygen saturation"
        );

    }


    if (
        vitals.systolic &&
        vitals.systolic.length > 0
    ) {

        measurements.push(
            "Blood pressure"
        );

    }


    if (
        week.weight &&
        week.weight.length > 0
    ) {

        measurements.push(
            "Weight"
        );

    }


    if (
        week.assessments &&
        week.assessments.length > 0
    ) {

        measurements.push(
            "Assessment records"
        );

    }


    if (
        measurements.length === 0
    ) {

        return (
            "No objective measurements were recorded during this period."
        );

    }


return measurements.join("\n");

}

function generateClinicalEvents(
    week:any
): string {


    const events = [];


    const symptoms =
        week.symptoms || [];



    if (
        symptoms.includes(
            "BLOOD_IN_COUGH"
        )
    ) {

        events.push(
            "Blood in cough."
        );

    }


    if (
        symptoms.includes(
            "FEVER"
        )
    ) {

        events.push(
            "Fever."
        );

    }


    if (
        symptoms.includes(
            "BREATHING_DIFFICULTY"
        )
    ) {

        events.push(
            "Breathing difficulty."
        );

    }


    if (
        week.assessments &&
        week.assessments.length > 0
    ) {

        events.push(
            "Assessment records were completed."
        );

    }



    if (
        events.length === 0
    ) {

        return (
            "No specific clinical events were recorded during this period."
        );

    }


    return events.join(" ");

}

function generateFeelingSummary(
    symptoms:string[] = []
): string {


    if (
        symptoms.length === 0
    ) {

        return (
            "No symptoms were reported during this period."
        );

    }


const displaySymptoms = [
    ...new Set(
        symptoms
            .filter(
                symptom =>
                    symptom !== "OTHER"
            )
            .map(
                symptom => {

                    const label =
                        symptomLabels[symptom] ||
                        symptom;

                    return label
                        .toLowerCase()
                        .replace(
                            /\b\w/g,
                            char => char.toUpperCase()
                        );

                }
            )
    )
];

    if (
        displaySymptoms.length === 0
    ) {

        return (
            "No specific symptoms were reported during this period."
        );

    }


    return (
    `${displaySymptoms.join(", ")}`
);

}

export function generateClinicalAnswers(
    week: any,
    context: ClinicalStoryContext
): ClinicalAnswers {


return {

Q1:
    generateFeelingSummary(
        week.symptoms
    ),


Q2:
    generateVitalObservation(
        week
    ),


    Q3:
    generateObjectiveMeasurements(
        week
    ),


    Q4:
    generateClinicalEvents(
        week
    )

};

}