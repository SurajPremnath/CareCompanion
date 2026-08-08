import {
    PDFDocument,
    StandardFonts
} from "pdf-lib";

import { PdfAssets } from "./PdfAssets";
import { PdfTheme } from "./PdfTheme";
import { PdfHeader } from "./PdfHeader";
import { PdfContent } from "./PdfContent";
import { PdfFooter } from "./PdfFooter";

import {
    ExecutiveSummaryContent,
    type DrawOptions
} from "./ExecutiveSummaryContent";

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

    async generate(
        report: ExecutiveSummaryReport
    ): Promise<Uint8Array> {

        const pdf =
            await PDFDocument.create();

        const regularFont =
            await pdf.embedFont(
                StandardFonts.Helvetica
            );

        const boldFont =
            await pdf.embedFont(
                StandardFonts.HelveticaBold
            );

        const logoImage =
            await PdfAssets.loadLogo(pdf);

        let page =
            pdf.addPage([
                PdfTheme.page.width,
                PdfTheme.page.height
            ]);

        let currentY =
            PdfHeader.draw({

                page,

                boldFont,

                regularFont,

                logoImage,

                reportTitle:
                    "Executive Summary",

                patientName:
                    report.patient.name,

                age:
                    report.patient.age?.toString(),

                sex:
                    report.patient.gender,

                doctorName:
                    report.patient.doctor,

                hospitalName:
                    report.patient.hospital,

                generatedOn:
                    new Date()

            });

        const content =
    PdfContent.begin(
        page,
        currentY
    );

let drawOptions: DrawOptions = {

    page: content.page,

    x: content.left,

    y: currentY,

    width: content.width,

    boldFont,

    regularFont,

    summary: report.summary,

    clinicalStory: report.clinicalStory

};

currentY =
    ExecutiveSummaryContent.drawJourneySnapshot(
        {
            ...drawOptions,
            y: currentY
        },
        currentY
    );

const footerReservedSpace = 120;

if (
    currentY <
    PdfTheme.header.pageBreakMargin + footerReservedSpace
) {

    page = pdf.addPage([
        PdfTheme.page.width,
        PdfTheme.page.height
    ]);

    currentY =
        PdfHeader.draw({

            page,

            boldFont,

            regularFont,

            logoImage,

            reportTitle:
                "Executive Summary",

            patientName:
                report.patient.name,

            age:
                report.patient.age?.toString(),

            sex:
                report.patient.gender,

            doctorName:
                report.patient.doctor,

            hospitalName:
                report.patient.hospital,

            generatedOn:
                new Date()

        });

    drawOptions.page = page;
}

currentY =
    ExecutiveSummaryContent.drawClinicalStoryHeading(
        {
            ...drawOptions,
            y: currentY
        },
        currentY
    );


const symptoms = report.clinicalStory[0];

if (symptoms) {


    const tableBottomY =
        ExecutiveSummarySectionRenderer.drawTable(
            {
                page: drawOptions.page,
                x: drawOptions.x,
                y: currentY,
                width: drawOptions.width,
                boldFont,
                regularFont
            },
            report.clinicalStory
        );


    currentY = tableBottomY - 20;

}

/*

/*
for (const item of report.clinicalStory) {



    if (
        currentY <
        PdfTheme.header.pageBreakMargin + footerReservedSpace
    ) {

        page = pdf.addPage([
            PdfTheme.page.width,
            PdfTheme.page.height
        ]);

        currentY =
            PdfHeader.draw({

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

const content =
    PdfContent.begin(
        page,
        currentY
    );

drawOptions.page = content.page;
drawOptions.x = content.left;
drawOptions.width = content.width;
drawOptions.y = currentY;

    }

    currentY =
        ExecutiveSummarySectionRenderer.draw(
            {
    page: drawOptions.page,
    x: drawOptions.x,
    y: currentY,
    width: drawOptions.width,
    boldFont,
    regularFont
},
{
    icon: item.icon,
    title: item.title,
    question: item.question,
    periods: item.periods
}
        );
}

*/
if (
    currentY <
    PdfTheme.header.pageBreakMargin + footerReservedSpace
) {

    page = pdf.addPage([
        PdfTheme.page.width,
        PdfTheme.page.height
    ]);

    currentY =
        PdfHeader.draw({

            page,

            boldFont,

            regularFont,

            logoImage,

            reportTitle:
                "Executive Summary",

            patientName:
                report.patient.name,

            age:
                report.patient.age?.toString(),

            sex:
                report.patient.gender,

            doctorName:
                report.patient.doctor,

            hospitalName:
                report.patient.hospital,

            generatedOn:
                new Date()

        });

    drawOptions.page = page;
}


currentY =
    ExecutiveSummaryContent.drawTreatmentInformation(
        {
            page: drawOptions.page,
            x: drawOptions.x,
            y: currentY - 20,
            width: drawOptions.width,
            regularFont: drawOptions.regularFont,
            boldFont: drawOptions.boldFont,
            summary: report.summary,
            clinicalStory: report.clinicalStory
        },
        currentY - 20
    );


        PdfFooter.draw({

            pdf,

            regularFont

        });

        return await pdf.save();

    }



}


export const executiveSummaryPdf =
    new ExecutiveSummaryPdf();