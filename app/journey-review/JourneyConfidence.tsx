// components/journey-review/JourneyConfidence.tsx

"use client";

import {
  ShieldCheck,
  TriangleAlert,
  CircleHelp,
} from "lucide-react";

import { JourneyStatus } from "@/lib/journey";

interface JourneyConfidenceProps {
  confidence: number;
  status: JourneyStatus;
}

export function JourneyConfidence({
  confidence,
  status,
}: JourneyConfidenceProps) {
  const level = getConfidenceLevel(confidence);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

      <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-4">

          <div
            className={`rounded-2xl p-4 ${level.iconBackground}`}
          >
            <level.icon
              className={`h-8 w-8 ${level.iconColor}`}
            />
          </div>

          <div>

            <h3 className="text-lg font-semibold text-slate-900">
              AI Clinical Confidence
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Confidence that the detected journey accurately
              represents this consultation.
            </p>

          </div>

        </div>

        <div className="min-w-[260px]">

          <div className="mb-2 flex items-center justify-between">

            <span className="text-sm font-medium text-slate-600">
              Confidence Score
            </span>

            <span
              className={`text-2xl font-bold ${level.textColor}`}
            >
              {confidence}%
            </span>

          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-200">

            <div
              className={`h-full rounded-full transition-all duration-500 ${level.barColor}`}
              style={{
                width: `${Math.min(
                  Math.max(confidence, 0),
                  100,
                )}%`,
              }}
            />

          </div>

          <div className="mt-3 flex items-center justify-between">

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${level.badge}`}
            >
              {level.label}
            </span>

            <StatusBadge status={status} />

          </div>

        </div>

      </div>

    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: JourneyStatus;
}) {
const config: Record<
  JourneyStatus,
  {
    label: string;
    className: string;
  }
> = {
  [JourneyStatus.NOT_STARTED]: {
    label: "Not Started",
    className: "bg-slate-100 text-slate-700",
  },

  [JourneyStatus.PENDING]: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-700",
  },

  [JourneyStatus.IN_PROGRESS]: {
    label: "In Progress",
    className: "bg-blue-100 text-blue-700",
  },

  [JourneyStatus.IN_REVIEW]: {
    label: "In Review",
    className: "bg-sky-100 text-sky-700",
  },

  [JourneyStatus.COMPLETED]: {
    label: "Completed",
    className: "bg-green-100 text-green-700",
  },

  [JourneyStatus.REVIEW_REQUIRED]: {
    label: "Review Required",
    className: "bg-amber-100 text-amber-700",
  },

  [JourneyStatus.FAILED]: {
    label: "Failed",
    className: "bg-red-100 text-red-700",
  },

  [JourneyStatus.CANCELLED]: {
    label: "Cancelled",
    className: "bg-gray-100 text-gray-700",
  },
};

  const current = config[status];

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${current.className}`}
    >
      {current.label}
    </span>
  );
}

function getConfidenceLevel(confidence: number) {
  if (confidence >= 90) {
    return {
      label: "High Confidence",
      icon: ShieldCheck,
      textColor: "text-green-700",
      iconColor: "text-green-700",
      iconBackground: "bg-green-100",
      barColor: "bg-green-600",
      badge:
        "bg-green-100 text-green-700",
    };
  }

  if (confidence >= 75) {
    return {
      label: "Review Recommended",
      icon: CircleHelp,
      textColor: "text-amber-700",
      iconColor: "text-amber-700",
      iconBackground: "bg-amber-100",
      barColor: "bg-amber-500",
      badge:
        "bg-amber-100 text-amber-700",
    };
  }

  return {
    label: "Needs Verification",
    icon: TriangleAlert,
    textColor: "text-red-700",
    iconColor: "text-red-700",
    iconBackground: "bg-red-100",
    barColor: "bg-red-600",
    badge:
      "bg-red-100 text-red-700",
  };
}