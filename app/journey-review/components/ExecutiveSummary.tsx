"use client";

import React from "react";

import type {
    ReactNode
} from "react";

import {
    CalendarDays,
    ClipboardCheck,
    Droplets,
    FileText,
    HeartPulse
} from "lucide-react";

import {
    ExecutiveSummaryViewModel,
    PatientViewModel
} from "./types";

import {
    buildClinicalStory
} from "../clinical-story/storyBuilder";

import PdfDownloadButton
    from "../../components/pdf/PdfDownloadButton";

import { executiveSummaryPdf }
    from "@/lib/pdf/executiveSummaryPdf";


const REPORT_START_DATE = "2026-07-10";

const BASELINE_END_DATE = "2026-08-03";

const WEEKLY_START_DATE = "2026-08-04";


interface JourneyWeek {

    start: string;

    end: string;

    label: string;

}


function toLocalDateString(
    date: Date
): string {

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function formatJourneyDate(
    dateString: string
): string {

    const [
        year,
        month,
        day
    ] =
        dateString
            .split("-")
            .map(Number);

    return new Intl.DateTimeFormat(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    ).format(
        new Date(
            year,
            month - 1,
            day
        )
    );
}


function buildJourneyWeeks(): JourneyWeek[] {

    const today =
        new Date();

    const currentDate =
        new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );

    const reportStart =
        new Date(
            2026,
            6,
            10
        );

    const baselineEnd =
        new Date(
            2026,
            7,
            3
        );

    const weeklyStart =
        new Date(
            2026,
            7,
            4
        );

    const journeyWeeks: JourneyWeek[] = [];


    /*
     * INITIAL CLINICAL BASELINE
     *
     * 10 Jul 2026 - 3 Aug 2026
     *
     * This is intentionally one period because
     * 3 Aug is the consultation boundary.
     */

    if (
        reportStart <= currentDate
    ) {

        const effectiveBaselineEnd =
            baselineEnd < currentDate
                ? baselineEnd
                : currentDate;

        const start =
            toLocalDateString(
                reportStart
            );

        const end =
            toLocalDateString(
                effectiveBaselineEnd
            );

        journeyWeeks.push({

            start,

            end,

            label:
                `${formatJourneyDate(start)} - ` +
                `${formatJourneyDate(end)}`

        });

    }


    /*
     * WEEKLY PERIODS
     *
     * Start from 4 Aug 2026.
     * Each period covers seven calendar days.
     */

    while (
        weeklyStart <= currentDate
    ) {

        const periodStart =
            new Date(
                weeklyStart
            );

        const periodEnd =
            new Date(
                weeklyStart
            );

        periodEnd.setDate(
            periodEnd.getDate() + 6
        );

        const effectiveEnd =
            periodEnd > currentDate
                ? currentDate
                : periodEnd;

        const start =
            toLocalDateString(
                periodStart
            );

        const end =
            toLocalDateString(
                effectiveEnd
            );

        const isCurrentPeriod =
            effectiveEnd.getTime() ===
            currentDate.getTime();

        journeyWeeks.push({

            start,

            end,

            label:
                isCurrentPeriod
                    ? `${formatJourneyDate(start)} - Current`
                    : `${formatJourneyDate(start)} - ` +
                      `${formatJourneyDate(end)}`

        });

        weeklyStart.setDate(
            weeklyStart.getDate() + 7
        );

    }


    return journeyWeeks;

}


interface Props {

    patient: PatientViewModel;

    summary: ExecutiveSummaryViewModel;

}


export function ExecutiveSummary({

    patient,

    summary

}: Props) {


    // ======================================================
    // JOURNEY PERIODS
    // ======================================================

    const JOURNEY_WEEKS =
        buildJourneyWeeks();


    // ======================================================
    // WEEKLY CLINICAL DATA AGGREGATION
    // ======================================================

const groupedTimeline =
    JOURNEY_WEEKS.map(
        week => ({

            weekLabel:
                week.label,

            recordCount: 0,

            symptoms:
                [] as string[],

            diagnoses:
                [] as string[],

            consultations:
                [] as string[],

            events:
                [] as string[],

            vitalChanges:
                [] as string[],

            medicationChanges:
                [] as string[],

            clinicalChanges:
                [] as string[],

            currentCondition:
                "",

            functionalStatus:
                "",

            vitals: {

                temperature:
                    [] as number[],

                pulse:
                    [] as number[],

                spo2:
                    [] as number[],

                systolic:
                    [] as number[],

                diastolic:
                    [] as number[]

            },

            weight:
                [] as number[],

            assessments:
                [] as string[]

        })
    );


    (
        summary.clinicalTimeline ?? []
    ).forEach(
        event => {

            const eventDate =
                new Date(
                    event.date
                );


            const weekIndex =
                JOURNEY_WEEKS.findIndex(
                    week => {

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

                    }
                );


            if (
                weekIndex === -1
            ) {
                return;
            }


            const bucket =
                groupedTimeline[
                    weekIndex
                ];


bucket.recordCount++;


/* ==================================================
   SYMPTOMS
================================================== */

if (
    Array.isArray(event.symptoms)
) {

    bucket.symptoms.push(
        ...event.symptoms
    );

    if (
        !Array.isArray(
            (bucket as any).symptomsByDate
        )
    ) {
        (bucket as any).symptomsByDate = [];
    }

    (
        bucket as any
    ).symptomsByDate.push({
        date: toLocalDateString(
            eventDate
        ),
        symptoms: event.symptoms
    });

}


/* ==================================================
   DIAGNOSIS
================================================== */

// Diagnosis is not part of ClinicalTimelineEvent.
// Do not read diagnosis data from the timeline event.


/* ==================================================
   CONSULTATIONS
================================================== */

// Consultation data is not part of ClinicalTimelineEvent.
// Do not read consultation data from the timeline event.

/* ==================================================
   CLINICAL EVENTS
================================================== */

// Clinical Event data is not part of ClinicalTimelineEvent.


// Vital changes are derived from the structured vitals data.
// ClinicalTimelineEvent does not contain a separate vitalChanges field.


// Medication changes are not part of ClinicalTimelineEvent.

// Clinical changes are not part of ClinicalTimelineEvent.


/* ==================================================
   CURRENT CONDITION are not part of ClinicalTimelineEvent
================================================== */


/* ==================================================
   FUNCTIONAL STATUS are not part of ClinicalTimelineEvent
================================================== */


/* ==================================================
   VITALS
================================================== */

if (
    event.vitals?.temperature !== null &&
    event.vitals?.temperature !== undefined
) {
    bucket.vitals.temperature.push(
        Number(
            event.vitals.temperature
        )
    );
}


if (
    event.vitals?.pulse
) {

    bucket.vitals.pulse.push(
        event.vitals.pulse
    );

}


if (
    event.vitals?.spo2
) {

    bucket.vitals.spo2.push(
        event.vitals.spo2
    );

}


if (
    event.vitals?.systolic
) {

    bucket.vitals.systolic.push(
        event.vitals.systolic
    );

}


if (
    event.vitals?.diastolic
) {

    bucket.vitals.diastolic.push(
        event.vitals.diastolic
    );

}


if (
    event.vitals?.weight
) {

    bucket.weight.push(
        event.vitals.weight
    );

}


            if (
                event.vitals.pulse
            ) {

                bucket.vitals.pulse.push(
                    event.vitals.pulse
                );

            }


            if (
                event.vitals.spo2
            ) {

                bucket.vitals.spo2.push(
                    event.vitals.spo2
                );

            }


            if (
                event.vitals.systolic
            ) {

                bucket.vitals.systolic.push(
                    event.vitals.systolic
                );

            }


            if (
                event.vitals.diastolic
            ) {

                bucket.vitals.diastolic.push(
                    event.vitals.diastolic
                );

            }


            if (
                event.vitals.weight
            ) {

                bucket.weight.push(
                    event.vitals.weight
                );

            }

        }
    );


/* ==================================================
   PREVIOUS PERIOD CONTEXT
================================================== */

groupedTimeline.forEach(
    (week, index) => {

        if (
            index === 0
        ) {
            return;
        }

        const previous =
            groupedTimeline[
                index - 1
            ];

        (
            week as any
        ).previousWeek = {

            symptoms:
                previous.symptoms,

            vitals:
                previous.vitals,

            diagnoses:
                previous.diagnoses,

            consultations:
                previous.consultations,

            events:
                previous.events

        };

    }
);

    // ======================================================
    // CLINICAL STORY
    // ======================================================

    const clinicalStory =
        buildClinicalStory(
            groupedTimeline
        ).map(
            (section: any) => {

                /*
                 * Q4 and Q5:
                 *
                 * If the answer remains exactly the same
                 * across consecutive periods, merge those
                 * periods into one continuous period.
                 */

                const isMergeableSection =
                    section.id === "Q4" ||
                    section.id === "Q5" ||
                    section.title ===
                        "Current Medications & Treatment" ||
                    section.title ===
                        "Latest Clinical Plan";


                if (
                    !isMergeableSection
                ) {
                    return section;
                }


                if (
                    !Array.isArray(
                        section.periods
                    ) ||
                    section.periods.length <= 1
                ) {
                    return section;
                }


                const mergedPeriods: any[] = [];


                section.periods.forEach(
                    (period: any) => {

                        const previous =
                            mergedPeriods[
                                mergedPeriods.length - 1
                            ];


                        if (
                            previous &&
                            previous.answer.trim() ===
                            period.answer.trim()
                        ) {

                            const previousLabel =
                                previous.weekLabel;

                            const currentLabel =
                                period.weekLabel;


                            const previousStart =
                                previousLabel
                                    .split(" - ")[0];


                            const currentEnd =
                                currentLabel
                                    .split(" - ")[1];


                            previous.weekLabel =
                                `${previousStart} - ${currentEnd}`;


                            return;

                        }


                        mergedPeriods.push({
                            ...period
                        });

                    }
                );


                return {

                    ...section,

                    periods:
                        mergedPeriods

                };

            }
        );


    /*
     * PART 2 BEGINS HERE
     *
     * Do not add anything below this point yet.
     */
    return (

        <div
            id="executive-summary"
            className="space-y-8"
        >

            {/* ==================================================
                JOURNEY SNAPSHOT
            ================================================== */}

            <section
                className="
                    rounded-3xl
                    border
                    border-slate-100
                    bg-white
                    p-6
                    shadow-xl
                    sm:p-8
                "
            >

<div
    className="
        flex
        flex-col
        gap-5
        lg:flex-row
        lg:items-center
    "
>

    {/* ==================================================
        TITLE
    ================================================== */}

    <div
        className="
            flex
            shrink-0
            items-center
            gap-3
            lg:w-[245px]
        "
    >

        <div
            className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-gradient-to-br
                from-blue-400
                to-cyan-300
                text-white
            "
        >
            <CalendarDays
                size={22}
            />
        </div>


        <div className="min-w-0">

            <h2
                className="
                    text-lg
                    font-bold
                    leading-tight
                    text-slate-900
                "
            >
                Clinical Journey Summary
            </h2>

            <p
                className="
                    mt-1
                    text-xs
                    font-semibold
                    text-slate-600
                "
            >
                {formatJourneyDate(
                    REPORT_START_DATE
                )}{" "}
                - Current
            </p>

        </div>

    </div>


    {/* ==================================================
        SUMMARY NUMBERS
    ================================================== */}

    <div
        className="
            grid
            min-w-0
            flex-1
            grid-cols-3
            gap-3
        "
    >

        <SummaryCard
            icon={
                <HeartPulse
                    size={20}
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
                    size={20}
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
                    size={20}
                    strokeWidth={2.5}
                />
            }
            title="Blood Cough"
            value={
                summary
                    .recordedEvents
                    .bloodCoughCount
            }
        />

    </div>


    {/* ==================================================
        PDF ACTION
    ================================================== */}

    <div
        className="
            shrink-0
            lg:ml-1
        "
    >

        <PdfDownloadButton
            loading={false}
            onClick={async () => {

                const element =
                    document.getElementById(
                        "executive-summary"
                    );

                if (!element) {
                    return;
                }


                const bytes =
                    await executiveSummaryPdf.generate({
                        patient,
                        summary,
                        clinicalStory
                    });


                const pdfBytes =
                    new Uint8Array(
                        bytes
                    );


                const blob =
                    new Blob(
                        [pdfBytes],
                        {
                            type:
                                "application/pdf"
                        }
                    );


                const url =
                    URL.createObjectURL(
                        blob
                    );


                const link =
                    document.createElement(
                        "a"
                    );


                link.href = url;


                const now =
                    new Date();


                const pad =
                    (
                        value: number
                    ) =>
                        value
                            .toString()
                            .padStart(
                                2,
                                "0"
                            );


                const timestamp =
                    `${now.getFullYear()}-` +
                    `${pad(
                        now.getMonth() + 1
                    )}-` +
                    `${pad(
                        now.getDate()
                    )}_` +
                    `${pad(
                        now.getHours()
                    )}-` +
                    `${pad(
                        now.getMinutes()
                    )}-` +
                    `${pad(
                        now.getSeconds()
                    )}`;


                const safePatientName =
                    (
                        patient.name ??
                        "Patient"
                    )
                        .replace(
                            /[^\w\s-]/g,
                            ""
                        )
                        .trim()
                        .replace(
                            /\s+/g,
                            "_"
                        );


                link.download =
                    `CareVR_ExecutiveSummary_${safePatientName}_${timestamp}.pdf`;


                link.click();


                URL.revokeObjectURL(
                    url
                );

            }}
        />

    </div>

</div>

            </section>


            {/* ==================================================
                CLINICAL JOURNEY — PART 3 WILL START HERE
            ================================================== */}
            {/* ==================================================
                FIVE CLINICAL QUESTIONS
            ================================================== */}

            <section
                className="
                    rounded-3xl
                    border
                    border-slate-100
                    bg-white
                    p-6
                    shadow-xl
                    sm:p-8
                "
            >

                <div
                    className="
                        mb-6
                        flex
                        items-center
                        gap-3
                    "
                >

                    <div
                        className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-blue-50
                            text-xl
                        "
                    >
                        📋
                    </div>

                    <div>

                        <h2
                            className="
                                text-xl
                                font-bold
                                text-slate-900
                            "
                        >
                            Clinical Journey
                        </h2>

                        <p
                            className="
                                mt-1
                                text-sm
                                text-slate-500
                            "
                        >
                            Five questions every doctor needs answered.
                        </p>

                    </div>

                </div>


                <div className="space-y-6">

                    {clinicalStory.map(
                        (item: any) => (

<section
    key={item.id}
    className="
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
    "
>

    <div
        className="
            grid
            grid-cols-1
            lg:grid-cols-[250px_minmax(0,1fr)]
        "
    >

        {/* ==================================================
            QUESTION / LEFT COLUMN
        ================================================== */}

        <div
            className="
                flex
                items-start
                gap-3
                border-b
                border-slate-100
                bg-slate-50
                px-4
                py-4
                lg:flex-col
                lg:justify-center
                lg:border-b-0
                lg:border-r
                lg:px-5
                lg:py-6
            "
        >

            <div
                className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-white
                    text-xl
                    shadow-sm
                "
            >
                {item.icon}
            </div>


            <div className="min-w-0">

                <h3
                    className="
                        text-base
                        font-bold
                        leading-5
                        text-slate-900
                    "
                >
                    {item.title}
                </h3>


                <p
                    className="
                        mt-1
                        text-sm
                        leading-5
                        text-slate-600
                    "
                >
                    {item.question}
                </p>

            </div>

        </div>


        {/* ==================================================
            DATE-WISE ANSWERS / RIGHT COLUMN
        ================================================== */}

<div
    className="
        p-3
        sm:p-4
    "
>

{item.id === "Q1" ? (

    <div className="relative pl-2">

        {/* Vertical timeline */}

        <div
            className="
                absolute
                left-[11px]
                top-3
                bottom-3
                w-px
                bg-slate-200
            "
        />

        <div className="space-y-5">

            {item.periods.map(
                (
                    period: any,
                    index: number
                ) => {

                    const isCurrent =
                        index ===
                        item.periods.length - 1;

                    return (
                        <React.Fragment
                            key={period.weekLabel}
                        >

                            {/* PERIOD */}

                            <div
                                className="
                                    relative
                                    grid
                                    grid-cols-[22px_minmax(0,1fr)]
                                    gap-3
                                "
                            >

                                {/* TIMELINE DOT */}

                                <div
                                    className="
                                        relative
                                        z-10
                                        mt-1
                                        flex
                                        h-[22px]
                                        w-[22px]
                                        items-center
                                        justify-center
                                    "
                                >

                                    <div
                                        className={`
                                            h-3
                                            w-3
                                            rounded-full
                                            border-2
                                            border-white
                                            shadow-sm
                                            ${
                                                isCurrent
                                                    ? "bg-blue-600 ring-2 ring-blue-100"
                                                    : "bg-slate-400"
                                            }
                                        `}
                                    />

                                </div>


                                {/* TIMELINE CONTENT */}

                                <div
                                    className="
                                        min-w-0
                                        pb-1
                                    "
                                >

                                    <div
                                        className="
                                            mb-1
                                            text-xs
                                            font-bold
                                            text-blue-700
                                        "
                                    >
                                        {
                                            period.weekLabel
                                        }
                                    </div>

<div
    className="
        text-sm
        leading-6
        text-slate-700
    "
>
    {(() => {

        const symptoms =
            period.answer
                .replace(
                    /^Symptoms\s*/i,
                    ""
                )
                .trim();

        if (!symptoms) {
            return "No symptoms were recorded during this period.";
        }

        if (isCurrent) {
            return `Since 04 Aug, ${symptoms.toLowerCase()} have continued to be reported.`;
        }

        return `During this period, the patient experienced ${symptoms.toLowerCase()}.`;

    })()}
</div>

                                </div>

                            </div>


                            {/* 03 AUG DOCTOR VISIT */}

                            {index === 0 && (
                                <div
                                    className="
                                        relative
                                        grid
                                        grid-cols-[22px_minmax(0,1fr)]
                                        gap-3
                                    "
                                >

                                    {/* VISIT MARKER */}

                                    <div
                                        className="
                                            relative
                                            z-10
                                            mt-1
                                            flex
                                            h-[22px]
                                            w-[22px]
                                            items-center
                                            justify-center
                                        "
                                    >

                                        <div
                                            className="
                                                flex
                                                h-4
                                                w-4
                                                items-center
                                                justify-center
                                                rounded-full
                                                border-2
                                                border-white
                                                bg-blue-500
                                                text-[8px]
                                                shadow-sm
                                                ring-2
                                                ring-blue-100
                                            "
                                        >
                                            •
                                        </div>

                                    </div>


                                    {/* VISIT CONTENT */}

                                    <div
                                        className="
                                            min-w-0
                                            pb-1
                                        "
                                    >

                                        <div
                                            className="
                                                mb-1
                                                text-xs
                                                font-bold
                                                text-blue-700
                                            "
                                        >
                                            03 Aug 2026 · Doctor visit
                                        </div>

                                        <div
                                            className="
                                                text-sm
                                                leading-6
                                                text-slate-700
                                            "
                                        >
                                            Doctor consultation recorded.
                                            The latest clinical plan was
                                            established at this visit.
                                        </div>

                                    </div>

                                </div>
                            )}

                        </React.Fragment>
                    );

                }
            )}

        </div>

    </div>

) : item.id === "Q3" ? (

    (() => {

        const currentPeriod =
            item.periods[
                item.periods.length - 1
            ];

        if (!currentPeriod) {
            return null;
        }

        return (

            <article
                key={
                    currentPeriod.weekLabel
                }
                className="
                    mb-3
                    overflow-hidden
                    rounded-xl
                    border
                    border-blue-200
                    bg-blue-50/40
                    last:mb-0
                "
            >

                {/* DATE */}

                <div
                    className="
                        border-b
                        border-blue-100
                        px-4
                        py-3
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            gap-3
                        "
                    >

                        <div
                            className="
                                text-sm
                                font-semibold
                                text-blue-800
                            "
                        >
                            Current week
                        </div>

                        <span
                            className="
                                rounded-full
                                bg-blue-100
                                px-2
                                py-1
                                text-[10px]
                                font-bold
                                text-blue-700
                            "
                        >
                            CURRENT
                        </span>

                    </div>

                    <div
                        className="
                            mt-1
                            text-xs
                            text-slate-500
                        "
                    >
                        {
                            currentPeriod.weekLabel
                        }
                    </div>

                </div>


                {/* ANSWER */}

<div
    className="
        px-4
        py-4
    "
>
{(() => {

    /*
     * ==================================================
     * CURRENT WEEK
     *
     * Match the structured clinical-data bucket to the
     * exact period being displayed by Q3.
     * ==================================================
     */

    const currentWeek =
        groupedTimeline.find(
            week =>
                week.weekLabel ===
                currentPeriod.weekLabel
        );


    const answer =
        currentPeriod.answer
            .replace(/\r\n/g, "\n")
            .trim();


    /*
     * ==================================================
     * NUMERIC VITAL VALUES
     *
     * All vitals are read directly from the structured
     * clinical timeline.
     * ==================================================
     */

    const numericValues = (
        values: unknown[] = []
    ): number[] => {

        if (!Array.isArray(values)) {
            return [];
        }

        return values
            .map(
                value =>
                    typeof value === "number"
                        ? value
                        : Number(value)
            )
            .filter(
                value =>
                    Number.isFinite(value)
            );

    };


    /*
     * ==================================================
     * RANGE
     * ==================================================
     */

    const formatRange = (
        values: unknown[],
        suffix: string
    ) => {

        const numbers =
            numericValues(values);

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

        return {

            current:
                `${current}${suffix}`,

            min:
                `${minimum}${suffix}`,

            max:
                `${maximum}${suffix}`

        };

    };


    /*
     * ==================================================
     * BLOOD PRESSURE
     * ==================================================
     */

    const formatBloodPressure = () => {

        const systolic =
            numericValues(
                currentWeek?.vitals?.systolic ?? []
            );

        const diastolic =
            numericValues(
                currentWeek?.vitals?.diastolic ?? []
            );


        if (
            systolic.length === 0 &&
            diastolic.length === 0
        ) {
            return null;
        }


        const pair = (
            systolicValue: number | null,
            diastolicValue: number | null
        ): string => {

            if (
                systolicValue !== null &&
                diastolicValue !== null
            ) {
                return (
                    `${systolicValue}/` +
                    `${diastolicValue} mmHg`
                );
            }

            if (
                systolicValue !== null
            ) {
                return `${systolicValue} mmHg`;
            }

            if (
                diastolicValue !== null
            ) {
                return `${diastolicValue} mmHg`;
            }

            return "—";

        };


        return {

            current:
                pair(
                    systolic.length > 0
                        ? systolic[
                            systolic.length - 1
                        ]
                        : null,

                    diastolic.length > 0
                        ? diastolic[
                            diastolic.length - 1
                        ]
                        : null
                ),

            min:
                pair(
                    systolic.length > 0
                        ? Math.min(
                            ...systolic
                        )
                        : null,

                    diastolic.length > 0
                        ? Math.min(
                            ...diastolic
                        )
                        : null
                ),

            max:
                pair(
                    systolic.length > 0
                        ? Math.max(
                            ...systolic
                        )
                        : null,

                    diastolic.length > 0
                        ? Math.max(
                            ...diastolic
                        )
                        : null
                )

        };

    };


/*
 * ==================================================
 * TEMPERATURE
 *
 * Use current-week temperature readings when
 * available.
 *
 * If no temperature was recorded during the
 * current week, use the latest available
 * temperature record and mark it with *.
 *
 * Min / Max in fallback mode are based on all
 * available historical temperature readings.
 * ==================================================
 */

const currentWeekTemperatureValues =
    numericValues(
        currentWeek?.vitals?.temperature ?? []
    );


const historicalTemperatureRecords =
    (summary.clinicalTimeline ?? [])
        .filter(
            event =>
                event.vitals?.temperature !== null &&
                event.vitals?.temperature !== undefined &&
                Number.isFinite(
                    Number(
                        event.vitals.temperature
                    )
                )
        )
        .map(
            event => ({
                date:
                    new Date(
                        event.date
                    ).getTime(),

                value:
                    Number(
                        event.vitals.temperature
                    )
            })
        )
        .sort(
            (a, b) =>
                a.date - b.date
        );


let temperature:
    | {
        current: string;
        min: string;
        max: string;
        isFallback: boolean;
    }
    | null = null;


if (
    currentWeekTemperatureValues.length > 0
) {

    const currentTemperature =
        formatRange(
            currentWeekTemperatureValues,
            "°F"
        );

    if (currentTemperature) {

        temperature = {
            ...currentTemperature,
            isFallback: false
        };

    }

}
else if (
    historicalTemperatureRecords.length > 0
) {

    const historicalValues =
        historicalTemperatureRecords.map(
            record =>
                record.value
        );


    const latestTemperature =
        historicalTemperatureRecords[
            historicalTemperatureRecords.length - 1
        ].value;


    temperature = {

        current:
            `${latestTemperature}°F`,

        min:
            `${Math.min(
                ...historicalValues
            )}°F`,

        max:
            `${Math.max(
                ...historicalValues
            )}°F`,

        isFallback:
            true

    };

}


    /*
     * ==================================================
     * VITAL CARDS
     * ==================================================
     */

    const vitalCards = [

        {
            key: "blood-pressure",

            label:
                "Blood Pressure",

            icon:
                "♥",

            iconClass:
                "bg-rose-50 text-rose-600",

            data:
                formatBloodPressure()

        },

        {
            key: "pulse",

            label:
                "Pulse",

            icon:
                "♥",

            iconClass:
                "bg-red-50 text-red-600",

            data:
                formatRange(
                    currentWeek?.vitals?.pulse ?? [],
                    " bpm"
                )

        },

        {
            key: "spo2",

            label:
                "SpO₂",

            icon:
                "◉",

            iconClass:
                "bg-blue-50 text-blue-600",

            data:
                formatRange(
                    currentWeek?.vitals?.spo2 ?? [],
                    "%"
                )

        },

{
    key: "temperature",

    label:
        "Temperature",

    icon:
        "♨",

    iconClass:
        "bg-amber-50 text-amber-600",

    data:
        temperature

}

    ];


        /*
         * ==================================================
         * YESTERDAY'S SYMPTOMS
         *
         * Symptoms continue to come from the generated Q3
         * answer, which is already restricted to yesterday
         * by answers.ts.
         * ==================================================
         */

        const symptomsMatch =
            answer.match(
                /Yesterday's symptoms\s*([\s\S]*)$/i
            );


        const yesterdaySymptoms =
            symptomsMatch?.[1]
                ? symptomsMatch[1]
                    .split("\n")
                    .map(
                        (
                            line: string
                        ) =>
                            line.trim()
                    )
                    .filter(Boolean)
                : [];


        return (

            <div className="space-y-5">

                {/* ==================================================
                    VITALS
                ================================================== */}

                <div>

                    <div
                        className="
                            mb-3
                            flex
                            items-center
                            gap-2
                        "
                    >

                        <div
                            className="
                                flex
                                h-7
                                w-7
                                items-center
                                justify-center
                                rounded-full
                                bg-blue-50
                                text-sm
                            "
                        >
                            ❤️
                        </div>

                        <div
                            className="
                                text-sm
                                font-bold
                                text-slate-800
                            "
                        >
                            Current vitals
                        </div>

                    </div>


                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-3
                            sm:grid-cols-2
                            xl:grid-cols-4
                        "
                    >

                        {vitalCards.map(
                            (
                                vital
                            ) => (

                                <div
                                    key={
                                        vital.key
                                    }
                                    className="
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-white
                                        p-3
                                        shadow-sm
                                    "
                                >

                                    <div
                                        className="
                                            mb-3
                                            flex
                                            items-center
                                            gap-2
                                        "
                                    >

                                        <div
                                            className={`
                                                flex
                                                h-8
                                                w-8
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-full
                                                text-sm
                                                ${vital.iconClass}
                                            `}
                                        >
                                            {
                                                vital.icon
                                            }
                                        </div>

                                        <div
                                            className="
                                                text-xs
                                                font-bold
                                                text-slate-600
                                            "
                                        >
                                            {
                                                vital.label
                                            }
                                        </div>

                                    </div>


<div
    className="
        text-[10px]
        font-semibold
        uppercase
        tracking-wide
        text-slate-400
    "
>
    {
        vital.key === "temperature" &&
        temperature?.isFallback
            ? "Latest*"
            : "Current"
    }
</div>

<div
    className="
        mt-0.5
        text-base
        font-bold
        leading-5
        text-slate-900
    "
>
    {
        vital.data
            ?.current ??
        "—"
    }
</div>

{
    vital.key === "temperature" &&
    temperature?.isFallback && (

        <div
            className="
                mt-2
                text-[11px]
                leading-4
                text-slate-400
            "
        >
            * Latest available temperature record;
            no temperature was recorded this week.
        </div>

    )
}

                                    <div
                                        className="
                                            grid
                                            grid-cols-2
                                            gap-2
                                            border-t
                                            border-slate-100
                                            pt-2
                                        "
                                    >

                                        <div>

                                            <div
                                                className="
                                                    text-[10px]
                                                    font-medium
                                                    text-slate-400
                                                "
                                            >
                                                Min
                                            </div>

                                            <div
                                                className="
                                                    mt-0.5
                                                    text-xs
                                                    font-semibold
                                                    text-slate-600
                                                "
                                            >
                                                {
                                                    vital.data
                                                        ?.min ??
                                                    "—"
                                                }
                                            </div>

                                        </div>


                                        <div>

                                            <div
                                                className="
                                                    text-[10px]
                                                    font-medium
                                                    text-slate-400
                                                "
                                            >
                                                Max
                                            </div>

                                            <div
                                                className="
                                                    mt-0.5
                                                    text-xs
                                                    font-semibold
                                                    text-slate-600
                                                "
                                            >
                                                {
                                                    vital.data
                                                        ?.max ??
                                                    "—"
                                                }
                                            </div>

                                        </div>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                </div>


                {/* ==================================================
                    YESTERDAY'S SYMPTOMS
                ================================================== */}

                <div
                    className="
                        border-t
                        border-slate-100
                        pt-4
                    "
                >

                    <div
                        className="
                            mb-2
                            text-sm
                            font-bold
                            text-slate-800
                        "
                    >
                        Yesterday's symptoms
                    </div>


                    {yesterdaySymptoms.length > 0 ? (

                        <div
                            className="
                                flex
                                flex-wrap
                                gap-2
                            "
                        >

                            {yesterdaySymptoms.map(
                                (
                                    symptom: string,
                                    index: number
                                ) => (

                                    <span
                                        key={
                                            index
                                        }
                                        className="
                                            rounded-full
                                            bg-slate-100
                                            px-3
                                            py-1.5
                                            text-xs
                                            font-medium
                                            text-slate-700
                                        "
                                    >
                                        {
                                            symptom
                                        }
                                    </span>

                                )
                            )}

                        </div>

                    ) : (

                        <div
                            className="
                                text-sm
                                text-slate-500
                            "
                        >
                            No symptoms were recorded yesterday.
                        </div>

                    )}

                </div>

            </div>

        );

    })()}

</div>

            </article>

        );

    })()

) : (

    item.periods.map(
            (period: any) => (

                <article
                    key={
                        period.weekLabel
                    }
                    className="
                        mb-3
                        overflow-hidden
                        rounded-xl
                        border
                        border-slate-100
                        bg-slate-50
                        last:mb-0
                    "
                >

                    {/* DATE */}

                    <div
                        className="
                            border-b
                            border-slate-100
                            px-4
                            py-3
                        "
                    >

                        <div
                            className="
                                text-sm
                                font-semibold
                                text-blue-800
                            "
                        >
                            {
                                period.weekLabel
                            }
                        </div>

                    </div>


                    {/* ANSWER */}

                    <div
                        className="
                            px-4
                            py-4
                        "
                    >

{item.id === "Q5" ? (

    <ClinicalPlan
        answer={
            period.answer
        }
    />

) : item.id === "Q2" ? (

    <div className="text-sm text-slate-700">
        {(() => {

            const answer =
                period.answer
                    .replace(/\r\n/g, "\n")
                    .trim();


            /*
             * ==================================================
             * HEALTH CHANGES
             *
             * Q1 = What happened?
             * Q2 = What changed?
             *
             * Clinical Changes are intentionally hidden for now.
             * ==================================================
             */

            const symptomMatch =
                answer.match(
                    /Symptom progression\s+([\s\S]*?)(?=\s+Vital changes|\s+Medication changes|\s+Clinical changes|$)/i
                );

            const vitalMatch =
                answer.match(
                    /Vital changes\s+([\s\S]*?)(?=\s+Medication changes|\s+Clinical changes|$)/i
                );

            const medicationMatch =
                answer.match(
                    /Medication changes\s+([\s\S]*?)(?=\s+Clinical changes|$)/i
                );


            const cleanValue = (
                value: string | undefined
            ) => {

                if (!value) {
                    return "";
                }

                return value
                    .replace(
                        /^Symptoms recorded:\s*/i,
                        ""
                    )
                    .replace(
                        /^No longer reported:\s*/i,
                        ""
                    )
                    .replace(
                        /^No specific vital change was recorded during this period\.?\s*/i,
                        ""
                    )
                    .replace(
                        /^No vital change was recorded during this period\.?\s*/i,
                        ""
                    )
                    .replace(
                        /^No medication change was recorded during this period\.?\s*/i,
                        ""
                    )
                    .replace(
                        /^No additional clinical change was recorded during this period\.?\s*/i,
                        ""
                    )
                    .trim();

            };


            /*
             * ==================================================
             * SYMPTOM CHANGES
             *
             * Convert the comma-separated symptom string
             * into individual points.
             * ==================================================
             */

            const symptomChanges =
                symptomMatch?.[1]
                    ? cleanValue(
                        symptomMatch[1]
                    )
                        .split(",")
                        .map(
                            (
                                value: string
                            ) =>
                                value.trim()
                        )
                        .filter(Boolean)
                    : [];


            /*
             * ==================================================
             * VITAL CHANGES
             *
             * Already generated as newline-separated findings.
             * ==================================================
             */

            const vitalChanges =
                vitalMatch?.[1]
                    ? vitalMatch[1]
                        .split("\n")
                        .map(
                            (
                                value: string
                            ) =>
                                cleanValue(
                                    value
                                )
                        )
                        .filter(Boolean)
                    : [];


            /*
             * ==================================================
             * MEDICATION CHANGES
             * ==================================================
             */

            const medicationChange =
                cleanValue(
                    medicationMatch?.[1]
                );


            /*
             * ==================================================
             * CHANGE ITEMS
             *
             * Clinical Changes intentionally omitted.
             * ==================================================
             */

            const changeItems = [
                {
                    key: "symptoms",
                    label: "Symptoms Change",
                    icon: "〽",
                    iconClass:
                        "bg-violet-50 text-violet-600",
                    labelClass:
                        "text-violet-700",
                    bulletClass:
                        "bg-violet-400",
                    value:
                        symptomChanges.length > 0
                            ? symptomChanges
                            : [
                                "No significant symptom change was recorded during this period."
                            ]
                },

                {
                    key: "vitals",
                    label: "Vital Changes",
                    icon: "♨",
                    iconClass:
                        "bg-red-50 text-red-600",
                    labelClass:
                        "text-red-700",
                    bulletClass:
                        "bg-red-400",
                    value:
                        vitalChanges.length > 0
                            ? vitalChanges
                            : [
                                "No significant vital change was recorded during this period."
                            ]
                },

                {
                    key: "medication",
                    label: "Medication Changes",
                    icon: "💊",
                    iconClass:
                        "bg-emerald-50 text-emerald-600",
                    labelClass:
                        "text-emerald-700",
                    bulletClass:
                        "bg-emerald-400",
                    value:
                        medicationChange
                            ? [
                                medicationChange
                            ]
                            : [
                                "No medication change was recorded during this period."
                            ]
                }
            ];


            return (

                <div
                    className="
                        grid
                        grid-cols-1
                        gap-0
                        divide-y
                        divide-slate-100
                        md:grid-cols-2
                        md:divide-x
                        md:divide-y-0
                        xl:grid-cols-3
                    "
                >

                    {changeItems.map(
                        (
                            change
                        ) => (

                            <div
                                key={
                                    change.key
                                }
                                className="
                                    min-w-0
                                    px-3
                                    py-3
                                    first:pl-0
                                    last:pr-0
                                    md:px-4
                                    xl:border-r
                                    xl:border-slate-100
                                    xl:last:border-r-0
                                "
                            >

                                {/* CATEGORY */}

                                <div
                                    className="
                                        mb-2
                                        flex
                                        items-center
                                        gap-2
                                    "
                                >

                                    <div
                                        className={`
                                            flex
                                            h-8
                                            w-8
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-full
                                            text-sm
                                            ${change.iconClass}
                                        `}
                                    >
                                        {
                                            change.icon
                                        }
                                    </div>


                                    <div
                                        className={`
                                            text-xs
                                            font-bold
                                            leading-4
                                            ${change.labelClass}
                                        `}
                                    >
                                        {
                                            change.label
                                        }
                                    </div>

                                </div>


                                {/* POINTS */}

                                <div
                                    className="
                                        space-y-1.5
                                        text-[13px]
                                        leading-5
                                        text-slate-600
                                    "
                                >

                                    {change.value.map(
                                        (
                                            point: string,
                                            pointIndex: number
                                        ) => (

                                            <div
                                                key={
                                                    pointIndex
                                                }
                                                className="
                                                    flex
                                                    items-start
                                                    gap-2
                                                "
                                            >

                                                <span
                                                    className={`
                                                        mt-[7px]
                                                        h-1.5
                                                        w-1.5
                                                        shrink-0
                                                        rounded-full
                                                        ${change.bulletClass}
                                                    `}
                                                />

                                                <span>
                                                    {
                                                        point
                                                    }
                                                </span>

                                            </div>

                                        )
                                    )}

                                </div>

                            </div>

                        )
                    )}

                </div>

            );

        })()}
    </div>

) : (

    <div
        className="
            whitespace-pre-line
            text-sm
            leading-6
            text-slate-700
        "
    >
        {
            period.answer
        }
    </div>

)}

                    </div>

                </article>

            )
        )

    )}

</div>

    </div>

</section>

                        )
                    )}

                </div>

            </section>


            {/* ==================================================
                END OF EXECUTIVE SUMMARY
            ================================================== */}

        </div>

    );
}
function ClinicalPlan({
    answer
}: {
    answer: string;
}) {

    const lines =
        answer
            .split("\n")
            .map(
                line => line.trim()
            )
            .filter(Boolean);


    const consultationIndex =
        lines.findIndex(
            line =>
                line.toLowerCase() ===
                "latest consultation"
        );


    const instructionsIndex =
        lines.findIndex(
            line =>
                line.toLowerCase() ===
                "doctor instructions"
        );


    const consultation =
        consultationIndex >= 0
            ? lines[
                consultationIndex + 1
              ]
            : null;


    const instructions =
        instructionsIndex >= 0
            ? lines.slice(
                instructionsIndex + 1
              )
            : [];


    const icons = [
        "🍬",
        "🚫",
        "💊",
        "🩸",
        "🩻"
    ];


    return (

        <div className="relative">

            <div
                className="
                    absolute
                    left-3.5
                    top-4
                    bottom-4
                    w-px
                    bg-blue-100
                "
            />


            <div className="relative space-y-4">

                {consultation && (

                    <div
                        className="
                            flex
                            items-start
                            gap-3
                        "
                    >

                        <div
                            className="
                                z-10
                                flex
                                h-7
                                w-7
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                border
                                border-blue-100
                                bg-white
                                text-sm
                            "
                        >
                            📋
                        </div>


                        <div
                            className="
                                min-w-0
                                pt-1
                            "
                        >

                            <div
                                className="
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-blue-700
                                "
                            >
                                Latest consultation
                            </div>

                            <div
                                className="
                                    mt-1
                                    text-sm
                                    leading-6
                                    text-slate-700
                                "
                            >
                                {consultation}
                            </div>

                        </div>

                    </div>

                )}


                {instructions.map(
                    (
                        instruction,
                        index
                    ) => (

                        <div
                            key={index}
                            className="
                                flex
                                items-start
                                gap-3
                            "
                        >

                            <div
                                className="
                                    z-10
                                    flex
                                    h-7
                                    w-7
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-full
                                    border
                                    border-blue-100
                                    bg-white
                                    text-sm
                                "
                            >
                                {
                                    icons[index] ??
                                    "•"
                                }
                            </div>


                            <div
                                className="
                                    min-w-0
                                    flex-1
                                    pt-1
                                    text-sm
                                    leading-6
                                    text-slate-700
                                "
                            >
                                {instruction}
                            </div>

                        </div>

                    )
                )}

            </div>

        </div>

    );
}


function SummaryCard({
    icon,
    title,
    value
}: {
    icon: ReactNode;
    title: string;
    value: number;
}) {

    return (

        <div
            className="
                min-w-0
                rounded-2xl
                bg-slate-50
                px-4
                py-3
            "
        >

            <div
                className="
                    flex
                    items-center
                    gap-2
                "
            >

                <div
                    className="
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-gradient-to-br
                        from-blue-100
                        to-cyan-100
                        text-blue-700
                    "
                >
                    {icon}
                </div>

                <div
                    className="
                        min-w-0
                        truncate
                        text-xs
                        font-semibold
                        text-slate-600
                    "
                >
                    {title}
                </div>

            </div>


            <div
                className="
                    mt-1
                    text-2xl
                    font-bold
                    leading-none
                    text-slate-900
                "
            >
                {value}
            </div>

        </div>

    );
}