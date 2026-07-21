import {
  JourneyStatus,
  SeverityLevel,
  TimelineEventType,
} from "../journeyTypes";

export interface TimelineEventView {
  id: string;

  eventDate: string;

  eventType: TimelineEventType;

  title: string;

  description?: string;

  subtitle?: string;

  severity?: SeverityLevel;

  status?: JourneyStatus;

  confidence?: number;

  consultationId?: string;

  prescriptionId?: string;

  medicineId?: string;

  investigationId?: string;

  procedureId?: string;

  /**
   * UI compatibility fields
   */
  doctorName?: string;

  hospitalName?: string;

  source?: string;

  highlighted?: boolean;

  color?: string;

  icon?: string;

  metadata?: Record<string, unknown>;
}