// lib/journey/journeyRepository.ts

import { JourneyAnalysisResult } from "./journeyModels";
import { JourneyMapper } from "./journeyMapper";
import { JourneyStorage } from "./journeyStorage";

export class JourneyRepository {
  /**
   * ============================================================
   * Save New Journey
   * ============================================================
   */
  static async save(
    analysis: JourneyAnalysisResult,
  ): Promise<JourneyAnalysisResult> {
    const record = JourneyMapper.toPersistence(analysis);

    await JourneyStorage.save(record);

    return analysis;
  }

  /**
   * ============================================================
   * Update Existing Journey
   * ============================================================
   */
  static async update(
    analysis: JourneyAnalysisResult,
  ): Promise<JourneyAnalysisResult> {
    const record = JourneyMapper.toPersistence(analysis);

    await JourneyStorage.update(record);

    return analysis;
  }

  /**
   * ============================================================
   * Archive Journey
   * Keeps complete audit trail.
   * Never physically deletes.
   * ============================================================
   */
  static async archive(
    consultationId: string,
    reason: string,
  ): Promise<void> {
    await JourneyStorage.archive(
      consultationId,
      reason,
    );
  }

  /**
   * ============================================================
   * Find Journey
   * ============================================================
   */
  static async findByConsultationId(
    consultationId: string,
  ): Promise<JourneyAnalysisResult | null> {
    const record =
      await JourneyStorage.findByConsultationId(
        consultationId,
      );

    if (!record) {
      return null;
    }

    return JourneyMapper.fromPersistence(record);
  }

  /**
   * ============================================================
   * Patient Timeline
   * ============================================================
   */
  static async findByPatientId(
    patientId: string,
  ): Promise<JourneyAnalysisResult[]> {
    const records =
      await JourneyStorage.findByPatientId(patientId);

    return records.map(record =>
      JourneyMapper.fromPersistence(record),
    );
  }

  /**
   * ============================================================
   * Latest Journey
   * ============================================================
   */
  static async findLatestByPatientId(
    patientId: string,
  ): Promise<JourneyAnalysisResult | null> {
    const record =
      await JourneyStorage.findLatestByPatientId(
        patientId,
      );

    if (!record) {
      return null;
    }

    return JourneyMapper.fromPersistence(record);
  }

  /**
   * ============================================================
   * Journey Exists
   * ============================================================
   */
  static async exists(
    consultationId: string,
  ): Promise<boolean> {
    return JourneyStorage.exists(
      consultationId,
    );
  }
}