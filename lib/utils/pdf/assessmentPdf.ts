import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function downloadAssessmentPdf(

  reportElement: HTMLDivElement,

  patientName: string

): Promise<void> {
const canvas = await html2canvas(
  reportElement,
  {
    scale: 1,
    useCORS: true,
    scrollY: -window.scrollY,
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const pdfWidth = 210;
  const pdfHeight = 297;

  const imgWidth = pdfWidth;
  const imgHeight =
    (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(
    imgData,
    "PNG",
    0,
    position,
    imgWidth,
    imgHeight
  );

  heightLeft -= pdfHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;

    pdf.addPage();

    pdf.addImage(
      imgData,
      "PNG",
      0,
      position,
      imgWidth,
      imgHeight
    );

    heightLeft -= pdfHeight;
  }

  const patient =
    patientName.replace(/\s+/g, "_") ||
    "Patient";

  const today = new Date()
    .toISOString()
    .split("T")[0];

/*
  PHASE 3 PDF ENHANCEMENT

  Disabled for now because the report is generated
  as a single image via html2canvas.

  Adding page footers here causes overlap with
  report content when the image spans multiple pages.

  Re-enable after migrating to a fully programmatic
  jsPDF layout with controlled page breaks.

const totalPages = pdf.getNumberOfPages();

for (let i = 1; i <= totalPages; i++) {
  pdf.setPage(i);

  pdf.setFontSize(9);
  pdf.setTextColor(120);

  pdf.text(
    "Created by Suraj Premnath",
    105,
    287,
    { align: "center" }
  );

  pdf.text(
    `© ${new Date().getFullYear()} CareVR. All Rights Reserved.`,
    105,
    292,
    { align: "center" }
  );

  pdf.text(
    `Page ${i} of ${totalPages}`,
    190,
    292
  );
}
*/

pdf.save(
  `CareVR_Report_${patient}_${today}.pdf`
);
}
