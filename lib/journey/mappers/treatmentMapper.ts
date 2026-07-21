import {
  TreatmentDecision,
} from "../journeyAnalysisModels";

import {
  ActiveTreatmentView,
  TreatmentDecisionView,
} from "../view-models";

export function mapTreatmentDecision(
  treatment: TreatmentDecision,
): TreatmentDecisionView {
  return {
    status: treatment.status,
    rationale: treatment.rationale,
    recommendations: treatment.recommendations,
    nextReviewDate: treatment.nextReviewDate,
    archived: treatment.archived,
  };
}

export function mapActiveTreatment(
  treatment: TreatmentDecision,
): ActiveTreatmentView {
  return {
    medicines: treatment.activeTreatment.medicines,
    procedures: treatment.activeTreatment.procedures,
    investigations: treatment.activeTreatment.investigations,
  };
}