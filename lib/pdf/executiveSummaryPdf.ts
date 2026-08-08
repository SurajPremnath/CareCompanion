import {
    PDFDocument,
    StandardFonts
} from "pdf-lib";

import { PdfAssets } from "./PdfAssets";
import { PdfTheme } from "./PdfTheme";
import { PdfHeader } from "./PdfHeader";
import { PdfContent } from "./PdfContent";
import { PdfFooter } from "./PdfFooter";
import { ExecutiveSummaryContent, type DrawOptions } from "./ExecutiveSummaryContent";
import { ExecutiveSummarySectionRenderer } from "./executive-summary/ExecutiveSummarySectionRenderer";

import type {
    ExecutiveSummaryViewModel,
    PatientViewModel
} from "@/app/journey-review/components/types";

export interface ExecutiveSummaryReport {
    patient: PatientViewModel;
    summary: ExecutiveSummaryViewModel;
    clinicalStory: any[];
}

export class ExecutiveSummaryPdf {

    async generate(report: ExecutiveSummaryReport): Promise<Uint8Array> {
        const pdf = await PDFDocument.create();
        const regularFont = await pdf.embedFont(StandardFonts.Helvetica);
        const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold);
        const logoImage = await PdfAssets.loadLogo(pdf);

        const addPage = () => {
            const page = pdf.addPage([
                PdfTheme.page.width,
                PdfTheme.page.height
            ]);
            const currentY = PdfHeader.draw({
                page,
                boldFont,
                regularFont,
                logoImage,
                reportTitle: "Executive Summary",
                patientName: report.patient.name,
                age: report.patient.age?.toString(),
                sex: report.patient.gender,
                doctorName: report.patient.doctor,
                hospitalName: report.patient.hospital,
                generatedOn: new Date()
            });
            const content = PdfContent.begin(page, currentY);
            return {
                page,
                y: content.currentY,
                x: content.left,
                width: content.width
            };
        };

        const first = addPage();
        let currentY = first.y;
        let page = first.page;
        let x = first.x;
        let width = first.width;

        const drawOptions: DrawOptions = {
            page,
            x,
            y: currentY,
            width,
            boldFont,
            regularFont,
            summary: report.summary,
            clinicalStory: report.clinicalStory
        };

        currentY = ExecutiveSummaryContent.drawJourneySnapshot(drawOptions, currentY);
        currentY = ExecutiveSummarySectionRenderer.drawHealthEvents(
            { page, x, y: currentY, width, boldFont, regularFont },
            report.clinicalStory?.[0]
        );

        const second = addPage();
        page = second.page;
        x = second.x;
        width = second.width;
        currentY = second.y;

        currentY = ExecutiveSummarySectionRenderer.drawHealthChanges(
            { page, x, y: currentY, width, boldFont, regularFont },
            report.clinicalStory?.[1]
        );

        const third = addPage();
        page = third.page;
        x = third.x;
        width = third.width;
        currentY = third.y;

        currentY = ExecutiveSummarySectionRenderer.drawPatientStatus(
            { page, x, y: currentY, width, boldFont, regularFont },
            report.clinicalStory?.[2],
            report.summary
        );

        const fourth = addPage();
        page = fourth.page;
        x = fourth.x;
        width = fourth.width;
        currentY = fourth.y;

        currentY = ExecutiveSummaryContent.drawTreatmentInformation(
            {
                page,
                x,
                y: currentY,
                width,
                regularFont,
                boldFont,
                summary: report.summary,
                clinicalStory: report.clinicalStory
            },
            currentY
        );

        currentY -= 8;

        currentY = ExecutiveSummarySectionRenderer.drawClinicalPlan(
            { page, x, y: currentY, width, boldFont, regularFont },
            report.clinicalStory?.[4]
        );

        PdfFooter.draw({
            pdf,
            regularFont
        });

        return await pdf.save();
    }
}

export const executiveSummaryPdf = new ExecutiveSummaryPdf();