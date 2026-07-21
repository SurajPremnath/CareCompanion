// components/journey-review/JourneyDetectedChanges.tsx

"use client";

import {
  ArrowRight,
  Building2,
  ClipboardPlus,
  ClipboardMinus,
  Pill,
  Stethoscope,
  Activity,
  FlaskConical,
} from "lucide-react";

import {
  DetectedChange,
  JourneyChangeType,
} from "@/lib/journey";

import { ChangeCard } from "./ChangeCard";

interface JourneyDetectedChangesProps {
  changes: DetectedChange[];
}

export function JourneyDetectedChanges({
  changes,
}: JourneyDetectedChangesProps) {
  if (changes.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

        <div className="text-center">

          <Activity className="mx-auto mb-4 h-12 w-12 text-green-500" />

          <h3 className="text-lg font-semibold text-slate-900">
            No Clinical Changes Detected
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            CareVR did not detect any clinically significant
            differences compared to the previous consultation.
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

      <div className="border-b border-slate-100 px-6 py-5">

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-indigo-100 p-3">
            <Activity className="h-6 w-6 text-indigo-700" />
          </div>

          <div>

            <h3 className="text-xl font-bold text-slate-900">
              Detected Clinical Changes
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Compare previous consultation with the current one.
            </p>

          </div>

        </div>

      </div>

      <div className="space-y-4 p-6">

        {changes.map(change => (
          <ChangeCard
            key={change.id}
            icon={getIcon(change.type)}
            title={change.title}
            description={change.description}
            previousValue={change.previousValue}
            currentValue={change.currentValue}
            requiresConfirmation={
              change.requiresConfirmation
            }
          />
        ))}

      </div>

    </div>
  );
}

function getIcon(type: JourneyChangeType) {
  switch (type) {
    case JourneyChangeType.DOCTOR_CHANGED:
      return (
        <Stethoscope className="h-5 w-5 text-sky-600" />
      );

    case JourneyChangeType.HOSPITAL_CHANGED:
      return (
        <Building2 className="h-5 w-5 text-indigo-600" />
      );

    case JourneyChangeType.MEDICINE_ADDED:
      return (
        <ClipboardPlus className="h-5 w-5 text-green-600" />
      );

    case JourneyChangeType.MEDICINE_REMOVED:
      return (
        <ClipboardMinus className="h-5 w-5 text-red-600" />
      );

    case JourneyChangeType.MEDICINE_DOSE_CHANGED:
    case JourneyChangeType.MEDICINE_DURATION_CHANGED:
    case JourneyChangeType.MEDICINE_FREQUENCY_CHANGED:
      return (
        <Pill className="h-5 w-5 text-amber-600" />
      );

    case JourneyChangeType.INVESTIGATION_ADDED:
      return (
        <FlaskConical className="h-5 w-5 text-purple-600" />
      );

    default:
      return (
        <ArrowRight className="h-5 w-5 text-slate-600" />
      );
  }
}