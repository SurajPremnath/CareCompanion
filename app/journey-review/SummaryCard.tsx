// components/journey-review/SummaryCard.tsx

"use client";

import { ArrowRight } from "lucide-react";

interface SummaryCardProps {
  title: string;

  previousValue?: string;

  currentValue?: string;

  reason?: string;

  highlighted?: boolean;

  badge?: string;
}

export function SummaryCard({
  title,
  previousValue,
  currentValue,
  reason,
  highlighted = false,
  badge,
}: SummaryCardProps) {
  return (
    <div
      className={`rounded-2xl border p-5 transition-all ${
        highlighted
          ? "border-sky-300 bg-sky-50"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="mb-4">

        <div className="flex items-center justify-between">

  <h4 className="text-base font-semibold text-slate-900">
    {title}
  </h4>

  {badge && (
    <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
      {badge}
    </span>
  )}

</div>

      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr]">

        <div className="rounded-xl border border-red-200 bg-red-50 p-4">

          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-red-700">
            Previous
          </div>

          <div className="min-h-[48px] text-sm text-slate-800">
            {previousValue || (
              <span className="italic text-slate-400">
                Not Available
              </span>
            )}
          </div>

        </div>

        <div className="flex items-center justify-center">

          <ArrowRight className="h-5 w-5 text-slate-500" />

        </div>

        <div className="rounded-xl border border-green-200 bg-green-50 p-4">

          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-green-700">
            Current
          </div>

          <div className="min-h-[48px] text-sm text-slate-800">
            {currentValue || (
              <span className="italic text-slate-400">
                Not Available
              </span>
            )}
          </div>

        </div>

      </div>

      {reason && (
        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">

          <div className="text-xs font-semibold uppercase tracking-wide text-amber-700">
            Clinical Reason
          </div>

          <div className="mt-2 text-sm leading-6 text-slate-700">
            {reason}
          </div>

        </div>
      )}
    </div>
  );
}