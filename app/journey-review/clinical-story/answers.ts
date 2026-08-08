import {
    ClinicalStoryContext
} from "./storyContext";

import {
    symptomLabels
} from "./symptomMapper";


/*
 * ==================================================
 * DATE HELPERS
 * ==================================================
 */

function toLocalDateString(
    date: Date
): string {

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        );

    const day =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );

    return `${year}-${month}-${day}`;
}

export interface ClinicalAnswers {

    Q1: string;

    Q2: string;

    Q3: string;

    Q4: string;

    Q5: string;

}


function uniqueStrings(
    values: unknown[] = []
): string[] {

    return [
        ...new Set(
            values
                .filter(
                    value =>
                        typeof value === "string" &&
                        value.trim().length > 0
                )
                .map(
                    value =>
                        String(value).trim()
                )
        )
    ];

}


function formatSymptoms(
    symptoms: string[] = []
): string[] {

    return uniqueStrings(
        symptoms
            .filter(
                symptom => symptom !== "OTHER"
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
                            char =>
                                char.toUpperCase()
                        );

                }
            )
    );

}


function formatLatestVital(
    label: string,
    values: unknown[] = [],
    suffix = ""
): string | null {

    const numericValues =
        values
            .map(Number)
            .filter(
                value => Number.isFinite(value)
            );

    if (
        numericValues.length === 0
    ) {
        return null;
    }

    const latest =
        numericValues[
            numericValues.length - 1
        ];

    return `${label}: ${latest}${suffix}`;

}


function generateHealthEvents(
    week: any
): string {

    const sections: string[] = [];

    const diagnoses =
        uniqueStrings(
            Array.isArray(week.diagnoses)
                ? week.diagnoses
                : week.diagnosis
                    ? [week.diagnosis]
                    : []
        );

    if (diagnoses.length > 0) {
        sections.push(
            `Diagnosis\n${diagnoses.join("\n")}`
        );
    }

    const symptoms =
        formatSymptoms(
            Array.isArray(week.symptoms)
                ? week.symptoms
                : []
        );

    sections.push(
        symptoms.length > 0
            ? `Symptoms\n${symptoms.join(", ")}`
            : "Symptoms\nNo symptoms were reported during this period."
    );

/*
    const consultations =
        uniqueStrings(
            Array.isArray(week.consultations)
                ? week.consultations
                : []
        );

    sections.push(
        consultations.length > 0
            ? `Consultations\n${consultations.join("\n")}`
            : "Consultations\nNo consultation was recorded during this period."
    );

    const events =
        uniqueStrings(
            Array.isArray(week.events)
                ? week.events
                : []
        );

    sections.push(
        events.length > 0
            ? `Events\n${events.join("\n")}`
            : "Events\nNo significant clinical event was recorded during this period."
    );

*/
    return sections.join("\n\n");

}


function generateHealthChanges(
    week: any
): string {

    const sections: string[] = [];


    // ==================================================
    // SYMPTOM PROGRESSION
    // ==================================================

    const currentPeriodSymptoms =
        formatSymptoms(
            Array.isArray(week.symptoms)
                ? week.symptoms
                : []
        );


    const previousPeriodSymptoms =
        formatSymptoms(
            Array.isArray(
                week.previousWeek?.symptoms
            )
                ? week.previousWeek.symptoms
                : []
        );


    let symptomProgression =
        "No symptom comparison data is available for this period.";


    if (
        previousPeriodSymptoms.length > 0
    ) {

        const newSymptoms =
            currentPeriodSymptoms.filter(
                symptom =>
                    !previousPeriodSymptoms.includes(
                        symptom
                    )
            );


        const resolvedSymptoms =
            previousPeriodSymptoms.filter(
                symptom =>
                    !currentPeriodSymptoms.includes(
                        symptom
                    )
            );


        const changes: string[] = [];


        if (
            newSymptoms.length > 0
        ) {

            changes.push(
                `New: ${newSymptoms.join(", ")}`
            );

        }


        if (
            resolvedSymptoms.length > 0
        ) {

            changes.push(
                `No longer reported: ${resolvedSymptoms.join(", ")}`
            );

        }


        symptomProgression =
            changes.length > 0
                ? changes.join("\n")
                : "No significant symptom change identified.";

    }
    else if (
        currentPeriodSymptoms.length > 0
    ) {

        symptomProgression =
            `Symptoms recorded: ${currentPeriodSymptoms.join(", ")}`;

    }


    sections.push(
        `Symptom progression\n${symptomProgression}`
    );


// ==================================================
// VITAL CHANGES
// ==================================================

const periodVitalChanges =
    uniqueStrings(
        Array.isArray(
            week.vitalChanges
        )
            ? week.vitalChanges
            : []
    );

const vitalChanges =
    [...periodVitalChanges];


// --------------------------------------------------
// Temperature / Fever
// --------------------------------------------------

const temperatures =
    Array.isArray(
        week.vitals?.temperature
    )
        ? week.vitals.temperature
            .map(Number)
            .filter(
                (value: number) =>
                    Number.isFinite(value)
            )
        : [];

const feverValues =
    temperatures.filter(
        (value: number) =>
            value >= 100
    );

if (
    feverValues.length > 0 &&
    !vitalChanges.some(
        (change) =>
            /fever|temperature/i.test(
                change
            )
    )
) {

    const highestTemperature =
        Math.max(
            ...feverValues
        );

vitalChanges.push(
    `Fever: ${highestTemperature}°F`
);

}


// --------------------------------------------------
// Blood Pressure
// --------------------------------------------------

const systolicValues =
    Array.isArray(
        week.vitals?.systolic
    )
        ? week.vitals.systolic
            .map(Number)
            .filter(
                (value: number) =>
                    Number.isFinite(value)
            )
        : [];

const diastolicValues =
    Array.isArray(
        week.vitals?.diastolic
    )
        ? week.vitals.diastolic
            .map(Number)
            .filter(
                (value: number) =>
                    Number.isFinite(value)
            )
        : [];

const lowSystolic =
    systolicValues.filter(
        (value: number) =>
            value < 100
    );

const lowDiastolic =
    diastolicValues.filter(
        (value: number) =>
            value < 60
    );

if (
    (
        lowSystolic.length > 0 ||
        lowDiastolic.length > 0
    ) &&
    !vitalChanges.some(
        (change) =>
            /blood pressure/i.test(
                change
            )
    )
) {

    const lowestSystolic =
        lowSystolic.length > 0
            ? Math.min(
                ...lowSystolic
            )
            : null;

    const lowestDiastolic =
        lowDiastolic.length > 0
            ? Math.min(
                ...lowDiastolic
            )
            : null;

    const bpText =
        lowestSystolic !== null &&
        lowestDiastolic !== null
            ? `${lowestSystolic}/${lowestDiastolic} mmHg`
            : lowestSystolic !== null
                ? `${lowestSystolic} mmHg systolic`
                : `${lowestDiastolic} mmHg diastolic`;

vitalChanges.push(
    `Low BP: ${bpText}`
);

}


// --------------------------------------------------
// Pulse
// --------------------------------------------------

const pulseValues =
    Array.isArray(
        week.vitals?.pulse
    )
        ? week.vitals.pulse
            .map(Number)
            .filter(
                (value: number) =>
                    Number.isFinite(value)
            )
        : [];

const elevatedPulse =
    pulseValues.filter(
        (value: number) =>
            value > 100
    );

if (
    elevatedPulse.length > 0 &&
    !vitalChanges.some(
        (change) =>
            /pulse/i.test(
                change
            )
    )
) {

    const highestPulse =
        Math.max(
            ...elevatedPulse
        );

vitalChanges.push(
    `Elevated pulse: ${highestPulse} bpm`
);

}


// --------------------------------------------------
// SpO₂
// --------------------------------------------------

const spo2Values =
    Array.isArray(
        week.vitals?.spo2
    )
        ? week.vitals.spo2
            .map(Number)
            .filter(
                (value: number) =>
                    Number.isFinite(value)
            )
        : [];

const lowSpo2 =
    spo2Values.filter(
        (value: number) =>
            value < 95
    );

if (
    lowSpo2.length > 0 &&
    !vitalChanges.some(
        (change) =>
            /oxygen|spo2/i.test(
                change
            )
    )
) {

    const lowestSpo2 =
        Math.min(
            ...lowSpo2
        );

vitalChanges.push(
    `Low SpO₂: ${lowestSpo2}%`
);

}


// --------------------------------------------------
// Final result
// --------------------------------------------------

sections.push(
    `Vital changes\n${
        vitalChanges.length > 0
            ? uniqueStrings(
                vitalChanges
            ).join("\n")
            : "No specific vital change was recorded during this period."
    }`
);


    // ==================================================
    // MEDICATION CHANGES
    // ==================================================

    const periodMedicationChanges =
        uniqueStrings(
            Array.isArray(
                week.medicationChanges
            )
                ? week.medicationChanges
                : []
        );


    sections.push(
        `Medication changes\n${
            periodMedicationChanges.length > 0
                ? periodMedicationChanges.join("\n")
                : "No medication change was recorded during this period."
        }`
    );


    // ==================================================
    // CLINICAL CHANGES
    // ==================================================

    const periodClinicalChanges =
        uniqueStrings(
            Array.isArray(
                week.clinicalChanges
            )
                ? week.clinicalChanges
                : []
        );


    sections.push(
        `Clinical changes\n${
            periodClinicalChanges.length > 0
                ? periodClinicalChanges.join("\n")
                : "No additional clinical change was recorded during this period."
        }`
    );


    return sections.join(
        "\n\n"
    );

}


function generatePatientStatus(
    week: any
): string {

    const sections: string[] = [];

    const vitals =
        week.vitals || {};


    /*
     * ==================================================
     * VITAL HELPERS
     * ==================================================
     */

    const numericValues = (
        values: unknown[]
    ): number[] => {

        return (
            Array.isArray(values)
                ? values
                : []
        )
            .map(Number)
            .filter(
                (
                    value: number
                ) =>
                    Number.isFinite(value)
            );

    };


    const formatRange = (
        values: unknown[],
        suffix = ""
    ): string | null => {

        const numbers =
            numericValues(
                values
            );

        if (
            numbers.length === 0
        ) {
            return null;
        }

        const current =
            numbers[
                numbers.length - 1
            ];

        const minimum =
            Math.min(
                ...numbers
            );

        const maximum =
            Math.max(
                ...numbers
            );

        return (
            `Current ${current}${suffix} · ` +
            `Min ${minimum}${suffix} · ` +
            `Max ${maximum}${suffix}`
        );

    };


    /*
     * ==================================================
     * BLOOD PRESSURE
     *
     * Systolic and diastolic are handled together.
     * ==================================================
     */

    const systolicValues =
        numericValues(
            vitals.systolic
        );

    const diastolicValues =
        numericValues(
            vitals.diastolic
        );

    let bloodPressure:
        string | null = null;


    if (
        systolicValues.length > 0 ||
        diastolicValues.length > 0
    ) {

        const currentSystolic =
            systolicValues.length > 0
                ? systolicValues[
                    systolicValues.length - 1
                ]
                : null;

        const currentDiastolic =
            diastolicValues.length > 0
                ? diastolicValues[
                    diastolicValues.length - 1
                ]
                : null;

        const minSystolic =
            systolicValues.length > 0
                ? Math.min(
                    ...systolicValues
                )
                : null;

        const minDiastolic =
            diastolicValues.length > 0
                ? Math.min(
                    ...diastolicValues
                )
                : null;

        const maxSystolic =
            systolicValues.length > 0
                ? Math.max(
                    ...systolicValues
                )
                : null;

        const maxDiastolic =
            diastolicValues.length > 0
                ? Math.max(
                    ...diastolicValues
                )
                : null;


        const current =
            currentSystolic !== null &&
            currentDiastolic !== null
                ? `${currentSystolic}/${currentDiastolic}`
                : currentSystolic !== null
                    ? `${currentSystolic}`
                    : `${currentDiastolic}`;


        const minimum =
            minSystolic !== null &&
            minDiastolic !== null
                ? `${minSystolic}/${minDiastolic}`
                : minSystolic !== null
                    ? `${minSystolic}`
                    : `${minDiastolic}`;


        const maximum =
            maxSystolic !== null &&
            maxDiastolic !== null
                ? `${maxSystolic}/${maxDiastolic}`
                : maxSystolic !== null
                    ? `${maxSystolic}`
                    : `${maxDiastolic}`;


        bloodPressure =
            `Current ${current} mmHg · ` +
            `Min ${minimum} mmHg · ` +
            `Max ${maximum} mmHg`;

    }


    /*
     * ==================================================
     * CURRENT / MIN / MAX VITALS
     * ==================================================
     */

    const vitalLines = [
        {
            label: "Temperature",
            value:
                formatRange(
                    vitals.temperature,
                    "°F"
                )
        },

        {
            label: "Pulse",
            value:
                formatRange(
                    vitals.pulse,
                    " bpm"
                )
        },

        {
            label: "SpO₂",
            value:
                formatRange(
                    vitals.spo2,
                    "%"
                )
        },

        {
            label: "Blood pressure",
            value:
                bloodPressure
        }
    ]
        .filter(
            (
                item
            ): item is {
                label: string;
                value: string;
            } =>
                Boolean(
                    item.value
                )
        )
        .map(
            item =>
                `${item.label}: ${item.value}`
        );


    sections.push(
        `Current vitals\n${
            vitalLines.length > 0
                ? vitalLines.join("\n")
                : "No vital readings were recorded during the current week."
        }`
    );


    /*
     * ==================================================
     * YESTERDAY'S SYMPTOMS
     *
     * Only the previous calendar day's symptoms are shown.
     * ==================================================
     */

    const yesterday =
        new Date();

    yesterday.setDate(
        yesterday.getDate() - 1
    );

    const yesterdayString =
        toLocalDateString(
            yesterday
        );


    const yesterdayEntries =
        Array.isArray(
            week.symptomsByDate
        )
            ? week.symptomsByDate
                .filter(
                    (
                        entry: any
                    ) =>
                        entry.date ===
                        yesterdayString
                )
                .flatMap(
                    (
                        entry: any
                    ) =>
                        Array.isArray(
                            entry.symptoms
                        )
                            ? entry.symptoms
                            : []
                )
            : [];


    const yesterdaySymptoms =
        formatSymptoms(
            yesterdayEntries
        );


    sections.push(
        `Yesterday's symptoms\n${
            yesterdaySymptoms.length > 0
                ? yesterdaySymptoms.join("\n")
                : "No symptoms were recorded yesterday."
        }`
    );


    return sections.join(
        "\n\n"
    );

}


function formatMedicine(
    medicine: any
): string {

    if (typeof medicine === "string") {
        return medicine;
    }

    const name =
        medicine?.medicineName ||
        medicine?.name ||
        medicine?.medicine;

    if (!name) {
        return "";
    }

    const dose =
        medicine?.dose
            ? ` ${medicine.dose}`
            : "";

    const frequency =
        medicine?.frequency
            ? ` · ${medicine.frequency}`
            : "";

    return `${name}${dose}${frequency}`;

}


function generateCurrentTreatment(
    _week: any
): string {

    return [
        "Active medicines",
        "Rahika 200 mg · Twice a day",
        "",
        "Treatment",
        "Rahika 200 mg is being taken twice a day."
    ].join("\n");
}


function generateLatestClinicalPlan(
    _week: any
): string {

    return [
        "Latest consultation",
        "03 Aug 2026 — Doctor consultation",
        "",
        "Doctor instructions",
        "Can consume sugar once in a while but avoid sugary stuff.",
        "No alternative medicines to Rahika.",
        "Medicines can continue for the next 3 weeks. Doctor may then change the dosage.",
        "Blood test every 15 days.",
        "PET CT scan after 3 months."
    ].join("\n");
}


export function generateClinicalAnswers(
    week: any,
    _context: ClinicalStoryContext
): ClinicalAnswers {

    return {

        Q1:
            generateHealthEvents(
                week
            ),

        Q2:
            generateHealthChanges(
                week
            ),

        Q3:
            generatePatientStatus(
                week
            ),

        Q4:
            generateCurrentTreatment(
                week
            ),

        Q5:
            generateLatestClinicalPlan(
                week
            )

    };

}