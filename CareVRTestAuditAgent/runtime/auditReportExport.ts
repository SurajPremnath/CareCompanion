/**
 * CareVRTestAuditAgent
 *
 * Audit report export boundary.
 *
 * Converts a completed audit report into a stable,
 * serialisable export representation.
 *
 * IMPORTANT:
 *
 * This module:
 * - does not control CareVR
 * - does not control Strataparse
 * - does not invoke models
 * - does not alter audit evidence
 * - does not create new analysis
 *
 * It only serialises the completed AuditReport.
 */

import type {
    AuditReport,
} from "./auditReport";


export interface AuditReportExport {

    reportId:
        string;

    runId:
        string;

    generatedAt:
        string;

    status:
        AuditReport["status"];

    summary:
        AuditReportSummary;

    data:
        AuditReportExportData;
}


export interface AuditReportSummary {

    overallStatus:
        AuditReport["analysis"]["overallStatus"];

    executiveSummary:
        string;

    findings:
        AuditReport["analysis"]["findings"];
}


export interface AuditReportExportData {

    documents:
        AuditReport["aggregation"]["documentSummary"];

    usage:
        AuditReport["aggregation"]["usage"];

    cost:
        AuditReport["aggregation"]["cost"];

    timing:
        AuditReport["aggregation"]["timing"];

    evaluations:
        AuditReport["aggregation"]["evaluations"];

    analysis:
        AuditReport["analysis"];
}


/**
 * Converts a completed audit report into the
 * serialisable export representation.
 *
 * The export preserves the complete audit evidence
 * and analysis without introducing additional
 * interpretation at the export boundary.
 */
export function createAuditReportExport(
    report:
        AuditReport
):
    AuditReportExport {

    return {

        reportId:
            report.reportId,

        runId:
            report.runId,

        generatedAt:
            new Date(
                report.generatedAt
            ).toISOString(),

        status:
            report.status,

        summary: {

            overallStatus:
                report.analysis.overallStatus,

            executiveSummary:
                report.analysis.executiveSummary,

            findings:
                report.analysis.findings.map(
                    finding => ({
                        ...finding,
                    })
                ),
        },

        data: {

            documents:
                {
                    ...report.aggregation.documentSummary,

                    documentTypes:
                        {
                            ...report
                                .aggregation
                                .documentSummary
                                .documentTypes,
                        },
                },

            usage:
                {
                    ...report.aggregation.usage,
                },

            cost:
                {
                    ...report.aggregation.cost,
                },

            timing:
                {
                    ...report.aggregation.timing,
                },

            evaluations:
                report
                    .aggregation
                    .evaluations
                    .map(
                        evaluation => ({
                            ...evaluation,

                            notes:
                                [
                                    ...evaluation.notes,
                                ],
                        })
                    ),

            analysis:
                {
                    ...report.analysis,

                    findings:
                        report
                            .analysis
                            .findings
                            .map(
                                finding => ({
                                    ...finding,
                                })
                            ),
                },
        },
    };
}


/**
 * Serialises the export representation as JSON.
 *
 * This remains independent from PDF, UI,
 * filesystem, or other export implementations.
 */
export function serializeAuditReportExport(
    report:
        AuditReport
):
    string {

    const exportData =
        createAuditReportExport(
            report
        );

    return JSON.stringify(
        exportData,
        null,
        2
    );
}