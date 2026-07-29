"use client";


import {
    ThermometerSun,
    HeartPulse,
    Activity,
    Scale,
    HeartPulse as BloodPressure
} from "lucide-react";


import {
    buildClinicalTrends,
    ClinicalTrendSummary
} from "../data/clinicalTrends";


import {
    useEffect,
    useState
} from "react";


import {
    LineChart,
    Line,
    ResponsiveContainer
} from "recharts";


/*
--------------------------------------------------
ICON SYSTEM
--------------------------------------------------
*/

const iconMap: Record<string, any> = {

    Temperature:
        TemperatureMedicalIcon,

    Pulse:
        PulseMedicalIcon,

    "SpO₂":
        OxygenMedicalIcon,

    Weight:
        Scale,

    "Blood Pressure":
        BloodPressureMedicalIcon

};


/*
--------------------------------------------------
CLINICAL DISPLAY META
--------------------------------------------------
*/


const trendMeta: Record<string, any> = {


    Temperature: {

        description:
            "Body temperature monitoring",

        color:
            "blue",

        status:
            "Stable"

    },


    Pulse: {

        description:
            "Heart rate monitoring",

        color:
            "red",

        status:
            "Monitor"

    },


    "SpO₂": {

        description:
            "Oxygen saturation level",

        color:
            "green",

        status:
            "Good"

    },


    Weight: {

        description:
            "Body weight tracking",

        color:
            "purple",

        status:
            "Stable"

    },


"Blood Pressure": {

    description:
        "Systolic / Diastolic blood pressure",

    color:
        "orange",

    status:
        "Normal"

}

};



/*
--------------------------------------------------
CLINICAL INSIGHT ENGINE
--------------------------------------------------
*/


function getInsight(
    parameter:string
){

    switch(parameter){


        case "Temperature":

            return "Temperature remained stable during the selected period.";


        case "Pulse":

            return "Average pulse was slightly elevated. Continue regular monitoring.";


        case "SpO₂":

            return "Oxygen saturation remained within acceptable range.";


        case "Weight":

            return "Weight remained stable with minimal variation.";


        case "Systolic BP":

        case "Diastolic BP":

            return "Blood pressure values remained within the recorded range.";


        default:

            return "Health measurement trend recorded successfully.";

    }

}

function TemperatureIcon(){

    return (

        <svg
            width="34"
            height="34"
            viewBox="0 0 24 24"
            fill="none"
        >

            <path
                d="M12 14.5V5a2 2 0 0 0-4 0v9.5a4 4 0 1 0 4 0Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />

            <circle
                cx="10"
                cy="17"
                r="2.5"
                fill="currentColor"
            />

        </svg>

    );

}

function TemperatureMedicalIcon(){

    return (

        <svg
            width="38"
            height="38"
            viewBox="0 0 40 40"
            fill="none"
        >

            {/* thermometer tube */}

            <path
                d="
                M20 7
                C17.8 7 16 8.8 16 11
                V25
                C13.8 26.5 12.5 28.7 12.5 31
                C12.5 34.6 15.4 37.5 19 37.5
                C22.6 37.5 25.5 34.6 25.5 31
                C25.5 28.7 24.2 26.5 22 25
                V11
                C22 8.8 22.2 7 20 7
                "
                stroke="#2563EB"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />


            {/* bulb */}

            <circle
                cx="19"
                cy="31"
                r="4"
                fill="#2563EB"
            />


            {/* temperature ticks */}

            <path
                d="
                M28 12H33
                M28 18H33
                M28 24H33
                "
                stroke="#2563EB"
                strokeWidth="2"
                strokeLinecap="round"
            />


        </svg>

    );

}

function PulseMedicalIcon(){

    return (

        <svg
            width="38"
            height="38"
            viewBox="0 0 40 40"
            fill="none"
        >

            {/* Heart outline */}

            <path
    d="
    M20 34
    C18 32
    6 25
    6 15
    C6 10
    10 7
    15 7
    C17.5 7
    19.5 8.5
    20 11
    C20.5 8.5
    22.5 7
    25 7
    C30 7
    34 10
    34 15
    C34 25
    22 32
    20 34
    Z
    "
    fill="#F43F8F"
/>


            {/* ECG line */}

            <path
                d="
                M11 20
                H15
                L17 16
                L20 24
                L23 18
                L25 20
                H29
                "
                stroke="#EC4899"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

        </svg>

    );

}

function BloodPressureMedicalIcon(){

    return (

        <svg
            width="38"
            height="38"
            viewBox="0 0 40 40"
            fill="none"
        >

            {/* BP cuff */}

            <rect
                x="8"
                y="12"
                width="24"
                height="16"
                rx="5"
                stroke="#F97316"
                strokeWidth="2.8"
            />


            {/* Display */}

            <rect
                x="14"
                y="16"
                width="12"
                height="7"
                rx="2"
                fill="#F97316"
                opacity="0.15"
            />


            {/* Pulse line */}

            <path
                d="
                M14 20
                H17
                L19 17
                L22 23
                L24 20
                H27
                "
                stroke="#F97316"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />


            {/* Tube */}

            <path
                d="
                M32 22
                C35 22 35 28 32 30
                "
                stroke="#F97316"
                strokeWidth="2.2"
                strokeLinecap="round"
            />


        </svg>

    );

}

function OxygenMedicalIcon(){

    return (

        <svg
            width="42"
            height="42"
            viewBox="0 0 42 42"
            fill="none"
        >

            {/* trachea */}

            <path
                d="
                M21 6
                V16
                "
                stroke="#16A34A"
                strokeWidth="3"
                strokeLinecap="round"
            />


            {/* left lung */}

            <path
                d="
                M20 15

                C16 11 9 12 7 19

                C5 26 8 34 15 35

                C18 35 20 32 20 28

                Z
                "
                fill="#22C55E"
                fillOpacity="0.22"
                stroke="#16A34A"
                strokeWidth="2.5"
            />


            {/* right lung */}

            <path
                d="
                M22 15

                C26 11 33 12 35 19

                C37 26 34 34 27 35

                C24 35 22 32 22 28

                Z
                "
                fill="#22C55E"
                fillOpacity="0.22"
                stroke="#16A34A"
                strokeWidth="2.5"
            />


            {/* bronchial branches */}

            <path
                d="
                M21 15

                L15 23

                M21 15

                L27 23
                "
                stroke="#16A34A"
                strokeWidth="2"
                strokeLinecap="round"
            />


        </svg>

    );

}

export default function ClinicalTrends(){


    const [trends,setTrends] =
        useState<ClinicalTrendSummary[]>([]);

const [selectedInsight, setSelectedInsight] = useState<string | null>(null);



    useEffect(()=>{


        async function load(){


            const data =
                await buildClinicalTrends();


            setTrends(data);


        }


        load();


    },[]);



    return (

        <div
            className="
                space-y-8
            "
        >


            {trends.map((item)=>{


                const Icon =
                    iconMap[item.parameter];


                const meta =
                    trendMeta[item.parameter];



                return (

                    <div
                        key={item.parameter}
                        className="
                            flex
                            gap-6
                        "
                    >


                        {/* LEFT TIMELINE */}

                        <div
    className="
        relative
        flex
        w-24
        justify-start
    "
>


                            {/* Vertical line */}

<div
    className="
        absolute
left-[8px]
top-10
        bottom-0
        w-px
        bg-slate-200
    "
/>


                            {/* Timeline node */}

                            <div
                                className={`
                                    absolute
                                    top-10
                                    z-10
                                    h-4
                                    w-4
                                    rounded-full
                                    border-2
                                    border-white
                                    shadow

                                    ${
                                        meta.color === "red"
                                        ? "bg-red-500"
                                        :
                                        meta.color === "green"
                                        ? "bg-green-500"
                                        :
                                        meta.color === "purple"
                                        ? "bg-purple-500"
                                        :
                                        meta.color === "orange"
                                        ? "bg-orange-500"
                                        :
                                        "bg-blue-500"
                                    }
                                `}
                            />


                            {/* Icon circle */}

<div
    className={`
        relative
        z-20
        mt-5
ml-8
        flex
        h-16
        w-16
        items-center
        justify-center
        rounded-full
        border
        shadow-sm

        ${
            meta.color === "red"
            ? "bg-red-50 text-red-500 border-red-200"
            :
            meta.color === "green"
            ? "bg-green-50 text-green-500 border-green-200"
            :
            meta.color === "purple"
            ? "bg-purple-50 text-purple-500 border-purple-200"
            :
            meta.color === "orange"
            ? "bg-orange-50 text-orange-500 border-orange-200"
            :
            "bg-blue-50 text-blue-500 border-blue-200"
        }
    `}
>

    <div
        className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-full
            bg-white/60
        "
    >

        {Icon && (

            <Icon
                size={28}
                strokeWidth={2.5}
            />

        )}

    </div>


</div>


                        </div>





                        {/* RIGHT CONTENT CARD */}


                        <div
                            className="
                                flex-1
                                rounded-3xl
                                border
                                border-slate-100
                                bg-white
                                p-6
                                shadow-sm
                            "
                        >


                            <div
                                className="
                                    grid
                                    grid-cols-1
                                    lg:grid-cols-3
                                    gap-6
                                "
                            >


                                {/* Vital Information */}

                                <div>

<div
    className="
        flex
        items-center
        gap-2
    "
>

    <h3
        className="
            text-xl
            font-bold
            text-slate-900
        "
    >
        {item.parameter}
    </h3>


<button
    type="button"
    onClick={() =>
    setSelectedInsight(
        selectedInsight === item.parameter
        ? null
        : item.parameter
    )
}
    className="
        flex
        !h-6
        !w-6
        !min-h-6
        !min-w-6
        shrink-0
        items-center
        justify-center
        rounded-full
        border
        border-slate-300
        text-[12px]
        font-semibold
        text-slate-500
        leading-none
        p-0
    "
>
    i
</button>

</div>

{
    selectedInsight === item.parameter && (

        <div
            className="
                mt-2
                text-sm
                text-slate-600
            "
        >
            {getInsight(item.parameter)}
        </div>

    )
}



                                    <span
                                        className="
                                            mt-4
                                            inline-flex
                                            rounded-full
                                            bg-slate-50
                                            px-4
                                            py-2
                                            text-sm
                                            font-semibold
                                        "
                                    >

                                        ✓ {meta.status}

                                    </span>


                                </div>





                                {/* Metrics Area */}


                                <div
                                    className="
                                        lg:col-span-2
                                    "
                                >

                                    {/* Temporary placeholder */}

<div
    className="
        grid
        grid-cols-4
        gap-3
    "
>


    <MetricCard
        title="CURRENT"
        value={item.current}
        color={meta.color}
    />


    <MetricCard
        title="MIN"
        value={item.minimum}
        color={meta.color}
    />


    <MetricCard
        title="MAX"
        value={item.maximum}
        color={meta.color}
    />


    <MetricCard
        title="AVERAGE"
        value={item.average}
        color={meta.color}
    />


</div>




                                </div>


                            </div>


                        </div>


                    </div>

                );


            })}


        </div>

    );

}


function MiniTrend({
    color
}:{
    color:string;
}){

    return (

        <svg
            width="100%"
            height="35"
            viewBox="0 0 120 35"
            fill="none"
        >

            <polyline
                points="
                2,25
                15,18
                28,22
                42,10
                55,20
                70,8
                85,22
                100,14
                118,18
                "
                stroke={
                    color
                }
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
            />


            <circle
                cx="2"
                cy="25"
                r="2.5"
                fill={color}
            />

            <circle
                cx="118"
                cy="18"
                r="2.5"
                fill={color}
            />


        </svg>

    );

}

function MetricCard({
    title,
    value,
    color
}:{
    title:string;
    value:string;
    color:string;
})
{

    return (

        <div
            className="
                rounded-2xl
                border
                border-slate-100
                bg-white
                p-4
                shadow-sm
            "
        >

            <div
                className="
                    text-xs
                    font-semibold
                    tracking-wide
                    text-slate-400
                "
            >
                {title}
            </div>


            <div
                className="
                    mt-2
                    text-xl
                    font-bold
                    text-slate-900
                "
            >
                {value}
            </div>

<MiniTrend
    color={
        color === "red"
        ? "#ef4444"
        :
        color === "green"
        ? "#22c55e"
        :
        color === "orange"
        ? "#f97316"
        :
        color === "purple"
        ? "#a855f7"
        :
        "#2563eb"
    }
/>




        </div>

    );

}

