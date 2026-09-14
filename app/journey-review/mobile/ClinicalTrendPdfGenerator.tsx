"use client";

import { useEffect, useRef, useState } from "react";

import {
    buildClinicalTrends,
    ClinicalTrendSummary,
} from "../data/clinicalTrends";

import {
    trendReportPdf,
} from "@/lib/pdf/trendReportPdf";


import {
    patientStorage,
} from "@/lib/storage/patientStorage";

import {
    buildPatient,
} from "@/app/journey-review/data/patient";




function formatReportDate(
    dateString: string
): string {

    return new Date(
        `${dateString}T00:00:00`
    ).toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    );

}


interface ClinicalTrendPdfGeneratorProps {

    patientId: string | null;

    patientName: string;

    startDate: string;

    endDate: string;

    onComplete?: () => void;

    onNoData?: () => void;

}

export default function ClinicalTrendPdfGenerator({

    patientId,

    patientName,

    startDate,

    endDate,

    onComplete,

    onNoData,

}: ClinicalTrendPdfGeneratorProps) {

    const [progress, setProgress] = useState(0);

    const [generating, setGenerating] =
        useState(true);


const [message, setMessage] = useState(
    "Preparing Clinical Trends..."
);

const [trends, setTrends] =
    useState<ClinicalTrendSummary[]>([]);

const generationStartedRef =
    useRef(false);


useEffect(() => {

    if (!generating) {
        return;
    }


    if (!startDate || !endDate) {
        return;
    }

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
            "Loading clinical data..."
        );

const data =
    await buildClinicalTrends(
        patientId!,
        startDate,
        endDate
    );

if (data.length === 0) {
    onNoData?.();
    return;
}

setTrends(data);

const pdfTrends =
    data.map(
        trend => ({

            parameter:
                trend.parameter,

            status:
                "Recorded",

            current:
                trend.current,

            history:
                trend.history,

            periods: [
                {

                    label:
                        `${formatReportDate(
                            startDate
                        )} - ${formatReportDate(
                            endDate
                        )}`,

                    current:
                        trend.current,

                    minimum:
                        trend.minimum,

                    maximum:
                        trend.maximum,

                    average:
                        trend.average

                }
            ]

        })
    );

setProgress(70);

setMessage(
    "Generating PDF..."
);

const careVrPatient =
    buildPatient();

const pdfBytes =
    await trendReportPdf.generate(
        pdfTrends,
        {

            patientName:
                patientName || "Patient",

            age:
                String(
                    careVrPatient.age
                ),

            sex:
                careVrPatient.gender,

            doctorName:
                careVrPatient.doctor,

            hospitalName:
                careVrPatient.hospital,

            reportPeriod:
                `${formatReportDate(
                    startDate
                )} - ${formatReportDate(
                    endDate
                )}`

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

}, [
    generating,
    patientId,
    startDate,
    endDate,
    patientName,
    onComplete
]);

return (

    <div
        style={{
            width: "100%",
            padding: "24px 18px",
            textAlign: "center",
            boxSizing: "border-box",
        }}
    >

{!generating ? (

    <>

        <h2
            style={{
                margin:
                    "0 0 18px",
            }}
        >
            Clinical Trends
        </h2>

        <p
            style={{
                margin:
                    "0 0 10px",
                color:
                    "#59657f",
                fontSize: 14,
            }}
        >
            {startDate && endDate
                ? `${formatReportDate(
                    startDate
                )} - ${formatReportDate(
                    endDate
                )}`
                : "Preparing report..."}
        </p>

    </>

) : (

            <>

                <h2
                    style={{
                        marginBottom: 18,
                    }}
                >
                    Clinical Trends
                </h2>


                <p>
                    {message}
                </p>


<p
    style={{
        marginTop: 4,
        color: "#59657f",
        fontSize: 13,
    }}
>
    {startDate && endDate
        ? `${formatReportDate(
            startDate
        )} - ${formatReportDate(
            endDate
        )}`
        : ""}
</p>


                <div
                    style={{
                        width: "100%",
                        height: 12,
                        background:
                            "#E5E7EB",
                        borderRadius: 6,
                        overflow: "hidden",
                        marginTop: 24,
                    }}
                >

                    <div
                        style={{
                            width:
                                `${progress}%`,
                            height: "100%",
                            background:
                                "#2563EB",
                            transition:
                                "width 0.35s ease",
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

            </>

        )}

    </div>

);

}

function delay(milliseconds: number): Promise<void> {

    return new Promise((resolve) => {

        window.setTimeout(resolve, milliseconds);

    });

}