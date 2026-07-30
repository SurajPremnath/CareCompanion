import {
    PDFPage,
    PDFFont,
    rgb,
    RGB
} from "pdf-lib";

import { PdfTheme } from "./PdfTheme";
import { PdfDrawing } from "./PdfDrawing";
import { PdfMetricCard } from "./PdfMetricCard";

export interface TrendMetric {

    parameter: string;

    status: string;

    current: string;

    minimum: string;

    maximum: string;

    average: string;

}

export interface PdfSectionOptions {

    page: PDFPage;

    boldFont: PDFFont;

    regularFont: PDFFont;

    trend: TrendMetric;

    x: number;

    y: number;

    width: number;

}

interface SectionTheme {

    accent: RGB;

    background: RGB;

}

export class PdfSection {

static drawSection(
    options: PdfSectionOptions
): number {

    const {

        page,

        boldFont,

        regularFont,

        trend,

        x,

        y,

        width

    } = options;

    const sectionHeight =
        PdfTheme.card.minHeight;

    const theme =
        this.getTheme(
            trend.status
        );

    PdfDrawing.roundedRect(page, {

        x,

        y,

        width,

        height: sectionHeight,

        radius:
            PdfTheme.card.radius,

        borderWidth:
            PdfTheme.card.borderWidth,

        borderColor:
            rgb(0.90, 0.92, 0.95),

        fillColor:
            rgb(1, 1, 1)

    });

    this.drawHeader({

        page,

        boldFont,

        regularFont,

        trend,

        x,

        y,

        width,

        theme

    });

    this.drawMetrics({

        page,

        boldFont,

        trend,

        x,

        y,

        theme

    });

    return (

        y -

        sectionHeight -

        PdfTheme.card.gap

    );

}

private static drawHeader(options: {

    page: PDFPage;

    boldFont: PDFFont;

    regularFont: PDFFont;

    trend: TrendMetric;

    x: number;

    y: number;

    width: number;

    theme: SectionTheme;

}) {

    const {

        page,

        boldFont,

        regularFont,

        trend,

        x,

        y,

        width,

        theme

    } = options;

    const iconSize = 28;

    const iconX =
        x +
        PdfTheme.card.padding;

    const iconY =
        y +
        PdfTheme.card.headerTopOffset;

    this.drawIcon({

        page,

        parameter:
            trend.parameter,

        x: iconX,

        y: iconY,

        size: iconSize,

        theme

    });

    PdfDrawing.text(page, {

        text:
            trend.parameter,

        x:
            iconX +
            PdfTheme.card.titleLeftOffset,

        y:
            iconY +
            PdfTheme.card.titleTopOffset,

        size:
            PdfTheme.typography.sectionTitle,

        font:
            boldFont,

        color:
            rgb(
                0.10,
                0.13,
                0.18
            )

    });

    this.drawStatusBadge({

        page,

        font:
            regularFont,

        status:
            trend.status,

        x:
            x +
            width -
            PdfTheme.card.badgeRightOffset,

        y:
            iconY +
            PdfTheme.card.badgeTopOffset,

        theme

    });

}

    private static drawMetrics(options: {

        page: PDFPage;

        boldFont: PDFFont;

        trend: TrendMetric;

        x: number;

        y: number;

        theme: SectionTheme;

    }) {

        const {

            page,

            boldFont,

            trend,

            x,

            y,

            theme

        } = options;

        const startX =
            x +
            PdfTheme.card.padding;

        const startY =
            y +
            PdfTheme.card.metricsBottomOffset;

        const gap =
            PdfTheme.metricCard.gap;

        const width =
            PdfTheme.metricCard.width;

        PdfMetricCard.draw({

            page,

            font: boldFont,

            title: "CURRENT",

            value: trend.current,

            x: startX,

            y: startY,

            accent: theme.accent

        });

        PdfMetricCard.draw({

            page,

            font: boldFont,

            title: "MIN",

            value: trend.minimum,

            x: startX + width + gap,

            y: startY,

            accent: theme.accent

        });

        PdfMetricCard.draw({

            page,

            font: boldFont,

            title: "MAX",

            value: trend.maximum,

            x: startX + ((width + gap) * 2),

            y: startY,

            accent: theme.accent

        });

        PdfMetricCard.draw({

            page,

            font: boldFont,

            title: "AVERAGE",

            value: trend.average,

            x: startX + ((width + gap) * 3),

            y: startY,

            accent: theme.accent

        });

    }
    private static drawStatusBadge(options: {

        page: PDFPage;

        font: PDFFont;

        status: string;

        x: number;

        y: number;

        theme: SectionTheme;

    }) {

        const {

            page,

            font,

            status,

            x,

            y,

            theme

        } = options;

                PdfDrawing.badge(page,{

            text: status,

            x,

            y,

            width: 90,

            height: 26,

            font,

            textSize: PdfTheme.typography.badge,

            background: theme.background,

            border: theme.accent,

            textColor: theme.accent

        });

    }

private static drawIcon(options: {

    page: PDFPage;

    parameter: string;

    x: number;

    y: number;

    size: number;

    theme: SectionTheme;

}) {

    const {

        parameter

    } = options;

    const value =
        parameter
            .trim()
            .toLowerCase();

    if (
        value.includes("temperature")
    ) {

        this.drawTemperatureIcon(options);
        return;

    }

    if (
        value.includes("pulse")
    ) {

        this.drawPulseIcon(options);
        return;

    }

    if (
        value.includes("blood pressure") ||
        value === "bp"
    ) {

        this.drawBloodPressureIcon(options);
        return;

    }

    if (
        value.includes("spo2") ||
        value.includes("oxygen")
    ) {

        this.drawOxygenIcon(options);
        return;

    }

    if (
        value.includes("weight")
    ) {

        this.drawWeightIcon(options);
        return;

    }

    this.drawTemperatureIcon(options);

}

private static drawTemperatureIcon(options: {

    page: PDFPage;

    x: number;

    y: number;

    size: number;

    theme: SectionTheme;

}) {

    const {

        page,

        x,

        y,

        theme

    } = options;

    const centerX =
        x + 18;

    const bottomY =
        y + 8;

    page.drawLine({

        start: {

            x: centerX,

            y: bottomY + 18

        },

        end: {

            x: centerX,

            y: bottomY + 6

        },

        thickness: 3,

        color: theme.accent

    });

    page.drawCircle({

        x: centerX,

        y: bottomY,

        size: 5,

        color: theme.accent

    });

    page.drawLine({

        start: {

            x: centerX + 8,

            y: bottomY + 18

        },

        end: {

            x: centerX + 12,

            y: bottomY + 18

        },

        thickness: 2,

        color: theme.accent

    });

    page.drawLine({

        start: {

            x: centerX + 8,

            y: bottomY + 12

        },

        end: {

            x: centerX + 12,

            y: bottomY + 12

        },

        thickness: 2,

        color: theme.accent

    });

    page.drawLine({

        start: {

            x: centerX + 8,

            y: bottomY + 6

        },

        end: {

            x: centerX + 12,

            y: bottomY + 6

        },

        thickness: 2,

        color: theme.accent

    });

}

    private static getTheme(
        status: string
    ): SectionTheme {

        const value =
            status
                .trim()
                .toLowerCase();

        if (
            value.includes("stable") ||
            value.includes("normal")
        ) {

            return {

                accent: rgb(
                    0.09,
                    0.64,
                    0.29
                ),

                background: rgb(
                    0.94,
                    0.99,
                    0.95
                )

            };

        }

        if (
            value.includes("attention") ||
            value.includes("warning")
        ) {

            return {

                accent: rgb(
                    0.97,
                    0.45,
                    0.09
                ),

                background: rgb(
                    1.00,
                    0.97,
                    0.91
                )

            };

        }

        if (
            value.includes("critical") ||
            value.includes("high") ||
            value.includes("low")
        ) {

            return {

                accent: rgb(
                    0.91,
                    0.26,
                    0.21
                ),

                background: rgb(
                    0.99,
                    0.95,
                    0.95
                )

            };

        }

        return {

            accent: rgb(
                0.15,
                0.39,
                0.92
            ),

            background: rgb(
                0.94,
                0.97,
                1.00
            )

        };

    }


private static drawPulseIcon(options: {

    page: PDFPage;

    x: number;

    y: number;

    size: number;

    theme: SectionTheme;

}) {

    const {

        page,

        x,

        y,

        theme

    } = options;

    page.drawLine({

        start: {

            x: x + 4,

            y: y + 14

        },

        end: {

            x: x + 10,

            y: y + 14

        },

        thickness: 2,

        color: theme.accent

    });

    page.drawLine({

        start: {

            x: x + 10,

            y: y + 14

        },

        end: {

            x: x + 14,

            y: y + 20

        },

        thickness: 2,

        color: theme.accent

    });

    page.drawLine({

        start: {

            x: x + 14,

            y: y + 20

        },

        end: {

            x: x + 18,

            y: y + 8

        },

        thickness: 2,

        color: theme.accent

    });

    page.drawLine({

        start: {

            x: x + 18,

            y: y + 8

        },

        end: {

            x: x + 22,

            y: y + 18

        },

        thickness: 2,

        color: theme.accent

    });

    page.drawLine({

        start: {

            x: x + 22,

            y: y + 18

        },

        end: {

            x: x + 30,

            y: y + 18

        },

        thickness: 2,

        color: theme.accent

    });

}

private static drawBloodPressureIcon(options: {

    page: PDFPage;

    x: number;

    y: number;

    size: number;

    theme: SectionTheme;

}) {

    const {

        page,

        x,

        y,

        theme

    } = options;

    page.drawCircle({

        x: x + 16,

        y: y + 18,

        size: 8,

        borderColor: theme.accent,

        borderWidth: 2

    });

    page.drawLine({

        start: {

            x: x + 16,

            y: y + 10

        },

        end: {

            x: x + 16,

            y: y + 2

        },

        thickness: 2,

        color: theme.accent

    });

    page.drawLine({

        start: {

            x: x + 13,

            y: y + 5

        },

        end: {

            x: x + 16,

            y: y + 2

        },

        thickness: 2,

        color: theme.accent

    });

    page.drawLine({

        start: {

            x: x + 19,

            y: y + 5

        },

        end: {

            x: x + 16,

            y: y + 2

        },

        thickness: 2,

        color: theme.accent

    });

}

private static drawOxygenIcon(options: {

    page: PDFPage;

    x: number;

    y: number;

    size: number;

    theme: SectionTheme;

}) {

    const {

        page,

        x,

        y,

        theme

    } = options;

    page.drawCircle({

        x: x + 16,

        y: y + 16,

        size: 7,

        borderColor: theme.accent,

        borderWidth: 2

    });

    page.drawLine({

        start: {

            x: x + 16,

            y: y + 9

        },

        end: {

            x: x + 16,

            y: y + 3

        },

        thickness: 2,

        color: theme.accent

    });

    page.drawLine({

        start: {

            x: x + 16,

            y: y + 23

        },

        end: {

            x: x + 16,

            y: y + 29

        },

        thickness: 2,

        color: theme.accent

    });

    page.drawLine({

        start: {

            x: x + 9,

            y: y + 16

        },

        end: {

            x: x + 23,

            y: y + 16

        },

        thickness: 2,

        color: theme.accent

    });

}

private static drawWeightIcon(options: {

    page: PDFPage;

    x: number;

    y: number;

    size: number;

    theme: SectionTheme;

}) {

    const {

        page,

        x,

        y,

        theme

    } = options;

        page.drawRectangle({

        x: x + 6,

        y: y + 6,

        width: 20,

        height: 20,

        borderWidth: 2,

        borderColor: theme.accent,

        color: rgb(1, 1, 1)

    });

    page.drawCircle({

        x: x + 16,

        y: y + 19,

        size: 3,

        borderColor: theme.accent,

        borderWidth: 2

    });

    page.drawLine({

        start: {

            x: x + 16,

            y: y + 19

        },

        end: {

            x: x + 20,

            y: y + 22

        },

        thickness: 2,

        color: theme.accent

    });

}

    }