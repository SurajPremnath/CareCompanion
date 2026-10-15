export type ReportExecutionType =
    | "EXECUTIVE_SUMMARY"
    | "CLINICAL_TRENDS";


export type ReportExecutionHandoff = {

    userId: string;

    patientId: string | null;

    patientName: string;

    reportType: ReportExecutionType;

    startDate: string;

    endDate: string;

    requestedAt: string;

};


let reportExecutionHandoff:
    ReportExecutionHandoff | null = null;


export const reportExecutionHandoffStore = {

    set(
        handoff: ReportExecutionHandoff
    ): void {

        reportExecutionHandoff =
            handoff;

    },


    get(): ReportExecutionHandoff | null {

        return reportExecutionHandoff;

    },


    clear(): void {

        reportExecutionHandoff =
            null;

    },

};