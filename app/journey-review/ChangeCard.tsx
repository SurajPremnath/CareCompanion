// components/journey-review/ChangeCard.tsx

"use client";

import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

interface ChangeCardProps {
  icon: React.ReactNode;

  title: string;

  description: string;

  previousValue?: string;

  currentValue?: string;

  requiresConfirmation?: boolean;
}

export function ChangeCard({
  icon,
  title,
  description,
  previousValue,
  currentValue,
  requiresConfirmation = false,
}: ChangeCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:border-sky-300 hover:shadow-md">

      <div className="p-5">

        <div className="flex items-start gap-4">

          <div className="rounded-xl bg-slate-100 p-3">
            {icon}
          </div>

          <div className="flex-1">

            <div className="flex flex-wrap items-center justify-between gap-3">

              <h4 className="text-base font-semibold text-slate-900">
                {title}
              </h4>

              {requiresConfirmation ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">

                  <AlertCircle className="h-4 w-4" />

                  Confirmation Required

                </span>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">

                  <CheckCircle2 className="h-4 w-4" />

                  Automatically Detected

                </span>
              )}

            </div>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              {description}
            </p>

            {(previousValue || currentValue) && (
              <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_auto_1fr]">

                <div className="rounded-xl border border-red-200 bg-red-50 p-4">

                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-red-700">
                    Previous
                  </div>

                  <div className="min-h-[48px] text-sm font-medium text-slate-800">
                    {previousValue || (
                      <span className="italic text-slate-400">
                        Not Available
                      </span>
                    )}
                  </div>

                </div>

                <div className="flex items-center justify-center">

                  <div className="rounded-full bg-slate-100 p-2">
                    <ArrowRight className="h-5 w-5 text-slate-500" />
                  </div>

                </div>

                <div className="rounded-xl border border-green-200 bg-green-50 p-4">

                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-green-700">
                    Current
                  </div>

                  <div className="min-h-[48px] text-sm font-medium text-slate-800">
                    {currentValue || (
                      <span className="italic text-slate-400">
                        Not Available
                      </span>
                    )}
                  </div>

                </div>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}