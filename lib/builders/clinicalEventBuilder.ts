import type { DailyCare } from "@/lib/types/dailyCare";

import {
  ClinicalEventType,
  CreateClinicalEventRequest,
} from "@/lib/types/clinicalEvent";

export class ClinicalEventBuilder {

  //------------------------------------------------------------
  // Daily Care -> Clinical Event
  //------------------------------------------------------------

  static fromDailyCare(
    dailyCare: DailyCare
  ): CreateClinicalEventRequest {

    const summary: string[] = [];

    if (dailyCare.temperature !== null) {
      summary.push(
        `Temp ${dailyCare.temperature}°${dailyCare.temperatureUnit}`
      );
    }

    if (
      dailyCare.systolic !== null &&
      dailyCare.diastolic !== null
    ) {
      summary.push(
        `BP ${dailyCare.systolic}/${dailyCare.diastolic}`
      );
    }

    if (dailyCare.pulse !== null) {
      summary.push(
        `Pulse ${dailyCare.pulse}`
      );
    }

    if (dailyCare.spo2 !== null) {
      summary.push(
        `SpO₂ ${dailyCare.spo2}%`
      );
    }

    if (dailyCare.symptoms.length > 0) {
      summary.push(
        `${dailyCare.symptoms.length} symptom(s)`
      );
    }

    return {

      userId: dailyCare.userId,

      patientId: dailyCare.patientId,

      eventType:
        ClinicalEventType.DAILY_CARE,

      sourceTable: "daily_care",

      sourceId: dailyCare.id,

      eventDate: dailyCare.recordedAt,

      title: "Daily Care",

      summary:
        summary.length > 0
          ? summary.join(" • ")
          : "Daily care recorded"

    };

  }

}