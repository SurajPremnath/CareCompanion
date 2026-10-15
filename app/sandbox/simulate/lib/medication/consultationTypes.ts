/**
 * ============================================================
 * CAREVR - Canonical Consultation Domain
 * ============================================================
 * Single source of truth for all consultation metadata.
 * Used by:
 * - Prescription
 * - Journey
 * - Treatment
 * - Prescription AI
 * - Timeline
 * ============================================================
 */

export enum ConsultationMode {
  IN_PERSON = "IN_PERSON",
  VIDEO = "VIDEO",
  PHONE = "PHONE",
  WHATSAPP = "WHATSAPP",
  EMAIL = "EMAIL",
  HOME_VISIT = "HOME_VISIT",
  UNKNOWN = "UNKNOWN",
}

export enum ConsultationSource {
  NEW_PRESCRIPTION = "NEW_PRESCRIPTION",
  FOLLOW_UP = "FOLLOW_UP",
  EMERGENCY = "EMERGENCY",
  MANUAL_ENTRY = "MANUAL_ENTRY",
  AI_EXTRACTION = "AI_EXTRACTION",
  IMPORTED = "IMPORTED",
}

export enum ConsultationStatus {
  DRAFT = "DRAFT",
  REVIEW_PENDING = "REVIEW_PENDING",
  VERIFIED = "VERIFIED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface DoctorInformation {
  id?: string;
  name?: string;
  speciality?: string;
  registrationNumber?: string;
  hospital?: string;
}

export interface ConsultationMetadata {
  consultationId: string;

  patientId: string;

  mode: ConsultationMode;

  source: ConsultationSource;

  status: ConsultationStatus;

  consultationDate: string;

  doctor?: DoctorInformation;

  hospitalName?: string;

  department?: string;

  followUpRecommended?: boolean;

  followUpDate?: string;

  remarks?: string;

  createdAt: string;

  updatedAt: string;
}