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
    decision: treatment.status,
    activeDoctor: treatment.activeTreatment.doctorName,
    activeHospital: treatment.activeTreatment.hospitalName,
    recommendations: treatment.recommendations,
    archived: false,
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