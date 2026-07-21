// components/journey-review/TreatmentDecisionCard.tsx

"use client";

import {
  ArrowRight,
  Archive,
  CheckCircle2,
  ClipboardList,
  Stethoscope,
  Building2,
  Info,
} from "lucide-react";

import {
  TreatmentDecisionView,
} from "@/lib/journey/view-models";

interface TreatmentDecisionCardProps {
  decision: TreatmentDecisionView;

  onArchive?: () => void;
}

export function TreatmentDecisionCard({
  decision,
  onArchive,
}: TreatmentDecisionCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

      <div className="border-b border-slate-100 px-6 py-5">

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-indigo-100 p-3">
            <ClipboardList className="h-6 w-6 text-indigo-700" />
          </div>

          <div>

            <h3 className="text-xl font-bold text-slate-900">
              Treatment Decision
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              AI recommendation for the patient's treatment
              journey.
            </p>

          </div>

        </div>

      </div>

      <div className="space-y-6 p-6">

        <div className="rounded-xl border border-sky-200 bg-sky-50 p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">
                Decision
              </p>

              <h4 className="mt-2 text-lg font-bold text-slate-900">
                {formatDecision(
                  decision.decision,
                )}
              </h4>

            </div>

            <CheckCircle2 className="h-10 w-10 text-sky-600" />

          </div>

        </div>

        <div className="grid gap-4 lg:grid-cols-2">

          <InfoCard
            icon={
              <Stethoscope className="h-5 w-5 text-sky-600" />
            }
            title="Active Doctor"
            value={
              decision.activeDoctor ??
              "Not Available"
            }
          />

          <InfoCard
            icon={
              <Building2 className="h-5 w-5 text-indigo-600" />
            }
            title="Active Hospital"
            value={
              decision.activeHospital ??
              "Not Available"
            }
          />

        </div>

        {decision.reason && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">

            <div className="flex items-start gap-3">

              <Info className="mt-0.5 h-5 w-5 text-amber-700" />

              <div>

                <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                  Reason
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {decision.reason}
                </p>

              </div>

            </div>

          </div>
        )}

        {decision.notes && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              Clinical Notes
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-700">
              {decision.notes}
            </p>

          </div>
        )}

        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-6">

          <button
            type="button"
            onClick={onArchive}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <Archive className="h-4 w-4" />
            Archive Previous Plan
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
          >
            Continue

            <ArrowRight className="h-4 w-4" />
          </button>

        </div>

      </div>

    </div>
  );
}

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
}

function InfoCard({
  icon,
  title,
  value,
}: InfoCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

      <div className="flex items-center gap-2">

        {icon}

        <span className="text-sm font-medium text-slate-600">
          {title}
        </span>

      </div>

      <p className="mt-3 text-base font-semibold text-slate-900">
        {value}
      </p>

    </div>
  );
}

function formatDecision(
  decision: string,
): string {
  return decision;
}