"use client";

import { useEffect, useRef, useState } from "react";

import { executiveSummaryPdf }
    from "@/lib/pdf/executiveSummaryPdf";

import { authService }
    from "@/lib/auth/authService";

import { buildClinicalStory }
    from "@/app/journey-review/clinical-story/storyBuilder";

import { buildExecutiveSummary }
    from "@/app/journey-review/data/executiveSummary";

import {
    prescriptionRepository,
} from "@/lib/prescription/prescriptionRepository";

import {
    buildClinicalTrends,
    ClinicalTrendSummary,
} from "../data/clinicalTrends";

import {
    patientStorage,
} from "@/lib/storage/patientStorage";

import {
    selfDailyCareRepository,
} from "@/lib/repositories/SelfDailyCareRepository";

import {
    dailyCareRepository,
} from "@/lib/repositories/DailyCareRepository";


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



interface ExecutiveSummaryPdfGeneratorProps {
    patientId: string | null;
    patientName: string;
    accessId: string | null;
    selectedRole:
        | "SELF"
        | "FAMILY"
        | "CARETAKER"
        | "DOCTOR"
        | null;
    careMode: "SELF" | "FAMILY";
    startDate: string;
    endDate: string;
    onComplete?: () => void;
    onNoData?: () => void;
}


interface ExecutiveSummaryPatientContextResponse {
    patient: {
        id: string;
        fullName: string;
        dateOfBirth: string | null;
        gender:
            | "Male"
            | "Female"
            | "Other"
            | "Prefer not to say"
            | null;
        status:
            | "ACTIVE"
            | "INACTIVE";
    };

    doctors: Array<{
        providerId: string;
        doctorName: string;
        specialisation: string | null;
        facilityId: string | null;
        hospitalName: string | null;
    }>;
}

type ExecutiveSummaryStage =
    | "preparing"
    | "records"
    | "patient"
    | "clinical"
    | "summary"
    | "pdf";

const executiveSummaryStages: {
    key: ExecutiveSummaryStage;
    title: string;
    description: string;
}[] = [
    {
        key: "preparing",
        title: "Preparing your report",
        description: "Getting your health summary ready.",
    },
    {
        key: "records",
        title: "Gathering health records",
        description: "Reviewing records for your selected period.",
    },
    {
        key: "patient",
        title: "Retrieving patient information",
        description: "Preparing the relevant patient details.",
    },
    {
        key: "clinical",
        title: "Gathering clinical details",
        description: "Bringing together prescriptions and doctor's notes.",
    },
    {
        key: "summary",
        title: "Preparing your Executive Summary",
        description: "Organising your health trends and clinical timeline.",
    },
    {
        key: "pdf",
        title: "Generating your report",
        description: "Putting your Executive Summary together.",
    },
];

function ExecutiveSummaryStageIcon({
    stage,
}: {
    stage: ExecutiveSummaryStage;
}) {
    return (
        <svg
            viewBox="0 0 180 180"
            className="executive-summary-icon"
            aria-hidden="true"
        >
            <defs>
                <linearGradient
                    id="executiveReportGradient"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                >
                    <stop offset="0%" stopColor="#91B8F4" />
                    <stop offset="52%" stopColor="#9276E8" />
                    <stop offset="100%" stopColor="#C16BD9" />
                </linearGradient>

                <radialGradient id="executiveReportGlow">
                    <stop
                        offset="0%"
                        stopColor="#D9CCFF"
                        stopOpacity="0.9"
                    />
                    <stop
                        offset="100%"
                        stopColor="#D9CCFF"
                        stopOpacity="0"
                    />
                </radialGradient>
            </defs>

            <circle
                cx="90"
                cy="90"
                r="76"
                fill="url(#executiveReportGlow)"
            />

            {stage === "preparing" && (
                <g>
                    <rect
                        x="51"
                        y="34"
                        width="78"
                        height="106"
                        rx="12"
                        fill="white"
                        stroke="#B9A7ED"
                        strokeWidth="3"
                    />
                    <path
                        d="M67 57 H111 M67 69 H101"
                        stroke="#A99AE1"
                        strokeWidth="5"
                        strokeLinecap="round"
                    />
                    <path
                        d="M63 103 C74 103 76 84 87 84 S100 118 115 91"
                        fill="none"
                        stroke="url(#executiveReportGradient)"
                        strokeWidth="5"
                        strokeLinecap="round"
                    />
                    <path
                        d="M64 119 H105"
                        stroke="#D6C9F4"
                        strokeWidth="4"
                        strokeLinecap="round"
                    />
                </g>
            )}

            {stage === "records" && (
                <g>
                    <path
                        d="M40 59 Q40 49 50 49 H77 L87 60 H128 Q138 60 138 70 V125 Q138 135 128 135 H50 Q40 135 40 125Z"
                        fill="#D9D0FF"
                    />
                    <rect
                        x="49"
                        y="69"
                        width="82"
                        height="58"
                        rx="8"
                        fill="white"
                        stroke="#A795E7"
                        strokeWidth="3"
                    />
                    <path
                        d="M59 108 L72 94 L84 101 L100 80 L119 91"
                        fill="none"
                        stroke="url(#executiveReportGradient)"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M59 116 H120"
                        stroke="#C7B9EE"
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                </g>
            )}

            {stage === "patient" && (
                <g>
                    <rect
                        x="39"
                        y="39"
                        width="102"
                        height="102"
                        rx="17"
                        fill="white"
                        stroke="#C5B6F0"
                        strokeWidth="3"
                    />
                    <circle
                        cx="76"
                        cy="75"
                        r="17"
                        fill="#C8B9F3"
                    />
                    <path
                        d="M49 115 C50 91 102 91 103 115"
                        fill="#A99AE8"
                    />
                    <circle
                        cx="117"
                        cy="112"
                        r="22"
                        fill="url(#executiveReportGradient)"
                    />
                    <path
                        d="M117 100 V124 M105 112 H129"
                        stroke="white"
                        strokeWidth="5"
                        strokeLinecap="round"
                    />
                </g>
            )}

            {stage === "clinical" && (
                <g>
                    <path
                        d="M49 42 H106 L130 66 V137 H49Z"
                        fill="white"
                        stroke="#B9A7ED"
                        strokeWidth="3"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M106 42 V66 H130"
                        fill="#E6DEFF"
                        stroke="#B9A7ED"
                        strokeWidth="3"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M62 83 H100 M62 95 H91"
                        stroke="#C7B9EE"
                        strokeWidth="4"
                        strokeLinecap="round"
                    />
                    <g transform="rotate(-35 96 113)">
                        <rect
                            x="76"
                            y="103"
                            width="43"
                            height="19"
                            rx="9.5"
                            fill="url(#executiveReportGradient)"
                        />
                        <path
                            d="M97 104 V121"
                            stroke="white"
                            strokeWidth="2"
                        />
                    </g>
                </g>
            )}

            {stage === "summary" && (
                <g>
                    <rect
                        x="37"
                        y="42"
                        width="106"
                        height="96"
                        rx="14"
                        fill="white"
                        stroke="#B9A7ED"
                        strokeWidth="3"
                    />
                    <path
                        d="M52 113 L69 96 L83 104 L103 77 L128 88"
                        fill="none"
                        stroke="url(#executiveReportGradient)"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M53 123 H127"
                        stroke="#D6C9F4"
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                    <circle
                        cx="69"
                        cy="96"
                        r="4"
                        fill="#9276E8"
                    />
                    <circle
                        cx="103"
                        cy="77"
                        r="4"
                        fill="#C16BD9"
                    />
                </g>
            )}

            {stage === "pdf" && (
                <g>
                    <path
                        d="M49 33 H105 L131 59 V139 H49Z"
                        fill="white"
                        stroke="#B9A7ED"
                        strokeWidth="3"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M105 33 V59 H131"
                        fill="#E6DEFF"
                        stroke="#B9A7ED"
                        strokeWidth="3"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M63 80 H112 M63 91 H112 M63 102 H95"
                        stroke="#D1C4F1"
                        strokeWidth="4"
                        strokeLinecap="round"
                    />
                    <circle
                        cx="112"
                        cy="119"
                        r="22"
                        fill="url(#executiveReportGradient)"
                    />
                    <path
                        d="M101 119 L109 127 L124 110"
                        fill="none"
                        stroke="white"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </g>
            )}
        </svg>
    );
}


export default function ExecutiveSummaryPdfGenerator({
    patientId,
    patientName,
    accessId,
    selectedRole,
    careMode,
    startDate,
    endDate,
    onComplete,
    onNoData,
}: ExecutiveSummaryPdfGeneratorProps) {


const [progress, setProgress] =
    useState(0);

const [message, setMessage] =
    useState(
        "Preparing your report"
    );

const [activeStage, setActiveStage] =
    useState<ExecutiveSummaryStage>("preparing");

const [trends, setTrends] =
    useState<ClinicalTrendSummary[]>([]);

const [doctorsNotes, setDoctorsNotes] =
    useState<any[]>([]);

const [generating, setGenerating] =
    useState(true);


const generationStartedRef =
    useRef(false);

// No state required.
// Summary and Clinical Story are generated
// immediately before creating the PDF.


useEffect(() => {

    if (!generating) {
        return;
    }

    if (
        !startDate ||
        !endDate
    ) {
        return;
    }

    if (generationStartedRef.current) {
        return;
    }

    generationStartedRef.current = true;



async function startGeneration() {

    try {

        setProgress(5);
        setActiveStage("preparing");
        setMessage("Preparing your report");

        await delay(180);

        setProgress(10);
        setActiveStage("records");
        setMessage("Gathering health records");

        const user = await authService.getCurrentUser();

        if (!user) {
            throw new Error("Unable to identify current user.");
        }

        // Check health record count before starting report generation.
        let recordsInPeriod = 0;



if (careMode === "SELF") {
    setProgress(15);
    setActiveStage("records");
    setMessage("Gathering your health records");

    const records =
        await selfDailyCareRepository.getByUserId(user.id);

    recordsInPeriod = records.filter(record => {

        const recordedDate = record.recordedAt.slice(0, 10);

        return (
            recordedDate >= startDate &&
            recordedDate <= endDate
        );
    }).length;

} else {
    if (!patientId) {
        throw new Error(
            "A patient must be selected for FAMILY mode."
        );
    }

    setProgress(15);
    setActiveStage("records");
    setMessage("Gathering health records");

    const records =
        await dailyCareRepository.getByPatientId(patientId);


    recordsInPeriod = records.filter(record => {
        const recordedDate = record.recordedAt.slice(0, 10);

        return (
            recordedDate >= startDate &&
            recordedDate <= endDate
        );
    }).length;
}

if (recordsInPeriod === 0) {
    onNoData?.();
    return;
}


let selectedPatient = null;

setProgress(25);
setActiveStage("patient");
setMessage("Retrieving patient information");

if (patientId) {

    const patientResult =
        await patientStorage.getProtectedPatient(
            patientId
        );


    if (
        !patientResult.success ||
        !patientResult.data
    ) {
        throw new Error(
            "Unable to load patient information."
        );
    }

    selectedPatient =
        patientResult.data;

}


setProgress(35);
setActiveStage("clinical");
setMessage("Gathering clinical details");

const prescriptionHistory =
    await prescriptionRepository.getPrescriptionHistory(
        user.id,
        patientId
            ? "FAMILY"
            : "SELF",
        patientId,
        startDate,
        endDate
    );

const latestPrescription =
    prescriptionHistory[0] ?? null;




let retrievedDoctorsNotes: any[] = [];
let retrievedTreatments: any[] = [];


setMessage("Gathering clinical details");

const doctorsNotesResponse = await fetch(
    `/api/reports/executive-summary/doctors-notes?careMode=${encodeURIComponent(
        careMode,
    )}&patientId=${encodeURIComponent(
        patientId ?? "",
    )}&startDate=${encodeURIComponent(
        startDate,
    )}&endDate=${encodeURIComponent(
        endDate,
    )}`,
    {
        method: "GET",
        cache: "no-store",
    },
);

if (!doctorsNotesResponse.ok) {
    const errorBody = await doctorsNotesResponse
        .json()
        .catch(() => null);

    throw new Error(
        errorBody?.error ??
            "Unable to load Doctors Notes and Treatment Information.",
    );
}

const doctorsNotesResult =
    await doctorsNotesResponse.json();

retrievedDoctorsNotes = Array.isArray(
    doctorsNotesResult?.doctorsNotes,
)
    ? doctorsNotesResult.doctorsNotes
    : [];

const treatmentRecords: any[] = Array.isArray(
    doctorsNotesResult?.treatments,
)
    ? doctorsNotesResult.treatments
    : [];

const seenTreatmentEntries = new Set<string>();

retrievedTreatments = treatmentRecords.filter(
    (treatment) => {
        const medication =
            typeof treatment?.medication === "string"
                ? treatment.medication.trim().toLowerCase()
                : "";

        const dosage =
            typeof treatment?.dosage === "string"
                ? treatment.dosage.trim().toLowerCase()
                : "";

        const duration =
            typeof treatment?.duration === "string"
                ? treatment.duration.trim().toLowerCase()
                : "";

        const createdAt =
            typeof treatment?.createdAt === "string"
                ? treatment.createdAt.trim()
                : "";

        // Do not discard incomplete records without enough
        // information to identify a duplicate safely.
        if (!medication) {
            return true;
        }

        const treatmentKey = JSON.stringify([
            medication,
            dosage,
            duration,
        ]);

        if (seenTreatmentEntries.has(treatmentKey)) {
            return false;
        }

        seenTreatmentEntries.add(treatmentKey);
        return true;
    },
);




setDoctorsNotes(retrievedDoctorsNotes);

setProgress(45);
setActiveStage("summary");
setMessage("Preparing your Executive Summary");

const summary =
    await buildExecutiveSummary(
        patientId,
        startDate,
        endDate,
        careMode
    );


if (
    summary.totalDailyCareRecords === 0 &&
    retrievedDoctorsNotes.length === 0 &&
    retrievedTreatments.length === 0 &&
    prescriptionHistory.length === 0
) {
    onNoData?.();
    return;
}

// --------------------------------------------------
// Build one report-period bucket for every selected
            // reporting period.
            //
            // A single selected period continues to behave as
            // before. When multiple periods are selected, each
            // period gets its own independent bucket.
            // --------------------------------------------------

const reportStart =
    new Date(
        `${startDate}T00:00:00`
    );

const reportEnd =
    new Date(
        `${endDate}T23:59:59`
    );

const filteredTimeline =
    (
        summary.clinicalTimeline ??
        []
    ).filter(
        event => {
            if (!patientId) {
                const eventDate =
                    event.date.slice(0, 10);

                return (
                    eventDate >= startDate &&
                    eventDate <= endDate
                );
            }

            const eventDate =
                new Date(event.date);

            return (
                eventDate >= reportStart &&
                eventDate <= reportEnd
            );
        }
    );

const bucket = {
    weekLabel:
        `${formatReportDate(
            startDate
        )} - ${formatReportDate(
            endDate
        )}`,

    recordCount: 0,

    symptoms:
        [] as string[],

    vitals: {
        temperature:
            [] as number[],

        pulse:
            [] as number[],

        spo2:
            [] as number[],

        bloodPressure:
            [] as {
                date: string;
                systolic: number;
                diastolic: number;
            }[],
    },

    weight:
        [] as number[],

    assessments:
        [] as string[],
};

filteredTimeline.forEach(
    event => {

        bucket.recordCount++;

        /*
         * Combine standard symptoms and Other Symptom
         * into the same Symptoms collection.
         *
         * Each symptom is added only once within the
         * current reporting period.
         *
         * Comparison is case-insensitive and ignores
         * surrounding whitespace, while preserving the
         * original display text of the first occurrence.
         */

        const symptomsToAdd = [
            ...event.symptoms,
            ...(event.otherSymptom
                ? [event.otherSymptom]
                : [])
        ];

        for (
            const symptom of symptomsToAdd
        ) {

            const normalizedSymptom =
                symptom
                    .trim()
                    .toLowerCase();

            if (
                !normalizedSymptom
            ) {
                continue;
            }

            const alreadyExists =
                bucket.symptoms.some(
                    existingSymptom =>
                        existingSymptom
                            .trim()
                            .toLowerCase() ===
                        normalizedSymptom
                );

            if (
                !alreadyExists
            ) {

                bucket.symptoms.push(
                    symptom
                );

            }
        }

        if (
            event.vitals.temperature
        ) {

            bucket.vitals.temperature.push(
                event.vitals.temperature
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
            event.vitals.systolic !== null &&
            event.vitals.systolic !== undefined &&
            event.vitals.diastolic !== null &&
            event.vitals.diastolic !== undefined
        ) {

            bucket.vitals.bloodPressure.push({

                date:
                    event.date,

                systolic:
                    Number(
                        event.vitals.systolic
                    ),

                diastolic:
                    Number(
                        event.vitals.diastolic
                    ),

            });

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

const groupedTimeline = [
    {
        ...bucket,
        recordCount:
            bucket.recordCount > 0
                ? bucket.recordCount
                : retrievedDoctorsNotes.length > 0
                    ? 1
                    : 0,
    },
];

const story =
    buildClinicalStory(
        groupedTimeline,
        retrievedDoctorsNotes
    );


setProgress(65);
setActiveStage("patient");
setMessage("Retrieving patient information");

let reportPatient;


if (patientId) {

const contextResponse =
    await fetch(
        `/api/reports/executive-summary/patient-context?patientId=${encodeURIComponent(
            patientId,
        )}&accessId=${encodeURIComponent(
            accessId ?? "",
        )}&selectedRole=${encodeURIComponent(
            selectedRole ?? "",
        )}`,
        {
            method: "GET",
            cache: "no-store",
        },
    );

    if (!contextResponse.ok) {

        const errorBody =
            await contextResponse
                .json()
                .catch(() => null);

        throw new Error(
            errorBody?.error ??
                "Unable to load patient context.",
        );
    }

    const patientContext =
        (await contextResponse.json()) as
            ExecutiveSummaryPatientContextResponse;

    const reportDoctor =
        patientContext.doctors[0] ??
        null;

    reportPatient = {
        id:
            patientContext.patient.id,

        name:
            patientContext.patient.fullName,

        age:
            calculateAge(
                patientContext.patient
                    .dateOfBirth,
            ),

        gender:
            patientContext.patient.gender ??
            "Unknown",

        doctor:
            reportDoctor?.doctorName ??
            undefined,

        hospital:
            reportDoctor?.hospitalName ??
            undefined,

        status:
            patientContext.patient.status,
    };

} else {

    reportPatient = {
        id: user.id,

        name:
            patientName,

        age: null,

        gender:
            "Self",

        doctor:
            undefined,

        hospital:
            undefined,

        status:
            "Self",
    };

}



setProgress(80);
setActiveStage("pdf");
setMessage("Generating your report");

const bytes =
    await executiveSummaryPdf.generate({

        patient:
            reportPatient,


        reportPeriod:
            `${formatReportDate(
                startDate
            )} - ${formatReportDate(
                endDate
            )}`,

        summary,

        clinicalStory:
            story,

        treatments:
            retrievedTreatments,
    });


            const pdfBytes =
                new Uint8Array(bytes);

            const blob =
                new Blob(
                    [pdfBytes],
                    {
                        type:
                            "application/pdf",
                    }
                );

/*
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

                URL.revokeObjectURL(
                    url
                );

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

const timestamp =
    `${now.getFullYear()}-` +
    `${String(now.getMonth() + 1).padStart(2, "0")}-` +
    `${String(now.getDate()).padStart(2, "0")}_` +
    `${String(now.getHours()).padStart(2, "0")}-` +
    `${String(now.getMinutes()).padStart(2, "0")}-` +
    `${String(now.getSeconds()).padStart(2, "0")}`;

const fileName =
    `CareVR_ExecutiveSummary_${safePatientName}_${timestamp}.pdf`;

const link =
    document.createElement("a");

link.href = url;
link.download = fileName;

document.body.appendChild(link);
link.click();
document.body.removeChild(link);

setProgress(100);

setMessage(
    "Opening report..."
);

setTimeout(() => {

    URL.revokeObjectURL(
        url
    );

    onComplete?.();

}, 300);


        }
catch (error) {

    console.error(
        "Unable to generate Executive Summary.",
        error
    );

if (
    error instanceof Error &&
    error.message ===
        "No data available for the selected period."
) {

    setMessage(
        "No data available for the selected period."
    );

    setGenerating(false);

    onComplete?.();

    return;

}

setMessage(
    "Unable to generate report."
);

setGenerating(false);

}

    }

    void startGeneration();

}, [
    generating,
    startDate,
    endDate,
    patientId,
    patientName,
    accessId,
    selectedRole,
    onComplete,
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
                margin: "0 0 18px",
            }}
        >
            Executive Summary
        </h2>

        <p
            style={{
                margin: "0 0 10px",
                color: "#59657f",
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

    <section className="executive-summary-loading">

        <div className="executive-summary-orb">
            <div
                className="executive-summary-icon-wrap"
                key={activeStage}
            >
                <ExecutiveSummaryStageIcon
                    stage={activeStage}
                />
            </div>
        </div>

        <div className="executive-summary-tag">
            CAREVR HEALTH REPORT
        </div>

        <div
            className="executive-summary-copy"
            key={`copy-${activeStage}`}
        >
            <h2 className="executive-summary-title">
                {executiveSummaryStages.find(
                    (stage) => stage.key === activeStage
                )?.title ?? "Preparing your report"}
            </h2>

            <p className="executive-summary-description">
                {executiveSummaryStages.find(
                    (stage) => stage.key === activeStage
                )?.description ?? message}
            </p>
        </div>

        <p className="executive-summary-period">
            {startDate && endDate
                ? `${formatReportDate(
                    startDate
                )} - ${formatReportDate(
                    endDate
                )}`
                : ""}
        </p>

        <div
            className="executive-summary-progress"
            role="progressbar"
            aria-label="Executive Summary generation progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
        >
            <div
                className="executive-summary-progress-fill"
                style={{
                    width: `${progress}%`,
                }}
            />
        </div>

        <div className="executive-summary-progress-steps">
            {executiveSummaryStages.map((stage, index) => {
                const activeIndex =
                    executiveSummaryStages.findIndex(
                        (item) => item.key === activeStage
                    );

                return (
                    <div
                        key={stage.key}
                        className={
                            index <= activeIndex
                                ? "executive-summary-progress-step is-active"
                                : "executive-summary-progress-step"
                        }
                    />
                );
            })}
        </div>

        <div className="executive-summary-percentage">
            {progress}%
        </div>

        <style jsx>{`
            .executive-summary-loading {
                width: 100%;
                min-height: 440px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 28px 18px;
                box-sizing: border-box;
                text-align: center;
                overflow: hidden;
            }

            .executive-summary-orb {
                position: relative;
                width: 190px;
                height: 190px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 18px;
            }

            .executive-summary-orb::before {
                content: "";
                position: absolute;
                inset: 8px;
                border-radius: 50%;
                background: radial-gradient(
                    circle at 35% 30%,
                    rgba(255, 255, 255, 0.9),
                    rgba(215, 205, 255, 0.48) 40%,
                    rgba(176, 143, 240, 0.2) 70%,
                    transparent 74%
                );
                animation: executiveReportOrbPulse 2.8s ease-in-out infinite;
            }

            .executive-summary-icon-wrap {
                position: relative;
                z-index: 1;
                width: 180px;
                height: 180px;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: executiveReportIconIn 520ms ease-out;
            }

            .executive-summary-icon {
                display: block;
                width: 180px;
                height: 180px;
            }

            .executive-summary-tag {
                margin-bottom: 10px;
                color: rgba(103, 91, 180, 0.78);
                font-size: 11px;
                font-weight: 700;
                letter-spacing: 0.18em;
            }

            .executive-summary-copy {
                max-width: 440px;
                animation: executiveReportCopyIn 420ms ease-out;
            }

            .executive-summary-title {
                margin: 0;
                color: #40366e;
                font-size: clamp(22px, 4vw, 28px);
                line-height: 1.25;
                font-weight: 700;
                letter-spacing: -0.02em;
            }

            .executive-summary-description {
                margin: 10px 0 0;
                color: rgba(67, 59, 98, 0.75);
                font-size: 14px;
                line-height: 1.55;
            }

            .executive-summary-period {
                margin: 14px 0 0;
                color: #59657f;
                font-size: 12px;
            }

            .executive-summary-progress {
                width: min(100%, 320px);
                height: 8px;
                margin-top: 24px;
                border-radius: 999px;
                background: rgba(123, 106, 210, 0.16);
                overflow: hidden;
            }

            .executive-summary-progress-fill {
                height: 100%;
                border-radius: inherit;
                background: linear-gradient(
                    90deg,
                    #7b6bea,
                    #c257d7
                );
                transition: width 400ms ease;
            }

            .executive-summary-progress-steps {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 7px;
                margin-top: 18px;
            }

            .executive-summary-progress-step {
                width: 7px;
                height: 7px;
                border-radius: 999px;
                background: rgba(123, 106, 210, 0.2);
                transition:
                    width 300ms ease,
                    background 300ms ease;
            }

            .executive-summary-progress-step.is-active {
                width: 18px;
                background: linear-gradient(
                    90deg,
                    #7b6bea,
                    #c257d7
                );
            }

            .executive-summary-percentage {
                margin-top: 10px;
                color: #40366e;
                font-size: 13px;
                font-weight: 700;
                font-variant-numeric: tabular-nums;
            }

            @keyframes executiveReportOrbPulse {
                0%, 100% {
                    transform: scale(0.96);
                    opacity: 0.72;
                }

                50% {
                    transform: scale(1.04);
                    opacity: 1;
                }
            }

            @keyframes executiveReportIconIn {
                from {
                    opacity: 0;
                    transform: scale(0.86) translateY(8px);
                }

                to {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }

            @keyframes executiveReportCopyIn {
                from {
                    opacity: 0;
                    transform: translateY(7px);
                }

                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @media (prefers-reduced-motion: reduce) {
                .executive-summary-orb::before,
                .executive-summary-icon-wrap,
                .executive-summary-copy {
                    animation: none;
                }

                .executive-summary-progress-fill,
                .executive-summary-progress-step {
                    transition: none;
                }
            }

            @media (max-width: 480px) {
                .executive-summary-loading {
                    min-height: 400px;
                    padding: 24px 12px;
                }

                .executive-summary-orb {
                    width: 170px;
                    height: 170px;
                }

                .executive-summary-icon-wrap,
                .executive-summary-icon {
                    width: 160px;
                    height: 160px;
                }

                .executive-summary-title {
                    font-size: 22px;
                }
            }
        `}</style>

    </section>

)}


    </div>
);

}

function delay(milliseconds: number) {

    return new Promise<void>((resolve) => {

        window.setTimeout(resolve, milliseconds);

    });

}