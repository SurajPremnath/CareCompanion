import type { ConsultationRecord } from "@/lib/medication";

import {
  ConsultationMatch,
  ConsultationMatchConfidence,
  ConsultationResolutionRequest,
  ConsultationResolutionResult,
  ConsultationStatus,
} from "./consultationTypes";

export class ConsultationResolver {
  resolve(
    request: ConsultationResolutionRequest
  ): ConsultationResolutionResult {

    const current = request.consultation;

    const existing = request.existingConsultations ?? [];

    if (existing.length === 0) {
      return {
        consultation: current,
        status: "new",
        confidence: "high",
        reasons: [
          "No previous consultations found."
        ]
      };
    }

    const match = this.findBestMatch(
      current,
      existing
    );

    if (!match) {
      return {
        consultation: current,
        status: "new",
        confidence: "medium",
        reasons: [
          "No matching consultation found."
        ]
      };
    }

    return {
      consultation: current,
      status: this.determineStatus(match),
      matchedConsultation: match,
      confidence: match.confidence,
      reasons: match.reasons
    };
  }

  private findBestMatch(
    current: ConsultationRecord,
    consultations: ConsultationRecord[]
  ): ConsultationMatch | undefined {

    let bestMatch: ConsultationMatch | undefined;

    let highestScore = 0;

    for (const consultation of consultations) {

      const score = this.calculateScore(
        current,
        consultation
      );

      if (score <= highestScore) {
        continue;
      }

      highestScore = score;

      bestMatch = {
        consultationId:
          this.consultationId(consultation),

        score,

        confidence:
          this.confidence(score),

        reasons: this.reasons(score)
      };
    }

    return bestMatch;
  }

  private calculateScore(
    current: ConsultationRecord,
    previous: ConsultationRecord
  ): number {

    let score = 0;

    if (
      this.same(
        this.patientId(current),
        this.patientId(previous)
      )
    ) {
      score += 50;
    }

    if (
      this.same(
        this.doctor(current),
        this.doctor(previous)
      )
    ) {
      score += 20;
    }

    if (
      this.same(
        this.hospital(current),
        this.hospital(previous)
      )
    ) {
      score += 20;
    }

    if (
      this.same(
        this.consultationMode(current),
        this.consultationMode(previous)
      )
    ) {
      score += 10;
    }

    return score;
  }

  private determineStatus(
    match: ConsultationMatch
  ): ConsultationStatus {

    if (match.score >= 90) {
      return "duplicate";
    }

    if (match.score >= 60) {
      return "follow-up";
    }

    return "updated";
  }

  private confidence(
    score: number
  ): ConsultationMatchConfidence {

    if (score >= 90) {
      return "high";
    }

    if (score >= 60) {
      return "medium";
    }

    return "low";
  }

  private reasons(
    score: number
  ): string[] {

    if (score >= 90) {
      return ["Strong consultation match."];
    }

    if (score >= 60) {
      return ["Likely follow-up consultation."];
    }

    return ["Weak consultation match."];
  }

  private consultationId(
    consultation: ConsultationRecord
  ): string {

    const data = consultation as any;

    return (
      data.consultationId ??
      data.id ??
      crypto.randomUUID()
    );
  }

  private patientId(
    consultation: ConsultationRecord
  ): string {

    return (consultation as any).patient?.uhid ?? "";
  }

  private doctor(
    consultation: ConsultationRecord
  ): string {

    return (
      (consultation as any).consultation?.doctorName ??
      ""
    );
  }

  private hospital(
    consultation: ConsultationRecord
  ): string {

    return (
      (consultation as any).consultation?.hospitalName ??
      ""
    );
  }

  private consultationMode(
    consultation: ConsultationRecord
  ): string {

    return (
      (consultation as any).consultation?.consultationMode ??
      ""
    );
  }

  private same(
    left?: string,
    right?: string
  ): boolean {

    return (
      (left ?? "").trim().toLowerCase() ===
      (right ?? "").trim().toLowerCase()
    );
  }
}