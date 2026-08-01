"use client";

import { useEffect, useState } from "react";

import {
    buildClinicalTrends,
    ClinicalTrendSummary,
} from "../data/clinicalTrends";

import {
    trendReportPdf,
} from "@/lib/pdf/trendReportPdf";

interface ClinicalTrendPdfGeneratorProps {

    patientId: string | null;

    patientName: string;

    onComplete?: () => void;

}

export default function ClinicalTrendPdfGenerator({

    patientId,

    patientName,

    onComplete,

}: ClinicalTrendPdfGeneratorProps) {

    const [progress, setProgress] = useState(0);

    const [message, setMessage] = useState(
        "Preparing Clinical Trends..."
    );

const [trends, setTrends] =
    useState<ClinicalTrendSummary[]>([]);

useEffect(() => {

    async function startGeneration() {

        setProgress(20);

        setMessage(
            "Loading patient information..."
        );

        await delay(300);

        setProgress(40);

        setMessage(
            "Loading clinical data..."
        );

        const data =
            await buildClinicalTrends();

        setTrends(data);

setProgress(70);

setMessage(
    "Generating PDF..."
);

const pdfBytes =
    await trendReportPdf.generate(

        data.map(
            trend => ({

                parameter:
                    trend.parameter,

                status:
                    "Recorded",

                current:
                    trend.current,

                minimum:
                    trend.minimum,

                maximum:
                    trend.maximum,

                average:
                    trend.average,

            })
        ),

        {

            patientName:
                patientName || "Patient",

            reportPeriod:
                "From 10 Jul 2026"

        }

    );

const pdfData =
    new Uint8Array(pdfBytes);

const blob =
    new Blob(
        [pdfData],
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
                Clinical Trends
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
                        transition: "width 0.35s ease",
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

function delay(milliseconds: number): Promise<void> {

    return new Promise((resolve) => {

        window.setTimeout(resolve, milliseconds);

    });

}