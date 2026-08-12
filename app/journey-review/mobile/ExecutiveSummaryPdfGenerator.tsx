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
    patientStorage,
} from "@/lib/storage/patientStorage";


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

function calculateAge(
    dateOfBirth: string | null | undefined
): number | null {
    if (!dateOfBirth) {
        return null;
    }

    const birthDate =
        new Date(dateOfBirth);

    if (Number.isNaN(birthDate.getTime())) {
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

function buildReportPeriods(): ReportPeriod[] {

    const periods: ReportPeriod[] = [];

    const today =
        new Date()
            .toISOString()
            .split("T")[0];

    // --------------------------------------------------
    // Period 1 — fixed initial CareVR timeline period
    // --------------------------------------------------

    periods.push({
        start: INITIAL_REPORT_START,
        end:
            INITIAL_REPORT_END <= today
                ? INITIAL_REPORT_END
                : today,
        label:
            `${formatReportDate(INITIAL_REPORT_START)} - ` +
            `${formatReportDate(
                INITIAL_REPORT_END <= today
                    ? INITIAL_REPORT_END
                    : today
            )}`,
        isCurrent:
            INITIAL_REPORT_END > today,
    });

    // --------------------------------------------------
    // Subsequent periods
    // --------------------------------------------------

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
            new Date(periodStart);

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

periodStart = new Date(periodEnd);

periodStart.setDate(
    periodStart.getDate() + 1
);

periodStart.setHours(
    0,
    0,
    0,
    0
);
    }

    return periods;
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
        "Select a reporting period"
    );

const [selectedPeriod, setSelectedPeriod] =
    useState<ReportPeriod | null>(null);

const [generating, setGenerating] =
    useState(false);

const generationStartedRef =
    useRef(false);

const reportPeriods =
    buildReportPeriods();
// No state required.
// Summary and Clinical Story are generated
// immediately before creating the PDF.

useEffect(() => {

    if (!generating) {
        return;
    }

    if (!selectedPeriod) {
        return;
    }

    if (generationStartedRef.current) {
        return;
    }

    const activePeriod = selectedPeriod;

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
        activePeriod.start,
        activePeriod.end
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
                await buildExecutiveSummary();

            // --------------------------------------------------
            // Filter timeline to selected reporting period
            // --------------------------------------------------

const reportStart =
    new Date(
        `${activePeriod.start}T00:00:00`
    );

const reportEnd =
    new Date(
        `${activePeriod.end}T23:59:59`
    );

            const filteredTimeline =
                (
                    summary.clinicalTimeline ??
                    []
                ).filter(event => {

                    const eventDate =
                        new Date(event.date);

                    return (
                        eventDate >=
                            reportStart &&
                        eventDate <=
                            reportEnd
                    );
                });

            // --------------------------------------------------
            // Build a single report-period bucket
            // --------------------------------------------------

            const groupedTimeline = [
                {
                    weekLabel:
                        activePeriod.label,

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

                        systolic:
                            [] as number[],

                        diastolic:
                            [] as number[],
                    },

                    weight:
                        [] as number[],

                    assessments:
                        [] as string[],
                },
            ];

            filteredTimeline.forEach(
                event => {

                    const bucket =
                        groupedTimeline[0];

                    bucket.recordCount++;

                    bucket.symptoms.push(
                        ...event.symptoms
                    );

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
        latestPrescription?.doctorName ??
        undefined,

    hospital:
        latestPrescription?.hospitalOrClinic ??
        undefined,

    status:
        selectedPatient.status,
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

            setMessage(
                "Unable to generate report."
            );

            setGenerating(false);

        }

    }

    void startGeneration();

}, [
    generating,
    selectedPeriod,
    patientId,
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
                selectedPeriod?.start ===
                period.start;

            return (
                <button
                    key={period.start}
                    type="button"
                    onClick={() => {
                        setSelectedPeriod(
                            period
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
                        textAlign: "left",
                        cursor: "pointer",
                        boxSizing:
                            "border-box",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
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

                <button
                    type="button"
                    disabled={
                        !selectedPeriod
                    }
                    onClick={() => {

                        if (
                            !selectedPeriod
                        ) {
                            return;
                        }

                        setProgress(0);

                        setMessage(
                            "Preparing Executive Summary..."
                        );

                        setGenerating(
                            true
                        );

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
                            selectedPeriod
                                ? "#5630e8"
                                : "#d1d5db",
                        color:
                            "#ffffff",
                        fontSize: 15,
                        fontWeight: 700,
                        cursor:
                            selectedPeriod
                                ? "pointer"
                                : "not-allowed",
                    }}
                >
                    Generate Report
                </button>

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
                    {selectedPeriod?.label}
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