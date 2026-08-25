"use client";

/**
 * CareVRTestAuditAgent
 *
 * Audit Summary UI
 *
 * Purpose:
 * Presents one complete Audit Run at Summary level.
 *
 * Scope:
 * - Founder/co-founder/team readable summary
 * - Run, module, token, document, accuracy and status views
 * - Presentation only
 *
 * Important:
 * This component does NOT control Strataparse.
 * This component does NOT initiate AI requests.
 * This component does NOT calculate or invent audit evidence.
 *
 * The sample data below exists only to validate the UI.
 * It will later be replaced by the real aggregated Audit Run.
 */

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

    verified: boolean;
};


function formatNumber(value: number): string {
    return value.toLocaleString("en-IN");
}

function SectionTitle({
    number,
    title,
}: {
    number: string;
    title: string;
}) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 16,
            }}
        >
            <div
                style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    background: "#111827",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 700,
                }}
            >
                {number}
            </div>

            <h2
                style={{
                    margin: 0,
                    fontSize: 17,
                    fontWeight: 700,
                    color: "#111827",
                }}
            >
                {title}
            </h2>
        </div>
    );
}

function KpiCard({
    label,
    value,
    sublabel,
}: {
    label: string;
    value: string;
    sublabel?: string;
}) {
    return (
        <div
            style={{
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                padding: "18px 18px 16px",
                minWidth: 0,
            }}
        >
            <div
                style={{
                    fontSize: 12,
                    color: "#6b7280",
                    fontWeight: 600,
                    marginBottom: 8,
                }}
            >
                {label}
            </div>

            <div
                style={{
                    fontSize: 24,
                    lineHeight: 1.1,
                    fontWeight: 750,
                    color: "#111827",
                }}
            >
                {value}
            </div>

            {sublabel && (
                <div
                    style={{
                        marginTop: 6,
                        fontSize: 11,
                        color: "#9ca3af",
                    }}
                >
                    {sublabel}
                </div>
            )}
        </div>
    );
}

function StatusBadge({
    status,
}: {
    status: AuditSummaryModel["status"];
}) {
    const completed = status === "COMPLETED";

    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 10px",
                borderRadius: 999,
                background: completed ? "#ecfdf5" : "#f3f4f6",
                color: completed ? "#047857" : "#4b5563",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 0.3,
            }}
        >
            <span
                style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: completed ? "#10b981" : "#9ca3af",
                }}
            />
            {status}
        </span>
    );
}

function DataTable({
    headers,
    children,
}: {
    headers: string[];
    children: React.ReactNode;
}) {
    return (
        <div
            style={{
                width: "100%",
                overflowX: "auto",
                border: "1px solid #e5e7eb",
                borderRadius: 10,
            }}
        >
            <table
                style={{
                    width: "100%",
                    minWidth: 900,
                    borderCollapse: "collapse",
                    fontSize: 12,
                }}
            >
                <thead>
                    <tr style={{ background: "#f9fafb" }}>
                        {headers.map((header) => (
                            <th
                                key={header}
                                style={{
                                    textAlign: "left",
                                    padding: "11px 12px",
                                    borderBottom:
                                        "1px solid #e5e7eb",
                                    color: "#6b7280",
                                    fontWeight: 700,
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>{children}</tbody>
            </table>
        </div>
    );
}

function TableCell({
    children,
    bold = false,
}: {
    children: React.ReactNode;
    bold?: boolean;
}) {
    return (
        <td
            style={{
                padding: "12px",
                borderBottom: "1px solid #f3f4f6",
                color: "#374151",
                fontWeight: bold ? 700 : 500,
                whiteSpace: "nowrap",
            }}
        >
            {children}
        </td>
    );
}

interface AuditSummaryProps {
    summary:
        AuditSummaryModel;
}

export default function AuditSummary({
    summary,
}: AuditSummaryProps) {

    return (
        <main
            style={{
                minHeight: "100vh",
                background: "#f5f7fa",
                color: "#111827",
                padding: "28px 24px 48px",
                fontFamily:
                    "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            }}
        >
            <div
                style={{
                    maxWidth: 1500,
                    margin: "0 auto",
                }}
            >
                {/* -------------------------------------------------- */}
                {/* HEADER                                               */}
                {/* -------------------------------------------------- */}

                <section
                    style={{
                        background: "#ffffff",
                        border: "1px solid #e5e7eb",
                        borderRadius: 14,
                        padding: "22px 24px",
                        marginBottom: 18,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            gap: 20,
                            flexWrap: "wrap",
                        }}
                    >
                        <div>
                            <div
                                style={{
                                    fontSize: 11,
                                    fontWeight: 800,
                                    letterSpacing: 1.1,
                                    color: "#6b7280",
                                    marginBottom: 5,
                                }}
                            >
                                CAREVR AI TEST AUDIT
                            </div>

                            <h1
                                style={{
                                    margin: 0,
                                    fontSize: 28,
                                    lineHeight: 1.15,
                                    fontWeight: 800,
                                }}
                            >
                                Summary
                            </h1>

                            <div
                                style={{
                                    marginTop: 8,
                                    fontSize: 12,
                                    color: "#6b7280",
                                }}
                            >
                                Complete measured view of one Audit Run
                            </div>
                        </div>

                        <StatusBadge status={summary.status} />
                    </div>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(150px, 1fr))",
                            gap: 16,
                            marginTop: 22,
                            paddingTop: 18,
                            borderTop: "1px solid #f0f0f0",
                        }}
                    >
                        <div>
                            <div
                                style={{
                                    fontSize: 10,
                                    color: "#9ca3af",
                                    fontWeight: 700,
                                    marginBottom: 4,
                                }}
                            >
                                RUN ID
                            </div>
                            <div
                                style={{
                                    fontSize: 12,
                                    fontWeight: 700,
                                }}
                            >
                                {summary.runId}
                            </div>
                        </div>

                        <div>
                            <div
                                style={{
                                    fontSize: 10,
                                    color: "#9ca3af",
                                    fontWeight: 700,
                                    marginBottom: 4,
                                }}
                            >
                                DATE
                            </div>
                            <div style={{ fontSize: 12 }}>
                                {summary.date}
                            </div>
                        </div>

                        <div>
                            <div
                                style={{
                                    fontSize: 10,
                                    color: "#9ca3af",
                                    fontWeight: 700,
                                    marginBottom: 4,
                                }}
                            >
                                START
                            </div>
                            <div style={{ fontSize: 12 }}>
                                {summary.startTime}
                            </div>
                        </div>

                        <div>
                            <div
                                style={{
                                    fontSize: 10,
                                    color: "#9ca3af",
                                    fontWeight: 700,
                                    marginBottom: 4,
                                }}
                            >
                                END
                            </div>
                            <div style={{ fontSize: 12 }}>
                                {summary.endTime}
                            </div>
                        </div>

                        <div>
                            <div
                                style={{
                                    fontSize: 10,
                                    color: "#9ca3af",
                                    fontWeight: 700,
                                    marginBottom: 4,
                                }}
                            >
                                DURATION
                            </div>
                            <div
                                style={{
                                    fontSize: 12,
                                    fontWeight: 700,
                                }}
                            >
                                {summary.duration}
                            </div>
                        </div>
                    </div>
                </section>

                {/* -------------------------------------------------- */}
                {/* KPI STRIP                                             */}
                {/* -------------------------------------------------- */}

                <section
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(145px, 1fr))",
                        gap: 12,
                        marginBottom: 24,
                    }}
                >
                    <KpiCard
                        label="Modules"
                        value={String(summary.kpis.modules)}
                    />

                    <KpiCard
                        label="Documents"
                        value={String(summary.kpis.documents)}
                    />

                    <KpiCard
                        label="Requests"
                        value={String(summary.kpis.requests)}
                    />

                    <KpiCard
                        label="Total Time"
                        value={summary.kpis.totalTime}
                    />

                    <KpiCard
                        label="Input Tokens"
                        value={formatNumber(
                            summary.kpis.inputTokens
                        )}
                    />

                    <KpiCard
                        label="Output Tokens"
                        value={formatNumber(
                            summary.kpis.outputTokens
                        )}
                    />

                    <KpiCard
                        label="Total Tokens"
                        value={formatNumber(
                            summary.kpis.totalTokens
                        )}
                    />
                </section>

                {/* -------------------------------------------------- */}
                {/* 1. MODULE SUMMARY                                     */}
                {/* -------------------------------------------------- */}

                <section
                    style={{
                        background: "#ffffff",
                        border: "1px solid #e5e7eb",
                        borderRadius: 14,
                        padding: 22,
                        marginBottom: 18,
                    }}
                >
                    <SectionTitle
                        number="1"
                        title="Module Summary"
                    />

                    <DataTable
                        headers={[
                            "Module",
                            "Documents",
                            "Models",
                            "Requests",
                            "Total Time",
                            "Input Tokens",
                            "Output Tokens",
                            "Total Tokens",
                            "Accuracy",
                        ]}
                    >
                        {summary.moduleSummary.map((row) => (
                            <tr key={row.module}>
                                <TableCell bold>
                                    {row.module}
                                </TableCell>
                                <TableCell>
                                    {row.documents}
                                </TableCell>
                                <TableCell>
                                    {row.models}
                                </TableCell>
                                <TableCell>
                                    {row.requests}
                                </TableCell>
                                <TableCell>
                                    {row.totalTime}
                                </TableCell>
                                <TableCell>
                                    {formatNumber(row.inputTokens)}
                                </TableCell>
                                <TableCell>
                                    {formatNumber(row.outputTokens)}
                                </TableCell>
                                <TableCell>
                                    {formatNumber(row.totalTokens)}
                                </TableCell>
                                <TableCell bold>
                                    {row.accuracy}
                                </TableCell>
                            </tr>
                        ))}
                    </DataTable>
                </section>

                {/* -------------------------------------------------- */}
                {/* 2. TOKEN SUMMARY BY MODEL                            */}
                {/* -------------------------------------------------- */}

                <section
                    style={{
                        background: "#ffffff",
                        border: "1px solid #e5e7eb",
                        borderRadius: 14,
                        padding: 22,
                        marginBottom: 18,
                    }}
                >
                    <SectionTitle
                        number="2"
                        title="Token Summary by Model"
                    />

                    <DataTable
                        headers={[
                            "Model",
                            "Documents",
                            "Requests",
                            "Input Tokens",
                            "Output Tokens",
                            "Total Tokens",
                            "Accuracy",
                        ]}
                    >
                        {summary.modelSummary.map((row) => (
                            <tr key={row.model}>
                                <TableCell bold>
                                    {row.model}
                                </TableCell>
                                <TableCell>
                                    {row.documents}
                                </TableCell>
                                <TableCell>
                                    {row.requests}
                                </TableCell>
                                <TableCell>
                                    {formatNumber(row.inputTokens)}
                                </TableCell>
                                <TableCell>
                                    {formatNumber(row.outputTokens)}
                                </TableCell>
                                <TableCell>
                                    {formatNumber(row.totalTokens)}
                                </TableCell>
                                <TableCell bold>
                                    {row.accuracy}
                                </TableCell>
                            </tr>
                        ))}
                    </DataTable>
                </section>

                {/* -------------------------------------------------- */}
                {/* 3. DOCUMENT TYPE SUMMARY                             */}
                {/* -------------------------------------------------- */}

                <section
                    style={{
                        background: "#ffffff",
                        border: "1px solid #e5e7eb",
                        borderRadius: 14,
                        padding: 22,
                        marginBottom: 18,
                    }}
                >
                    <SectionTitle
                        number="3"
                        title="Document Type Summary"
                    />

                    <DataTable
                        headers={[
                            "Document Type",
                            "Models",
                            "Documents",
                            "Requests",
                            "Total Time",
                            "Total Tokens",
                            "Accuracy",
                        ]}
                    >
                        {summary.documentSummary.map((row) => (
                            <tr key={row.documentType}>
                                <TableCell bold>
                                    {row.documentType}
                                </TableCell>
                                <TableCell>
                                    {row.models}
                                </TableCell>
                                <TableCell>
                                    {row.documents}
                                </TableCell>
                                <TableCell>
                                    {row.requests}
                                </TableCell>
                                <TableCell>
                                    {row.totalTime}
                                </TableCell>
                                <TableCell>
                                    {formatNumber(row.totalTokens)}
                                </TableCell>
                                <TableCell bold>
                                    {row.accuracy}
                                </TableCell>
                            </tr>
                        ))}
                    </DataTable>
                </section>

                {/* -------------------------------------------------- */}
                {/* 4. ACCURACY SUMMARY                                   */}
                {/* -------------------------------------------------- */}

                <section
                    style={{
                        background: "#ffffff",
                        border: "1px solid #e5e7eb",
                        borderRadius: 14,
                        padding: 22,
                        marginBottom: 18,
                    }}
                >
                    <SectionTitle
                        number="4"
                        title="Accuracy Summary"
                    />

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "minmax(180px, 0.8fr) minmax(320px, 1.2fr)",
                            gap: 24,
                        }}
                    >
                        <div
                            style={{
                                border: "1px solid #e5e7eb",
                                borderRadius: 12,
                                padding: 22,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                            }}
                        >
                            <div
                                style={{
                                    fontSize: 11,
                                    color: "#6b7280",
                                    fontWeight: 700,
                                }}
                            >
                                OVERALL ACCURACY
                            </div>

                            <div
                                style={{
                                    marginTop: 8,
                                    fontSize: 40,
                                    lineHeight: 1,
                                    fontWeight: 800,
                                    color: "#111827",
                                }}
                            >
                                {summary.accuracySummary.overall}
                            </div>

                            <div
                                style={{
                                    marginTop: 8,
                                    fontSize: 11,
                                    color: "#9ca3af",
                                }}
                            >
                                Based on evaluated audit evidence
                            </div>
                        </div>

                        <div
                            style={{
                                border: "1px solid #e5e7eb",
                                borderRadius: 12,
                                overflow: "hidden",
                            }}
                        >
                            {[
                                [
                                    "Accurate",
                                    summary.accuracySummary.accurate,
                                ],
                                [
                                    "Partially Accurate",
                                    summary.accuracySummary
                                        .partiallyAccurate,
                                ],
                                [
                                    "Inaccurate",
                                    summary.accuracySummary.inaccurate,
                                ],
                                [
                                    "Not Evaluated",
                                    summary.accuracySummary.notEvaluated,
                                ],
                            ].map(([label, value]) => (
                                <div
                                    key={label}
                                    style={{
                                        display: "flex",
                                        justifyContent:
                                            "space-between",
                                        alignItems: "center",
                                        padding:
                                            "13px 16px",
                                        borderBottom:
                                            "1px solid #f3f4f6",
                                        fontSize: 12,
                                    }}
                                >
                                    <span
                                        style={{
                                            color: "#4b5563",
                                            fontWeight: 600,
                                        }}
                                    >
                                        {label}
                                    </span>

                                    <span
                                        style={{
                                            color: "#111827",
                                            fontWeight: 800,
                                        }}
                                    >
                                        {value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* -------------------------------------------------- */}
                {/* 5. RUN STATUS SUMMARY                                */}
                {/* -------------------------------------------------- */}

                <section
                    style={{
                        background: "#ffffff",
                        border: "1px solid #e5e7eb",
                        borderRadius: 14,
                        padding: 22,
                        marginBottom: 18,
                    }}
                >
                    <SectionTitle
                        number="5"
                        title="Run Status Summary"
                    />

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(190px, 1fr))",
                            gap: 12,
                        }}
                    >
                        {[
                            [
                                "Documents Received",
                                summary.runStatus.documentsReceived,
                            ],
                            [
                                "Documents Completed",
                                summary.runStatus.documentsCompleted,
                            ],
                            [
                                "Documents Failed",
                                summary.runStatus.documentsFailed,
                            ],
                            [
                                "Requests Sent",
                                summary.runStatus.requestsSent,
                            ],
                            [
                                "Requests Completed",
                                summary.runStatus.requestsCompleted,
                            ],
                            [
                                "Requests Failed",
                                summary.runStatus.requestsFailed,
                            ],
                            [
                                "Active at Completion",
                                summary.runStatus
                                    .activeRequestsAtCompletion,
                            ],
                            [
                                "Terminal Requests",
                                summary.runStatus.terminalRequests,
                            ],
                        ].map(([label, value]) => (
                            <div
                                key={label}
                                style={{
                                    border:
                                        "1px solid #e5e7eb",
                                    borderRadius: 10,
                                    padding: 15,
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: 11,
                                        color: "#6b7280",
                                        fontWeight: 600,
                                        marginBottom: 7,
                                    }}
                                >
                                    {label}
                                </div>

                                <div
                                    style={{
                                        fontSize: 22,
                                        fontWeight: 800,
                                        color: "#111827",
                                    }}
                                >
                                    {value}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* -------------------------------------------------- */}
                {/* VERIFICATION                                         */}
                {/* -------------------------------------------------- */}

                <section
                    style={{
                        background: summary.verified
                            ? "#ecfdf5"
                            : "#fffbeb",
                        border: `1px solid ${
                            summary.verified
                                ? "#a7f3d0"
                                : "#fde68a"
                        }`,
                        borderRadius: 12,
                        padding: "14px 16px",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                    }}
                >
                    <div
                        style={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: summary.verified
                                ? "#10b981"
                                : "#f59e0b",
                            color: "#ffffff",
                            fontWeight: 800,
                            fontSize: 13,
                            flexShrink: 0,
                        }}
                    >
                        {summary.verified ? "✓" : "!"}
                    </div>

                    <div>
                        <div
                            style={{
                                fontSize: 12,
                                fontWeight: 800,
                                color: summary.verified
                                    ? "#065f46"
                                    : "#92400e",
                            }}
                        >
                            {summary.verified
                                ? "Audit summary verified"
                                : "Audit summary requires verification"}
                        </div>

                        <div
                            style={{
                                marginTop: 2,
                                fontSize: 11,
                                color: summary.verified
                                    ? "#047857"
                                    : "#a16207",
                            }}
                        >
                            Summary values are intended to reconcile
                            with the underlying detailed audit records.
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}