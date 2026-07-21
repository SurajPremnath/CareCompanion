// components/journey-review/JourneySummaryCard.tsx

"use client";

import { ClipboardList } from "lucide-react";

import {
  JourneySummaryView,
  SummaryItemView,
} from "@/lib/journey/view-models";

import { SummaryCard } from "./SummaryCard";

interface JourneySummaryCardProps {
  summary: JourneySummaryView;
}

export function JourneySummaryCard({
  summary,
}: JourneySummaryCardProps) {
  if (!summary.items.length) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

      <div className="border-b border-slate-100 px-6 py-5">

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-sky-100 p-3">
            <ClipboardList className="h-6 w-6 text-sky-700" />
          </div>

          <div>

            <h3 className="text-xl font-bold text-slate-900">
              Clinical Summary
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              AI-generated summary comparing the previous and current
              consultation.
            </p>

          </div>

        </div>

      </div>

      <div className="space-y-5 p-6">

        {summary.title && (
          <div>

            <h4 className="text-lg font-semibold text-slate-900">
              {summary.title}
            </h4>

            {summary.subtitle && (
              <p className="mt-2 text-sm text-slate-600">
                {summary.subtitle}
              </p>
            )}

          </div>
        )}

        {summary.items.map(
          (
            item: SummaryItemView,
            index: number,
          ) => (
            <SummaryCard
              key={item.id ?? index}
              title={item.title}
              previousValue={
                item.previousValue
              }
              currentValue={
                item.currentValue
              }
              reason={item.reason}
              highlighted={
                item.highlighted ??
                false
              }
            />
          ),
        )}

      </div>

    </div>
  );
}