import { supabase } from "@/lib/supabase";
import type {
    ExecutiveSummaryViewModel
} from "../components/types";


export async function buildExecutiveSummary(
    patientId: string,
    startDate: string,
    endDate: string
): Promise<ExecutiveSummaryViewModel> {


    const {
        data: dailyCare,
        error: dailyCareError
    } =
    await supabase
        .from("daily_care")
        .select(
`
temperature,
pulse,
spo2,
systolic,
diastolic,
weight_kg,
symptoms,
other_symptom,
recorded_at
`
        )
        .eq(
            "patient_id",
            patientId
        )
        .gte(
            "recorded_at",
            `${startDate}T00:00:00`
        )
        .lte(
            "recorded_at",
            `${endDate}T23:59:59`
        )
    .order(
        "recorded_at",
        {
            ascending:true
        }
    );

console.log(
    "[EXEC SUMMARY DEBUG] daily_care",
    {
        patientId,
        startDate,
        endDate,
        recordCount:
            dailyCare?.length ?? 0,
        firstRecord:
            dailyCare?.[0] ?? null,
        lastRecord:
            dailyCare?.[
                (dailyCare?.length ?? 1) - 1
            ] ?? null,
        error:
            dailyCareError ?? null
    }
);


const {
    data: assessments,
    error: assessmentError
} =
await supabase
    .from("assessments")
    .select("*")
    .eq(
        "patient_id",
        patientId
    )
    .gte(
        "completed_at",
        `${startDate}T00:00:00`
    )
    .lte(
        "completed_at",
        `${endDate}T23:59:59`
    )
    .order(
        "completed_at",
        {
            ascending: true
        }
    );

const {
    data: dailyCareSymptoms,
    error: dailyCareSymptomsError
} =
await supabase
    .from("daily_care_symptoms")
    .select(
        `
        symptom_key
        `
    )
    .eq(
        "patient_id",
        patientId
    );


const records =
    dailyCare ?? [];

const {
    data: previousDailyCare,
    error: previousDailyCareError
} =
    await supabase
        .from("daily_care")
        .select(`
            temperature,
            pulse,
            spo2,
            systolic,
            diastolic,
            weight_kg,
            recorded_at
        `)
        .eq("patient_id", patientId)
        .lt(
            "recorded_at",
            `${startDate}T00:00:00`
        )
        .order(
            "recorded_at",
            {
                ascending: false
            }
        );

if (previousDailyCareError) {
    throw previousDailyCareError;
}

const previousRecords =
    previousDailyCare ?? [];

const selectedVitalValues = {
    temperature:
        records
            .map(record => record.temperature)
            .filter(
                value =>
                    value !== null &&
                    value !== undefined
            ),

    pulse:
        records
            .map(record => record.pulse)
            .filter(
                value =>
                    value !== null &&
                    value !== undefined
            ),

    spo2:
        records
            .map(record => record.spo2)
            .filter(
                value =>
                    value !== null &&
                    value !== undefined
            ),

    systolic:
        records
            .map(record => record.systolic)
            .filter(
                value =>
                    value !== null &&
                    value !== undefined
            ),

    diastolic:
        records
            .map(record => record.diastolic)
            .filter(
                value =>
                    value !== null &&
                    value !== undefined
            ),

    weight:
        records
            .map(record => record.weight_kg)
            .filter(
                value =>
                    value !== null &&
                    value !== undefined
            )
};

const fallbackVitals = {
    temperature:
        selectedVitalValues.temperature.length === 0
            ? (
                previousRecords.find(
                    record =>
                        record.temperature !== null &&
                        record.temperature !== undefined
                )?.temperature ?? null
            )
            : null,

    pulse:
        selectedVitalValues.pulse.length === 0
            ? (
                previousRecords.find(
                    record =>
                        record.pulse !== null &&
                        record.pulse !== undefined
                )?.pulse ?? null
            )
            : null,

    spo2:
        selectedVitalValues.spo2.length === 0
            ? (
                previousRecords.find(
                    record =>
                        record.spo2 !== null &&
                        record.spo2 !== undefined
                )?.spo2 ?? null
            )
            : null,

    systolic:
        selectedVitalValues.systolic.length === 0
            ? (
                previousRecords.find(
                    record =>
                        record.systolic !== null &&
                        record.systolic !== undefined
                )?.systolic ?? null
            )
            : null,

    diastolic:
        selectedVitalValues.diastolic.length === 0
            ? (
                previousRecords.find(
                    record =>
                        record.diastolic !== null &&
                        record.diastolic !== undefined
                )?.diastolic ?? null
            )
            : null,

    weight:
        selectedVitalValues.weight.length === 0
            ? (
                previousRecords.find(
                    record =>
                        record.weight_kg !== null &&
                        record.weight_kg !== undefined
                )?.weight_kg ?? null
            )
            : null
};

const fallbackVitalNotes: string[] = [];

if (fallbackVitals.temperature !== null) {
    fallbackVitalNotes.push(
        "* Latest available temperature reading; no temperature was recorded during the selected period."
    );
}

if (
    fallbackVitals.pulse !== null
) {
    fallbackVitalNotes.push(
        "* Latest available pulse reading; no pulse was recorded during the selected period."
    );
}

if (
    fallbackVitals.spo2 !== null
) {
    fallbackVitalNotes.push(
        "* Latest available SpO₂ reading; no SpO₂ was recorded during the selected period."
    );
}

if (
    fallbackVitals.systolic !== null ||
    fallbackVitals.diastolic !== null
) {
    fallbackVitalNotes.push(
        "* Latest available blood pressure reading; no complete blood pressure reading was recorded during the selected period."
    );
}

// Weight is not displayed in the Executive Summary
// Patient Status section, so no weight fallback note is generated.

const symptomValues =
    (dailyCareSymptoms ?? [])
        .map(record =>
            record.symptom_key
        )
        .filter(
            (value): value is string =>
                Boolean(value)
        );


const clinicalTimeline =
    records.map(record => {

        const recordSymptoms =
            Array.isArray(record.symptoms)
                ? record.symptoms
                    .filter(
                        (symptom): symptom is string =>
                            typeof symptom === "string"
                    )
                    .map(symptom =>
                        symptom.toLowerCase()
                    )
                : [];

        const otherSymptom =
            typeof record.other_symptom === "string" &&
            record.other_symptom.trim()
                ? record.other_symptom
                    .trim()
                    .toLowerCase()
                : null;

        const symptomsForDate =
            [
                ...recordSymptoms,
                ...(otherSymptom
                    ? [otherSymptom]
                    : [])
            ]
            .filter(symptom =>
                symptomValues.includes(symptom)
            );

        return {
            date:
                record.recorded_at,

            symptoms:
                Array.from(
                    new Set(
                        symptomsForDate
                    )
                ),

            vitals: {
                temperature:
                    record.temperature,

                pulse:
                    record.pulse,

                spo2:
                    record.spo2,

                systolic:
                    record.systolic,

                diastolic:
                    record.diastolic,

                weight:
                    record.weight_kg
            }
        };
    });



const assessmentRecords =
    assessments ?? [];


    const temperatures =
        records
            .map(x => x.temperature)
            .filter(Boolean)
            .map(Number);


    const pulses =
        records
            .map(x => x.pulse)
            .filter(Boolean)
            .map(Number);


    const spo2 =
        records
            .map(x => x.spo2)
            .filter(Boolean)
            .map(Number);


    const systolic =
        records
            .map(x => x.systolic)
            .filter(Boolean)
            .map(Number);


    const diastolic =
        records
            .map(x => x.diastolic)
            .filter(Boolean)
            .map(Number);


    const weights =
        records
            .map(x => x.weight_kg)
            .filter(Boolean)
            .map(Number);



    return {

        monitoringStart:
            records.length
                ? new Date(records[0].recorded_at)
                    .toLocaleDateString(
                        "en-GB",
                        {
                            day:"2-digit",
                            month:"short",
                            year:"numeric"
                        }
                    )
                : "",


        monitoringEnd:
            records.length
                ? new Date(
                    records[records.length - 1].recorded_at
                )
                    .toLocaleDateString(
                        "en-GB",
                        {
                            day:"2-digit",
                            month:"short",
                            year:"numeric"
                        }
                    )
                : "",


        totalDailyCareRecords:
            records.length,


        totalSelfDailyCareRecords:
            0,


        totalAssessments:
            assessmentRecords.length,


vitalSummary: {

    temperature: calculateRange(
        temperatures
    ),

    pulse: calculateRange(
        pulses
    ),

    spo2: calculateRange(
        spo2
    ),

    systolic: calculateRange(
        systolic
    ),

    diastolic: calculateRange(
        diastolic
    ),

    weight: calculateRange(
        weights
    )

},

fallbackVitals,

fallbackVitalNotes,

recordedEvents: {

    bloodCoughCount:
        records.filter(record =>
            Array.isArray(record.symptoms) &&
            record.symptoms.includes(
                "BLOOD_IN_COUGH"
            )
        ).length,


    symptomRecords:
        records.filter(record =>
            Array.isArray(record.symptoms) &&
            record.symptoms.length > 0
        ).length

},


        timeline: [],

clinicalTimeline:
    clinicalTimeline

    };

}



function calculateRange(
    values:number[]
) {

    if(values.length === 0)
    {
        return {
            min:null,
            max:null,
            average:null
        };
    }


    return {

        min:
            Math.min(...values),


        max:
            Math.max(...values),


        average:
            Number(
                (
                    values.reduce(
                        (a,b)=>a+b,
                        0
                    )
                    /
                    values.length
                )
                .toFixed(1)
            )

    };

}