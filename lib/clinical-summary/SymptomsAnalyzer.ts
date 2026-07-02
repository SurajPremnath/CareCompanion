// ==========================================================
// CareVR
// Symptoms Analyzer
// ==========================================================

import type {
  ClinicalFinding,
  ClinicalSummaryInput,
} from "./ClinicalSummaryTypes";

export class SymptomsAnalyzer {

  //----------------------------------------------------------
  // Analyze Symptoms
  //----------------------------------------------------------

  static analyze(
    record: ClinicalSummaryInput
  ): ClinicalFinding[] {

    const findings: ClinicalFinding[] = [];

    //----------------------------------------------------------
    // No Symptoms
    //----------------------------------------------------------

    if (record.symptoms.length === 0) {

      findings.push({

        category: "Symptoms",

        severity: "normal",

        title: "No Symptoms Reported",

        description:
          "No symptoms were recorded.",

      });

      return findings;

    }

    //----------------------------------------------------------
    // Critical Symptoms
    //----------------------------------------------------------

    if (
      record.symptoms.includes("BLOOD_IN_COUGH")
    ) {

      findings.push({

        category: "Symptoms",

        severity: "critical",

        title: "Blood in Cough",

        description:
          "Blood in cough has been reported.",

      });

    }

    if (
      record.symptoms.includes("BREATHLESSNESS")
    ) {

      findings.push({

        category: "Symptoms",

        severity: "critical",

        title: "Breathlessness",

        description:
          "Breathlessness has been reported.",

      });

    }

    //----------------------------------------------------------
    // Warning Symptoms
    //----------------------------------------------------------

    if (
      record.symptoms.includes("FEVER")
    ) {

      findings.push({

        category: "Symptoms",

        severity: "warning",

        title: "Fever",

        description:
          "Fever has been reported.",

      });

    }

    if (
      record.symptoms.includes("VOMITING")
    ) {

      findings.push({

        category: "Symptoms",

        severity: "warning",

        title: "Vomiting",

        description:
          "Vomiting has been reported.",

      });

    }

    //----------------------------------------------------------
    // Attention Symptoms
    //----------------------------------------------------------

    const attentionSymptoms = [

      {
        key: "WEAKNESS",
        title: "Weakness",
      },

      {
        key: "BODY_PAIN",
        title: "Body Pain",
      },

      {
        key: "COUGH",
        title: "Cough",
      },

      {
        key: "LOSS_OF_APPETITE",
        title: "Loss of Appetite",
      },

      {
        key: "WALKING_DIFFICULTY",
        title: "Walking Difficulty",
      },

      {
        key: "LOOSE_MOTIONS",
        title: "Loose Motions",
      },

      {
        key: "DRY_MOUTH",
        title: "Dry Mouth",
      },

    ];

    attentionSymptoms.forEach(symptom => {

      if (
        record.symptoms.includes(symptom.key)
      ) {

        findings.push({

          category: "Symptoms",

          severity: "attention",

          title: symptom.title,

          description:
            `${symptom.title} has been reported.`,

        });

      }

    });

    return findings;

  }

}