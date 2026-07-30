import {
    PDFPage,
    PDFFont,
    rgb
} from "pdf-lib";

import { PdfTheme } from "./PdfTheme";
import { PdfDrawing } from "./PdfDrawing";

export interface PdfHeaderOptions {

    page: PDFPage;

    boldFont: PDFFont;

    regularFont: PDFFont;

    generatedOn: Date;

    patientName?: string;

    age?: string;

    sex?: string;

    doctorName?: string;

    hospitalName?: string;

    reportPeriod?: string;

}

export class PdfHeader {

static draw(
    options: PdfHeaderOptions
) {

    const {

        page,

        boldFont,

        regularFont,

        generatedOn,

        patientName,

        age,

        sex,

        doctorName,

        hospitalName,

        reportPeriod

    } = options;

    const margin =
        PdfTheme.page.margin;

    let y =
        PdfTheme.page.height -
        margin;

    PdfDrawing.text(page,{

        text:"CareVR",

        x:margin,

        y,

        size:PdfTheme.typography.reportTitle,

        font:boldFont,

        color:rgb(
            0.15,
            0.39,
            0.92
        )

    });

    y -= PdfTheme.header.titleGap;

    PdfDrawing.text(page,{

        text:"Clinical Trends Report",

        x:margin,

        y,

        size:16,

        font:boldFont,

        color:rgb(
            0.10,
            0.13,
            0.18
        )

    });

    y -= 24;

    if (patientName) {

        PdfDrawing.text(page,{
            text:`Patient : ${patientName}`,
            x:margin,
            y,
            size:11,
            font:regularFont
        });

        y -= 15;

        PdfDrawing.text(page,{
            text:`Age : ${age ?? "-"}    Sex : ${sex ?? "-"}`,
            x:margin,
            y,
            size:11,
            font:regularFont
        });

        y -= 15;

        PdfDrawing.text(page,{
            text:`Consultant : ${doctorName ?? "-"}`,
            x:margin,
            y,
            size:11,
            font:regularFont
        });

        y -= 15;

        PdfDrawing.text(page,{
            text:`Hospital : ${hospitalName ?? "-"}`,
            x:margin,
            y,
            size:11,
            font:regularFont
        });

        if (reportPeriod) {

            y -= 15;

            PdfDrawing.text(page,{
                text:`Report Period : ${reportPeriod}`,
                x:margin,
                y,
                size:11,
                font:regularFont
            });

        }

        y -= 20;
    }

    PdfDrawing.text(page,{

        text:`Generated On : ${generatedOn.toLocaleString()}`,

        x:margin,

        y,

        size:PdfTheme.typography.body,

        font:regularFont,

        color:rgb(
            0.45,
            0.50,
            0.58
        )

    });

    y -= PdfTheme.header.dividerGap;

    PdfDrawing.divider(page,{

        x:margin,

        y,

        width:PdfTheme.page.contentWidth

    });

}

}