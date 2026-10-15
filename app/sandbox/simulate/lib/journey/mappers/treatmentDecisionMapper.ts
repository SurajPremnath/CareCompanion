import {
  TreatmentDecision,
} from "../journeyAnalysisModels";

import {
  TreatmentDecisionView,
} from "../view-models";

/**
 * Maps the Journey Engine TreatmentDecision
 * into the Journey Review presentation model.
 */
export function mapTreatmentDecision(
  decision: TreatmentDecision,
): TreatmentDecisionView {
  return {
    decision: formatDecision(
      decision.status,
    ),

    activeDoctor:
      decision.activeTreatment.doctorName,

    activeHospital:
      decision.activeTreatment.hospitalName,

    reason:
      decision.recommendations[0]?.reason,

    notes:
      decision.activeTreatment.notes?.join(
        "\n",
      ),

    recommendations:
      decision.recommendations,

    archived: false,
  };
}

/**
 * Converts enum values into
 * human readable labels.
 */
function formatDecision(
  status: string,
): string {
  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(
      /\b\w/g,
      c => c.toUpperCase(),
    );
}