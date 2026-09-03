/**
 * CareVRTestAuditAgent
 *
 * Audit report.
 *
 * Converts aggregated evidence and audit analysis into
 * one immutable report structure suitable for:
 * - Founder Analysis
 * - Audit Summary
 * - Report export
 * - Persistent audit storage
 *
 * IMPORTANT:
 *
 * This module does not:
 * - modify production results
 * - invoke production intelligence
 * - perform extraction
 * - invent evaluation evidence
 *
 * It only assembles already collected audit evidence.
 */

import type {
    AuditAggregation,
} from "./auditAggregator";

import type {
    AuditAnalysis,
} from "./auditAnalysis";


export interface AuditReport {

    reportId:
        string;

    runId:
        string;

    generatedAt:
        number;

    status:
        AuditAnalysis["overallStatus"];

    aggregation:
        AuditAggregation;

    analysis:
        AuditAnalysis;
}


/**
 * Creates the final audit report.
 *
 * The report contains both:
 *
 * 1. Raw aggregated evidence
 * 2. Structured analysis of that evidence
 *
 * This preserves traceability from every finding back
 * to the underlying audit observations.
 */
export function createAuditReport(
    input: {
        reportId:
            string;

        aggregation:
            AuditAggregation;

        analysis:
            AuditAnalysis;

        generatedAt?:
            number;
    }
):
    AuditReport {

    validateIdentifier(
        input.reportId,
        "reportId"
    );

    validateIdentifier(
        input.aggregation.run.runId,
        "runId"
    );

    const generatedAt =
        input.generatedAt ??
        Date.now();

    validateTimestamp(
        generatedAt
    );

    return {

        reportId:
            input.reportId,

        runId:
            input.aggregation.run.runId,

        generatedAt,

        status:
            input.analysis.overallStatus,

        aggregation:
            cloneAggregation(
                input.aggregation
            ),

        analysis:
            cloneAnalysis(
                input.analysis
            ),
    };
}


/**
 * Creates a safe copy of the aggregation.
 *
 * Audit reports must represent a snapshot of evidence
 * at report-generation time.
 */
function cloneAggregation(
    aggregation:
        AuditAggregation
):
    AuditAggregation {

    return {

        run:
            {
                ...aggregation.run,

                metadata:
                    {
                        ...aggregation.run.metadata,
                    },
            },

        requests:
            aggregation.requests.map(
                request => ({
                    ...request,
                })
            ),

        usage:
            {
                ...aggregation.usage,
            },

        cost:
            {
                ...aggregation.cost,
            },

        result:
            {
                ...aggregation.result,

                documents:
                    aggregation.result.documents.map(
                        document => ({

                            ...document,

                            result:
                                {
                                    ...document.result,
                                },
                        })
                    ),
            },

        evaluations:
            aggregation.evaluations.map(
                evaluation => ({

                    ...evaluation,

                    notes:
                        [
                            ...evaluation.notes,
                        ],
                })
            ),

        accuracy:
            {
                ...aggregation.accuracy,

                misses:
                    [
                        ...aggregation.accuracy.misses,
                    ],
            },

        documentCoverage:
            aggregation.documentCoverage.map(
                document => ({
                    ...document,
                })
            ),

        pageExecution:
            aggregation.pageExecution.map(
                page => ({
                    ...page,
                })
            ),

        modelSummary:
            aggregation.modelSummary.map(
                model => ({
                    ...model,
                })
            ),

        documentSummary:
            {
                ...aggregation.documentSummary,

                documentTypes:
                    {
                        ...aggregation.documentSummary.documentTypes,
                    },
            },

        timing:
            {
                ...aggregation.timing,
            },
    };
}


/**
 * Creates a safe copy of the analysis.
 */
function cloneAnalysis(
    analysis:
        AuditAnalysis
):
    AuditAnalysis {

    return {

        ...analysis,

        findings:
            analysis.findings.map(
                finding => ({
                    ...finding,
                })
            ),
    };
}


/**
 * Validates a required report identifier.
 */
function validateIdentifier(
    value:
        string,
    field:
        string
):
    void {

    if (
        !value.trim()
    ) {
        throw new Error(
            `${field} is required.`
        );
    }
}


/**
 * Validates a Unix timestamp represented
 * in milliseconds.
 */
function validateTimestamp(
    timestamp:
        number
):
    void {

    if (
        !Number.isFinite(
            timestamp
        ) ||
        timestamp < 0
    ) {
        throw new Error(
            "generatedAt must be a finite non-negative timestamp."
        );
    }
}