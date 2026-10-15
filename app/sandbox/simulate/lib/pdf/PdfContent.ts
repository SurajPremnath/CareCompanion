import { PDFPage } from "pdf-lib";

import { PdfTheme } from "./PdfTheme";

export interface PdfContentArea {

    page: PDFPage;

    currentY: number;

    left: number;

    width: number;

}

export class PdfContent {

    static begin(
        page: PDFPage,
        startY: number
    ): PdfContentArea {

        return {

            page,

            currentY: startY,

            left: PdfTheme.page.margin,

            width: PdfTheme.page.contentWidth

        };

    }

}