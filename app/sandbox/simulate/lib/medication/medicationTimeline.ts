/**
 * ============================================================
 * CAREVR Medication Timeline
 * ============================================================
 * Timeline builder for medication history.
 * Pure business logic.
 * ============================================================
 */

import { ConsultationMetadata } from "./consultationTypes";
import { Medicine } from "./medicationTypes";

export enum MedicationTimelineEventType {
  CONSULTATION = "CONSULTATION",
  MEDICATION_STARTED = "MEDICATION_STARTED",
  MEDICATION_STOPPED = "MEDICATION_STOPPED",
  MEDICATION_UPDATED = "MEDICATION_UPDATED",
}

export interface MedicationTimelineEvent {
  id: string;

  patientId: string;

  consultationId: string;

  eventDate: string;

  eventType: MedicationTimelineEventType;

  title: string;

  description: string;

  medicines: Medicine[];

  consultation?: ConsultationMetadata;
}

export class MedicationTimeline {
  /**
   * Creates a consultation timeline event.
   */
  static consultation(
    consultation: ConsultationMetadata,
    medicines: Medicine[]
  ): MedicationTimelineEvent {
    return {
      id: crypto.randomUUID(),

      patientId: consultation.patientId,

      consultationId: consultation.consultationId,

      eventDate: consultation.consultationDate,

      eventType: MedicationTimelineEventType.CONSULTATION,

      title: "Consultation",

      description: this.buildConsultationDescription(
        consultation,
        medicines.length
      ),

      medicines,

      consultation,
    };
  }

  /**
   * Sorts timeline chronologically.
   */
  static sort(
    events: MedicationTimelineEvent[]
  ): MedicationTimelineEvent[] {
    return [...events].sort(
      (a, b) =>
        new Date(a.eventDate).getTime() -
        new Date(b.eventDate).getTime()
    );
  }

  /**
   * Latest event.
   */
  static latest(
    events: MedicationTimelineEvent[]
  ): MedicationTimelineEvent | undefined {
    return this.sort(events).at(-1);
  }

  /**
   * Events for patient.
   */
  static byPatient(
    events: MedicationTimelineEvent[],
    patientId: string
  ): MedicationTimelineEvent[] {
    return events.filter(
      (event) => event.patientId === patientId
    );
  }

  /**
   * Events for consultation.
   */
  static byConsultation(
    events: MedicationTimelineEvent[],
    consultationId: string
  ): MedicationTimelineEvent[] {
    return events.filter(
      (event) =>
        event.consultationId === consultationId
    );
  }

  /**
   * Build consultation summary.
   */
  private static buildConsultationDescription(
    consultation: ConsultationMetadata,
    medicineCount: number
  ): string {
    const doctor =
      consultation.doctor?.name ?? "Unknown Doctor";

    const hospital =
      consultation.hospitalName ?? "Unknown Hospital";

    return `${medicineCount} medicine(s) prescribed by ${doctor} at ${hospital}.`;
  }
}