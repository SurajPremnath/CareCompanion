// components/journey-review/JourneyReview.tsx

"use client";

import {
  JourneyAnalysisResult,
} from "@/lib/journey";

import {
  JourneyReviewModel,
} from "@/lib/journey/view-models";

import {
  mapJourneyReview,
} from "@/lib/journey/mappers";

import { JourneyHeader } from "./JourneyHeader";
import { JourneyConfidence } from "./JourneyConfidence";
import { JourneySummaryCard } from "./JourneySummaryCard";
import { JourneyDetectedChanges } from "./JourneyDetectedChanges";
import { JourneyQuestions } from "./JourneyQuestions";
import { TreatmentDecisionCard } from "./TreatmentDecisionCard";
import { ActiveTreatmentCard } from "./ActiveTreatmentCard";
import { JourneyTimeline } from "./JourneyTimeline";
import { JourneyActions } from "./JourneyActions";
import { EmptyJourney } from "./EmptyJourney";
import { LoadingJourney } from "./LoadingJourney";

interface JourneyReviewProps {
    analysis?: JourneyAnalysisResult;
    
    loading?: boolean;

    error?: string;

  onAnswerChange?: (
    questionId: string,
    value: string | string[],
  ) => void;

  onSave?: () => void;

  onEdit?: () => void;

  onArchiveTreatment?: () => void;

  onFinish?: () => void;
}

export function JourneyReview({
  analysis,
  loading = false,
error,
  onAnswerChange,
  onSave,
  onEdit,
  onArchiveTreatment,
  onFinish,
}: JourneyReviewProps) {
if (loading) {
  return <LoadingJourney />;
}

if (error) {
    return (
        <div className="rounded-xl border border-red-200 bg-red-50 p-8">

            <h3 className="text-lg font-semibold text-red-700">
                Journey Processing Failed
            </h3>

            <p className="mt-2 text-sm text-red-600">
                {error}
            </p>

        </div>
    );
}

if (!analysis) {
    return (
        <EmptyJourney
            title="No Journey Available"
            description="Upload a consultation to generate a clinical journey."
        />
    );
}

const review: JourneyReviewModel =
  mapJourneyReview(analysis);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">

      <JourneyHeader
    context={review.context}
/>

      <JourneyConfidence
        confidence={review.confidence}
        status={review.status}
      />

      <JourneySummaryCard
        summary={review.summary}
      />

      <JourneyDetectedChanges
        changes={review.detectedChanges}
      />

      {review.questions?.length > 0 && (
        <JourneyQuestions
          questions={review.questions}
          onAnswerChange={onAnswerChange}
        />
      )}

{review.treatmentDecision && (
  <TreatmentDecisionCard
    decision={review.treatmentDecision}
    onArchive={onArchiveTreatment}
  />
)}

{review.activeTreatment && (
  <ActiveTreatmentCard
    treatment={review.activeTreatment}
  />
)}
      <JourneyTimeline
    events={review.timelineEvents}
/>

<JourneyActions
    actions={review.actions}
    onExecute={(action) => {
        console.log(action);
    }}
/>

    </div>
  );
}
