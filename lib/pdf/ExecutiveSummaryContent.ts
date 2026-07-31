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
        regularFont
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

    y -= 24;

    page.drawText(
        "Rahika 200 mg is prescribed twice daily as part of the current treatment regimen. The tablets started from 17 Jul 2026.",
        {
            x,
            y,
            size: 10,
            font: regularFont,
            maxWidth: width,
            lineHeight: 14
        }
    );

    return y - 40;
}
}