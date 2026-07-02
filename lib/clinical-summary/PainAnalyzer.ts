// ==========================================================
// CareVR
// Pain Analyzer
// ==========================================================

import type {
  ClinicalFinding,
  ClinicalSummaryInput,
} from "./ClinicalSummaryTypes";

export class PainAnalyzer {

  //----------------------------------------------------------
  // Analyze Pain
  //----------------------------------------------------------

  static analyze(
    record: ClinicalSummaryInput
  ): ClinicalFinding[] {

    const findings: ClinicalFinding[] = [];

    //----------------------------------------------------------
    // No Pain
    //----------------------------------------------------------

    if (record.painLocations.length === 0) {

      findings.push({

        category: "Pain",

        severity: "normal",

        title: "No Pain Reported",

        description:
          "No pain locations were recorded.",

      });

      return findings;

    }

    //----------------------------------------------------------
    // Pain Reported
    //----------------------------------------------------------

    findings.push({

      category: "Pain",

      severity: "attention",

      title: "Pain Reported",

      description:
        `Pain reported in ${record.painLocations.length} location(s).`,

    });

    //----------------------------------------------------------
    // Individual Pain Locations
    //----------------------------------------------------------

    record.painLocations.forEach(location => {

      findings.push({

        category: "Pain",

        severity: "attention",

        title: location,

        description:
          `${location.replaceAll("_", " ")} pain reported.`,

      });

    });

    return findings;

  }

}