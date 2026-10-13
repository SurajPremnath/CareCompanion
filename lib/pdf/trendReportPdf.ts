import {
    PDFDocument,
    StandardFonts,
    rgb
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


export interface TrendReportDailyReading {
    date: string;
    temperature: number | null;
    pulse: number | null;
    spo2: number | null;
    systolic: number | null;
    diastolic: number | null;
    weightKg: number | null;
}

export interface TrendReportInfo {
    patientName?: string;
    age?: string;
    sex?: string;
    careMode?: "SELF" | "FAMILY";
    doctorName?: string;
    hospitalName?: string;
    reportPeriod?: string;
     dailyReadings?: TrendReportDailyReading[];
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

    showGender: report.careMode !== "SELF",

    doctorName: report.doctorName,

    hospitalName: report.hospitalName,

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

        showGender: report.careMode !== "SELF",

        doctorName: report.doctorName,

        hospitalName: report.hospitalName,

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

        // =====================================================
        // Date-wise Clinical Readings — final PDF section
        // =====================================================

        const dailyReadings = report.dailyReadings ?? [];

        if (dailyReadings.length > 0) {
            const tableLeft = content.left;
            const tableWidth = content.width;
            const columnWidths = [75, 65, 55, 60, 165, 95];

            const headers = [
                "Date",
                "Temp (F)",
                "Pulse",
                "SpO2 (%)",
                "Blood Pressure",
                "Weight (kg)"
            ];

            let rowY = currentY - 28;

            const drawColumnHeader = () => {
                page.drawRectangle({
                    x: tableLeft,
                    y: rowY - 6,
                    width: tableWidth,
                    height: 22,
                    color: rgb(0.94, 0.96, 0.98)
                });

                let x = tableLeft;

                headers.forEach((header, index) => {
                    PdfDrawing.text(page, {
                        text: header,
                        x: x + 4,
                        y: rowY,
                        size: 7,
                        font: boldFont,
                        color: rgb(0.12, 0.16, 0.22)
                    });

                    x += columnWidths[index];
                });

                PdfDrawing.divider(page, {
                    x: tableLeft,
                    y: rowY - 8,
                    width: tableWidth,
                    color: rgb(0.82, 0.85, 0.89)
                });

                rowY -= 25;
            };

            const startContinuationPage = () => {
                page = pdf.addPage([
                    PdfTheme.page.width,
                    PdfTheme.page.height
                ]);

                currentY = PdfHeader.draw({
                    page,
                    boldFont,
                    regularFont,
                    logoImage,
                    reportTitle: "Clinical Trends Report",
                    patientName: report.patientName,
                    age: report.age,
                    sex: report.sex,
                    showGender: report.careMode !== "SELF",
                    doctorName: report.doctorName,
                    hospitalName: report.hospitalName,
                    reportPeriod: report.reportPeriod,
                    generatedOn: new Date()
                });

                content = PdfContent.begin(
                    page,
                    currentY
                );

                rowY = currentY - 28;
                drawColumnHeader();
            };

            // Keep the table title and column headings together.
            // If there is insufficient space, start a clean page
            // before drawing either heading.
            if (rowY < 100) {
                page = pdf.addPage([
                    PdfTheme.page.width,
                    PdfTheme.page.height
                ]);

                currentY = PdfHeader.draw({
                    page,
                    boldFont,
                    regularFont,
                    logoImage,
                    reportTitle: "Clinical Trends Report",
                    patientName: report.patientName,
                    age: report.age,
                    sex: report.sex,
                    showGender: report.careMode !== "SELF",
                    doctorName: report.doctorName,
                    hospitalName: report.hospitalName,
                    reportPeriod: report.reportPeriod,
                    generatedOn: new Date()
                });

                content = PdfContent.begin(
                    page,
                    currentY
                );

                rowY = currentY - 28;
            }

            PdfDrawing.text(page, {
                text: "Date-wise Clinical Readings",
                x: tableLeft,
                y: rowY,
                size: 14,
                font: boldFont,
                color: rgb(0.10, 0.13, 0.18)
            });

            rowY -= 25;
            drawColumnHeader();

            for (const reading of dailyReadings) {
                if (rowY < 55) {
                    startContinuationPage();
                }

                const bloodPressure =
                    reading.systolic == null &&
                    reading.diastolic == null
                        ? "-"
                        : `${reading.systolic ?? "-"}/${reading.diastolic ?? "-"}`;

                const values = [
                    reading.date,
                    reading.temperature == null
                        ? "-"
                        : String(reading.temperature),
                    reading.pulse == null
                        ? "-"
                        : String(reading.pulse),
                    reading.spo2 == null
                        ? "-"
                        : String(reading.spo2),
                    bloodPressure,
                    reading.weightKg == null
                        ? "-"
                        : String(reading.weightKg)
                ];

                let x = tableLeft;

                values.forEach((value, index) => {
                    PdfDrawing.text(page, {
                        text: value,
                        x: x + 4,
                        y: rowY,
                        size: 8,
                        font: regularFont,
                        color: rgb(0.16, 0.19, 0.24)
                    });

                    x += columnWidths[index];
                });

                PdfDrawing.divider(page, {
                    x: tableLeft,
                    y: rowY - 7,
                    width: tableWidth,
                    thickness: 0.5,
                    color: rgb(0.89, 0.91, 0.94)
                });

                rowY -= 20;
            }
        }

        // Footer will be drawn after all pages are created.
        PdfFooter.draw({
            pdf,
            regularFont
        });

        return await pdf.save();
    }
}

export const trendReportPdf = new TrendReportPdf();