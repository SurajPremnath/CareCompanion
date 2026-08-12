"use client";

import { useEffect, useRef, useState } from "react";

import { executiveSummaryPdf }
    from "@/lib/pdf/executiveSummaryPdf";

import { buildClinicalStory }
    from "@/app/journey-review/clinical-story/storyBuilder";

import { buildExecutiveSummary }
    from "@/app/journey-review/data/executiveSummary";

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
        end: new Date()
            .toISOString()
            .split("T")[0],
        label: "24 Jul 2026 - Current"
    }

];

interface ExecutiveSummaryPdfGeneratorProps {

    patientId: string | null;

    patientName: string;

    onComplete?: () => void;

}

export default function ExecutiveSummaryPdfGenerator({

    patientId,

    patientName,

    onComplete,

}: ExecutiveSummaryPdfGeneratorProps) {

const [progress, setProgress] =
        useState(0);

const [message, setMessage] =
    useState(
        "Preparing Executive Summary..."
    );

const generationStartedRef =
    useRef(false);
// No state required.
// Summary and Clinical Story are generated
// immediately before creating the PDF.

useEffect(() => {

    if (generationStartedRef.current) {
        return;
    }

    generationStartedRef.current = true;

    async function startGeneration() {

        setProgress(20);

        setMessage(
            "Loading patient information..."
        );

        await delay(300);

setProgress(40);

setMessage(
    "Preparing Executive Summary..."
);

const summary =
    await buildExecutiveSummary();

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

            diastolic: [] as number[],

        },

        weight: [] as number[],

        assessments: [] as string[],

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

const story =
    buildClinicalStory(
        groupedTimeline
    );

setProgress(70);

setMessage(
    "Generating PDF..."
);

const bytes =
    await executiveSummaryPdf.generate({

        patient: {

            id:
                patientId ?? "self",

            name:
                patientName || "Patient",

            age:
                0,

            gender:
                "",

        },

        summary,

        clinicalStory: story,

    });

const pdfBytes =
    new Uint8Array(bytes);

const blob =
    new Blob(
        [pdfBytes],
        {
            type: "application/pdf",
        }
    );

const url =
    URL.createObjectURL(blob);

setProgress(100);

setMessage(
    "Opening report..."
);

window.open(
    url,
    "_blank"
);

setTimeout(() => {

    URL.revokeObjectURL(url);

    onComplete?.();

}, 300);

    }

    startGeneration();

}, []);

    return (

        <div
            style={{
                width: "100%",
                padding: "40px 24px",
                textAlign: "center",
            }}
        >

            <h2
                style={{
                    marginBottom: 24,
                }}
            >
                Executive Summary
            </h2>

            <p>{message}</p>

            <div
                style={{
                    width: "100%",
                    height: 12,
                    background: "#E5E7EB",
                    borderRadius: 6,
                    overflow: "hidden",
                    marginTop: 24,
                }}
            >

                <div
                    style={{
                        width: `${progress}%`,
                        height: "100%",
                        background: "#2563EB",
                        transition: "width .35s ease",
                    }}
                />

            </div>

            <div
                style={{
                    marginTop: 12,
                    fontWeight: 600,
                }}
            >
                {progress}%
            </div>

        </div>

    );

}

function delay(milliseconds: number) {

    return new Promise<void>((resolve) => {

        window.setTimeout(resolve, milliseconds);

    });

}