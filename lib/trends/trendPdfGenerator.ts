//------------------------------------------------------------
// Imports
//------------------------------------------------------------

import {
  PDFDocument,
  StandardFonts,
  rgb,
  PDFPage,
  PDFFont,
  PDFImage,
} from "pdf-lib";

import type {
  TrendReport,
} from "./trendReport";

import {
  TrendChartConfig,
} from "./trendChartConfig";

//------------------------------------------------------------
// Trend PDF Generator
//------------------------------------------------------------

export class TrendPdfGenerator {

  //----------------------------------------------------------
  // Generate
  //----------------------------------------------------------

  async generate(
    report: TrendReport
  ): Promise<void> {

    //--------------------------------------------------------
    // Create PDF
    //--------------------------------------------------------

    const pdf =
      await PDFDocument.create();

    const page =
      pdf.addPage([595, 842]);


    const font =
      await pdf.embedFont(
        StandardFonts.Helvetica
      );

    //--------------------------------------------------------
    // Build Report
    //--------------------------------------------------------

    this.drawHeader(
      page,
      font
    );

    this.drawPatientInformation(
      page,
      font,
      report
    );

this.drawSummaryStatistics(
  page,
  font,
  report
);

this.drawFooter(
  page,
  font,
  1
);

await this.drawCharts(
  pdf,
  page,
  report
);

    //--------------------------------------------------------
    // Download
    //--------------------------------------------------------

    await this.download(
      pdf
    );

  }

  //----------------------------------------------------------
  // Draw Header
  //----------------------------------------------------------

  private drawHeader(
  page: PDFPage,
  font: PDFFont
): void {

  //--------------------------------------------------------
  // Brand
  //--------------------------------------------------------

  page.drawText(
    "CareVR",
    {
      x: 50,
      y: 805,
      size: 20,
      font,
      color: rgb(0.10, 0.35, 0.70),
    }
  );

page.drawText(
  "Simple Daily Care",
  {
    x: 50,
    y: 790,
    size: 10,
    font,
    color: rgb(0.45, 0.45, 0.45),
  }
);

page.drawText(
  "Better Clinical Conversations",
  {
    x: 50,
    y: 778,
    size: 10,
    font,
    color: rgb(0.45, 0.45, 0.45),
  }
);

  //--------------------------------------------------------
  // Report Title
  //--------------------------------------------------------

  page.drawText(
    "Clinical Trends Report",
    {
      x: 50,
      y: 748,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    }
  );

  //--------------------------------------------------------
  // Divider
  //--------------------------------------------------------

  page.drawLine({
    start: { x: 50, y: 745 },
    end: { x: 545, y: 745 },
    thickness: 1,
    color: rgb(0.85, 0.85, 0.85),
  });

}

  //----------------------------------------------------------
  // Draw Patient Information
  //----------------------------------------------------------

private drawPatientInformation(
  page: PDFPage,
  font: PDFFont,
  report: TrendReport
): void {


page.drawText(
  `Patient Name : ${report.patientName}`,
  {
    x: 50,
    y: 695,
    size: 12,
    font,
  }
);

page.drawText(
  `Report Period : ${report.reportPeriod}`,
  {
    x: 50,
    y: 675,
    size: 12,
    font,
  }
);

//--------------------------------------------------------
// Generated Date & Time
//--------------------------------------------------------

const generatedDate = new Date(report.generatedAt);

const formattedDate =
  generatedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const formattedTime =
  generatedDate.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

page.drawText(
  `Generated On : ${formattedDate}`,
  {
    x: 50,
    y: 655,
    size: 12,
    font,
  }
);

page.drawText(
  `Generated Time : ${formattedTime}`,
  {
    x: 50,
    y: 635,
    size: 12,
    font,
  }
);

page.drawText(
  `Parameters : ${report.selectedParameters.join(", ")}`,
  {
    x: 50,
    y: 615,
    size: 12,
    font,
  }
);

  
}

//----------------------------------------------------------
// Draw Summary Statistics
//----------------------------------------------------------

private drawSummaryStatistics(
  page: PDFPage,
  font: PDFFont,
  report: TrendReport
): void {

  page.drawText(
    "Summary Statistics",
    {
      x: 50,
      y: 550,
      size: 16,
      font,
      color: rgb(0, 0, 0),
    }
  );

  let y = 515;

for (const parameter of report.trend.parameters) {

  if (!parameter.enabled) {
    continue;
  }

  //----------------------------------------------------------
  // Parameter Title
  //----------------------------------------------------------

  const title =
  parameter.parameter === "bloodPressure"
    ? "Blood Pressure (Upper)"
    : TrendChartConfig[
        parameter.parameter
      ].title.replace("₂", "2");

page.drawText(
  title,
    {
      x: 50,
      y,
      size: 13,
      font,
    }
  );

  y -= 20;

  //----------------------------------------------------------
  // Table Layout
  //----------------------------------------------------------

  const startX = 50;
  const tableWidth = 495;
  const rowHeight = 22;

const columnWidth = tableWidth / 4;

const drawCenteredText = (
  text: string,
  column: number,
  y: number,
  size: number
) => {

  const textWidth =
    font.widthOfTextAtSize(
      text,
      size
    );

  page.drawText(
    text,
    {
      x:
        startX +
        column * columnWidth +
        (columnWidth - textWidth) / 2,
      y,
      size,
      font,
    }
  );

};

  const currentX = startX;
  const minimumX = startX + 125;
  const maximumX = startX + 250;
  const averageX = startX + 375;

  // Top Border
  page.drawLine({
    start: { x: startX, y },
    end: { x: startX + tableWidth, y },
    thickness: 0.8,
    color: rgb(0.75, 0.75, 0.75),
  });

//----------------------------------------------------------
// Vertical Column Lines
//----------------------------------------------------------

const tableTop = y;

const tableBottom = y - (rowHeight * 2);

for (let i = 1; i < 4; i++) {

  const x = startX + i * columnWidth;

  page.drawLine({
    start: {
      x,
      y: tableTop,
    },
    end: {
      x,
      y: tableBottom,
    },
    thickness: 0.5,
    color: rgb(0.85, 0.85, 0.85),
  });

}

  y -= rowHeight;

//----------------------------------------------------------
// Header Background
//----------------------------------------------------------

page.drawRectangle({
  x: startX,
  y,
  width: tableWidth,
  height: rowHeight,
  color: rgb(0.94, 0.94, 0.94),
  borderColor: rgb(0.80, 0.80, 0.80),
  borderWidth: 0.5,
});

  //----------------------------------------------------------
  // Header Row
  //----------------------------------------------------------

drawCenteredText(
  "Current",
  0,
  y + 7,
  10
);

drawCenteredText(
  "Minimum",
  1,
  y + 7,
  10
);

drawCenteredText(
  "Maximum",
  2,
  y + 7,
  10
);

drawCenteredText(
  "Average",
  3,
  y + 7,
  10
);

  // Header Bottom Border
  page.drawLine({
    start: { x: startX, y },
    end: { x: startX + tableWidth, y },
    thickness: 0.6,
    color: rgb(0.80, 0.80, 0.80),
  });

  y -= rowHeight;

  //----------------------------------------------------------
  // Values Row
  //----------------------------------------------------------

drawCenteredText(
  `${parameter.statistics.current ?? "-"}`,
  0,
  y + 7,
  11
);

drawCenteredText(
  `${parameter.statistics.minimum ?? "-"}`,
  1,
  y + 7,
  11
);

drawCenteredText(
  `${parameter.statistics.maximum ?? "-"}`,
  2,
  y + 7,
  11
);

drawCenteredText(
  `${parameter.statistics.average ?? "-"}`,
  3,
  y + 7,
  11
);

  //----------------------------------------------------------
  // Bottom Border
  //----------------------------------------------------------

  page.drawLine({
    start: { x: startX, y },
    end: { x: startX + tableWidth, y },
    thickness: 0.8,
    color: rgb(0.75, 0.75, 0.75),
  });

  y -= 34;
}

}

//----------------------------------------------------------
// Draw Charts
//----------------------------------------------------------

private async drawCharts(
  pdf: PDFDocument,
  page: PDFPage,
  report: TrendReport
): Promise<void> {

  if (report.chartImages.length === 0) {
    return;
  }

  //--------------------------------------------------------
  // Create New Page
  //--------------------------------------------------------

  let chartPage =
    pdf.addPage([595, 842]);


  const font =
    await pdf.embedFont(
      StandardFonts.Helvetica
    );

  chartPage.drawText(
    "Clinical Trend Charts",
    {
      x: 50,
      y: 790,
      size: 18,
      font,
      color: rgb(0, 0, 0),
    }
  );

let pageNumber = 2;

this.drawFooter(
  chartPage,
  font,
  pageNumber
);
  //--------------------------------------------------------
  // Starting Position
  //--------------------------------------------------------

  let y = 740;

  //--------------------------------------------------------
  // Draw Charts
  //--------------------------------------------------------

  for (const image of report.chartImages) {

    const embeddedImage =
      await pdf.embedPng(image);

    const scaled =
      embeddedImage.scale(0.45);

    //------------------------------------------------------
    // Create New Page if Required
    //------------------------------------------------------

    if (y - scaled.height < 50) {

      chartPage =
        pdf.addPage([595, 842]);

pageNumber++;

      chartPage.drawText(
        "Clinical Trend Charts (Continued)",
        {
          x: 50,
          y: 790,
          size: 18,
          font,
          color: rgb(0, 0, 0),
        }
      );

this.drawFooter(
  chartPage,
  font,
  pageNumber
);

      y = 740;

    }

    //------------------------------------------------------
    // Draw Image
    //------------------------------------------------------

    chartPage.drawImage(
      embeddedImage,
      {
        x: 50,
        y: y - scaled.height,
        width: scaled.width,
        height: scaled.height,
      }
    );

    y -= scaled.height + 30;

  }

}

//----------------------------------------------------------
// Draw Footer
//----------------------------------------------------------

private drawFooter(
  page: PDFPage,
  font: PDFFont,
  pageNumber: number
): void {

  page.drawLine({
    start: { x: 40, y: 35 },
    end: { x: 555, y: 35 },
    thickness: 0.5,
    color: rgb(0.8, 0.8, 0.8),
  });

page.drawText(
  "Disclaimer: This report is for informational purposes only and is intended to support discussions with healthcare professionals. It is not a medical diagnosis or treatment recommendation.",
  {
    x: 50,
    y: 52,
    size: 9,
    font,
    color: rgb(0.50, 0.50, 0.50),
    maxWidth: 490,
    lineHeight: 9,
  }
);

  page.drawText(
    "Generated by CareVR",
    {
      x: 50,
      y: 18,
      size: 9,
      font,
      color: rgb(0.45, 0.45, 0.45),
    }
  );

  page.drawText(
    "Created by Suraj Premnath",
    {
      x: 215,
      y: 18,
      size: 9,
      font,
      color: rgb(0.45, 0.45, 0.45),
    }
  );

  page.drawText(
    `Page ${pageNumber}`,
    {
      x: 500,
      y: 18,
      size: 9,
      font,
      color: rgb(0.45, 0.45, 0.45),
    }
  );

}

  //----------------------------------------------------------
  // Download
  //----------------------------------------------------------

  private async download(
    pdf: PDFDocument
  ): Promise<void> {

    const bytes =
      await pdf.save();

    const blob =
      new Blob(
        [
          bytes.buffer as ArrayBuffer,
        ],
        {
          type: "application/pdf",
        }
      );

    const url =
      URL.createObjectURL(
        blob
      );

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      "CareVR-Clinical-Trends.pdf";

    link.click();

    URL.revokeObjectURL(
      url
    );

  }

}

export const trendPdfGenerator =
  new TrendPdfGenerator();