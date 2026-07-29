import { supabase } from "@/lib/supabase";
import type {
    ExecutiveSummaryViewModel
} from "../components/types";


const DAD_PATIENT_ID =
    "8d0abd84-3828-4292-b7b0-8772e4b7b5ad";


const START_DATE = "2026-07-10";

const END_DATE =
    new Date()
        .toISOString()
        .split("T")[0];

export async function buildExecutiveSummary()
: Promise<ExecutiveSummaryViewModel> {



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
recorded_at
`
        )
        .eq(
            "patient_id",
            DAD_PATIENT_ID
        )
.gte(
    "recorded_at",
    `${START_DATE}T00:00:00`
)
.lte(
    "recorded_at",
    `${END_DATE}T23:59:59`
)
        .order(
            "recorded_at",
            {
                ascending:true
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
        DAD_PATIENT_ID
    );


    const records =
        dailyCare ?? [];


const clinicalTimeline =
    records.map(record => ({

        date:
            record.recorded_at,


        symptoms:
            Array.isArray(record.symptoms)
                ? record.symptoms
                : [],


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

    }));


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