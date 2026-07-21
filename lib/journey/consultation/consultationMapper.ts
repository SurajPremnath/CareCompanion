import type { ConsultationRecord } from "@/lib/medication";

import {
  ConsultationMatch,
  ConsultationMatchConfidence,
  ConsultationResolutionResult,
  ResolvedConsultation,
} from "./consultationTypes";

export class ConsultationMapper {

  map(
    resolution: ConsultationResolutionResult
  ): ResolvedConsultation {

    return {
      consultation: this.clone(
        resolution.consultation
      ),

      status: resolution.status,

      previousConsultationId:
        resolution.matchedConsultation?.consultationId,

      confidence:
        resolution.confidence
    };
  }

  clone(
    consultation: ConsultationRecord
  ): ConsultationRecord {

    if (typeof structuredClone === "function") {
      return structuredClone(consultation);
    }

    return JSON.parse(
      JSON.stringify(consultation)
    );
  }

  toSummary(
    consultation: ConsultationRecord
  ) {

    const data = consultation as any;

    return {

      consultationId:
        data.consultationId ??
        data.id,

      consultationDate:
        data.consultation?.consultationDate,

      doctorName:
        data.consultation?.doctorName,

      hospitalName:
        data.consultation?.hospitalName,

      consultationMode:
        data.consultation?.consultationMode,

      diagnosisCount:
        Array.isArray(data.assessments)
          ? data.assessments.length
          : 0,

      medicationCount:
        Array.isArray(data.medicines)
          ? data.medicines.length
          : 0,

      investigationCount:
        Array.isArray(data.investigations)
          ? data.investigations.length
          : 0,

      complaintCount:
        Array.isArray(data.complaints)
          ? data.complaints.length
          : 0
    };
  }

  mapMatch(
    match?: ConsultationMatch
  ) {

    if (!match) {
      return undefined;
    }

    return {

      consultationId:
        match.consultationId,

      confidence:
        match.confidence,

      score:
        match.score,

      reasons:
        [...match.reasons]
    };
  }

  confidenceWeight(
    confidence?: ConsultationMatchConfidence
  ): number {

    switch (confidence) {

      case "high":
        return 1.0;

      case "medium":
        return 0.75;

      case "low":
        return 0.50;

      default:
        return 0;
    }
  }
}