import {
  PDFDocument,
  PDFPage,
  PDFFont,
  StandardFonts,
  rgb,
} from "pdf-lib";

import { DailyCarePdfRequest } from "./PdfModels";

import { formatRecordedDate } from "@/lib/utils/displayFormatter";

export class DailyCarePdfGenerator {

  static async generate(
    request: DailyCarePdfRequest
  ): Promise<Uint8Array> {

    const pdf = await PDFDocument.create();

    let page = pdf.addPage([595, 842]);

    const titleFont =
      await pdf.embedFont(StandardFonts.HelveticaBold);

    const normalFont =
      await pdf.embedFont(StandardFonts.Helvetica);

    page.drawText("CareVR", {
      x: 50,
      y: 790,
      size: 24,
      font: titleFont,
      color: rgb(0.12, 0.30, 0.80),
    });

    page.drawText(

      request.reportType === "self"
        ? "Self Daily Care Report"
        : "Family Daily Care Report",

      {
        x: 50,
        y: 760,
        size: 18,
        font: titleFont,
      }

    );

    page.drawLine({

      start: { x: 50, y: 748 },

      end: { x: 545, y: 748 },

      thickness: 1,

      color: rgb(0.8, 0.8, 0.8),

    });

 page.drawText(

  "This report summarizes the observations recorded during the selected assessment.",

  {

    x: 50,

    y: 725,

    size: 11,

    font: normalFont,

  }

);

//--------------------------------------------------
// Patient Summary
//--------------------------------------------------

page.drawText(

  "Patient Summary",

  {

    x: 50,

    y: 680,

    size: 16,

    font: titleFont,

  }

);

page.drawLine({

  start: { x: 50, y: 670 },

  end: { x: 545, y: 670 },

  thickness: 0.5,

  color: rgb(0.85, 0.85, 0.85),

});

page.drawText(

  `Patient : ${request.patientName}`,

  {

    x: 60,

    y: 645,

    size: 12,

    font: normalFont,

  }

);

page.drawText(

  `Age : ${request.age ?? "Not Available"}${
    request.age !== null ? " Years" : ""
  }`,

  {

    x: 320,

    y: 645,

    size: 12,

    font: normalFont,

  }

);

page.drawText(

  `Recorded On : ${formatRecordedDate(request.record.recordedAt)}`,

  {

    x: 60,

    y: 620,

    size: 12,

    font: normalFont,

  }

);

//--------------------------------------------------
// Vital Signs
//--------------------------------------------------

page.drawText(

  "Vital Signs",

  {

    x: 50,

    y: 575,

    size: 16,

    font: titleFont,

  }

);

page.drawLine({

  start: { x: 50, y: 565 },

  end: { x: 545, y: 565 },

  thickness: 0.5,

  color: rgb(0.85, 0.85, 0.85),

});

page.drawText(

  `Temperature : ${
    request.record.temperature !== null
      ? `${request.record.temperature}°${request.record.temperatureUnit}`
      : "Not Recorded"
  }`,

  {

    x: 60,

    y: 540,

    size: 12,

    font: normalFont,

  }

);

page.drawText(

  `Blood Pressure : ${
    request.record.systolic !== null &&
    request.record.diastolic !== null
      ? `${request.record.systolic}/${request.record.diastolic}`
      : "Not Recorded"
  }`,

  {

    x: 320,

    y: 540,

    size: 12,

    font: normalFont,

  }

);

page.drawText(

  `Pulse : ${
    request.record.pulse !== null
      ? `${request.record.pulse} bpm`
      : "Not Recorded"
  }`,

  {

    x: 60,

    y: 515,

    size: 12,

    font: normalFont,

  }

);

page.drawText(

  `SpO2 : ${
    request.record.spo2 !== null
      ? `${request.record.spo2}%`
      : "Not Recorded"
  }`,

  {

    x: 320,

    y: 515,

    size: 12,

    font: normalFont,

  }

);

//--------------------------------------------------
// Observation Summary
//--------------------------------------------------

page.drawText(

  "Observation Summary",

  {

    x: 50,

    y: 465,

    size: 16,

    font: titleFont,

  }

);

page.drawLine({

  start: { x: 50, y: 455 },

  end: { x: 545, y: 455 },

  thickness: 0.5,

  color: rgb(0.85,0.85,0.85),

});

page.drawText(

  "The following is a summary based on the observations recorded during this assessment.",

  {

    x: 60,

    y: 430,

    size: 11,

    font: normalFont,

  }

);

//--------------------------------------------------
// Observation Summary Content
//--------------------------------------------------

let currentY = 395;

//--------------------------------------------------
// Normal Observations
//--------------------------------------------------

if (request.observationSummary.normalFindings.length > 0) {

  page.drawText(
    "Normal Observations",
    {
      x: 60,
      y: currentY,
      size: 13,
      font: titleFont,
      color: rgb(0.00, 0.45, 0.00),
    }
  );

  currentY -= 22;

  request.observationSummary.normalFindings.forEach((finding) => {

    page.drawText(
      `• ${finding.description}`,
      {
        x: 75,
        y: currentY,
        size: 11,
        font: normalFont,
      }
    );

    currentY -= 18;

  });

  currentY -= 10;

}

//--------------------------------------------------
// Reported Observations
//--------------------------------------------------

if (request.observationSummary.attentionFindings.length > 0) {

  page.drawText(
    "Reported Observations",
    {
      x: 60,
      y: currentY,
      size: 13,
      font: titleFont,
    }
  );

  currentY -= 22;

  request.observationSummary.attentionFindings.forEach((finding) => {

    page.drawText(
      `• ${finding.description}`,
      {
        x: 75,
        y: currentY,
        size: 11,
        font: normalFont,
      }
    );

    currentY -= 18;

  });

  currentY -= 10;

}

//--------------------------------------------------
// Additional Notes
//--------------------------------------------------

if (request.observationSummary.missingFindings.length > 0) {

  page.drawText(
    "Additional Notes",
    {
      x: 60,
      y: currentY,
      size: 13,
      font: titleFont,
    }
  );

  currentY -= 22;

  request.observationSummary.missingFindings.forEach((finding) => {

    page.drawText(
      `• ${finding.description}`,
      {
        x: 75,
        y: currentY,
        size: 11,
        font: normalFont,
      }
    );

    currentY -= 18;

  });

}

//--------------------------------------------------
// Page 2
//--------------------------------------------------

page = pdf.addPage([595, 842]);

currentY = 780;

//--------------------------------------------------
// Symptoms & Pain
//--------------------------------------------------


page.drawText(

  "Symptoms & Pain",

  {

    x: 50,

    y: currentY,

    size: 16,

    font: titleFont,

  }

);

currentY -= 10;

page.drawLine({

  start: { x: 50, y: currentY },

  end: { x: 545, y: currentY },

  thickness: 0.5,

  color: rgb(0.85,0.85,0.85),

});

currentY -= 30;

page.drawText(

  "Symptoms",

  {

    x: 60,

    y: currentY,

    size: 12,

    font: titleFont,

  }

);

page.drawText(

  request.record.symptoms.length > 0
  ? request.record.symptoms
      .map(
        symptom =>
          symptom
            .replace(/_/g, " ")
            .toLowerCase()
            .replace(
              /\b\w/g,
              c => c.toUpperCase()
            )
      )
      .join(", ")
  : "Not Recorded",

  {

    x: 190,

    y: currentY,

    size: 12,

    font: normalFont,

  }

);

currentY -= 25;

page.drawText(

  "Pain Locations",

  {

    x: 60,

    y: currentY,

    size: 12,

    font: titleFont,

  }

);

page.drawText(

  request.record.painLocations.length > 0
  ? request.record.painLocations
      .map(
        location =>
          location
            .replace(/_/g, " ")
            .toLowerCase()
            .replace(
              /\b\w/g,
              c => c.toUpperCase()
            )
      )
      .join(", ")
  : "Not Recorded",

  {

    x: 190,

    y: currentY,

    size: 12,

    font: normalFont,

  }

);

currentY -= 35;

//--------------------------------------------------
// Clinical Notes
//--------------------------------------------------

page.drawText(

  "Clinical Notes",

  {

    x: 50,

    y: currentY,

    size: 16,

    font: titleFont,

  }

);

currentY -= 10;

page.drawLine({

  start: { x: 50, y: currentY },

  end: { x: 545, y: currentY },

  thickness: 0.5,

  color: rgb(0.85,0.85,0.85),

});

currentY -= 30;

page.drawText(

  request.record.notes?.trim().length
    ? request.record.notes
    : "No clinical notes were recorded.",

  {

    x: 60,

    y: currentY,

    size: 11,

    font: normalFont,

    maxWidth: 470,

    lineHeight: 16,

  }

);

currentY -= 50;

//--------------------------------------------------
// Disclaimer
//--------------------------------------------------

page.drawLine({

  start: { x: 50, y: currentY },

  end: { x: 545, y: currentY },

  thickness: 0.5,

  color: rgb(0.85,0.85,0.85),

});

currentY -= 25;

page.drawText(

  "Disclaimer",

  {

    x: 50,

    y: currentY,

    size: 13,

    font: titleFont,

  }

);

currentY -= 22;

page.drawText(

  "This report summarizes information recorded during the daily care assessment. It is intended to support communication between the individual, caregivers and healthcare professionals. It should not be used as a substitute for professional medical advice, diagnosis or treatment.",

  {

    x: 60,

    y: currentY,

    size: 9,

    font: normalFont,

    maxWidth: 470,

    lineHeight: 14,

  }

);

return await pdf.save();

  }

  static async download(
    request: DailyCarePdfRequest,
    fileName: string
  ): Promise<void> {

    const pdfBytes =
      await this.generate(request);

    // Create a fresh Uint8Array backed by a standard ArrayBuffer.
    const bytes =
      new Uint8Array(pdfBytes);

    const blob = new Blob(
      [bytes],
      {
        type: "application/pdf",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download = fileName;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

  }

}