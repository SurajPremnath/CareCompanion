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

    history?: number[];

    periods: {

        label: string;

        current: string;

        minimum: string;

        maximum: string;

        average: string;

    }[];

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

console.log(
    "PDF DRAW SECTION:",
    options.trend.parameter,
    options.trend.history
);

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

const topY = y - sectionHeight;

PdfDrawing.roundedRect(page, {

    x,

    y: topY,

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

    y: topY,

    width,

    theme

});

this.drawMetrics({
    page,
    boldFont,
    regularFont,
    trend,
    x,
    y: topY,
    width,
    theme
});


return topY - PdfTheme.card.gap;

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


}

private static drawMetrics(options: {

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

    } = options;


    const left =
        x +
        PdfTheme.card.padding;


    const tableWidth =
        width -
        (PdfTheme.card.padding * 2);


    const parameterColumnWidth =
        90;


    const metricColumnWidth =
        (
            tableWidth -
            parameterColumnWidth
        ) / 4;


const headerY =
    y +
    75;


/*
 * Column headers
 *
 * Parameter | Current | Min | Max | Avg
 */

PdfDrawing.text(page, {

    text:
        trend.parameter,

    x:
        left,

    y:
        headerY,

    size: 9,

    font:
        boldFont,

    color:
        rgb(
            0.25,
            0.29,
            0.36
        )

});


const headers = [

    "CURRENT",
    "MIN",
    "MAX",
    "AVG"

];


headers.forEach(
    (header, index) => {

        PdfDrawing.text(page, {

            text:
                header,

            x:
                left +
                parameterColumnWidth +
                (
                    metricColumnWidth *
                    index
                ),

            y:
                headerY,

            size: 9,

            font:
                boldFont,

            color:
                rgb(
                    0.25,
                    0.29,
                    0.36
                )

        });

    }
);


    /*
     * Selected reporting periods.
     *
     * One row per period.
     */

    let rowY =
        headerY - 18;


    for (
        const period of trend.periods
    ) {

        PdfDrawing.text(page, {

            text:
                period.label.replace(
                    /^(\d{2})\s+\w+\s+\d{4}\s+-\s+(\d{2})\s+(\w+)\s+\d{4}$/,
                    "$1 - $2 $3"
                ),

            x:
                left,

            y:
                rowY,

            size: 9,

            font:
                regularFont,

            color:
                rgb(
                    0.25,
                    0.29,
                    0.36
                )

        });


        const noValue =
    period.current.startsWith("-") &&
    period.minimum.startsWith("-") &&
    period.maximum.startsWith("-") &&
    period.average.startsWith("-");


        if (noValue) {

            PdfDrawing.text(page, {

                text:
                    `No ${trend.parameter.toLowerCase()} recorded for this week`,

                x:
                    left +
                    parameterColumnWidth,

                y:
                    rowY,

                size: 9,

                font:
                    regularFont,

                color:
                    rgb(
                        0.45,
                        0.48,
                        0.52
                    )

            });

        } else {

            PdfDrawing.text(page, {

                text:
                    period.current,

                x:
                    left +
                    parameterColumnWidth,

                y:
                    rowY,

                size: 9,

                font:
                    regularFont,

                color:
                    rgb(
                        0.10,
                        0.13,
                        0.18
                    )

            });


            PdfDrawing.text(page, {

                text:
                    period.minimum,

                x:
                    left +
                    parameterColumnWidth +
                    metricColumnWidth,

                y:
                    rowY,

                size: 9,

                font:
                    regularFont,

                color:
                    rgb(
                        0.10,
                        0.13,
                        0.18
                    )

            });


            PdfDrawing.text(page, {

                text:
                    period.maximum,

                x:
                    left +
                    parameterColumnWidth +
                    (
                        metricColumnWidth * 2
                    ),

                y:
                    rowY,

                size: 9,

                font:
                    regularFont,

                color:
                    rgb(
                        0.10,
                        0.13,
                        0.18
                    )

            });


            PdfDrawing.text(page, {

                text:
                    period.average,

                x:
                    left +
                    parameterColumnWidth +
                    (
                        metricColumnWidth * 3
                    ),

                y:
                    rowY,

                size: 9,

                font:
                    regularFont,

                color:
                    rgb(
                        0.10,
                        0.13,
                        0.18
                    )

            });

        }


        rowY -= 16;

    }




}


    /*
     * Draw the recorded clinical trend history as a simple
     * PDF-native line graph.
     *
     * The screen uses Recharts, but the PDF cannot render
     * React components. The same recorded history is therefore
     * drawn directly using pdf-lib primitives.
     */
    static drawTrendGraph(options: {

        page: PDFPage;

        trend: TrendMetric;

        x: number;

        y: number;

        width: number;

    }) {

console.log(
    "PDF DRAW TREND GRAPH",
    options.trend.parameter,
    options.trend.history
);

        const {

            page,

            trend,

            x,

            y,

            width

        } = options;


        const history =
            (trend.history ?? [])
                .filter(
                    value =>
                        Number.isFinite(value)
                );


        if (history.length < 2) {

            return;

        }


        const graphHeight = 70;

        const graphWidth = width;

        const minimum =
            Math.min(...history);

        const maximum =
            Math.max(...history);

        const range =
            maximum - minimum;


        /*
         * Keep a visible vertical range even when all
         * recorded values are identical.
         */
        const valueRange =
            range === 0
                ? 1
                : range;


        const padding = 6;


        const graphLeft =
            x + padding;

        const graphRight =
            x +
            graphWidth -
            padding;

        const graphBottom =
            y;

        const graphTop =
            y +
            graphHeight;


        /*
         * Graph baseline.
         */
        PdfDrawing.divider(page, {

            x:
                graphLeft,

            y:
                graphBottom,

            width:
                graphRight -
                graphLeft,

            thickness: 1,

            color:
                rgb(
                    0.88,
                    0.90,
                    0.93
                )

        });


        /*
         * Draw each recorded value as a point and connect
         * consecutive measurements with a line.
         */
        history.forEach(
            (value, index) => {

                const normalized =
                    (
                        value -
                        minimum
                    ) /
                    valueRange;


                const pointX =
                    history.length === 1
                        ? graphLeft
                        :
                        graphLeft +
                        (
                            (
                                graphRight -
                                graphLeft
                            ) *
                            index /
                            (
                                history.length -
                                1
                            )
                        );


                const pointY =
                    graphBottom +
                    (
                        normalized *
                        (
                            graphHeight -
                            padding
                        )
                    );


                if (index > 0) {

                    const previousValue =
                        history[
                            index - 1
                        ];

                    const previousNormalized =
                        (
                            previousValue -
                            minimum
                        ) /
                        valueRange;


                    const previousX =
                        graphLeft +
                        (
                            (
                                graphRight -
                                graphLeft
                            ) *
                            (
                                index - 1
                            ) /
                            (
                                history.length -
                                1
                            )
                        );


                    const previousY =
                        graphBottom +
                        (
                            previousNormalized *
                            (
                                graphHeight -
                                padding
                            )
                        );


                    page.drawLine({

                        start: {

                            x:
                                previousX,

                            y:
                                previousY

                        },

                        end: {

                            x:
                                pointX,

                            y:
                                pointY

                        },

                        thickness: 2,

                        color:
                            rgb(
                                0.34,
                                0.19,
                                0.91
                            )

                    });

                }


                PdfDrawing.circle(page, {

                    x:
                        pointX,

                    y:
                        pointY,

                    size: 2.5,

                    borderWidth: 0,

                    fillColor:
                        rgb(
                            0.34,
                            0.19,
                            0.91
                        )

                });

            }
        );

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