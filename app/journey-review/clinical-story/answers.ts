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

    const seen =
        new Set<string>();

    const result: string[] = [];

    values
        .filter(
            value =>
                typeof value === "string" &&
                value.trim().length > 0
        )
        .forEach(
            value => {

                const displayValue =
                    String(value)
                        .trim()
                        .replace(
                            /\s+/g,
                            " "
                        );

                /*
                 * Use a normalized comparison key so that
                 * visually equivalent symptom descriptions
                 * are treated as the same symptom.
                 *
                 * Example:
                 * "Itching At The Back"
                 * "Itching At Back"
                 *
                 * Both resolve to the same comparison key.
                 */
                const comparisonKey =
                    displayValue
                        .toLowerCase()
                        .replace(
                            /\bat the\b/g,
                            "at"
                        )
                        .replace(
                            /\s+/g,
                            " "
                        )
                        .trim();

                if (
                    seen.has(
                        comparisonKey
                    )
                ) {
                    return;
                }

                seen.add(
                    comparisonKey
                );

                result.push(
                    displayValue
                );

            }
        );

    return result;

}

function formatSymptoms(
    symptoms: string[] = []
): string[] {

    const formattedSymptoms =
        symptoms
            .filter(
                symptom =>
                    typeof symptom === "string" &&
                    symptom.trim().length > 0 &&
                    symptom.trim().toUpperCase() !== "OTHER"
            )
            .map(
                symptom => {

                    const label =
                        symptomLabels[symptom] ||
                        symptom;

return label
    .toLowerCase()
    .replace(
        /_/g,
        " "
    )
    .replace(
        /\b\w/g,
        char =>
            char.toUpperCase()
    );

                }
            );


    /*
     * Deduplicate AFTER formatting.
     *
     * This ensures values such as:
     *
     * Cold
     * COLD
     * cold
     *
     * and:
     *
     * Itching At The Back
     * Itching at the back
     *
     * are treated as the same displayed symptom.
     */

    const seen =
        new Set<string>();

    return formattedSymptoms.filter(
        symptom => {

            const key =
                symptom
                    .trim()
                    .toLowerCase();

            if (
                seen.has(key)
            ) {
                return false;
            }

            seen.add(key);

            return true;

        }
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
            ? week.symptoms.map(
                (symptom: string) =>
                    symptom.toUpperCase()
            )
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


        const progressionParts: string[] = [];


        if (
            newSymptoms.length > 0
        ) {

            progressionParts.push(
                `New symptoms: ${newSymptoms.join(", ")}`
            );

        }


        if (
            resolvedSymptoms.length > 0
        ) {

            progressionParts.push(
                `No longer reported: ${resolvedSymptoms.join(", ")}`
            );

        }


        if (
            progressionParts.length > 0
        ) {

            symptomProgression =
                progressionParts.join("\n");

        } else {

            symptomProgression =
                "No significant symptom change was recorded during this period.";

        }

    } else if (
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

    const vitalChanges: string[] = [];


    // --------------------------------------------------
    // Blood Pressure
    // --------------------------------------------------

    const bloodPressureObservations =
        Array.isArray(
            week.vitals?.bloodPressure
        )
            ? week.vitals.bloodPressure
            : [];


    if (
        bloodPressureObservations.length > 0
    ) {

        const formatBPDate =
            (
                dateString: string
            ) =>
                new Date(
                    dateString
                ).toLocaleDateString(
                    "en-GB",
                    {
                        day: "2-digit",
                        month: "short",
                    }
                );


        const highestSystolic =
            bloodPressureObservations.reduce(
                (
                    highest: any,
                    current: any
                ) =>
                    Number(
                        current.systolic
                    ) >
                    Number(
                        highest.systolic
                    )
                        ? current
                        : highest
            );


        const highestDiastolic =
            bloodPressureObservations.reduce(
                (
                    highest: any,
                    current: any
                ) =>
                    Number(
                        current.diastolic
                    ) >
                    Number(
                        highest.diastolic
                    )
                        ? current
                        : highest
            );


        const lowestSystolic =
            bloodPressureObservations.reduce(
                (
                    lowest: any,
                    current: any
                ) =>
                    Number(
                        current.systolic
                    ) <
                    Number(
                        lowest.systolic
                    )
                        ? current
                        : lowest
            );


        const bpObservations: string[] = [];


        const addObservation =
            (
                observation: {
                    date: string;
                    systolic: number;
                    diastolic: number;
                },
                description: string
            ) => {

                const bpText =
                    `${formatBPDate(
                        observation.date
                    )} — BP ` +
                    `${observation.systolic}/` +
                    `${observation.diastolic}`;


                const text =
                    description
                        ? `${bpText} — ${description}`
                        : bpText;


                if (
                    !bpObservations.includes(
                        text
                    )
                ) {

                    bpObservations.push(
                        text
                    );

                }

            };


        if (
            bloodPressureObservations.length === 1
        ) {

            addObservation(
                bloodPressureObservations[0],
                ""
            );

        } else {

            addObservation(
                highestSystolic,
                ""
            );

            addObservation(
                highestDiastolic,
                ""
            );

            addObservation(
                lowestSystolic,
                ""
            );

        }


        vitalChanges.push(
            ...bpObservations
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
                    (
                        value: number
                    ) =>
                        Number.isFinite(value)
                )
            : [];


    const elevatedPulse =
        pulseValues.filter(
            (
                value: number
            ) =>
                value > 100
        );


    if (
        elevatedPulse.length > 0 &&
        !vitalChanges.some(
            change =>
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
                    (
                        value: number
                    ) =>
                        Number.isFinite(value)
                )
            : [];


    const lowSpo2 =
        spo2Values.filter(
            (
                value: number
            ) =>
                value < 95
        );


    if (
        lowSpo2.length > 0 &&
        !vitalChanges.some(
            change =>
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
    // Final vital-change formatting
    // --------------------------------------------------

    const uniqueVitalChanges =
        uniqueStrings(
            vitalChanges
        );


    const bloodPressureItems =
        uniqueVitalChanges.filter(
            change =>
                /BP|blood pressure|systolic|diastolic/i.test(
                    change
                )
        );


    const otherVitalItems =
        uniqueVitalChanges.filter(
            change =>
                !/BP|blood pressure|systolic|diastolic/i.test(
                    change
                )
        );


    const bloodPressureText =
        bloodPressureItems
            .map(
                change =>
                    `• ${change}`
            )
            .join("\n");


    const otherVitalText =
        otherVitalItems
            .map(
                change =>
                    `• ${change}`
            )
            .join("\n");


    let vitalChangesText =
        "Vital changes";


    if (
        bloodPressureItems.length > 0
    ) {

        vitalChangesText +=
            "\nBlood Pressure Observations\n" +
            bloodPressureText;

    }


    if (
        otherVitalItems.length > 0
    ) {

        vitalChangesText +=
            "\n" +
            otherVitalText;

    }


    sections.push(
        vitalChangesText
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

const bloodPressureObservations =
    Array.isArray(
        vitals.bloodPressure
    )
        ? vitals.bloodPressure.filter(
            (
                observation: any
            ) =>
                observation &&
                Number.isFinite(
                    Number(
                        observation.systolic
                    )
                ) &&
                Number.isFinite(
                    Number(
                        observation.diastolic
                    )
                )
        )
        : [];

const systolicValues =
    bloodPressureObservations.map(
        (
            observation: any
        ) =>
            Number(
                observation.systolic
            )
    );

const diastolicValues =
    bloodPressureObservations.map(
        (
            observation: any
        ) =>
            Number(
                observation.diastolic
            )
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
 * LATEST RECORDED SYMPTOMS
 *
 * Show the most recent recorded symptom entry.
 * Do not restrict symptoms to the previous
 * calendar day.
 * ==================================================
 */

const symptomEntries =
    Array.isArray(
        week.symptomsByDate
    )
        ? week.symptomsByDate
            .filter(
                (
                    entry: any
                ) =>
                    entry &&
                    typeof entry.date === "string" &&
                    Array.isArray(
                        entry.symptoms
                    ) &&
                    entry.symptoms.length > 0
            )
            .sort(
                (
                    a: any,
                    b: any
                ) =>
                    b.date.localeCompare(
                        a.date
                    )
            )
        : [];


const latestSymptoms =
    symptomEntries.length > 0
        ? formatSymptoms(
            symptomEntries[0].symptoms
        )
        : [];


sections.push(
    `Latest symptoms\n${
        latestSymptoms.length > 0
            ? latestSymptoms.join("\n")
            : "No symptoms have been recorded."
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