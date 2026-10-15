// ==========================================================
// CareVR
// Temperature Analyzer
// ==========================================================

import type {
  ClinicalFinding,
  ClinicalSummaryInput,
} from "./ClinicalSummaryTypes";

export class TemperatureAnalyzer {

  //----------------------------------------------------------
  // Analyze Temperature
  //----------------------------------------------------------

  static analyze(
    record: ClinicalSummaryInput
  ): ClinicalFinding[] {

    const findings: ClinicalFinding[] = [];

    if (record.temperature == null) {

      findings.push({

        category: "Temperature",

        severity: "attention",

        title: "Temperature Not Recorded",

        description:
          "Body temperature was not recorded.",

      });

      return findings;

    }

    let temperature =
      record.temperature;

    //----------------------------------------------------------
    // Convert Fahrenheit to Celsius
    //----------------------------------------------------------

    if (
      record.temperatureUnit === "F"
    ) {

      temperature =
        (temperature - 32) * 5 / 9;

    }

    //----------------------------------------------------------
    // Clinical Rules
    //----------------------------------------------------------

    if (temperature >= 39) {

      findings.push({

        category: "Temperature",

        severity: "critical",

        title: "High Fever",

        description:
          "High fever detected.",

      });

    }

    else if (temperature >= 38) {

      findings.push({

        category: "Temperature",

        severity: "warning",

        title: "Fever",

        description:
          "Fever is present.",

      });

    }

    else if (temperature >= 37.5) {

      findings.push({

        category: "Temperature",

        severity: "attention",

        title: "Mild Temperature Elevation",

        description:
          "Temperature is mildly elevated.",

      });

    }

    else {

      findings.push({

        category: "Temperature",

        severity: "normal",

        title: "Temperature Normal",

        description:
          "Temperature is within the normal range.",

      });

    }

    return findings;

  }

}