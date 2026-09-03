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

const REPORT_PERIOD_DAYS = 21;

const INITIAL_REPORT_START =
    "2026-07-10";

const INITIAL_REPORT_END =
    "2026-08-03";


interface ReportPeriod {

    start: string;

    end: string;

    label: string;

    isCurrent: boolean;

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


function buildReportPeriods(): ReportPeriod[] {

    const periods: ReportPeriod[] = [];

    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    periods.push({

        start:
            INITIAL_REPORT_START,

        end:
            INITIAL_REPORT_END <= today
                ? INITIAL_REPORT_END
                : today,

        label:
            `${formatReportDate(
                INITIAL_REPORT_START
            )} - ` +
            `${formatReportDate(
                INITIAL_REPORT_END <= today
                    ? INITIAL_REPORT_END
                    : today
            )}`,

        isCurrent:
            INITIAL_REPORT_END > today,

    });


    let periodStart =
        new Date(
            `${INITIAL_REPORT_END}T00:00:00`
        );


    periodStart.setDate(
        periodStart.getDate() + 1
    );


    while (
        periodStart
            .toISOString()
            .split("T")[0] <= today
    ) {

        const start =
            periodStart
                .toISOString()
                .split("T")[0];


        const periodEnd =
            new Date(
                periodStart
            );


        periodEnd.setDate(
            periodEnd.getDate()
                + REPORT_PERIOD_DAYS
                - 1
        );


        const calculatedEnd =
            periodEnd
                .toISOString()
                .split("T")[0];


        const isCurrent =
            calculatedEnd > today;


        const end =
            isCurrent
                ? today
                : calculatedEnd;


        periods.push({

            start,

            end,

            label:
                `${formatReportDate(start)} - ` +
                `${formatReportDate(end)}`,

            isCurrent,

        });


        if (isCurrent) {
            break;
        }


        periodStart =
            new Date(
                periodEnd
            );


        periodStart.setDate(
            periodStart.getDate() + 1
        );

    }


    return periods;

}

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

    const [generating, setGenerating] =
        useState(false);

const reportPeriods =
    buildReportPeriods();


const [selectedPeriods, setSelectedPeriods] =
    useState<ReportPeriod[]>([]);


const [message, setMessage] = useState(
    "Select a reporting period"
);

const [trends, setTrends] =
    useState<ClinicalTrendSummary[]>([]);

const generationStartedRef =
    useRef(false);


useEffect(() => {

    if (!generating) {
        return;
    }

if (
    selectedPeriods.length === 0
) {
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

const periodResults =
    await Promise.all(
        selectedPeriods.map(
            async period => {

                const data =
                    await buildClinicalTrends(
                        period.start,
                        period.end
                    );

                return {
                    period,
                    data,
                };

            }
        )
    );

const data =
    periodResults.flatMap(
        result => result.data
    );

setTrends(data);

const pdfTrends =
    Array.from(
        data.reduce(
            (
                map,
                trend
            ) => {

                const existing =
                    map.get(
                        trend.parameter
                    );

                if (existing) {

                    existing.history = [
                        ...existing.history,
                        ...trend.history
                    ];

                } else {

                    map.set(
                        trend.parameter,
                        {
                            ...trend,
                            history: [
                                ...trend.history
                            ]
                        }
                    );

                }

                return map;

            },
            new Map()
        ).values()
    );

        setProgress(70);

        setMessage(
            "Generating PDF..."
        );

const careVrPatient =
    buildPatient();

const pdfBytes =
    await trendReportPdf.generate(


pdfTrends.map(
    trend => ({

        parameter:
            trend.parameter,

        status:
            "Recorded",

        current:
            trend.current,

        history:
            trend.history,

        periods:
            selectedPeriods.map(
                period => {

                    const periodResult =
                        periodResults.find(
                            result =>
                                result.period.start ===
                                period.start
                        );

                    const periodTrend =
                        periodResult?.data.find(
                            item =>
                                item.parameter ===
                                trend.parameter
                        );

                    return {

                        label:
                            period.label,

                        current:
                            periodTrend?.current ??
                            "-",

                        minimum:
                            periodTrend?.minimum ??
                            "-",

                        maximum:
                            periodTrend?.maximum ??
                            "-",

                        average:
                            periodTrend?.average ??
                            "-"

                    };

                }
            )

    })
),

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
            selectedPeriods
                .map(
                    period =>
                        period.label
                )
                .join(" • ")

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
    selectedPeriods
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
                        color: "#59657f",
                        fontSize: 14,
                    }}
                >
                    Select reporting period
                </p>


                <div
                    style={{
                        width: "100%",
                        maxWidth: 380,
                        margin: "0 auto",
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                    }}
                >

                    {reportPeriods.map(
                        period => {

const isSelected =
    selectedPeriods.some(
        selected =>
            selected.start ===
            period.start
    );

                            return (

                                <button
                                    key={
                                        period.start
                                    }
                                    type="button"
onClick={() => {

    setSelectedPeriods(
        current => {

            const alreadySelected =
                current.some(
                    selected =>
                        selected.start ===
                        period.start
                );

            if (alreadySelected) {

                return current.filter(
                    selected =>
                        selected.start !==
                        period.start
                );

            }

            return [
                ...current,
                period,
            ];

        }
    );

}}
                                    style={{
                                        width: "100%",
                                        padding:
                                            "14px 16px",
                                        borderRadius: 12,
                                        border:
                                            isSelected
                                                ? "2px solid #5630e8"
                                                : "1px solid #d1d5db",
                                        background:
                                            isSelected
                                                ? "#f5f3ff"
                                                : "#ffffff",
                                        color:
                                            "#101d45",
                                        textAlign:
                                            "left",
                                        cursor:
                                            "pointer",
                                        boxSizing:
                                            "border-box",
                                    }}
                                >

                                    <div
                                        style={{
                                            display:
                                                "flex",
                                            alignItems:
                                                "center",
                                            justifyContent:
                                                "space-between",
                                            gap: 12,
                                        }}
                                    >

                                        <span
                                            style={{
                                                fontSize: 15,
                                                fontWeight:
                                                    isSelected
                                                        ? 700
                                                        : 600,
                                            }}
                                        >
                                            {period.label}
                                        </span>


                                        {period.isCurrent && (

                                            <span
                                                style={{
                                                    flexShrink: 0,
                                                    fontSize: 12,
                                                    fontWeight: 700,
                                                    color:
                                                        "#5630e8",
                                                }}
                                            >
                                                Current
                                            </span>

                                        )}

                                    </div>

                                </button>

                            );

                        }
                    )}

                </div>


{selectedPeriods.length > 0 && (

    <div
        style={{
            width: "100%",
            maxWidth: 380,
            margin: "14px auto 0",
            textAlign: "left",
            color: "#59657f",
            fontSize: 13,
        }}
    >
        {selectedPeriods.length} period
        {selectedPeriods.length > 1
            ? "s"
            : ""}
        {" selected"}
    </div>

)}


                <button
                    type="button"
                    disabled={
    selectedPeriods.length === 0
}
onClick={() => {

    if (
        selectedPeriods.length === 0
    ) {
        return;
    }

    setProgress(0);

    setMessage(
        "Preparing Clinical Trends..."
    );

    generationStartedRef.current =
        false;

    setGenerating(true);

}}
                    style={{
                        width: "100%",
                        maxWidth: 380,
                        marginTop: 16,
                        padding:
                            "12px 16px",
                        border: "none",
                        borderRadius: 10,
                        background:
                            selectedPeriods.length > 0
                                ? "#5630e8"
                                : "#d1d5db",
                        color: "#ffffff",
                        fontSize: 15,
                        fontWeight: 700,
                        cursor:
                            selectedPeriods.length > 0
                                ? "pointer"
                                : "not-allowed",
                    }}
                >
                    Generate Clinical Trend Report
                </button>

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
    {selectedPeriods
        .map(
            period => period.label
        )
        .join(" • ")}
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