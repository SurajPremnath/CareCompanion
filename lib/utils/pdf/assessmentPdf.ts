
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function downloadAssessmentPdf(
  reportElement: HTMLDivElement,
  patientName: string
): Promise<void> {
  const canvas = await html2canvas(reportElement, {
    scale: 1,
    useCORS: true,
    scrollY: -window.scrollY,
    backgroundColor: "#ffffff",
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");

  const pdfWidth = 210;
  const pdfHeight = 297;
  const margin = 10;
  const headerHeight = 22;
  const footerHeight = 16;

  const contentWidth = pdfWidth - margin * 2;
  const contentHeight =
    pdfHeight - margin - headerHeight - footerHeight;

  // Load the existing CareVR logo.
  const logo = new Image();
  logo.src = "/images/CareVR v1.0.png";

  await new Promise<void>((resolve) => {
    logo.onload = () => resolve();
    logo.onerror = () => resolve();
  });

  const logoLoaded = logo.complete && logo.naturalWidth > 0;

  const imgWidth = contentWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  const totalPages = Math.max(
    1,
    Math.ceil(imgHeight / contentHeight)
  );

  for (let page = 0; page < totalPages; page++) {
    if (page > 0) {
      pdf.addPage();
    }

    // Header logo.
    if (logoLoaded) {
const maxLogoWidth = 40;
const maxLogoHeight = 14;

const aspectRatio = logo.naturalWidth / logo.naturalHeight;

const logoWidth = Math.min(
  maxLogoWidth,
  maxLogoHeight * aspectRatio
);

const logoHeight = logoWidth / aspectRatio;

pdf.addImage(
  logo,
  "PNG",
  margin,
  6,
  logoWidth,
  logoHeight
);
    }

    // Header title.
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(13);
    pdf.setTextColor(29, 45, 98);
    pdf.text(
      "Health Assessment Report",
      pdfWidth - margin,
      15,
      { align: "right" }
    );

    pdf.setDrawColor(220, 225, 235);
    pdf.line(
      margin,
      headerHeight + 2,
      pdfWidth - margin,
      headerHeight + 2
    );

    // Report image.
    // Each page displays a vertical slice of the captured report.
    const position =
      margin + headerHeight - page * contentHeight;

    pdf.addImage(
      imgData,
      "PNG",
      margin,
      position,
      imgWidth,
      imgHeight
    );

    // Footer separator.
    pdf.setDrawColor(220, 225, 235);
    pdf.line(
      margin,
      pdfHeight - footerHeight,
      pdfWidth - margin,
      pdfHeight - footerHeight
    );

    // Footer text.
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);

    pdf.text(
      "Created by Linearise AI Labs",
      pdfWidth / 2,
      pdfHeight - 10,
      { align: "center" }
    );

    pdf.text(
      `© ${new Date().getFullYear()} CareVR. All Rights Reserved.`,
      margin,
      pdfHeight - 4
    );

    pdf.text(
      `Page ${page + 1} of ${totalPages}`,
      pdfWidth - margin,
      pdfHeight - 4,
      { align: "right" }
    );
  }

  const patient =
    patientName.replace(/\s+/g, "_") || "Patient";

  const today = new Date()
    .toISOString()
    .split("T")[0];

  pdf.save(`CareVR_Report_${patient}_${today}.pdf`);
}
