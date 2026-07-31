import {
    PDFDocument,
    StandardFonts
} from "pdf-lib";

import { PdfAssets } from "./PdfAssets";

import { PdfTheme } from "./PdfTheme";
import { PdfDrawing } from "./PdfDrawing";
import { PdfHeader } from "./PdfHeader";
import { PdfContent } from "./PdfContent";
import { PdfFooter } from "./PdfFooter";

import {
    PdfSection,
    TrendMetric
} from "./PdfSection";

export interface TrendReportInfo {

    patientName?: string;

    age?: string;

    sex?: string;

    doctorName?: string;

    hospitalName?: string;

    reportPeriod?: string;

}

export class TrendReportPdf {

async generate(
    trends: TrendMetric[],
    report: TrendReportInfo = {}
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

        reportTitle: "Clinical Trends Report",

        patientName: report.patientName,

        age: report.age,

        sex: report.sex,

        reportPeriod: report.reportPeriod,

        generatedOn: new Date()

    });

let content =
    PdfContent.begin(
        page,
        currentY
    );

        for (const trend of trends) {

            const footerReservedSpace = 120;

if (
    currentY <
    PdfTheme.header.pageBreakMargin + footerReservedSpace
) {

                page =
                    pdf.addPage([
                        PdfTheme.page.width,
                        PdfTheme.page.height
                    ]);

currentY =
    PdfHeader.draw({

        page,

        boldFont,

        regularFont,

    logoImage,

        reportTitle: "Clinical Trends Report",

        patientName: report.patientName,

        age: report.age,

        sex: report.sex,

        reportPeriod: report.reportPeriod,

        generatedOn: new Date()

    });

content =
    PdfContent.begin(
        page,
        currentY
    );

            }

currentY =
    PdfSection.drawSection({

        page: content.page,

        boldFont,

        regularFont,

        trend,

        x: content.left,

        y: currentY,

        width: content.width

    });

        }


// Footer will be drawn after all pages are created.

PdfFooter.draw({

    pdf,

    regularFont

});

return await pdf.save();

    }

}

export const trendReportPdf =
    new TrendReportPdf();