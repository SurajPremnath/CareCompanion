// ==========================================================
// CareVR
// Clinical Summary Engine
// ==========================================================

import type {
  ClinicalSummary,
  ClinicalFinding,
  ClinicalRecommendation,
  ClinicalSummaryInput,
  ClinicalSeverity,
} from "./ClinicalSummaryTypes";

import { TemperatureAnalyzer } from "./TemperatureAnalyzer";
import { VitalsAnalyzer } from "./VitalsAnalyzer";
import { SymptomsAnalyzer } from "./SymptomsAnalyzer";
import { PainAnalyzer } from "./PainAnalyzer";	

export class ClinicalSummaryEngine {

  //----------------------------------------------------------
  // Generate Clinical Summary
  //----------------------------------------------------------

static generate(
  record: ClinicalSummaryInput
): ClinicalSummary {

const findings: ClinicalFinding[] = [

  ...TemperatureAnalyzer.analyze(record),

  ...VitalsAnalyzer.analyze(record),

  ...SymptomsAnalyzer.analyze(record),

  ...PainAnalyzer.analyze(record),

];

const recommendations: ClinicalRecommendation[] = [];

  // Prevent unused variable warning.
  void record;

const overallStatus =
  determineOverallStatus(findings);

const normalFindings: ClinicalFinding[] = [];

const normalDescriptions = findings
  .filter(finding => finding.severity === "normal")
  .map(finding => finding.description);

const normalVitals: string[] = [];

if (
  normalDescriptions.some(description =>
    description.includes("Blood pressure")
  )
) {
  normalVitals.push("Blood Pressure");
}

if (
  normalDescriptions.some(description =>
    description.includes("Oxygen saturation")
  )
) {
  normalVitals.push("Oxygen Saturation");
}

if (
  normalDescriptions.some(description =>
    description.includes("Temperature")
  )
) {
  normalVitals.push("Body Temperature");
}

if (
  normalDescriptions.some(description =>
    description.includes("Pulse")
  )
) {
  normalVitals.push("Pulse Rate");
}

if (normalVitals.length > 0) {

  normalFindings.push({

    category: "Vitals",

    severity: "normal",

    title: "Normal Vital Signs",

    description:
      `${normalVitals.join(" and ")} ${
        normalVitals.length > 1 ? "were" : "was"
      } within the normal range.`,

  });

}

if (
  normalDescriptions.some(description =>
    description.includes("No symptoms")
  )
) {

  normalFindings.push({

    category: "Symptoms",

    severity: "normal",

    title: "Symptoms",

    description:
      "No symptoms were reported.",

  });

}

if (
  normalDescriptions.some(description =>
    description.includes("No pain")
  )
) {

  normalFindings.push({

    category: "Pain",

    severity: "normal",

    title: "Pain",

    description:
      "No pain was reported.",

  });

}

const attentionFindings: ClinicalFinding[] = [];

const attentionSource = findings.filter(
  finding =>
    (
      finding.severity === "attention" ||
      finding.severity === "warning" ||
      finding.severity === "critical"
    ) &&
    !finding.title.includes("Not Recorded")
);

//------------------------------------------------------
// Pain Summary
//------------------------------------------------------

const painLocations = attentionSource
  .filter(finding => finding.category === "Pain")
  .filter(
    finding =>
      ![
        "Pain Reported",
        "Body Pain",
      ].includes(finding.title)
  )
  .map(finding =>
    finding.title.toLowerCase().replaceAll("_", " ")
  );

if (painLocations.length > 0) {

  const formattedPainLocations =
    painLocations.map(location => `the ${location}`);

  let painSummary = "";

  if (formattedPainLocations.length === 1) {

    painSummary = formattedPainLocations[0];

  }

  else if (formattedPainLocations.length === 2) {

    painSummary =
      `${formattedPainLocations[0]} and ${formattedPainLocations[1]}`;

  }

  else {

    painSummary =
      `${formattedPainLocations
        .slice(0, -1)
        .join(", ")}, and ${formattedPainLocations.at(-1)}`;

  }

  attentionFindings.push({

    category: "Pain",

    severity: "attention",

    title: "Pain",

    description:
      `Pain was reported involving ${painSummary}.`,

  });

}

//------------------------------------------------------
// Non-Pain Findings
//------------------------------------------------------

attentionSource
  .filter(finding => finding.category !== "Pain")
  .forEach(finding => {

    attentionFindings.push(finding);

  });

const missingFindings =
  findings.filter(
    finding =>
      finding.title.includes("Not Recorded")
  );

let overallAssessment =
  "the patient's condition appears stable.";

if (overallStatus === "attention") {

  overallAssessment =
    "a few observations require attention.";

}

if (overallStatus === "warning") {

  overallAssessment =
    "Closer Monitoring is recommended based on the recorded observations.";

}

if (overallStatus === "critical") {

  overallAssessment =
    "Prompt Medical Review is recommended based on the recorded observations.";

}

return {

  overallAssessment,

  normalFindings,

  attentionFindings,

  missingFindings,

  recommendations,

};

}

}

//----------------------------------------------------------
// Overall Status
//----------------------------------------------------------

function determineOverallStatus(
  findings: ClinicalFinding[]
): ClinicalSeverity {

  if (
    findings.some(
      finding => finding.severity === "critical"
    )
  ) {
    return "critical";
  }

  if (
    findings.some(
      finding => finding.severity === "warning"
    )
  ) {
    return "warning";
  }

  if (
    findings.some(
      finding => finding.severity === "attention"
    )
  ) {
    return "attention";
  }

  return "normal";

}

