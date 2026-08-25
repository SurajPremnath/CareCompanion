"use client";

/**
 * CareVR Test Audit
 *
 * Founder/Admin Audit Summary Page.
 *
 * Purpose:
 * - Read the completed AuditReport produced by CareVRTestAuditAgent.
 * - Convert measured audit evidence into the existing AuditSummary UI model.
 * - Render the existing AuditSummary component.
 *
 * IMPORTANT:
 * - This page does NOT start an audit.
 * - This page does NOT control CareVR.
 * - This page does NOT control Strataparse.
 * - This page does NOT create or modify audit evidence.
 * - No sample/demo values are used.
 */

import {
    useCallback,
    useEffect,
    useState,
} from "react";

import AuditSummary, {
    type AuditSummaryModel,
} from "@/CareVRTestAuditAgent/ui/summary/AuditSummary";

import {
    getAllStoredAuditReports,
} from "@/CareVRTestAuditAgent/runtime/auditReportStorage";

import type {
    AuditReport,
} from "@/CareVRTestAuditAgent/runtime/auditReport";


function formatDate(
    value:
        string
): string {

    const date =
        new Date(
            value
        );

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "—";
    }

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    );
}


function formatTime(
    value:
        string
): string {

    const date =
        new Date(
            value
        );

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "—";
    }

    return date.toLocaleTimeString(
        "en-IN",
        {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
        }
    );
}


function formatDuration(
    milliseconds:
        number
): string {

    const totalSeconds =
        Math.max(
            0,
            Math.round(
                milliseconds /
                1000
            )
        );

    const hours =
        Math.floor(
            totalSeconds /
            3600
        );

    const minutes =
        Math.floor(
            (
                totalSeconds %
                3600
            ) /
            60
        );

    const seconds =
        totalSeconds %
        60;

    if (
        hours > 0
    ) {
        return `${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
    }

    return `${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
}


function formatPercentage(
    value:
        number |
        undefined
): string {

    if (
        value ===
        undefined ||
        !Number.isFinite(
            value
        )
    ) {
        return "Not evaluated";
    }

    return `${value.toFixed(2)}%`;
}


function averageAccuracy(
    report:
        AuditReport,
    documentNumbers?:
        Set<number>
): string {

    const evaluations =
        report.aggregation.evaluations
            .filter(
                evaluation =>
                    evaluation.accuracyScore !==
                    undefined
            )
            .filter(
                evaluation => {

                    if (
                        !documentNumbers
                    ) {
                        return true;
                    }

                    return (
                        evaluation.documentNumber !==
                        undefined &&
                        documentNumbers.has(
                            evaluation.documentNumber
                        )
                    );
                }
            );

    if (
        evaluations.length ===
        0
    ) {
        return "Not evaluated";
    }

    const total =
        evaluations.reduce(
            (
                sum,
                evaluation
            ) =>
                sum +
                (
                    evaluation.accuracyScore ??
                    0
                ),
            0
        );

    return formatPercentage(
        total /
        evaluations.length
    );
}


function getModelName(
    request: {
        modelName?:
            string;

        modelTier?:
            string;
    }
): string {

    return (
        request.modelName ??
        request.modelTier ??
        "Unknown"
    );
}


function buildSummaryModel(
    report:
        AuditReport
):
    AuditSummaryModel {

    const aggregation =
        report.aggregation;

    const run =
        aggregation.run;

    const requests =
        aggregation.requests;

    const evaluations =
        aggregation.evaluations;

    /*
     * ------------------------------------------------------------
     * MODEL SUMMARY
     *
     * Model-level reporting is derived only from observed
     * request evidence. We never invent a model name.
     * ------------------------------------------------------------
     */

    const modelGroups =
        new Map<
            string,
            {
                documents:
                    Set<number>;

                requests:
                    number;

                inputTokens:
                    number;

                outputTokens:
                    number;

                totalTokens:
                    number;

                documentNumbers:
                    Set<number>;
            }
        >();

    requests.forEach(
        request => {

            const model =
                getModelName(
                    request
                );

            const existing =
                modelGroups.get(
                    model
                ) ??
                {
                    documents:
                        new Set<number>(),

                    requests:
                        0,

                    inputTokens:
                        0,

                    outputTokens:
                        0,

                    totalTokens:
                        0,

                    documentNumbers:
                        new Set<number>(),
                };

            existing.requests += 1;

            existing.inputTokens +=
                request.inputTokens ??
                0;

            existing.outputTokens +=
                request.outputTokens ??
                0;

            existing.totalTokens +=
                request.totalTokens ??
                (
                    (
                        request.inputTokens ??
                        0
                    ) +
                    (
                        request.outputTokens ??
                        0
                    )
                );

            if (
                request.documentNumber !==
                undefined
            ) {
                existing.documents.add(
                    request.documentNumber
                );

                existing.documentNumbers.add(
                    request.documentNumber
                );
            }

            modelGroups.set(
                model,
                existing
            );
        }
    );

    const modelSummary =
        Array.from(
            modelGroups.entries()
        ).map(
            (
                [
                    model,
                    group,
                ]
            ) => ({
                model,

                documents:
                    group.documents.size,

                requests:
                    group.requests,

                inputTokens:
                    group.inputTokens,

                outputTokens:
                    group.outputTokens,

                totalTokens:
                    group.totalTokens,

                accuracy:
                    averageAccuracy(
                        report,
                        group.documentNumbers
                    ),
            })
        );


    /*
     * ------------------------------------------------------------
     * DOCUMENT SUMMARY
     *
     * Document types come from observed result evidence.
     * If classification evidence is unavailable, we explicitly
     * show "Not classified" instead of inventing a type.
     * ------------------------------------------------------------
     */

    const documentGroups =
        new Map<
            string,
            {
                documents:
                    Set<number>;

                requests:
                    number;

                totalTimeMs:
                    number;

                totalTokens:
                    number;

                models:
                    Set<string>;

                documentNumbers:
                    Set<number>;
            }
        >();

    aggregation.result.documents.forEach(
        document => {

            const documentType =
                document.documentType ??
                "Not classified";

            const existing =
                documentGroups.get(
                    documentType
                ) ??
                {
                    documents:
                        new Set<number>(),

                    requests:
                        0,

                    totalTimeMs:
                        0,

                    totalTokens:
                        0,

                    models:
                        new Set<string>(),

                    documentNumbers:
                        new Set<number>(),
                };

            existing.documents.add(
                document.documentNumber
            );

            existing.documentNumbers.add(
                document.documentNumber
            );

            const documentRequests =
                requests.filter(
                    request =>
                        request.documentNumber ===
                        document.documentNumber
                );

            existing.requests +=
                documentRequests.length;

            documentRequests.forEach(
                request => {

                    existing.totalTimeMs +=
                        request.durationMs ??
                        0;

                    existing.totalTokens +=
                        request.totalTokens ??
                        (
                            (
                                request.inputTokens ??
                                0
                            ) +
                            (
                                request.outputTokens ??
                                0
                            )
                        );

                    existing.models.add(
                        getModelName(
                            request
                        )
                    );
                }
            );

            documentGroups.set(
                documentType,
                existing
            );
        }
    );


    /*
     * If result evidence is not yet populated, preserve the
     * measured document count from the Audit Run without
     * pretending that document classification occurred.
     */
    if (
        documentGroups.size ===
        0 &&
        run.documentCount > 0
    ) {

        const documentNumbers =
            new Set<number>();

        for (
            let index = 1;
            index <= run.documentCount;
            index += 1
        ) {
            documentNumbers.add(
                index
            );
        }

        documentGroups.set(
            "Not classified",
            {
                documents:
                    documentNumbers,

                requests:
                    requests.length,

                totalTimeMs:
                    aggregation.timing.totalDurationMs,

                totalTokens:
                    aggregation.usage.totalTokens,

                models:
                    new Set(
                        requests.map(
                            getModelName
                        )
                    ),

                documentNumbers,
            }
        );
    }


    const documentSummary =
        Array.from(
            documentGroups.entries()
        ).map(
            (
                [
                    documentType,
                    group,
                ]
            ) => ({
                documentType,

                models:
                    group.models.size > 0
                        ? Array.from(
                            group.models
                        ).join(
                            ", "
                        )
                        : "Not captured",

                documents:
                    group.documents.size,

                requests:
                    group.requests,

                totalTime:
                    formatDuration(
                        group.totalTimeMs
                    ),

                totalTokens:
                    group.totalTokens,

                accuracy:
                    averageAccuracy(
                        report,
                        group.documentNumbers
                    ),
            })
        );


    /*
     * ------------------------------------------------------------
     * ACCURACY SUMMARY
     * ------------------------------------------------------------
     */

    const accurate =
        evaluations.filter(
            evaluation =>
                evaluation.accuracyStatus ===
                "PASS"
        ).length;

    const partiallyAccurate =
        evaluations.filter(
            evaluation =>
                evaluation.accuracyStatus ===
                "REVIEW"
        ).length;

    const inaccurate =
        evaluations.filter(
            evaluation =>
                evaluation.accuracyStatus ===
                "FAIL"
        ).length;

    const notEvaluated =
        evaluations.filter(
            evaluation =>
                evaluation.accuracyStatus ===
                "NOT_EVALUATED"
        ).length;


    /*
     * ------------------------------------------------------------
     * MODULE SUMMARY
     *
     * The current AuditRun represents one module. Therefore
     * module count is one for this run.
     * ------------------------------------------------------------
     */

    const observedModels =
        Array.from(
            new Set(
                requests.map(
                    getModelName
                )
            )
        );

    const moduleAccuracy =
        aggregation.evaluations.length > 0
            ? averageAccuracy(
                report
            )
            : "Not evaluated";


    /*
     * ------------------------------------------------------------
     * RUN STATUS
     * ------------------------------------------------------------
     */

    const terminalRequests =
        aggregation.usage.completedRequests +
        aggregation.usage.failedRequests;

    const activeRequestsAtCompletion =
        Math.max(
            0,
            aggregation.usage.requestCount -
            terminalRequests
        );


    /*
     * Verification means the summary is internally reconciled.
     * It does NOT mean clinical accuracy was independently proven.
     */

    const verified =
        run.documentCount ===
            aggregation.documentSummary.totalDocuments &&
        aggregation.usage.requestCount ===
            aggregation.usage.completedRequests +
            aggregation.usage.failedRequests +
            activeRequestsAtCompletion &&
        run.status ===
            "COMPLETED";


    return {

        runId:
            run.runId,

        date:
            formatDate(
                run.startedAt
            ),

        startTime:
            formatTime(
                run.startedAt
            ),

        endTime:
            run.endedAt
                ? formatTime(
                    run.endedAt
                )
                : "—",

        duration:
            formatDuration(
                aggregation.timing.totalDurationMs
            ),

        status:
            run.status,

        kpis: {
            modules:
                1,

            documents:
                run.documentCount,

            requests:
                aggregation.usage.requestCount,

            totalTime:
                formatDuration(
                    aggregation.timing.totalDurationMs
                ),

            inputTokens:
                aggregation.usage.inputTokens,

            outputTokens:
                aggregation.usage.outputTokens,

            totalTokens:
                aggregation.usage.totalTokens,
        },

        moduleSummary: [
            {
                module:
                    run.module,

                documents:
                    run.documentCount,

                models:
                    observedModels.length > 0
                        ? observedModels.join(
                            ", "
                        )
                        : "Not captured",

                requests:
                    aggregation.usage.requestCount,

                totalTime:
                    formatDuration(
                        aggregation.timing.totalDurationMs
                    ),

                inputTokens:
                    aggregation.usage.inputTokens,

                outputTokens:
                    aggregation.usage.outputTokens,

                totalTokens:
                    aggregation.usage.totalTokens,

                accuracy:
                    moduleAccuracy,
            },
        ],

        modelSummary,

        documentSummary,

        accuracySummary: {
            overall:
                formatPercentage(
                    report.analysis
                        .averageAccuracyScore
                ),

            accurate,

            partiallyAccurate,

            inaccurate,

            notEvaluated,
        },

        runStatus: {
            documentsReceived:
                run.documentCount,

            documentsCompleted:
                run.completedDocuments,

            documentsFailed:
                run.failedDocuments,

            requestsSent:
                aggregation.usage.requestCount,

            requestsCompleted:
                aggregation.usage.completedRequests,

            requestsFailed:
                aggregation.usage.failedRequests,

            activeRequestsAtCompletion,

            terminalRequests,
        },

        verified,
    };
}


export default function AuditAdminPage() {

    const [
        summary,
        setSummary,
    ] =
        useState<
            AuditSummaryModel |
            null
        >(
            null
        );

    const [
        hasReport,
        setHasReport,
    ] =
        useState(
            true
        );


    const loadAuditReport =
        useCallback(
            () => {

                const reports =
                    getAllStoredAuditReports();

                if (
                    reports.length ===
                    0
                ) {

                    setSummary(
                        null
                    );

                    setHasReport(
                        false
                    );

                    return;
                }

                /*
                 * Map insertion order represents report creation order
                 * in the current in-memory audit store.
                 */
                const latestReport =
                    reports[
                        reports.length - 1
                    ];

                setSummary(
                    buildSummaryModel(
                        latestReport
                    )
                );

                setHasReport(
                    true
                );
            },
            []
        );


    useEffect(
        () => {

            loadAuditReport();

        },
        [
            loadAuditReport,
        ]
    );


    if (
        !hasReport
    ) {

        return (
            <main
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#f5f7fa",
                    padding: 24,
                    fontFamily:
                        "Inter, ui-sans-serif, system-ui, sans-serif",
                }}
            >
                <section
                    style={{
                        width: "100%",
                        maxWidth: 620,
                        background: "#ffffff",
                        border:
                            "1px solid #e5e7eb",
                        borderRadius: 16,
                        padding: 32,
                        textAlign: "center",
                    }}
                >
                    <h1
                        style={{
                            margin: 0,
                            fontSize: 24,
                            color: "#111827",
                        }}
                    >
                        CareVR AI Test Audit
                    </h1>

                    <p
                        style={{
                            margin:
                                "12px 0 0",
                            color: "#6b7280",
                            fontSize: 14,
                            lineHeight: 1.6,
                        }}
                    >
                        No completed audit report is currently
                        available in the Audit Agent store.
                    </p>

                    <button
                        type="button"
                        onClick={
                            loadAuditReport
                        }
                        style={{
                            marginTop: 20,
                            border: 0,
                            borderRadius: 10,
                            padding:
                                "10px 18px",
                            background:
                                "#111827",
                            color:
                                "#ffffff",
                            fontWeight: 700,
                            cursor:
                                "pointer",
                        }}
                    >
                        Refresh Audit
                    </button>
                </section>
            </main>
        );
    }


    if (
        !summary
    ) {
        return null;
    }


    return (
        <div>
            <div
                style={{
                    position:
                        "sticky",
                    top: 0,
                    zIndex: 50,
                    display:
                        "flex",
                    justifyContent:
                        "flex-end",
                    padding:
                        "10px 18px",
                    background:
                        "rgba(245,247,250,0.94)",
                    backdropFilter:
                        "blur(8px)",
                }}
            >
                <button
                    type="button"
                    onClick={
                        loadAuditReport
                    }
                    style={{
                        border:
                            "1px solid #d1d5db",
                        borderRadius:
                            8,
                        padding:
                            "7px 12px",
                        background:
                            "#ffffff",
                        color:
                            "#374151",
                        fontSize:
                            12,
                        fontWeight:
                            700,
                        cursor:
                            "pointer",
                    }}
                >
                    Refresh Audit
                </button>
            </div>

            <AuditSummary
                summary={
                    summary
                }
            />
        </div>
    );
}