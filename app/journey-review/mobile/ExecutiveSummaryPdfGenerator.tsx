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
    buildPatient,
} from "@/app/journey-review/data/patient";


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
    startDate: string;
    endDate: string;
    onComplete?: () => void;
    onNoData?: () => void;
}

export default function ExecutiveSummaryPdfGenerator({
    patientId,
    patientName,
    startDate,
    endDate,
    onComplete,
    onNoData,
}: ExecutiveSummaryPdfGeneratorProps) {

const [progress, setProgress] =
    useState(0);

const [message, setMessage] =
    useState(
        "Select a reporting period"
    );


const [trends, setTrends] =
    useState<ClinicalTrendSummary[]>([]);



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

const user =
    await authService.getCurrentUser();

if (!user) {
    throw new Error(
        "Unable to identify current user."
    );
}

if (!patientId) {
    throw new Error(
        "Patient is required to generate the report."
    );
}

const patientResult =
    await patientStorage.getPatients();

if (
    !patientResult.success ||
    !patientResult.data
) {
    throw new Error(
        "Unable to load patient information."
    );
}

const selectedPatient =
    patientResult.data.find(
        patient =>
            patient.id === patientId
    );

if (!selectedPatient) {
    throw new Error(
        "Selected patient could not be found."
    );
}

const prescriptionHistory =
    await prescriptionRepository.getPrescriptionHistory(
        user.id,
        "FAMILY",
        patientId,
        startDate,
        endDate
    );

const latestPrescription =
    prescriptionHistory[0] ?? null;


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
    await buildExecutiveSummary(
        patientId,
        startDate,
        endDate
    );

if (
    summary.totalDailyCareRecords === 0
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

            const eventDate =
                new Date(
                    event.date
                );

            return (
                eventDate >=
                    reportStart &&
                eventDate <=
                    reportEnd
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
    bucket
];

const story =
    buildClinicalStory(
        groupedTimeline
    );

            setProgress(70);

            setMessage(
                "Generating PDF..."
            );

const careVrPatient =
    buildPatient();

const bytes =
    await executiveSummaryPdf.generate({
        patient: {
            id: patientId,

            name:
                patientName,

            age:
                calculateAge(
                    selectedPatient.dateOfBirth
                ),

            gender:
                selectedPatient.gender ??
                "Unknown",

            doctor:
                careVrPatient.doctor,

            hospital:
                careVrPatient.hospital,

            status:
                selectedPatient.status,
        },

        reportPeriod:
            `${formatReportDate(
                startDate
            )} - ${formatReportDate(
                endDate
            )}`,

        summary,

        clinicalStory: story,
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
                margin:
                    "0 0 18px",
            }}
        >
            Executive Summary
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
                    Executive Summary
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
                                "width .35s ease",
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

function delay(milliseconds: number) {

    return new Promise<void>((resolve) => {

        window.setTimeout(resolve, milliseconds);

    });

}