import type { ConsultationRecord } from "@/lib/medication";

import type { ComparisonDifference } from "../comparisonTypes";

import { BaseComparator } from "./BaseComparator";
import type { ComparisonProcessor } from "./ComparisonProcessor";

export class ConsultationComparator
  extends BaseComparator
  implements ComparisonProcessor
{
  compare(
    previous: ConsultationRecord,
    current: ConsultationRecord,
  ): ComparisonDifference[] {
    const differences: ComparisonDifference[] = [];

    const previousConsultation =
      previous.consultation;

    const currentConsultation =
      current.consultation;

    const fields = [
      {
        field: "doctorName",
        label: "Doctor",
        previous: previousConsultation.doctorName,
        current: currentConsultation.doctorName,
        severity: "major" as const,
      },
      {
        field: "hospitalName",
        label: "Hospital",
        previous:
          previousConsultation.hospitalName,
        current:
          currentConsultation.hospitalName,
        severity: "moderate" as const,
      },
      {
        field: "consultationDate",
        label: "Consultation Date",
        previous:
          previousConsultation.consultationDate,
        current:
          currentConsultation.consultationDate,
        severity: "informational" as const,
      },
      {
        field: "consultationMode",
        label: "Consultation Mode",
        previous:
          previousConsultation.consultationMode,
        current:
          currentConsultation.consultationMode,
        severity: "minor" as const,
      },
    ];

    for (const field of fields) {
      if (
        this.equals(
          field.previous,
          field.current,
        )
      ) {
        continue;
      }

      differences.push(
        this.difference(
          "consultation",
          field.field,
          field.label,
          field.previous,
          field.current,
          "modified",
          field.severity,
          "high",
          `${field.label} changed.`,
        ),
      );
    }

    return differences;
  }
}