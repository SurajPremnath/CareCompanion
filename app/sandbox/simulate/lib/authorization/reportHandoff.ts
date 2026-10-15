export type ReportModule =
    | "HEALTH_TIMELINE"
    | "EXECUTIVE_SUMMARY"
    | "CLINICAL_TRENDS";

export type ReportHandoff = {
    userId: string;
    patientId: string | null;
    patientName: string;
    moduleRequested: ReportModule;
    requestedAt: string;
};

let reportHandoff: ReportHandoff | null = null;

export const reportHandoffStore = {

    set(
        handoff: ReportHandoff
    ): void {
        reportHandoff = handoff;
    },

    get(): ReportHandoff | null {
        return reportHandoff;
    },

    clear(): void {
        reportHandoff = null;
    },

};
