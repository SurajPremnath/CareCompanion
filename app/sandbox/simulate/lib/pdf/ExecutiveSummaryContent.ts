import {
    PDFPage,
    PDFFont,
    rgb
} from "pdf-lib";

import type {
    ExecutiveSummaryViewModel
} from "@/app/journey-review/components/types";

export interface ClinicalStoryItem {

    id: string;

    title: string;

    question: string;

    icon?: string;

    periods: {

        weekLabel: string;

        answer: string;

    }[];
}


export interface DrawOptions {

    page: PDFPage;

    x: number;

    y: number;

    width: number;

    boldFont: PDFFont;

    regularFont: PDFFont;

    summary: ExecutiveSummaryViewModel;

    clinicalStory: ClinicalStoryItem[];

    treatments?: {
        id: string;
        doctorNoteId: string | null;
        medication: string;
        dosage: string;
        duration: string;
        displayOrder: number;
        createdAt: string;
        careMode: "SELF" | "FAMILY";
        patientId: string | null;
    }[];

}


export class ExecutiveSummaryContent {

    static drawJourneySnapshot(
        options: DrawOptions,
        y: number
    ): number {

        return this.renderJourneySnapshot(
            options,
            y
        );
    }

    static drawTreatmentInformation(
        options: DrawOptions,
        y: number
    ): number {

        return this.renderTreatmentInformation(
            options,
            y
        );
    }

private static renderJourneySnapshot(
    options: DrawOptions,
    y: number
): number {

    const {
        page,
        x,
        width,
        boldFont,
        regularFont,
        summary
    } = options;

    page.drawText(
        "Clinical Journey Summary",
        {
            x,
            y,
            size: 12,
            font: regularFont
        }
    );

    y -= 28;

page.drawText(
    `Daily Care Records : ${summary.totalDailyCareRecords}`,
    {
        x,
        y,
        font: regularFont,
        size: 12
    }
);

page.drawText(
    `Assessments : ${summary.totalAssessments}`,
    {
        x: x + 190,
        y,
        font: regularFont,
        size: 12
    }
);

page.drawText(
    `Blood Cough Records : ${summary.recordedEvents.bloodCoughCount}`,
    {
        x: x + 340,
        y,
        font: regularFont,
        size: 12
    }
);

    return y - 30;
}

static drawClinicalStoryHeading(
    options: DrawOptions,
    y: number
): number {

    const {
        page,
        x,
        width,
        boldFont,
        regularFont,
        clinicalStory
    } = options;

    page.drawText(
        "Recorded Clinical Journey",
        {
            x,
            y,
            size: 15,
            font: regularFont
        }
    );

    y -= 30;

return y;
}

static drawClinicalStoryItem(
    options: DrawOptions,
    item: ClinicalStoryItem,
    y: number
): number {

    const {
        page,
        x,
        width,
        boldFont,
        regularFont
    } = options;


    // Section Border

    page.drawRectangle({
        x: x - 8,
        y: y - 145,
        width: width + 16,
        height: 145,
        borderWidth: 0.6,
        borderColor: rgb(0.88, 0.88, 0.88)
    });

    page.drawText(
        item.title,
        {
            x,
            y: y - 18,
            size: 14,
            font: boldFont
        }
    );

    page.drawText(
        item.question,
        {
            x,
            y: y - 38,
            size: 10,
            font: regularFont,
            maxWidth: width
        }
    );

    let cardY = y - 68;

    for (const period of item.periods) {

        page.drawRectangle({
            x: x + 8,
            y: cardY - 38,
            width: width - 16,
            height: 38,
            borderWidth: 0.5,
            borderColor: rgb(0.92, 0.92, 0.92),
            color: rgb(0.98, 0.98, 0.98)
        });

        page.drawText(
            period.weekLabel,
            {
                x: x + 18,
                y: cardY - 12,
                size: 10,
                font: boldFont
            }
        );

        page.drawText(
            period.answer,
            {
                x: x + 120,
                y: cardY - 12,
                size: 10,
                font: regularFont,
                maxWidth: width - 140
            }
        );

        cardY -= 45;
    }

    y = cardY - 20;


    return y;
}


private static renderTreatmentInformation(
    options: DrawOptions,
    y: number
): number {

    const {
        page,
        x,
        width,
        boldFont,
        regularFont,
        treatments = []
    } = options;

    page.drawText(
        "Treatment Information",
        {
            x,
            y,
            size: 18,
            font: boldFont
        }
    );

    y -= 28;

    if (treatments.length === 0) {
        page.drawText(
            "No treatment information recorded for this period.",
            {
                x,
                y,
                size: 10,
                font: regularFont,
                maxWidth: width,
                lineHeight: 14
            }
        );

        return y - 28;
    }

    const sortedTreatments = [...treatments].sort(
        (a, b) => {
            const dateDifference =
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime();

            if (dateDifference !== 0) {
                return dateDifference;
            }

            return a.displayOrder - b.displayOrder;
        }
    );

    const dateWidth = width * 0.21;
    const medicationWidth = width * 0.34;
    const dosageWidth = width * 0.22;
    const durationWidth =
        width - dateWidth - medicationWidth - dosageWidth;

    const dateX = x;
    const medicationX = x + dateWidth;
    const dosageX = medicationX + medicationWidth;
    const durationX = dosageX + dosageWidth;

    const headerHeight = 24;
    const rowHeight = 30;

    page.drawRectangle({
        x,
        y: y - headerHeight + 5,
        width,
        height: headerHeight,
        borderWidth: 0.5,
        borderColor: rgb(0.84, 0.88, 0.92),
        color: rgb(0.94, 0.97, 0.99)
    });

    const headerY = y - 11;

    const headers = [
        {
            label: "Date",
            x: dateX,
            width: dateWidth
        },
        {
            label: "Medication",
            x: medicationX,
            width: medicationWidth
        },
        {
            label: "Dosage",
            x: dosageX,
            width: dosageWidth
        },
        {
            label: "Duration",
            x: durationX,
            width: durationWidth
        }
    ];

    for (const header of headers) {
        page.drawText(
            header.label,
            {
                x: header.x + 5,
                y: headerY,
                size: 8,
                font: boldFont,
                maxWidth: header.width - 10
            }
        );
    }

    y -= headerHeight;

    for (const treatment of sortedTreatments) {
        const treatmentDate = new Date(treatment.createdAt);

        const dateLabel =
            Number.isNaN(treatmentDate.getTime())
                ? "Date unavailable"
                : treatmentDate.toLocaleDateString(
                    "en-GB",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        timeZone: "UTC"
                    }
                );

        const cells = [
            {
                value: dateLabel,
                x: dateX,
                width: dateWidth
            },
            {
                value: treatment.medication || "",
                x: medicationX,
                width: medicationWidth
            },
            {
                value: treatment.dosage || "",
                x: dosageX,
                width: dosageWidth
            },
            {
                value: treatment.duration || "",
                x: durationX,
                width: durationWidth
            }
        ];

        const rowTop = y;

        for (const cell of cells) {
            if (cell.value) {
                page.drawText(
                    cell.value,
                    {
                        x: cell.x + 5,
                        y: rowTop - 16,
                        size: 8,
                        font: regularFont,
                        maxWidth: cell.width - 10,
                        lineHeight: 10
                    }
                );
            }
        }

        y -= rowHeight;

        page.drawLine({
            start: {
                x,
                y: y + 5
            },
            end: {
                x: x + width,
                y: y + 5
            },
            thickness: 0.4,
            color: rgb(0.88, 0.90, 0.93)
        });
    }

    return y - 12;
}

}