import {
    PDFPage,
    PDFFont,
    rgb,
    RGB
} from "pdf-lib";

import { PdfTheme } from "./PdfTheme";
import { PdfDrawing } from "./PdfDrawing";

export interface PdfMetricCardOptions {

    page: PDFPage;

    font: PDFFont;

    title: string;

    value: string;

    x: number;

    y: number;

    width?: number;

    height?: number;

    accent: RGB;

}

export class PdfMetricCard {

    static draw(
        options: PdfMetricCardOptions
    ) {

        const {

            page,

            font,

            title,

            value,

            x,

            y,

            accent

        } = options;

        const width =
            options.width ??
            PdfTheme.metricCard.width;

        const height =
            options.height ??
            PdfTheme.metricCard.height;

        PdfDrawing.roundedRect(page, {

            x,

            y,

            width,

            height,

            radius:
                PdfTheme.metricCard.radius,

            borderWidth: 1,

            borderColor:
                rgb(0.90,0.92,0.95),

            fillColor:
                rgb(1,1,1)

        });

        PdfDrawing.divider(page,{

            x,

            y:
                y +
                height -
                22,

            width

        });

        PdfDrawing.text(page,{

            text:title,

            x:
                x + PdfTheme.spacing.sm,

            y:
                y + height - PdfTheme.metricCard.titlePaddingTop,

            size:
                PdfTheme.typography.metricLabel,

            font,

            color:
                rgb(
                    0.45,
                    0.50,
                    0.58
                )

        });

        PdfDrawing.text(page,{

            text:value,

            x:
                x + PdfTheme.spacing.sm,

            y:
                y + PdfTheme.metricCard.valuePaddingBottom,

            size:
                PdfTheme.typography.metricValue,

            font,

            color:
                rgb(
                    0.10,
                    0.13,
                    0.18
                )

        });

        page.drawRectangle({

            x,

            y,

            width: PdfTheme.metricCard.accentWidth,

            height,

            color:accent

        });

    }

}