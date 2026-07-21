// components/journey-review/EmptyJourney.tsx

"use client";

import {
  CalendarDays,
} from "lucide-react";

interface EmptyJourneyProps {
  title?: string;
  description?: string;
}

export function EmptyJourney({
  title = "No Journey Available",
  description = "CareVR has not generated a patient journey yet.",
}: EmptyJourneyProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-8 py-16 text-center">

      <CalendarDays className="mx-auto mb-5 h-16 w-16 text-slate-300" />

      <h2 className="text-xl font-semibold text-slate-900">
        {title}
      </h2>

      <p className="mx-auto mt-3 max-w-xl text-slate-500">
        {description}
      </p>

    </div>
  );
}