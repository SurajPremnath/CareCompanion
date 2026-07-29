"use client";

import { ReportData } from "./types";

interface Props {
    report: ReportData;
}

function Row({
    label,
    value,
}: {
    label: string;
    value: any;
}) {
    return (
        <div className="flex items-start justify-between gap-6 border-b border-slate-100 py-4 last:border-0">

            <div className="text-slate-500">
                {label}
            </div>

            <div className="text-right font-semibold text-slate-900">
                {value ?? "--"}
            </div>

        </div>
    );
}

export function DetailedReport({
    report,
}: Props) {

    const {
        patient,
        executiveSummary,
        timeline,
    } = report;

    return (

        <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-100 px-8 py-7">

                <h2 className="jr-title-lg">
                    Detailed Clinical Report
                </h2>

                <p className="jr-body mt-2 text-slate-500">
                    Consolidated patient information generated from the CareVR journey.
                </p>

            </div>

            <div className="space-y-8 p-8">

                <div className="rounded-2xl border border-slate-200 p-6">

                    <h3 className="jr-title-md mb-5">
                        Patient Information
                    </h3>

                    <Row label="Patient Name" value={patient.name} />
                    <Row label="Age" value={patient.age} />
                    <Row label="Gender" value={patient.gender} />
                    <Row label="Hospital" value={patient.hospital} />
                    <Row label="Doctor" value={patient.doctor} />
                    <Row label="Current Status" value={patient.status} />

                </div>

                <div className="rounded-2xl border border-slate-200 p-6">

                    <h3 className="jr-title-md mb-5">
                        Monitoring Summary
                    </h3>

                    <Row
                        label="Monitoring Started"
                        value={executiveSummary.monitoringStart}
                    />

                    <Row
                        label="Monitoring Until"
                        value={executiveSummary.monitoringEnd}
                    />

                    <Row
                        label="Daily Care Records"
                        value={executiveSummary.totalDailyCareRecords}
                    />

                    <Row
                        label="Self Daily Care Records"
                        value={executiveSummary.totalSelfDailyCareRecords}
                    />

                    <Row
                        label="Assessments"
                        value={executiveSummary.totalAssessments}
                    />

                </div>

                <div className="rounded-2xl border border-slate-200 p-6">

                    <h3 className="jr-title-md mb-5">
                        Journey Summary
                    </h3>

                    <Row
                        label="Timeline Events"
                        value={timeline.length}
                    />

                </div>

            </div>

        </section>

    );

}