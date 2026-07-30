import {
    PDFPage,
    PDFFont,
    rgb,
    RGB
} from "pdf-lib";

export interface DrawTextOptions {

    text: string;

    x: number;

    y: number;

    size: number;

    font: PDFFont;

    color?: RGB;

}

export interface RoundedRectOptions {

    x: number;

    y: number;

    width: number;

    height: number;

    radius?: number;

    borderWidth?: number;

    borderColor?: RGB;

    fillColor?: RGB;

}

export interface CircleOptions {

    x: number;

    y: number;

    size: number;

    borderWidth?: number;

    borderColor?: RGB;

    fillColor?: RGB;

}

export interface DividerOptions {

    x: number;

    y: number;

    width: number;

    thickness?: number;

    color?: RGB;

}

export interface BadgeOptions {

    x: number;

    y: number;

    width: number;

    height: number;

    radius?: number;

    background: RGB;

    border?: RGB;

    text: string;

    textSize: number;

    font: PDFFont;

    textColor?: RGB;

}

export class PdfDrawing {

    static text(
        page: PDFPage,
        options: DrawTextOptions
    ) {

const safeText =
    options.text
        .replace(/₀/g, "0")
        .replace(/₁/g, "1")
        .replace(/₂/g, "2")
        .replace(/₃/g, "3")
        .replace(/₄/g, "4")
        .replace(/₅/g, "5")
        .replace(/₆/g, "6")
        .replace(/₇/g, "7")
        .replace(/₈/g, "8")
        .replace(/₉/g, "9")
        .replace(/°/g, " deg ")
        .replace(/µ/g, "u");

        page.drawText(safeText, {

            x: options.x,

            y: options.y,

            size: options.size,

            font: options.font,

            color: options.color ?? rgb(0, 0, 0)

        });

    }

    static centeredText(
        page: PDFPage,
        options: DrawTextOptions,
        width: number
    ) {

        const textWidth =
            options.font.widthOfTextAtSize(
                options.text,
                options.size
            );

        this.text(page, {

            ...options,

            x:
                options.x +
                (width - textWidth) / 2

        });

    }

    static roundedRect(
        page: PDFPage,
        options: RoundedRectOptions
    ) {

page.drawRectangle({

    x: options.x,

    y: options.y,

    width: options.width,

    height: options.height,

    borderWidth:
        options.borderWidth,

    borderColor:
        options.borderColor,

    color:
        options.fillColor

});

    }

    static circle(
        page: PDFPage,
        options: CircleOptions
    ) {

        page.drawCircle({

            x:
                options.x,

            y:
                options.y,

            size:
                options.size,

            borderWidth:
                options.borderWidth ?? 1,

            borderColor:
                options.borderColor,

            color:
                options.fillColor

        });

    }

    static divider(
        page: PDFPage,
        options: DividerOptions
    ) {

        page.drawLine({

            start: {

                x: options.x,

                y: options.y

            },

            end: {

                x:
                    options.x +
                    options.width,

                y:
                    options.y

            },

            thickness:
                options.thickness ?? 1,

            color:
                options.color ??
                rgb(0.85, 0.85, 0.85)

        });

    }

    static badge(
        page: PDFPage,
        options: BadgeOptions
    ) {

        this.roundedRect(page, {

            x: options.x,

            y: options.y,

            width: options.width,

            height: options.height,

            radius:
                options.radius ?? 8,

            borderWidth: 1,

            borderColor:
                options.border,

            fillColor:
                options.background

        });

        this.centeredText(
            page,
            {

                text: options.text,

                x: options.x,

                y:
                    options.y +
                    (options.height / 2) -
                    (options.textSize / 3),

                size: options.textSize,

                font: options.font,

                color:
                    options.textColor ??
                    rgb(1, 1, 1)

            },
            options.width
        );

    }

    static measureText(
        font: PDFFont,
        text: string,
        size: number
    ) {

        return font.widthOfTextAtSize(
            text,
            size
        );

    }

    static rightAlignedText(
        page: PDFPage,
        options: DrawTextOptions,
        rightEdge: number
    ) {

        const width =
            this.measureText(
                options.font,
                options.text,
                options.size
            );

        this.text(page, {

            ...options,

            x:
                rightEdge -
                width

        });

    }

    static multilineText(
        page: PDFPage,
        options: DrawTextOptions,
        lineHeight = 14
    ) {

        const lines =
            options.text.split("\n");

        let currentY =
            options.y;

        for (const line of lines) {

            this.text(page, {

                ...options,

                text: line,

                y: currentY

            });

            currentY -= lineHeight;

        }

    }

}