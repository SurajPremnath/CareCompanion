import {
  ConsultationSource,
  ConsultationType,
} from "../journeyTypes";

export interface JourneyContextView {
  patientId: string;

  currentConsultationDate?: string;

  previousConsultationDate?: string;

  consultationContext: ConsultationType;

  consultationSource: ConsultationSource;

  hasPreviousConsultation: boolean;

  isEmergency: boolean;
}