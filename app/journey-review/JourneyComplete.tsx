"use client";

import { CheckCircle2, RotateCcw } from "lucide-react";

export interface JourneyCompleteProps {
  onRestart?: () => void;
}

export function JourneyComplete({
  onRestart,
}: JourneyCompleteProps) {
  return (
    <div className="rounded-2xl border border-green-200 bg-white p-10 text-center shadow-sm">
      <CheckCircle2 className="mx-auto h-16 w-16 text-green-600" />

      <h2 className="mt-6 text-2xl font-bold text-slate-900">
        Journey Saved Successfully
      </h2>

      <p className="mt-3 text-slate-600">
        The consultation has been analysed and the patient's journey has
        been updated successfully.
      </p>

      {onRestart && (
        <button
          onClick={onRestart}
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-sky-600 px-6 py-3 font-semibold text-white hover:bg-sky-700"
        >
          <RotateCcw className="h-4 w-4" />
          Start New Journey
        </button>
      )}
    </div>
  );
}