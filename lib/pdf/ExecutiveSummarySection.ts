import { PDFPage, PDFFont } from "pdf-lib";

import { PdfDrawing } from "./PdfDrawing";
import { PdfTheme } from "./PdfTheme";

export interface ExecutiveSummaryData {

    overallHealth: string;

    healthScore: string;

    summary: string;

    findings: string[];

    recommendations: string[];

}

interface DrawExecutiveSummaryArgs {

    page: PDFPage;

    boldFont: PDFFont;

    regularFont: PDFFont;

    x: number;

    y: number;

    width: number;

    data: ExecutiveSummaryData;

}

export class ExecutiveSummarySection {

    static draw({

        page,

        boldFont,

        regularFont,

        x,

        y,

        width,

        data

    }: DrawExecutiveSummaryArgs): number {

        let currentY = y;

PdfDrawing.text(page, {

    text: "Executive Health Summary",

    x,

    y: currentY,

    size: 18,

    font: boldFont

});

currentY -= 28;

PdfDrawing.text(page, {

    text: `Overall Health : ${data.overallHealth}`,

    x,

    y: currentY,

    size: 12,

    font: boldFont

});

currentY -= 22;

PdfDrawing.text(page, {

    text: `Health Score : ${data.healthScore}`,

    x,

    y: currentY,

    size: 12,

    font: boldFont

});

currentY -= 28;

PdfDrawing.text(page, {

    text: "Clinical Summary",

    x,

    y: currentY,

    size: 14,

    font: boldFont

});

currentY -= 20;

        PdfDrawing.multilineText(page, {

            text: data.summary,

            x,

            y: currentY,

            width,

            font: regularFont,

            size: 11

        });

        currentY -= 70;

PdfDrawing.text(page, {

    text: "Key Findings",

    x,

    y: currentY,

    size: 14,

    font: boldFont

});

currentY -= 20;

        data.findings.forEach(item => {

PdfDrawing.text(page, {

    text: "Key Findings",

    x,

    y: currentY,

    size: 14,

    font: boldFont

});

currentY -= 20;

        });

        currentY -= 10;

PdfDrawing.text(page, {

    text: "Recommendations",

    x,

    y: currentY,

    size: 14,

    font: boldFont

});

currentY -= 20;

        data.recommendations.forEach(item => {

PdfDrawing.text(page, {

    text: `• ${item}`,

    x: x + 8,

    y: currentY,

    size: 11,

    font: regularFont

});

currentY -= 18;

        });

        return currentY;

    }

}