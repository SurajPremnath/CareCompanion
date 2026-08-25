/**
 * CareVRTestAuditAgent
 *
 * Completed audit report storage.
 *
 * This store belongs exclusively to the test audit agent.
 * It stores completed audit reports independently from the
 * live audit-run state.
 *
 * IMPORTANT:
 *
 * This storage does not participate in CareVR or Strataparse
 * processing.
 *
 * The storage layer preserves the current AuditReport contract.
 * It does not create, derive, or reinterpret audit analysis.
 */

import type {
    AuditReport,
} from "./auditReport";


const auditReports =
    new Map<
        string,
        AuditReport
    >();


/**
 * Stores a completed audit report.
 *
 * A defensive copy is stored so callers cannot mutate
 * the report held by the audit system.
 */
export function saveAuditReport(
    report:
        AuditReport
):
    void {

    auditReports.set(
        report.reportId,
        cloneStoredReport(
            report
        )
    );
}


/**
 * Returns a stored audit report.
 *
 * A defensive copy is returned so callers cannot mutate
 * the internal store.
 */
export function getStoredAuditReport(
    reportId:
        string
):
    AuditReport | undefined {

    const report =
        auditReports.get(
            reportId
        );

    if (!report) {
        return undefined;
    }

    return cloneStoredReport(
        report
    );
}


/**
 * Returns the most recently stored report for
 * a particular audit run.
 */
export function getStoredAuditReportByRunId(
    runId:
        string
):
    AuditReport | undefined {

    for (
        const report
        of auditReports.values()
    ) {

        if (
            report.runId ===
            runId
        ) {

            return cloneStoredReport(
                report
            );
        }
    }

    return undefined;
}


/**
 * Returns all stored audit reports.
 *
 * A defensive copy is returned.
 */
export function getAllStoredAuditReports():
    AuditReport[] {

    return Array.from(
        auditReports.values()
    ).map(
        report =>
            cloneStoredReport(
                report
            )
    );
}


/**
 * Removes one stored audit report.
 */
export function clearStoredAuditReport(
    reportId:
        string
):
    void {

    auditReports.delete(
        reportId
    );
}


/**
 * Removes all stored audit reports.
 *
 * Intended for test/reset scenarios.
 */
export function clearAllStoredAuditReports():
    void {

    auditReports.clear();
}


/**
 * Creates a defensive copy of a report before it
 * enters or leaves the storage boundary.
 *
 * Every nested mutable structure is copied.
 * No audit values are recalculated here.
 */
function cloneStoredReport(
    report:
        AuditReport
):
    AuditReport {

    return {

        ...report,

        aggregation: {

            ...report.aggregation,

            run: {

                ...report.aggregation.run,

                metadata: {
                    ...report.aggregation.run.metadata,
                },
            },

            requests:
                report.aggregation.requests.map(
                    request => ({
                        ...request,
                    })
                ),

            usage: {
                ...report.aggregation.usage,
            },

            cost: {
                ...report.aggregation.cost,
            },

            result: {

                ...report.aggregation.result,

                documents:
                    report
                        .aggregation
                        .result
                        .documents
                        .map(
                            document => ({

                                ...document,

                                result: {
                                    ...document.result,
                                },
                            })
                        ),
            },

            evaluations:
                report
                    .aggregation
                    .evaluations
                    .map(
                        evaluation => ({

                            ...evaluation,

                            notes: [
                                ...evaluation.notes,
                            ],
                        })
                    ),

            documentSummary: {

                ...report
                    .aggregation
                    .documentSummary,

                documentTypes: {

                    ...report
                        .aggregation
                        .documentSummary
                        .documentTypes,
                },
            },

            timing: {

                ...report
                    .aggregation
                    .timing,
            },
        },

        analysis: {

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
    };
}