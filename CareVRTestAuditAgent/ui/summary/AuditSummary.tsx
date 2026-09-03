// TEMPORARY UI PROTOTYPE — CareVR AI Test Audit Summary
// This file intentionally renders the agreed visual layout first.
// The existing AuditSummary implementation should remain commented/preserved
// in the repository until the visual shell is approved.
// No audit/runtime/Strataparse logic belongs in this prototype.

"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

export type AuditSummaryModel = {
    runId: string;
    date: string;
    startTime: string;
    endTime: string;
    duration: string;
    status: "COMPLETED" | "ACTIVE" | "INTERRUPTED" | "FAILED";

    kpis: {
        modules: number;
        documents: number;
        requests: number;
        totalTime: string;
        inputTokens: number;
        outputTokens: number;
        totalTokens: number;
    };

    moduleSummary: Array<{
        module: string;
        documents: number;
        models: string;
        requests: number;
        totalTime: string;
        inputTokens: number;
        outputTokens: number;
        totalTokens: number;
        accuracy: string;
    }>;

    modelSummary: Array<{
        model: string;
        documents: number;
        requests: number;
        inputTokens: number;
        outputTokens: number;
        totalTokens: number;
        accuracy: string;
    }>;

    documentSummary: Array<{
        documentType: string;
        models: string;
        documents: number;
        requests: number;
        totalTime: string;
        totalTokens: number;
        accuracy: string;
    }>;

    accuracySummary: {
        overall: string;
        accurate: number;
        partiallyAccurate: number;
        inaccurate: number;
        notEvaluated: number;
    };

    runStatus: {
        documentsReceived: number;
        documentsCompleted: number;
        documentsFailed: number;
        requestsSent: number;
        requestsCompleted: number;
        requestsFailed: number;
        activeRequestsAtCompletion: number;
        terminalRequests: number;
    };

    financial: {
        originalBalance: number;
        usageCost: number;
        currentRunningBalance: number;
        currency: string;
    };

    verified: boolean;
};

interface AuditSummaryProps {
    summary: AuditSummaryModel;
}

function formatNumber(value: number): string {
    return value.toLocaleString("en-IN");
}

function StatusIcon({ type = "check" }: { type?: "check" | "alert" }) {
    return (
        <span className={`status-icon status-icon-${type}`} aria-hidden="true">
            {type === "check" ? "✓" : "!"}
        </span>
    );
}

function SectionIcon({
    children,
    tone,
}: {
    children: ReactNode;
    tone: "blue" | "green" | "purple" | "orange";
}) {
    return (
        <span className={`section-icon section-icon-${tone}`}>{children}</span>
    );
}

function SectionCard({
    number,
    title,
    tone,
    children,
}: {
    number: string;
    title: string;
    tone: "blue" | "green" | "purple" | "orange";
    children: ReactNode;
}) {
    return (
        <section className={`section-card section-card-${tone}`}>
            <div className="section-card-header">
                <SectionIcon tone={tone}>{number}</SectionIcon>
                <h2>{title}</h2>
            </div>
            <div className="section-card-body">{children}</div>
        </section>
    );
}

function Metric({
    label,
    value,
    icon,
}: {
    label: string;
    value: string;
    icon: string;
}) {
    return (
        <div className="metric">
            <span className="metric-icon" aria-hidden="true">
                {icon}
            </span>
            <div className="metric-copy">
                <div className="metric-label">{label}</div>
                <div className="metric-value">{value}</div>
            </div>
        </div>
    );
}

function ActionButton({
    label,
    icon,
    onClick,
    primary = false,
}: {
    label: string;
    icon: string;
    onClick?: () => void;
    primary?: boolean;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`action-button ${primary ? "action-button-primary" : ""}`}
        >
            <span aria-hidden="true">{icon}</span>
            <span>{label}</span>
        </button>
    );
}

function RunField({ label, value }: { label: string; value: string }) {
    return (
        <div className="run-field">
            <div className="run-field-label">{label}</div>
            <div className="run-field-value">{value}</div>
        </div>
    );
}

export default function AuditSummary({
    summary,
}: AuditSummaryProps) {
    const router = useRouter();

    /*
     * Use the actual audit summary supplied by the Audit Report.
     *
     * This keeps the UI connected to the persisted audit evidence
     * rather than an undefined prototype object.
     */
    const view = summary;


    // Initials already exist elsewhere in the application; this temporary
    // prototype keeps the circular account treatment without changing auth.
    const initials = "U";

    const auditPassed =
        view.status === "COMPLETED" &&
        view.runStatus.documentsFailed === 0 &&
        view.runStatus.requestsFailed === 0;

    return (
        <main className="audit-page">
            <div className="audit-shell">
                {/* -------------------------------------------------- */}
                {/* CAREVR HEADER                                      */}
                {/* -------------------------------------------------- */}
                <header className="audit-header">
                    <div className="brand">
                        <img
                            src="/images/CareVR v1.0.png"
                            alt="CareVR"
                            className="brand-logo"
                        />
                    </div>

                    <div className="audit-title">
                        <h1>CAREVR AI TEST – SUMMARY</h1>
                        <div className="audit-subtitle">
                            <span>As of {view.date}</span>
                            <span className="separator">|</span>
                            <span>Run ID: {view.runId}</span>
                        </div>
                    </div>

                    <div className="header-actions">
                        <ActionButton
                            label="Home"
                            icon="⌂"
                            onClick={() => router.push("/dashboard")}
                        />

                        <button
                            type="button"
                            aria-label="Account"
                            title="Account"
                            className="account-button"
                        >
                            {initials}
                        </button>

                        <ActionButton
                            label="Export PDF"
                            icon="⇩"
                            onClick={() => window.print()}
                            primary
                        />
                    </div>
                </header>

                {/* -------------------------------------------------- */}
                {/* RUN DETAILS — FIRST CONTENT BLOCK                  */}
                {/* -------------------------------------------------- */}
                <section className="run-details-card">
                    <div className="run-details-topline">
                        <div className="run-details-title">
                            <span className="run-details-marker" aria-hidden="true" />
                            <div>
                                <div className="eyebrow">AUDIT RUN DETAILS</div>
                                <div className="run-id">{view.runId}</div>
                            </div>
                        </div>
                        <div>
                            <div className="eyebrow">RUN DETAILS</div>
                            <div className="run-id">{view.runId}</div>
                        </div>

                        <div
                            className={`run-status ${
                                auditPassed
                                    ? "run-status-passed"
                                    : "run-status-failed"
                            }`}
                        >
                            <StatusIcon
                                type={auditPassed ? "check" : "alert"}
                            />
                            <span>
                                {auditPassed ? "AUDIT PASSED" : "AUDIT FAILED"}
                            </span>
                        </div>
                    </div>

                    <div className="run-fields">
                        <RunField label="DATE" value={view.date} />
                        <RunField label="START" value={view.startTime} />
                        <RunField label="END" value={view.endTime} />
                        <RunField label="DURATION" value={view.duration} />
                    </div>
                </section>

                {/* -------------------------------------------------- */}
                {/* SUMMARY GRID                                       */}
                {/* -------------------------------------------------- */}
                <div className="summary-grid">
                    <SectionCard number="1" title="TEST COVERAGE" tone="blue">
                        <div className="metric-grid metric-grid-two">
                            <Metric label="Test Runs" value="4" icon="▣" />
                            <Metric
                                label="Documents Tested"
                                value="6"
                                icon="▤"
                            />
                            <Metric label="Single Page" value="4" icon="▤" />
                            <Metric label="Multi Page" value="2" icon="▤" />
                        </div>

                        <div className="info-callout blue-callout">
                            <div className="callout-label">Multi-page Test</div>
                            <div className="callout-value">
                                PET/CT (3 pages) + IHC (1 page)
                            </div>
                        </div>
                    </SectionCard>

                    <SectionCard number="2" title="COST / USAGE" tone="green">
                        <div className="metric-grid metric-grid-three">
                            <Metric
                                label="Initial Balance"
                                value="$9.30"
                                icon="$"
                            />
<Metric
    label="Current Balance"
    value={`$${view.financial.currentRunningBalance.toFixed(2)}`}
    icon="$"
/>
                            <Metric label="Spent" value="$0.17" icon="↓" />
                        </div>

                        <div className="metric-divider" />

                        <div className="metric-grid metric-grid-two">
                            <Metric
                                label="Avg Cost / Document"
                                value="~$0.03"
                                icon="≈"
                            />
                            <Metric
                                label="Latest Run Cost"
                                value="~$0.01"
                                icon="—"
                            />
                        </div>
                    </SectionCard>

                    <SectionCard number="3" title="AI PERFORMANCE" tone="purple">
                        <div className="assessment-list">
                            {[
                                ["Model Selection", "Correct"],
                                ["Difficulty-based Model Change", "Yes"],
                                ["Document Classification", "Correct"],
                            ].map(([label, value]) => (
                                <div className="assessment-row" key={label}>
                                    <div className="assessment-label">
                                        <StatusIcon />
                                        <span>{label}</span>
                                    </div>
                                    <div className="assessment-value">{value}</div>
                                </div>
                            ))}
                        </div>

                        <div className="assessment-summary">
                            <span className="assessment-summary-label">
                                Overall Assessment
                            </span>
                            <span className="assessment-pill purple-pill">
                                Mostly Accurate
                            </span>
                        </div>
                    </SectionCard>

                    <SectionCard
                        number="4"
                        title="EXECUTION / ACCURACY"
                        tone="orange"
                    >
                        <div className="assessment-list">
                            <div className="assessment-row">
                                <div className="assessment-label">
                                    <span className="row-symbol">▤</span>
                                    <span>Extraction Approach</span>
                                </div>
                                <div className="assessment-value">
                                    Page-by-page
                                </div>
                            </div>

                            <div className="assessment-row">
                                <div className="assessment-label">
                                    <StatusIcon />
                                    <span>Accuracy</span>
                                </div>
                                <div className="assessment-value">
                                    {view.accuracySummary.overall}
                                </div>
                            </div>

                            <div className="assessment-row">
                                <div className="assessment-label">
                                    <span className="row-symbol warning-symbol">
                                        !
                                    </span>
                                    <span>Miss Identified</span>
                                </div>
                                <div className="assessment-value warning-value">
                                    Consultation date
                                </div>
                            </div>
                        </div>

                        <div className="assessment-summary">
                            <span className="assessment-summary-label">
                                Status
                            </span>
                            <span className="assessment-pill success-pill">
                                ✓ Acceptable
                            </span>
                        </div>
                    </SectionCard>
                </div>

                {/* -------------------------------------------------- */}
                {/* KEY TAKEAWAY                                       */}
                {/* -------------------------------------------------- */}
                <section className="key-takeaway">
                    <div className="key-heading">
                        <span className="key-icon">★</span>
                        <span>
                            KEY
                            <br />
                            TAKEAWAY
                        </span>
                    </div>

                    <div className="key-content">
                        <div>
                            <strong>6 documents</strong> tested across
                            single- and multi-page documents.
                        </div>
                        <div>
                            Correct model routing and page-by-page processing
                            confirmed.
                        </div>
                        <div>
                            Results are mostly accurate (
                            <strong>{view.accuracySummary.overall}</strong>),
                            with one notable miss:{" "}
                            <span className="warning-text">
                                consultation date
                            </span>
                            .
                        </div>
                        <div>Cost is trending down.</div>
                    </div>

                    <div className="working-note">
                        * Accuracy is a current working assessment, not yet a
                        formally calculated score.
                    </div>
                </section>

                <div className="prototype-footer-note">
                    Visual prototype • real audit evidence boundary not yet connected
                </div>
            </div>

            <style jsx>{`
                .audit-page {
                    min-height: 100vh;
                    background: #f6f8fb;
                    color: #111827;
                    padding: 16px 28px 36px;
                    font-family:
                        Inter, ui-sans-serif, system-ui, -apple-system,
                        BlinkMacSystemFont, "Segoe UI", sans-serif;
                }

                .audit-shell {
                    width: 100%;
                    max-width: 1500px;
                    margin: 0 auto;
                }

                .audit-header {
                    display: grid;
                    grid-template-columns: 170px minmax(0, 1fr) auto;
                    align-items: center;
                    gap: 22px;
                    min-height: 104px;
                    padding: 0 0 14px;
                    border-bottom: 1px solid #e4e9f0;
                }

                .brand {
                    display: flex;
                    align-items: center;
                }

                .brand-logo {
                    display: block;
                    width: 138px;
                    height: auto;
                    object-fit: contain;
                }

                .audit-title {
                    min-width: 0;
                    text-align: center;
                }

                .audit-title h1 {
                    margin: 0;
                    color: #102454;
                    font-size: clamp(24px, 2vw, 30px);
                    line-height: 1.15;
                    font-weight: 850;
                    letter-spacing: 0.25px;
                }

                .audit-subtitle {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    margin-top: 6px;
                    color: #64748b;
                    font-size: 13px;
                    font-weight: 600;
                }

                .separator {
                    color: #94a3b8;
                }

                .header-actions {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    gap: 9px;
                }

                .action-button {
                    min-height: 40px;
                    padding: 0 13px;
                    border: 1px solid #dbe3ef;
                    border-radius: 10px;
                    background: #ffffff;
                    color: #334155;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 7px;
                    font: inherit;
                    font-size: 12px;
                    font-weight: 800;
                    cursor: pointer;
                    transition:
                        transform 0.15s ease,
                        box-shadow 0.15s ease,
                        background 0.15s ease;
                }

                .action-button:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 3px 10px rgba(15, 23, 42, 0.08);
                }

                .action-button-primary {
                    border-color: #2563eb;
                    background: #2563eb;
                    color: #ffffff;
                }

                .account-button {
                    width: 38px;
                    height: 38px;
                    flex: 0 0 38px;
                    border: 2px solid #ffffff;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #2563eb, #4f46e5);
                    color: #ffffff;
                    font: inherit;
                    font-size: 12px;
                    font-weight: 850;
                    cursor: pointer;
                    box-shadow: 0 2px 7px rgba(40, 31, 90, 0.15);
                }

                .run-details-card {
                    margin-top: 14px;
                    padding: 16px 20px;
                    border: 1px solid #dfe5ed;
                    border-radius: 17px;
                    background: #ffffff;
                    box-shadow: 0 2px 9px rgba(30, 41, 59, 0.025);
                }

                .run-details-topline {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 18px;
                }

                .run-details-title {
                    display: flex;
                    align-items: center;
                    gap: 11px;
                    min-width: 0;
                }

                .run-details-marker {
                    width: 7px;
                    height: 38px;
                    border-radius: 999px;
                    background: linear-gradient(180deg, #2563eb, #7c3aed);
                    flex: 0 0 7px;
                }

                .eyebrow {
                    color: #64748b;
                    font-size: 11px;
                    line-height: 1.2;
                    letter-spacing: 0.9px;
                    font-weight: 850;
                }

                .run-id {
                    margin-top: 5px;
                    color: #102454;
                    font-size: 16px;
                    line-height: 1.2;
                    font-weight: 850;
                }

                .run-status {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    min-height: 38px;
                    padding: 0 13px;
                    border-radius: 999px;
                    font-size: 12px;
                    font-weight: 850;
                    white-space: nowrap;
                }

                .run-status-passed {
                    border: 1px solid #a7f3d0;
                    background: #f0fdf4;
                    color: #15803d;
                }

                .run-status-failed {
                    border: 1px solid #fecaca;
                    background: #fef2f2;
                    color: #b91c1c;
                }

                .status-icon {
                    width: 21px;
                    height: 21px;
                    border-radius: 50%;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    flex: 0 0 21px;
                    border: 1.5px solid #16a34a;
                    color: #15803d;
                    font-size: 11px;
                    font-weight: 900;
                }

                .status-icon-alert {
                    border-color: #dc2626;
                    color: #dc2626;
                }

                .run-fields {
                    display: grid;
                    grid-template-columns: repeat(4, minmax(0, 1fr));
                    gap: 12px;
                    margin-top: 14px;
                }

                .run-field {
                    min-width: 0;
                    padding: 12px 14px;
                    border-radius: 11px;
                    background: #f7f9fc;
                }

                .run-field-label {
                    color: #94a3b8;
                    font-size: 10px;
                    line-height: 1.2;
                    font-weight: 850;
                    letter-spacing: 0.65px;
                }

                .run-field-value {
                    margin-top: 5px;
                    color: #24324a;
                    font-size: 13px;
                    line-height: 1.25;
                    font-weight: 750;
                    overflow-wrap: anywhere;
                }

                .summary-grid {
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 18px;
                    margin-top: 14px;
                }

                .section-card {
                    min-width: 0;
                    overflow: hidden;
                    border: 1px solid;
                    border-radius: 17px;
                    background: #ffffff;
                    box-shadow: 0 2px 10px rgba(30, 41, 59, 0.03);
                }

                .section-card {
                    transition: transform 0.16s ease, box-shadow 0.16s ease;
                }

                .section-card:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 8px 24px rgba(30, 41, 59, 0.06);
                }

                .section-card-blue {
                    border-color: #c9d8ff;
                }

                .section-card-green {
                    border-color: #c9ecd8;
                }

                .section-card-purple {
                    border-color: #ddd0f5;
                }

                .section-card-orange {
                    border-color: #fed7aa;
                }

                .section-card-header {
                    display: flex;
                    align-items: center;
                    gap: 11px;
                    min-height: 60px;
                    padding: 9px 18px;
                    border-bottom: 1px solid;
                }

                .section-card-blue .section-card-header {
                    background: #f5f8ff;
                    border-color: #d9e3ff;
                }

                .section-card-green .section-card-header {
                    background: #f4fbf7;
                    border-color: #d9f1e1;
                }

                .section-card-purple .section-card-header {
                    background: #faf7ff;
                    border-color: #e9def8;
                }

                .section-card-orange .section-card-header {
                    background: #fff9f3;
                    border-color: #fde3c4;
                }

                .section-card-header h2 {
                    margin: 0;
                    font-size: 16px;
                    line-height: 1.2;
                    font-weight: 850;
                    letter-spacing: 0.05px;
                }

                .section-card-blue .section-card-header h2 {
                    color: #2563eb;
                }

                .section-card-green .section-card-header h2 {
                    color: #16a34a;
                }

                .section-card-purple .section-card-header h2 {
                    color: #6d28d9;
                }

                .section-card-orange .section-card-header h2 {
                    color: #ea580c;
                }

                .section-icon {
                    width: 38px;
                    height: 38px;
                    border-radius: 50%;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    flex: 0 0 38px;
                    color: #ffffff;
                    font-size: 14px;
                    font-weight: 900;
                }

                .section-icon-blue {
                    background: #2563eb;
                }

                .section-icon-green {
                    background: #16a34a;
                }

                .section-icon-purple {
                    background: #7c3aed;
                }

                .section-icon-orange {
                    background: #f97316;
                }

                .section-card-body {
                    padding: 16px 18px 18px;
                }

                .metric-grid {
                    display: grid;
                    gap: 16px 22px;
                }

                .metric-grid-two {
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                }

                .metric-grid-three {
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                }

                .metric {
                    display: flex;
                    align-items: center;
                    gap: 11px;
                    min-width: 0;
                }

                .metric-icon {
                    width: 34px;
                    height: 34px;
                    border-radius: 9px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    flex: 0 0 34px;
                    background: #f5f8fc;
                    color: #2563eb;
                    font-size: 16px;
                    font-weight: 850;
                }

                .metric-copy {
                    min-width: 0;
                }

                .metric-label {
                    color: #64748b;
                    font-size: 11px;
                    line-height: 1.25;
                    font-weight: 650;
                }

                .metric-value {
                    margin-top: 3px;
                    color: #111827;
                    font-size: 18px;
                    line-height: 1.1;
                    font-weight: 850;
                }

                .info-callout {
                    margin-top: 16px;
                    padding: 12px 14px;
                    border: 1px solid;
                    border-radius: 13px;
                }

                .blue-callout {
                    border-color: #c7d2fe;
                    background: #f8faff;
                }

                .callout-label {
                    color: #1d4ed8;
                    font-size: 11px;
                    font-weight: 850;
                }

                .callout-value {
                    margin-top: 4px;
                    color: #111827;
                    font-size: 13px;
                    line-height: 1.35;
                    font-weight: 750;
                }

                .metric-divider {
                    height: 1px;
                    margin: 16px 0;
                    background: #e8edf3;
                }

                .assessment-list {
                    display: flex;
                    flex-direction: column;
                }

                .assessment-row {
                    display: grid;
                    grid-template-columns: minmax(0, 1fr) auto;
                    align-items: center;
                    gap: 12px;
                    min-height: 44px;
                    padding: 7px 0;
                    border-bottom: 1px solid #eef1f5;
                }

                .assessment-label {
                    min-width: 0;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: #1f2937;
                    font-size: 13px;
                    line-height: 1.35;
                    font-weight: 750;
                }

                .assessment-value {
                    color: #166534;
                    font-size: 13px;
                    line-height: 1.3;
                    font-weight: 850;
                    text-align: right;
                }

                .row-symbol {
                    width: 21px;
                    text-align: center;
                    color: #ea580c;
                    font-size: 16px;
                    font-weight: 900;
                }

                .warning-symbol,
                .warning-value {
                    color: #ea580c;
                }

                .assessment-summary {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                    margin-top: 13px;
                }

                .assessment-summary-label {
                    color: #1f2937;
                    font-size: 13px;
                    font-weight: 850;
                }

                .assessment-pill {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 32px;
                    padding: 0 12px;
                    border-radius: 10px;
                    font-size: 12px;
                    font-weight: 850;
                    white-space: nowrap;
                }

                .purple-pill {
                    background: #f3e8ff;
                    color: #5b21b6;
                }

                .success-pill {
                    border: 1px solid #bbf7d0;
                    background: #f0fdf4;
                    color: #15803d;
                }

                .key-takeaway {
                    display: grid;
                    grid-template-columns: 175px minmax(0, 1fr) 220px;
                    align-items: center;
                    gap: 18px;
                    margin-top: 14px;
                    padding: 15px 18px;
                    border: 1px solid #c7d2fe;
                    border-radius: 17px;
                    background: #f8faff;
                }

                .key-heading {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: #1d4ed8;
                    font-size: 16px;
                    line-height: 1.05;
                    font-weight: 900;
                }

                .key-icon {
                    width: 38px;
                    height: 38px;
                    border-radius: 50%;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    flex: 0 0 38px;
                    background: #3b82f6;
                    color: #ffffff;
                    font-size: 18px;
                }

                .key-content {
                    padding-left: 18px;
                    border-left: 1px solid #a5b4fc;
                    color: #1f2937;
                    font-size: 12.5px;
                    line-height: 1.55;
                    font-weight: 650;
                }

                .warning-text {
                    color: #ea580c;
                    font-weight: 850;
                }

                .working-note {
                    padding: 11px 12px;
                    border: 1px dashed #a78bfa;
                    border-radius: 11px;
                    background: #ffffff;
                    color: #4c1d95;
                    font-size: 10.5px;
                    line-height: 1.45;
                    text-align: center;
                    font-weight: 650;
                }

                .prototype-footer-note {
                    display: flex;
                    justify-content: center;
                    gap: 7px;
                    margin-top: 13px;
                    color: #94a3b8;
                    font-size: 10px;
                    font-weight: 650;
                }

                @media (max-width: 1100px) {
                    .audit-page {
                        padding-left: 18px;
                        padding-right: 18px;
                    }

                    .audit-header {
                        grid-template-columns: 150px minmax(0, 1fr) auto;
                        gap: 15px;
                    }

                    .brand-logo {
                        width: 135px;
                    }

                    .key-takeaway {
                        grid-template-columns: 155px minmax(0, 1fr);
                    }

                    .working-note {
                        grid-column: 1 / -1;
                    }
                }

                @media (max-width: 820px) {
                    .audit-header {
                        grid-template-columns: 1fr;
                        gap: 12px;
                        padding-bottom: 15px;
                    }

                    .brand {
                        justify-content: center;
                    }

                    .brand-logo {
                        width: 135px;
                    }

                    .audit-title {
                        order: 2;
                    }

                    .header-actions {
                        order: 3;
                        justify-content: center;
                        flex-wrap: wrap;
                    }

                    .run-details-topline {
                        align-items: flex-start;
                    }

                    .run-fields {
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                    }

                    .summary-grid {
                        grid-template-columns: 1fr;
                    }

                    .key-takeaway {
                        grid-template-columns: 1fr;
                    }

                    .key-content {
                        padding: 0;
                        border-left: 0;
                        border-top: 1px solid #a5b4fc;
                        padding-top: 14px;
                    }
                }

                @media (max-width: 560px) {
                    .audit-page {
                        padding: 12px 12px 30px;
                    }

                    .audit-title h1 {
                        font-size: 22px;
                    }

                    .audit-subtitle {
                        flex-direction: column;
                        gap: 3px;
                        font-size: 12px;
                    }

                    .separator {
                        display: none;
                    }

                    .header-actions {
                        width: 100%;
                    }

                    .action-button {
                        flex: 1;
                        min-width: 0;
                    }

                    .run-details-card {
                        padding: 15px;
                    }

                    .run-details-topline {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .run-status {
                        align-self: flex-start;
                    }

                    .run-fields {
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                    }

                    .section-card-header {
                        min-height: 59px;
                        padding: 9px 14px;
                    }

                    .section-card-body {
                        padding: 15px 14px 16px;
                    }

                    .section-icon {
                        width: 36px;
                        height: 36px;
                        flex-basis: 36px;
                    }

                    .section-card-header h2 {
                        font-size: 14px;
                    }

                    .metric-grid-three,
                    .metric-grid-two {
                        grid-template-columns: 1fr 1fr;
                    }

                    .metric-grid-three .metric:last-child {
                        grid-column: 1 / -1;
                    }

                    .metric-value {
                        font-size: 16px;
                    }

                    .assessment-row {
                        grid-template-columns: minmax(0, 1fr);
                        gap: 4px;
                        padding: 9px 0;
                    }

                    .assessment-value {
                        padding-left: 31px;
                        text-align: left;
                    }

                    .assessment-summary {
                        align-items: flex-start;
                        flex-direction: column;
                    }

                    .key-takeaway {
                        padding: 15px;
                    }

                    .prototype-footer-note {
                        flex-wrap: wrap;
                        text-align: center;
                    }
                }

                @media print {
                    .audit-page {
                        padding: 0;
                        background: #ffffff;
                    }

                    .audit-shell {
                        max-width: none;
                    }

                    .header-actions {
                        display: none;
                    }

                    .section-card,
                    .run-details-card,
                    .key-takeaway {
                        box-shadow: none;
                        break-inside: avoid;
                    }

                    .prototype-footer-note {
                        display: none;
                    }
                }
            `}</style>
        </main>
    );
}