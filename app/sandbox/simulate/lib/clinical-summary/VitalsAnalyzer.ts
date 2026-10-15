// ==========================================================
// CareVR
// Vitals Analyzer
// ==========================================================

import type {
  ClinicalFinding,
  ClinicalSummaryInput,
} from "./ClinicalSummaryTypes";

export class VitalsAnalyzer {

  //----------------------------------------------------------
  // Analyze Vital Signs
  //----------------------------------------------------------

  static analyze(
    record: ClinicalSummaryInput
  ): ClinicalFinding[] {

    const findings: ClinicalFinding[] = [];

    //----------------------------------------------------------
    // Blood Pressure
    //----------------------------------------------------------

    if (
      record.systolic == null ||
      record.diastolic == null
    ) {

      findings.push({
        category: "Blood Pressure",
        severity: "attention",
        title: "Blood Pressure Not Recorded",
        description: "Blood pressure was not recorded.",
      });

    }
    else if (
      record.systolic >= 140 ||
      record.diastolic >= 90
    ) {

      findings.push({
        category: "Blood Pressure",
        severity: "warning",
        title: "High Blood Pressure",
        description: "Blood pressure is elevated.",
      });

    }
    else {

      findings.push({
        category: "Blood Pressure",
        severity: "normal",
        title: "Blood Pressure Normal",
        description: "Blood pressure is within the normal range.",
      });

    }

    //----------------------------------------------------------
    // Pulse
    //----------------------------------------------------------

    if (record.pulse == null) {

      findings.push({
        category: "Pulse",
        severity: "attention",
        title: "Pulse Not Recorded",
        description: "Pulse rate was not recorded.",
      });

    }
    else if (
      record.pulse < 60 ||
      record.pulse > 100
    ) {

      findings.push({
        category: "Pulse",
        severity: "warning",
        title: "Abnormal Pulse",
        description: "Pulse rate is outside the normal range.",
      });

    }
    else {

      findings.push({
        category: "Pulse",
        severity: "normal",
        title: "Pulse Normal",
        description: "Pulse rate is within the normal range.",
      });

    }

    //----------------------------------------------------------
    // Oxygen Saturation
    //----------------------------------------------------------

    if (record.spo2 == null) {

      findings.push({
        category: "SpO₂",
        severity: "attention",
        title: "Oxygen Saturation Not Recorded",
        description: "Oxygen saturation was not recorded.",
      });

    }
    else if (record.spo2 < 92) {

      findings.push({
        category: "SpO₂",
        severity: "critical",
        title: "Low Oxygen Saturation",
        description: "Oxygen saturation is critically low.",
      });

    }
    else if (record.spo2 < 95) {

      findings.push({
        category: "SpO₂",
        severity: "warning",
        title: "Reduced Oxygen Saturation",
        description: "Oxygen saturation is below the normal range.",
      });

    }
    else {

      findings.push({
        category: "SpO₂",
        severity: "normal",
        title: "Oxygen Saturation Normal",
        description: "Oxygen saturation is within the normal range.",
      });

    }

    return findings;

  }

}