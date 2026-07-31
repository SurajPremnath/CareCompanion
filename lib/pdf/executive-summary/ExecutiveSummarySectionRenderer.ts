import {
    PDFPage,
    PDFFont,
    rgb
} from "pdf-lib";

export interface ExecutiveSummarySection {

    icon: string;

    title: string;

    question: string;

    periods: any[];

}

export interface ExecutiveSummarySectionOptions {

    page: PDFPage;

    x: number;

    y: number;

    width: number;

    boldFont: PDFFont;

    regularFont: PDFFont;

}

export class ExecutiveSummarySectionRenderer {

    static drawTable(
        options: ExecutiveSummarySectionOptions,
        sections: ExecutiveSummarySection[]
    ): number {

        return this.drawDynamicTable(
            options,
            sections
        );

    }

    private static drawDynamicTable(
        options: ExecutiveSummarySectionOptions,
        sections: ExecutiveSummarySection[]
    ): number {

const {
    page,
    x,
    y,
    width,
    boldFont,
    regularFont
} = options;

const columnWidths = [
    90,     // Area
    140,    // Question
    105,    // Period 1
    105,    // Period 2
    105     // Current
];

const headerHeight = 36;

let currentY = y;

page.drawRectangle({
    x,
    y: currentY - headerHeight,
    width,
    height: headerHeight,
    borderWidth: 1,
    color: undefined,
    borderColor: rgb(0.80,0.80,0.80)
});

let currentX = x;

for (let i = 0; i < columnWidths.length - 1; i++) {

    currentX += columnWidths[i];

    page.drawLine({
        start: {
            x: currentX,
            y: currentY
        },
        end: {
            x: currentX,
            y: currentY - headerHeight
        },
        thickness: 0.6,
        color: rgb(0.80,0.80,0.80)
    });

}

const headers = [
    "Area",
    "Question",
    sections[0]?.periods?.[0]?.weekLabel ?? "Period 1",
    sections[0]?.periods?.[1]?.weekLabel ?? "Period 2",
    sections[0]?.periods?.[2]?.weekLabel ?? "Current"
];

let headerX = x;

for (let i = 0; i < headers.length; i++) {

    const text =
        headers[i].replace(" - ", "\n");

    page.drawText(text, {
        x: headerX + 6,
        y: currentY - 18,
        font: boldFont,
        size: 8,
        lineHeight: 10,
        maxWidth: columnWidths[i] - 8
    });

    headerX += columnWidths[i];

}

currentY -= headerHeight;

const labels = [
    {
        area: "Symptoms",
        question: "How has the patient been feeling during this period?"
    },
    {
        area: "Vitals",
        question: "Were there any notable vital parameter observations?"
    },
    {
        area: "Measurements",
        question: "What objective measurements were recorded?"
    },
    {
        area: "Events",
        question: "What clinical events require attention?"
    }
];

const rows = labels.map((label, index) => {

    const section = sections[index];

    return {

        area: label.area,

        question: this.wrapText(
            label.question,
            24
        ),

        period1: this.wrapText(
            section?.periods?.[0]?.answer ?? "",
            18
        ),

        period2: this.wrapText(
            section?.periods?.[1]?.answer ?? "",
            18
        ),

        current: this.wrapText(
            section?.periods?.[2]?.answer ?? "",
            18
        )

    };

});

const lineHeight = 10;
const padding = 8;

for (const row of rows) {

    const questionLines =
        row.question.split("\n").length;

    const period1Lines =
        row.period1.split("\n").length;

    const period2Lines =
        row.period2.split("\n").length;

    const currentLines =
        row.current.split("\n").length;

    const tallestLines = Math.max(
        1,
        questionLines,
        period1Lines,
        period2Lines,
        currentLines
    );

    const rowHeight = Math.max(
        45,
        (tallestLines * lineHeight) + (padding * 2)
    );

    page.drawRectangle({
        x,
        y: currentY - rowHeight,
        width,
        height: rowHeight,
        borderWidth: 1,
        color: undefined,
        borderColor: rgb(0.80,0.80,0.80)
    });

    let bodyX = x;

    for (let i = 0; i < columnWidths.length - 1; i++) {

        bodyX += columnWidths[i];

        page.drawLine({
            start: {
                x: bodyX,
                y: currentY
            },
            end: {
                x: bodyX,
                y: currentY - rowHeight
            },
            thickness: 0.6,
            color: rgb(0.80,0.80,0.80)
        });

    }

    page.drawText(row.area, {
        x: x + 6,
        y: currentY - 18,
        font: regularFont,
        size: 8
    });

    page.drawText(row.question, {
        x: x + columnWidths[0] + 6,
        y: currentY - 18,
        font: regularFont,
        size: 9,
        lineHeight: 10,
        maxWidth: columnWidths[1] - 8
    });

    page.drawText(row.period1, {
        x: x + columnWidths[0] + columnWidths[1] + 6,
        y: currentY - 18,
        font: regularFont,
        size: 8,
        lineHeight: 10,
        maxWidth: columnWidths[2] - 8
    });

    page.drawText(row.period2, {
        x: x + columnWidths[0] + columnWidths[1] + columnWidths[2] + 6,
        y: currentY - 18,
        font: regularFont,
        size: 8,
        lineHeight: 10,
        maxWidth: columnWidths[3] - 8
    });

    page.drawText(row.current, {
        x: x + columnWidths[0] + columnWidths[1] + columnWidths[2] + columnWidths[3] + 6,
        y: currentY - 18,
        font: regularFont,
        size: 8,
        lineHeight: 10,
        maxWidth: columnWidths[4] - 8
    });

    currentY -= rowHeight;

}

return currentY;

}

private static wrapText(
    text: string,
    maxChars: number
): string {

    if (!text) {
        return "";
    }

    const words = text.split(" ");
    const lines: string[] = [];
    let line = "";

    for (const word of words) {

        const candidate =
            line.length === 0
                ? word
                : line + " " + word;

        if (candidate.length <= maxChars) {

            line = candidate;

        } else {

            if (line.length > 0) {
                lines.push(line);
            }

            line = word;

        }

    }

    if (line.length > 0) {
        lines.push(line);
    }

    return lines.join("\n");

}

}