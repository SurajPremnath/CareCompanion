"use client";

import { useEffect, useRef, useState } from "react";

import {
    buildClinicalTrends,
    ClinicalTrendSummary,
    buildClinicalTrendDailyReadings,
} from "../data/clinicalTrends";

import {
    trendReportPdf,
} from "@/lib/pdf/trendReportPdf";


import {
    patientStorage,
} from "@/lib/storage/patientStorage";

import {
    selfProfileStorage,
} from "@/lib/storage/SelfProfileStorage";



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

type ClinicalTrendStage =
    | "preparing"
    | "records"
    | "analysis"
    | "visuals"
    | "pdf";

const clinicalTrendStages: {
    key: ClinicalTrendStage;
    title: string;
    description: string;
}[] = [
    {
        key: "preparing",
        title: "Preparing your report",
        description: "Getting your selected reporting period ready.",
    },
    {
        key: "records",
        title: "Gathering health records",
        description: "Collecting recorded measurements for this period.",
    },
    {
        key: "analysis",
        title: "Analysing clinical trends",
        description: "Organising your readings across the selected period.",
    },
    {
        key: "visuals",
        title: "Preparing clinical insights",
        description: "Arranging your measurements and trend summaries.",
    },
    {
        key: "pdf",
        title: "Generating your report",
        description: "Putting your Clinical Trends report together.",
    },
];



function ClinicalTrendStageIcon({
    stage,
}: {
    stage: ClinicalTrendStage;
}) {
    return (
        <svg
            viewBox="0 0 180 180"
            className="clinical-trend-icon"
            aria-hidden="true"
        >
            <defs>
                <linearGradient
                    id="clinicalTrendGradient"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                >
                    <stop offset="0%" stopColor="#91B8F4" />
                    <stop offset="52%" stopColor="#9276E8" />
                    <stop offset="100%" stopColor="#C16BD9" />
                </linearGradient>
                <radialGradient id="clinicalTrendGlow">
                    <stop offset="0%" stopColor="#D9CCFF" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#D9CCFF" stopOpacity="0" />
                </radialGradient>
            </defs>

            <circle
                cx="90"
                cy="90"
                r="76"
                fill="url(#clinicalTrendGlow)"
            />

            {stage === "preparing" && (
                <g>
                    <rect x="51" y="34" width="78" height="106" rx="12"
                        fill="white" stroke="#B9A7ED" strokeWidth="3" />
                    <path d="M67 57 H111 M67 69 H101"
                        stroke="#A99AE1" strokeWidth="5" strokeLinecap="round" />
                    <path d="M64 103 H78 L87 88 L99 111 L116 91"
                        fill="none" stroke="url(#clinicalTrendGradient)"
                        strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M64 122 H105"
                        stroke="#D6C9F4" strokeWidth="4" strokeLinecap="round" />
                </g>
            )}

            {stage === "records" && (
                <g>
                    <rect x="43" y="42" width="94" height="104" rx="13"
                        fill="white" stroke="#B9A7ED" strokeWidth="3" />
                    <path d="M65 42 V34 H115 V42"
                        fill="none" stroke="#9276E8" strokeWidth="4"
                        strokeLinecap="round" />
                    <path d="M61 69 H119 M61 88 H119 M61 107 H101"
                        stroke="#C5B9EF" strokeWidth="5" strokeLinecap="round" />
                    <circle cx="116" cy="123" r="15"
                        fill="url(#clinicalTrendGradient)" />
                    <path d="M109 123 L114 128 L123 118"
                        fill="none" stroke="white" strokeWidth="3"
                        strokeLinecap="round" strokeLinejoin="round" />
                </g>
            )}

            {stage === "analysis" && (
                <g>
                    <path d="M43 130 V53 M43 130 H140"
                        fill="none" stroke="#B9A7ED" strokeWidth="4"
                        strokeLinecap="round" />
                    <path d="M52 111 L72 91 L89 102 L111 69 L132 79"
                        fill="none" stroke="url(#clinicalTrendGradient)"
                        strokeWidth="6" strokeLinecap="round"
                        strokeLinejoin="round" />
                    <circle cx="72" cy="91" r="5" fill="#9276E8" />
                    <circle cx="89" cy="102" r="5" fill="#9276E8" />
                    <circle cx="111" cy="69" r="5" fill="#9276E8" />
                    <circle cx="132" cy="79" r="5" fill="#C16BD9" />
                </g>
            )}

            {stage === "visuals" && (
                <g>
                    <rect x="39" y="43" width="102" height="94" rx="12"
                        fill="white" stroke="#B9A7ED" strokeWidth="3" />
                    <path d="M54 118 V100 H68 V118 M78 118 V81 H92 V118 M102 118 V65 H116 V118"
                        fill="url(#clinicalTrendGradient)" opacity="0.9" />
                    <path d="M52 59 H111"
                        stroke="#D6C9F4" strokeWidth="4" strokeLinecap="round" />
                </g>
            )}

            {stage === "pdf" && (
                <g>
                    <path d="M51 32 H103 L130 59 V139 Q130 147 122 147 H51 Q43 147 43 139 V40 Q43 32 51 32Z"
                        fill="white" stroke="#B9A7ED" strokeWidth="3" />
                    <path d="M103 32 V59 H130"
                        fill="#E8E0FF" stroke="#B9A7ED" strokeWidth="3"
                        strokeLinejoin="round" />
                    <path d="M59 80 H112 M59 94 H99"
                        stroke="#C5B9EF" strokeWidth="5" strokeLinecap="round" />
                    <path d="M59 119 L75 106 L88 113 L108 99"
                        fill="none" stroke="url(#clinicalTrendGradient)"
                        strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                </g>
            )}
        </svg>
    );
}

interface ClinicalTrendPdfGeneratorProps {

    careMode: "SELF" | "FAMILY";

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

    careMode,

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

const [activeStage, setActiveStage] =
    useState<ClinicalTrendStage>("preparing");

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

setProgress(5);
setActiveStage("preparing");
setMessage("Preparing your report");

await delay(180);

setProgress(20);
setActiveStage("records");
setMessage("Loading patient information...");

    await delay(300);


    let reportAge = "";
    let reportSex = "";
    let reportDoctorName = "";
    let reportHospitalName = "";

    if (careMode === "SELF") {
        const selfProfileResult =
            await selfProfileStorage.getProfile();

        if (
            selfProfileResult.success &&
            selfProfileResult.data
        ) {
            reportAge = String(
                calculateAge(
                    selfProfileResult.data.dateOfBirth
                ) ?? ""
            );
        }
    }

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

        reportAge = String(
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
setActiveStage("analysis");
setMessage("Loading clinical data...");

const [data, dailyReadings] = await Promise.all([
    buildClinicalTrends(
        patientId!,
        startDate,
        endDate
    ),
    buildClinicalTrendDailyReadings(
        patientId!,
        startDate,
        endDate
    ),
]);

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
setActiveStage("visuals");
setMessage("Preparing clinical insights...");

setProgress(80);
setActiveStage("pdf");
setMessage("Generating your Clinical Trends report...");

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

    careMode,

    doctorName:
        reportDoctorName,

    hospitalName:
        reportHospitalName,

    reportPeriod:
        `${formatReportDate(
            startDate
        )} - ${formatReportDate(
            endDate
        )}`,

    dailyReadings:
        dailyReadings
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

/*
    const url =
        URL.createObjectURL(blob);

setProgress(100);
setActiveStage("pdf");
setMessage("Opening report...");

    window.open(
        url,
        "_blank"
    );

    setTimeout(() => {

        onComplete?.();

    }, 300);

*/

const url =
    URL.createObjectURL(blob);

const safePatientName =
    (patientName || "Patient")
        .trim()
        .replace(/\s+/g, "_")
        .replace(/[<>:"/\\|?*]/g, "");

const now = new Date();

const date =
    `${now.getFullYear()}-` +
    `${String(now.getMonth() + 1).padStart(2, "0")}-` +
    `${String(now.getDate()).padStart(2, "0")}`;

const time =
    `${String(now.getHours()).padStart(2, "0")}-` +
    `${String(now.getMinutes()).padStart(2, "0")}-` +
    `${String(now.getSeconds()).padStart(2, "0")}`;

const fileName =
    `CareVR_${safePatientName}_${date}_${time}.pdf`;

const link =
    document.createElement("a");

link.href = url;
link.download = fileName;

document.body.appendChild(link);
link.click();
document.body.removeChild(link);

setProgress(100);
setMessage("Opening report...");

setTimeout(() => {
    URL.revokeObjectURL(url);
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

    <div className="clinical-trend-loading">

        <div className="clinical-trend-artwork-wrap">
            <div
                className="clinical-trend-icon-wrap"
                key={activeStage}
            >
                <ClinicalTrendStageIcon
                    stage={activeStage}
                />
            </div>
        </div>

        <div className="clinical-trend-tag">
            CAREVR · CLINICAL TRENDS
        </div>

        <div
            className="clinical-trend-copy"
            key={`copy-${activeStage}`}
        >
            <h2 className="clinical-trend-title">
                {clinicalTrendStages.find(
                    (stage) => stage.key === activeStage
                )?.title ?? "Preparing your report"}
            </h2>

            <p className="clinical-trend-description">
                {clinicalTrendStages.find(
                    (stage) => stage.key === activeStage
                )?.description ?? message}
            </p>
        </div>

        <p className="clinical-trend-period">
            {startDate && endDate
                ? `${formatReportDate(
                    startDate
                )} - ${formatReportDate(
                    endDate
                )}`
                : "Preparing reporting period"}
        </p>

        <div
            className="clinical-trend-progress"
            role="progressbar"
            aria-label="Clinical Trends report generation progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
        >
            <div
                className="clinical-trend-progress-fill"
                style={{
                    width: `${progress}%`,
                }}
            />
        </div>

        <div className="clinical-trend-progress-steps">
            {clinicalTrendStages.map((stage, index) => {
                const activeIndex =
                    clinicalTrendStages.findIndex(
                        (item) => item.key === activeStage
                    );

                return (
                    <div
                        key={stage.key}
                        className={
                            index <= activeIndex
                                ? "clinical-trend-progress-step is-active"
                                : "clinical-trend-progress-step"
                        }
                    />
                );
            })}
        </div>

        <div className="clinical-trend-percentage">
            {progress}%
        </div>

    </div>


        )}

        <style jsx>{`
            .clinical-trend-loading {
                width: 100%;
                max-width: 440px;
                margin: 0 auto;
                padding: 8px 0 12px;
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
                color: #25304A;
            }

            .clinical-trend-artwork-wrap {
                width: 180px;
                height: 180px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 8px;
            }

            .clinical-trend-icon-wrap {
                width: 180px;
                height: 180px;
                animation: clinical-trend-float 2.8s ease-in-out infinite;
            }

            .clinical-trend-icon {
                display: block;
                width: 100%;
                height: 100%;
                overflow: visible;
            }

            .clinical-trend-tag {
                margin-top: 2px;
                color: #8171C9;
                font-size: 10px;
                font-weight: 700;
                letter-spacing: 2px;
            }

            .clinical-trend-copy {
                margin-top: 16px;
                animation: clinical-trend-fade-in 0.35s ease both;
            }

            .clinical-trend-title {
                margin: 0;
                font-size: 21px;
                line-height: 1.35;
                font-weight: 700;
                color: #283451;
            }

            .clinical-trend-description {
                max-width: 320px;
                margin: 9px auto 0;
                color: #69738B;
                font-size: 14px;
                line-height: 1.6;
            }

            .clinical-trend-period {
                margin: 18px 0 0;
                color: #7B8499;
                font-size: 12px;
            }

            .clinical-trend-progress {
                width: min(100%, 320px);
                height: 8px;
                margin-top: 24px;
                overflow: hidden;
                border-radius: 999px;
                background: rgba(123, 106, 210, 0.16);
            }

            .clinical-trend-progress-fill {
                width: 0;
                height: 100%;
                border-radius: inherit;
                background: linear-gradient(
                    90deg,
                    #7B6BEA,
                    #9276E8,
                    #C16BD9
                );
                transition: width 0.35s ease;
            }

            .clinical-trend-progress-steps {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 7px;
                margin-top: 18px;
            }

            .clinical-trend-progress-step {
                width: 7px;
                height: 7px;
                border-radius: 999px;
                background: rgba(123, 106, 210, 0.2);
                transition:
                    width 0.3s ease,
                    background 0.3s ease;
            }

            .clinical-trend-progress-step.is-active {
                width: 18px;
                background: linear-gradient(
                    90deg,
                    #7B6BEA,
                    #C16BD9
                );
            }

            .clinical-trend-percentage {
                margin-top: 12px;
                color: #6557B5;
                font-size: 13px;
                font-weight: 700;
                font-variant-numeric: tabular-nums;
            }

            @keyframes clinical-trend-float {
                0%, 100% {
                    transform: translateY(0);
                }

                50% {
                    transform: translateY(-6px);
                }
            }

            @keyframes clinical-trend-fade-in {
                from {
                    opacity: 0;
                    transform: translateY(5px);
                }

                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @media (max-width: 480px) {
                .clinical-trend-artwork-wrap,
                .clinical-trend-icon-wrap {
                    width: 160px;
                    height: 160px;
                }

                .clinical-trend-title {
                    font-size: 19px;
                }

                .clinical-trend-loading {
                    padding-top: 4px;
                }
            }

            @media (prefers-reduced-motion: reduce) {
                .clinical-trend-icon-wrap,
                .clinical-trend-copy {
                    animation: none;
                }

                .clinical-trend-progress-fill,
                .clinical-trend-progress-step {
                    transition: none;
                }
            }
        `}</style>

    </div>

);

}

function delay(milliseconds: number): Promise<void> {

    return new Promise((resolve) => {

        window.setTimeout(resolve, milliseconds);

    });

}