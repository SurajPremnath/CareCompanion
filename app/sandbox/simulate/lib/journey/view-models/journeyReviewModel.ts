import {
  JourneyAction,
  DetectedChange,
} from "../journeyAnalysisModels";

import {
  JourneyStatus,
} from "../journeyTypes";

import {
  JourneyContextView,
} from "./journeyContextView";

import {
  ActiveTreatmentView,
} from "./activeTreatmentView";

import {
  QuestionView,
} from "./questionView";

import {
  JourneySummaryView,
} from "./summaryItemView";

import {
  TimelineEventView,
} from "./timelineEventView";

import {
  TreatmentDecisionView,
} from "./treatmentDecisionView";

export interface JourneyReviewModel {
  context: JourneyContextView;

  summary: JourneySummaryView;

  detectedChanges: DetectedChange[];

  questions: QuestionView[];

  treatmentDecision: TreatmentDecisionView;

  activeTreatment: ActiveTreatmentView;

  timelineEvents: TimelineEventView[];

  confidence: number;

  status: JourneyStatus;

  readyToPersist: boolean;

  requiresReview: boolean;

  actions: JourneyAction[];
}