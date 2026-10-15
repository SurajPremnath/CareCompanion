import type {
  ConsultationContext,
} from "../journeyAnalysisModels";

import type {
  ConsultationSource,
} from "../journeyTypes";

export interface JourneyContextView {
  patientId: string;

  currentConsultationDate?: string;

  previousConsultationDate?: string;

consultationContext?: ConsultationContext;

consultationSource?: ConsultationSource;

hasPreviousConsultation?: boolean;

isEmergency?: boolean;
}