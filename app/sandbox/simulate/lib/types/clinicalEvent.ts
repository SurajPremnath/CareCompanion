export enum ClinicalEventType {
  DAILY_CARE = "DAILY_CARE",
  SELF_ASSESSMENT = "SELF_ASSESSMENT",
  FAMILY_ASSESSMENT = "FAMILY_ASSESSMENT",
  PRESCRIPTION = "PRESCRIPTION",
}

export interface ClinicalEvent {
  id: string;

  userId: string;

  patientId: string | null;

  eventType: ClinicalEventType;

  sourceTable: string;

  sourceId: string;

  eventDate: string;

  title: string;

  summary: string | null;

  createdAt: string;
}

export interface CreateClinicalEventRequest {

  userId: string;

  patientId: string | null;

  eventType: ClinicalEventType;

  sourceTable: string;

  sourceId: string;

  eventDate: string;

  title: string;

  summary: string | null;

}