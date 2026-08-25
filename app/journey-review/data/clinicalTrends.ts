import { supabase } from "@/lib/supabase";


const DAD_PATIENT_ID =
    "8d0abd84-3828-4292-b7b0-8772e4b7b5ad";


export interface ClinicalTrendSummary {

    parameter:string;

    current:string;

    minimum:string;

    maximum:string;

    average:string;

    history:number[];

}



export async function buildClinicalTrends(
    startDate: string,
    endDate: string
):

Promise<ClinicalTrendSummary[]> {



const { data,error } = await supabase

.from("daily_care")

.select(
`
temperature,
pulse,
spo2,
systolic,
diastolic,
weight_kg
`
)

.eq(
    "patient_id",
    DAD_PATIENT_ID
)

.gte(
    "recorded_at",
    `${startDate} 00:00:00`
)

.lte(
    "recorded_at",
    `${endDate} 23:59:59`
)

.order(
    "recorded_at",
    {
        ascending: true
    }
);


if(error){

    throw error;

}



const records =
    data ?? [];




const calculate = (
    values:number[]
)=>{


    if(values.length===0){

        return {

            current:"-",

            min:"-",

            max:"-",

            avg:"-",

            history:[]

        };

    }



    return {


        current:
            values[
                values.length-1
            ].toString(),


        min:
            Math.min(...values)
            .toString(),


        max:
            Math.max(...values)
            .toString(),


        avg:
            (
                values.reduce(
                    (a,b)=>a+b,
                    0
                )
                /
                values.length
            )
            .toFixed(1),


        history:values


    };


};




const temperature =
calculate(
records
.map(r=>r.temperature)
.filter(Boolean)
);



const pulse =
calculate(
records
.map(r=>r.pulse)
.filter(Boolean)
);



const spo2 =
calculate(
records
.map(r=>r.spo2)
.filter(Boolean)
);



const systolic =
calculate(
records
.map(r=>r.systolic)
.filter(Boolean)
);



const diastolic =
calculate(
records
.map(r=>r.diastolic)
.filter(Boolean)
);



const weight =
calculate(
records
.map(r=>r.weight_kg)
.filter(Boolean)
);





return [



{

parameter:"Temperature",

current:
`${temperature.current}°F`,

minimum:
`${temperature.min}°F`,

maximum:
`${temperature.max}°F`,

average:
`${temperature.avg}°F`,

history:
temperature.history

},



{

parameter:"Pulse",

current:
`${pulse.current} bpm`,

minimum:
`${pulse.min} bpm`,

maximum:
`${pulse.max} bpm`,

average:
`${pulse.avg} bpm`,

history:
pulse.history

},



{

parameter:"SpO₂",

current:
`${spo2.current}%`,

minimum:
`${spo2.min}%`,

maximum:
`${spo2.max}%`,

average:
`${spo2.avg}%`,

history:
spo2.history

},



{

parameter:"Blood Pressure",

current:
`${systolic.current}/${diastolic.current}`,

minimum:
`${systolic.min}/${diastolic.min}`,

maximum:
`${systolic.max}/${diastolic.max}`,

average:
`${systolic.avg}/${diastolic.avg}`,

history:
systolic.history

},



{

parameter:"Weight",

current:
`${weight.current} kg`,

minimum:
`${weight.min} kg`,

maximum:
`${weight.max} kg`,

average:
`${weight.avg} kg`,

history:
weight.history

}



];


}