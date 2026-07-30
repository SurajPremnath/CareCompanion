"use client";

import { useState } from "react";

import {
    CalendarDays,
    Activity,
    ClipboardCheck,
    Droplets,
    FileText,
    HeartPulse,
    Stethoscope,
    ShieldAlert
} from "lucide-react";

import {
    ExecutiveSummaryViewModel
} from "./types";

import {
    buildClinicalStory
}
from "../clinical-story/storyBuilder";

import PdfDownloadButton
    from "../../components/pdf/PdfDownloadButton";

const JOURNEY_WEEKS = [
    {
        start: "2026-07-10",
        end: "2026-07-16",
        label: "10 Jul 2026 - 16 Jul 2026"
    },
    {
        start: "2026-07-17",
        end: "2026-07-23",
        label: "17 Jul 2026 - 23 Jul 2026"
    },
    {
        start: "2026-07-24",
        end: new Date().toISOString().split("T")[0],
        label: "24 Jul 2026 - Current"
    }
];

interface Props {

    summary: ExecutiveSummaryViewModel;

}



export function ExecutiveSummary({
    summary
}: Props) {


// ======================================================
// WEEKLY CLINICAL DATA AGGREGATION - START
// ======================================================

const groupedTimeline =
    JOURNEY_WEEKS.map(week => ({

        weekLabel: week.label,

        recordCount: 0,

        symptoms: [] as string[],

        vitals: {
    temperature: [] as number[],
    pulse: [] as number[],
    spo2: [] as number[],
    systolic: [] as number[],
    diastolic: [] as number[]
},

weight: [] as number[],

assessments: [] as string[]

    }));


(summary.clinicalTimeline ?? [])
    .forEach(event => {

        const eventDate =
            new Date(event.date);



const weekIndex =
    JOURNEY_WEEKS.findIndex(week => {

        const start =
            new Date(
                `${week.start}T00:00:00`
            );


        const end =
            new Date(
                `${week.end}T23:59:59`
            );


        return (
            eventDate >= start &&
            eventDate <= end
        );

    });



        if (weekIndex === -1) {
            return;
        }


        const bucket =
            groupedTimeline[weekIndex];


        bucket.recordCount++;


        bucket.symptoms.push(
            ...event.symptoms
        );


        if (event.vitals.temperature) {

    bucket.vitals.temperature.push(
        event.vitals.temperature
    );

}


if (event.vitals.pulse) {

    bucket.vitals.pulse.push(
        event.vitals.pulse
    );

}


if (event.vitals.spo2) {

    bucket.vitals.spo2.push(
        event.vitals.spo2
    );

}


if (event.vitals.systolic) {

    bucket.vitals.systolic.push(
        event.vitals.systolic
    );

}


if (event.vitals.diastolic) {

    bucket.vitals.diastolic.push(
        event.vitals.diastolic
    );

}


if (event.vitals.weight) {

    bucket.weight.push(
        event.vitals.weight
    );

}

    });

// ======================================================
// WEEKLY CLINICAL DATA AGGREGATION - END
// ======================================================


// ======================================================
// ======================================================

const story =
    (groupedTimeline ?? [])
        .filter(event =>
    event.recordCount > 0
)
        .map(event => {

            const date =
    event.weekLabel;


            const details: string[] = [];


if (event.recordCount > 0) {

    details.push(
        `${event.recordCount} daily care records were captured during this period.`
    );

}


            if (event.symptoms.length > 0) {
                details.push(
    event.symptoms.length > 0
        ? `Symptoms recorded: ${[
            ...new Set(event.symptoms)
        ].join(", ")}.`
        : `No symptoms were recorded during this period.`
);
            }


if (event.vitals.temperature.length > 0) {

    details.push(
        `Temperature readings were recorded.`
    );

}


if (event.vitals.pulse.length > 0) {

    details.push(
        `Pulse readings were recorded.`
    );

}


if (event.vitals.spo2.length > 0) {

    details.push(
        `Oxygen saturation readings were recorded.`
    );

}


if (event.weight.length > 0) {

    details.push(
        `Weight was recorded during this period.`
    );

}

            return [
                date,
                ...details
            ].join("\n");

        })
        .join("\n\n");


const clinicalStory =
    buildClinicalStory(
        groupedTimeline
    );

console.log(
    "CLINICAL STORY TABLE DATA",
    clinicalStory
);



return (

    <div
        id="executive-summary"
        className="space-y-8"
    >



            {/* Journey Snapshot */}

            <section
                className="
                    rounded-3xl
                    bg-white
                    border
                    border-slate-100
                    shadow-xl
                    p-8
                "
            >

<div className="flex items-center justify-between gap-6">

    <div className="flex items-center gap-4">


        <div
            className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-xl
                bg-gradient-to-br
                from-blue-400
                to-cyan-300
                text-white
            "
        >

            <CalendarDays size={24}/>

        </div>


        <div>

            <h2
                className="
                text-lg
                font-bold
                text-slate-900
                "
            >
                Clinical Journey Summary
            </h2>


            <p
                className="
                text-xs
                font-semibold
                text-slate-600
                "
            >
                10 Jul 2026 - {new Date().toLocaleDateString(
                    "en-GB",
                    {
                        day:"2-digit",
                        month:"short",
                        year:"numeric"
                    }
                )}
            </p>

        </div>


    </div>


                <div
                    className="
                        mt-8
                        grid
                        grid-cols-3
                        gap-5
                    "
                >

                    <SummaryCard
    icon={
        <HeartPulse
            size={24}
            strokeWidth={2.5}
        />
    }
    title="Daily Care"
    value={
        summary.totalDailyCareRecords
    }
/>


                    <SummaryCard
    icon={
        <ClipboardCheck
            size={24}
            strokeWidth={2.5}
        />
    }
                        title="Assessments"
                        value={
                            summary.totalAssessments
                        }
                    />


                    <SummaryCard
    icon={
        <Droplets
            size={24}
            strokeWidth={2.5}
        />
    }
                        title="Blood Cough Records"
                        value={
                            summary.recordedEvents.bloodCoughCount
                        }
                    />


                </div>

<div
    className="
        mt-6
        flex
        justify-end
    "
>

<PdfDownloadButton
    loading={false}
    onClick={() => {

        const content =
            document.getElementById(
                "executive-summary"
            );

        if (!content) {
            return;
        }

        const printWindow =
            window.open(
                "",
                "_blank",
                "width=1400,height=900"
            );

        if (!printWindow) {
            return;
        }

        const styles =
            Array.from(
                document.querySelectorAll(
                    "style, link[rel='stylesheet']"
                )
            )
            .map(node => node.outerHTML)
            .join("");

        printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
${styles}
<title>Executive Summary</title>
</head>

<body>

${content.outerHTML}

<script>
window.onload = function () {
    window.focus();
    window.print();
    window.close();
};
</script>

</body>
</html>
        `);

        printWindow.document.close();

    }}
/>

</div>

</div>





            </section>





            {/* Clinical Story */}

            <section
                className="
                    rounded-3xl
                    bg-white
                    border
                    border-slate-100
                    shadow-xl
                    p-8
                "
            >

                <div
                    className="
                        flex
                        items-center
                        gap-3
                        mb-5
                    "
                >

                    <FileText
                        className="text-blue-600"
                    />

                    <h2
                        className="
                            text-xl
                            font-bold
                            text-slate-900
                        "
                    >
                        Recorded Clinical Journey
                    </h2>

                </div>


                <div
                    className="
                        whitespace-pre-line
                        leading-7
                        text-slate-700
                    "
                >

<div className="space-y-6">


{
clinicalStory.map(
(item:any)=>(


<section
key={item.id}
className="
rounded-3xl
border
border-slate-200
bg-white
p-6
shadow-sm
"
>


<div
className="
grid
grid-cols-[180px_1fr]
gap-8
"
>


{/* LEFT CATEGORY */}

<div>

<div
className="
flex
h-16
w-16
items-center
justify-center
rounded-full
bg-blue-50
text-3xl
mb-4
"
>

{item.icon}

</div>



<h3
className="
text-xl
font-bold
text-blue-900
"
>
{item.title}
</h3>


<p
className="
mt-2
text-sm
leading-6
text-slate-600
"
>
{item.question}
</p>


</div>



{/* WEEKLY CARDS */}

<div
className="
grid
grid-cols-3
gap-4
"
>


{
item.periods.map(
(period:any)=>(


<div
key={period.weekLabel}
className="
rounded-2xl
bg-slate-50
p-5
"
>


<div
className="
mb-4
text-sm
font-semibold
text-blue-800
"
>

{period.weekLabel}

</div>



<div
className="
text-sm
leading-6
text-slate-700
whitespace-pre-line
"
>

{period.answer}


</div>


</div>


))
}


</div>


</div>


</section>


))
}


</div>


<div>
    <h3>
        Treatment Information
    </h3>

    <p>
        Rahika 200 mg is prescribed twice daily
        as part of the current treatment regimen. The Tablets started from 17th of July.
    </p>
</div>


</div>


            </section>





        </div>

    );

}




function SummaryCard({
    icon,
    title,
    value
}:any){


    return (

        <div
            className="
                rounded-2xl
                bg-slate-50
                p-5
            "
        >

            <div
    className="
        flex
        h-9
        w-9
        items-center
        justify-center
        rounded-xl
        bg-gradient-to-br
from-blue-100
to-cyan-100
text-blue-700
    "
>
    {icon}
</div>


            <div className="mt-3 text-sm text-slate-500">

                {title}

            </div>


            <div className="text-2xl font-bold text-slate-900">

                {value}

            </div>


        </div>

    );

}




function VitalCard({
    icon,
    title,
    data
}:any){


    return (

        <div
            className="
                rounded-2xl
                bg-slate-50
                p-5
            "
        >

            <div className="flex items-center gap-3 text-blue-600">

                {icon}

                <span className="font-semibold text-slate-900">
                    {title}
                </span>

            </div>


            <div className="mt-4 text-sm text-slate-700">

                <div>
                    Min: {data.min ?? "-"}
                </div>

                <div>
                    Max: {data.max ?? "-"}
                </div>

                <div>
                    Avg: {data.average ?? "-"}
                </div>

            </div>


        </div>

    );

}