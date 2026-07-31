import {
    PDFPage,
    PDFFont,
    PDFImage,
    rgb
} from "pdf-lib";

import { PdfTheme } from "./PdfTheme";

export interface PdfHeaderOptions {

    page: PDFPage;

    boldFont: PDFFont;

    regularFont: PDFFont;

logoImage?: PDFImage;

    reportTitle: string;

    patientName?: string;

    age?: string;

    sex?: string;

    reportPeriod?: string;

    generatedOn: Date;
}

export class PdfHeader {

    static draw(
        options: PdfHeaderOptions
    ): number {

        const {
            page,
            boldFont,
            regularFont,
logoImage,
            reportTitle,
            patientName,
            age,
            sex,
            reportPeriod,
            generatedOn
        } = options;

        const left = PdfTheme.page.margin;
        const right = PdfTheme.page.width - PdfTheme.page.margin;

        let y = 805;

//
// CAREVR BRAND
//

if (logoImage) {

const logoScale = 0.12;

const logoSize =
    logoImage.scale(logoScale);

page.drawImage(logoImage, {

    x: left,

    y: y - logoSize.height,

    width: logoSize.width,

    height: logoSize.height

});

y -= logoSize.height + 8;

}


        //
        // REPORT TITLE
        //

        y -= 30;

        page.drawText(

            reportTitle,

            {

                x:left,

                y,

                size:20,

                font:boldFont,

                color:rgb(0.15,0.15,0.15)

            }

        );

        //
        // DIVIDER
        //

        y -= 16;

        page.drawLine({

            start:{x:left,y},

            end:{x:right,y},

            thickness:1,

            color:rgb(0.88,0.88,0.88)

        });

        //
        // PATIENT DETAILS
        //

        y -= 22;

        page.drawText(

            `Patient Name : ${patientName ?? "-"}`,

            {

                x:left,

                y,

                size:10,

                font:regularFont

            }

        );

        page.drawText(

            `Generated On : ${generatedOn.toLocaleDateString("en-GB")}`,

            {

                x:340,

                y,

                size:10,

                font:regularFont

            }

        );

        y -= 18;

        page.drawText(

            `Age / Gender : ${age ?? "-"} / ${sex ?? "-"}`,

            {

                x:left,

                y,

                size:10,

                font:regularFont

            }

        );

        page.drawText(

            `Generated Time : ${generatedOn.toLocaleTimeString("en-GB")}`,

            {

                x:340,

                y,

                size:10,

                font:regularFont

            }

        );

y -= 8;
        //
        // END DIVIDER
        //

        y -= 18;

        page.drawLine({

            start:{x:left,y},

            end:{x:right,y},

            thickness:0.8,

            color:rgb(0.88,0.88,0.88)

        });

        //
        // BODY STARTS HERE
        //

        return y - 20;

    }

}