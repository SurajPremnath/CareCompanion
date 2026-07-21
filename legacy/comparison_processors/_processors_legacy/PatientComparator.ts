import type { ConsultationRecord } from "@/lib/medication";

import type { ComparisonDifference } from "../comparisonTypes";

import { BaseComparator } from "./BaseComparator";
import type { ComparisonProcessor } from "./ComparisonProcessor";

export class PatientComparator
  extends BaseComparator
  implements ComparisonProcessor
{
  compare(
    previous: ConsultationRecord,
    current: ConsultationRecord,
  ): ComparisonDifference[] {
    const differences: ComparisonDifference[] = [];

    const previousPatient = previous.patient;
    const currentPatient = current.patient;

    if (
      !this.same(
        previousPatient.uhid,
        currentPatient.uhid,
      )
    ) {
      differences.push(
        this.difference(
          "patient",
          "uhid",
          "UHID",
          previousPatient.uhid,
          currentPatient.uhid,
          "modified",
          "major",
          "high",
          "Patient identifier changed.",
        ),
      );
    }

    if (
      !this.same(
        previousPatient.patientName,
        currentPatient.patientName,
      )
    ) {
      differences.push(
        this.difference(
          "patient",
          "patientName",
          "Patient Name",
          previousPatient.patientName,
          currentPatient.patientName,
          "modified",
          "minor",
          "high",
          "Patient name changed.",
        ),
      );
    }

    if (
      !this.same(
        previousPatient.age,
        currentPatient.age,
      )
    ) {
      differences.push(
        this.difference(
          "patient",
          "age",
          "Age",
          previousPatient.age,
          currentPatient.age,
          "modified",
          "informational",
          "high",
          "Patient age changed.",
        ),
      );
    }

    if (
      !this.same(
        previousPatient.gender,
        currentPatient.gender,
      )
    ) {
      differences.push(
        this.difference(
          "patient",
          "gender",
          "Gender",
          previousPatient.gender,
          currentPatient.gender,
          "modified",
          "major",
          "high",
          "Patient gender changed.",
        ),
      );
    }

    return differences;
  }
}