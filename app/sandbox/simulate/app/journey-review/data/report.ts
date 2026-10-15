import {
    ExecutiveSummaryViewModel,
    PatientViewModel,
    ReportData,
    TimelineEvent,
} from "../components/types";

interface BuildReportParams {
    patient: PatientViewModel;
    executiveSummary: ExecutiveSummaryViewModel;
    timeline: TimelineEvent[];
}

export function buildReport({
    patient,
    executiveSummary,
    timeline,
}: BuildReportParams): ReportData {

    return {
        patient,
        executiveSummary,
        timeline,
        trends: [],
    };

}