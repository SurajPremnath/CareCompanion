// components/journey/JourneyWizard.tsx

"use client";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Sparkles,
  Upload,
} from "lucide-react";

import { useJourney, JourneyStep } from "./JourneyContext";

import {
  JourneyQuestions,
  JourneyReview,
  LoadingJourney,
  EmptyJourney,
} from "../journey-review";

import { TimelinePreview } from "./TimelinePreview";
import { JourneyComplete } from "./JourneyComplete";

interface JourneyWizardProps {
  onUpload?: () => Promise<void>;

  onRunAnalysis?: () => Promise<void>;

  onSave?: () => Promise<void>;
}

export function JourneyWizard({
  onUpload,
  onRunAnalysis,
  onSave,
}: JourneyWizardProps) {
  const {
    state,
    nextStep,
    previousStep,
    goToStep,
  } = useJourney();

  return (
    <div className="mx-auto max-w-7xl space-y-8">

      <WizardStepper
        current={state.step}
      />

      {state.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {state.error}
        </div>
      )}

      {state.step === JourneyStep.UPLOAD && (
        <UploadStep
          onContinue={async () => {
            await onUpload?.();
            nextStep();
          }}
        />
      )}

      {state.step === JourneyStep.ANALYSIS && (
        <AnalysisStep
          loading={state.loading}
          onRun={async () => {
            await onRunAnalysis?.();
            nextStep();
          }}
        />
      )}

      {state.step ===
        JourneyStep.QUESTIONS && (
        <JourneyQuestions
          questions={state.questions}
        />
      )}

      {state.step ===
        JourneyStep.REVIEW && (
        <div className="space-y-6">

          <TimelinePreview
            events={state.timeline}
          />

          {state.analysis ? (
            <JourneyReview
              analysis={state.analysis}
            />
          ) : (
            <EmptyJourney />
          )}

        </div>
      )}

      {state.step ===
        JourneyStep.SAVING && (
        <SavingStep />
      )}

      {state.step ===
        JourneyStep.COMPLETE && (
        <JourneyComplete />
      )}

      {state.step !==
        JourneyStep.COMPLETE && (
        <WizardFooter
          step={state.step}
          saving={state.saving}
          onBack={previousStep}
          onNext={async () => {
            if (
              state.step ===
              JourneyStep.REVIEW
            ) {
              goToStep(
                JourneyStep.SAVING,
              );

              await onSave?.();

              goToStep(
                JourneyStep.COMPLETE,
              );

              return;
            }

            nextStep();
          }}
        />
      )}

    </div>
  );
}

function WizardStepper({
  current,
}: {
  current: JourneyStep;
}) {
  const steps = [
    JourneyStep.UPLOAD,
    JourneyStep.ANALYSIS,
    JourneyStep.QUESTIONS,
    JourneyStep.REVIEW,
    JourneyStep.COMPLETE,
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex flex-wrap justify-between gap-4">

        {steps.map((step) => {
          const active =
            step === current;

          return (
            <div
              key={step}
              className="flex flex-1 items-center gap-3"
            >

              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                  active
                    ? "bg-sky-600 text-white"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {step ===
                JourneyStep.COMPLETE ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  steps.indexOf(step) +
                  1
                )}
              </div>

              <div>

                <div className="text-sm font-semibold text-slate-900">
                  {step.replace(
                    "_",
                    " ",
                  )}
                </div>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}

function UploadStep({
  onContinue,
}: {
  onContinue: () => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">

      <Upload className="mx-auto mb-6 h-16 w-16 text-sky-600" />

      <h2 className="text-2xl font-bold">
        Upload Consultation
      </h2>

      <p className="mt-3 text-slate-600">
        Upload prescription,
        discharge summary,
        lab report or image.
      </p>

      <button
        onClick={onContinue}
        className="mt-8 rounded-xl bg-sky-600 px-8 py-3 font-semibold text-white"
      >
        Continue
      </button>

    </div>
  );
}

function AnalysisStep({
  loading,
  onRun,
}: {
  loading: boolean;
  onRun: () => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">

      {loading ? (
        <>
          <Loader2 className="mx-auto h-14 w-14 animate-spin text-sky-600" />

          <h2 className="mt-5 text-xl font-semibold">
            Analysing Consultation...
          </h2>

          <LoadingJourney />

        </>
      ) : (
        <>
          <Sparkles className="mx-auto h-16 w-16 text-indigo-600" />

          <h2 className="mt-6 text-2xl font-bold">
            AI Analysis Ready
          </h2>

          <button
            className="mt-8 rounded-xl bg-indigo-600 px-8 py-3 font-semibold text-white"
            onClick={onRun}
          >
            Start Analysis
          </button>

        </>
      )}

    </div>
  );
}

function SavingStep() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

      <Loader2 className="mx-auto h-16 w-16 animate-spin text-sky-600" />

      <h2 className="mt-6 text-2xl font-bold">
        Saving Journey
      </h2>

      <p className="mt-2 text-slate-500">
        Updating timeline,
        treatment plan,
        journey analysis
        and patient history...
      </p>

    </div>
  );
}

interface WizardFooterProps {
  step: JourneyStep;
  saving: boolean;
  onBack(): void;
  onNext(): void;
}

function WizardFooter({
  step,
  saving,
  onBack,
  onNext,
}: WizardFooterProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <button
        onClick={onBack}
        disabled={
          step ===
          JourneyStep.UPLOAD
        }
        className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-semibold disabled:opacity-50"
      >
        <ArrowLeft className="h-4 w-4" />

        Back

      </button>

      <button
        onClick={onNext}
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-6 py-3 font-semibold text-white disabled:opacity-50"
      >
        {saving
          ? "Saving..."
          : step ===
            JourneyStep.REVIEW
          ? "Save Journey"
          : "Next"}

        <ArrowRight className="h-4 w-4" />

      </button>

    </div>
  );
}