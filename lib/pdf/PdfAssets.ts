import { PDFDocument, PDFImage } from "pdf-lib";

export class PdfAssets {

    static async loadLogo(pdf: PDFDocument): Promise<PDFImage> {

        const bytes = await fetch("/images/carevr-logo-right.png")
            .then(r => r.arrayBuffer());

        return await pdf.embedPng(bytes);

    }

}