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





const REPORT_PERIOD_DAYS = 21;


function calculateAge(
    dateOfBirth: string | null | undefined
): number | null {

    if (!dateOfBirth) {
        return null;
    }

    const birthDate =
        new Date(dateOfBirth);

    if (
        Number.isNaN(
            birthDate.getTime()
        )
    ) {
        return null;
    }

    const today =
        new Date();

    let age =
        today.getFullYear() -
        birthDate.getFullYear();

    const monthDifference =
        today.getMonth() -
        birthDate.getMonth();

    if (
        monthDifference < 0 ||
        (
            monthDifference === 0 &&
            today.getDate() <
                birthDate.getDate()
        )
    ) {
        age--;
    }

    return age;
}


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

    accessId: string | null;

    selectedRole:
        | "SELF"
        | "FAMILY"
        | "CARETAKER"
        | "DOCTOR"
        | null;

    onComplete?: () => void;

    onNoData?: () => void;

}

export default function ClinicalTrendPdfGenerator({

    patientId,

    patientName,

    startDate,

    endDate,

    accessId,

    selectedRole,

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

    let reportAge = "";
    let reportSex = "";
    let reportDoctorName = "";
    let reportHospitalName = "";

    if (patientId) {

        if (!accessId || !selectedRole) {
            throw new Error(
                "CareVR patient context is unavailable."
            );
        }

        const contextResponse =
            await fetch(
                `/api/reports/executive-summary/patient-context?patientId=${encodeURIComponent(
                    patientId
                )}&accessId=${encodeURIComponent(
                    accessId
                )}&selectedRole=${encodeURIComponent(
                    selectedRole
                )}`,
                {
                    method: "GET",
                    cache: "no-store",
                }
            );

        if (!contextResponse.ok) {
            throw new Error(
                "Unable to load patient information."
            );
        }

        const patientContext =
            await contextResponse.json();

        const reportPatient =
            patientContext.patient;

        const reportDoctor =
            patientContext.doctors?.[0] ?? null;

        reportAge =
            String(
                calculateAge(
                    reportPatient.dateOfBirth
                ) ?? ""
            );

        reportSex =
            reportPatient.gender ?? "";

        reportDoctorName =
            reportDoctor?.doctorName ?? "";

        reportHospitalName =
            reportDoctor?.hospitalName ?? "";
    }

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

    const pdfBytes =
        await trendReportPdf.generate(
            pdfTrends,
            {

                patientName:
                    patientName || "Patient",

                age:
                    reportAge,

                sex:
                    reportSex,

                doctorName:
                    reportDoctorName,

                hospitalName:
                    reportHospitalName,

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
    accessId,
    selectedRole,
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