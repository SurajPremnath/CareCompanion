// components/journey-review/JourneyHeader.tsx

"use client";

import {
  Calendar,
  Building2,
  Stethoscope,
  User,
  Activity,
  MessageCircle,
} from "lucide-react";

import {
  ConsultationType,
  ConsultationSource,
} from "@/lib/journey";

import {
  JourneyContextView,
} from "@/lib/journey/view-models";

interface JourneyHeaderProps {
  context: JourneyContextView;
}

export function JourneyHeader({
  context,
}: JourneyHeaderProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      <div className="border-b border-slate-100 bg-gradient-to-r from-sky-600 to-cyan-600 px-6 py-5">
        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-white/20 p-3">
            <Activity className="h-6 w-6 text-white" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              Clinical Journey Review
            </h2>

            <p className="mt-1 text-sm text-sky-100">
              Review today's consultation before updating the patient's health journey.
            </p>
          </div>

        </div>
      </div>

      <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-4">

        <InfoCard
          icon={<User className="h-5 w-5" />}
          label="Patient ID"
          value={context.patientId}
        />

        <InfoCard
          icon={<Calendar className="h-5 w-5" />}
          label="Consultation Date"
          value={formatDate(String(context.currentConsultationDate ?? ""))}
        />

        <InfoCard
          icon={<Stethoscope className="h-5 w-5" />}
          label="Context"
value={formatEnum(
  (context.consultationContext?.consultationType as ConsultationType) ??
    ConsultationType.OTHER,
)}
        />

        <InfoCard
          icon={getSourceIcon(
  context.consultationSource ?? ConsultationSource.PRESCRIPTION_UPLOAD,
)}
          label="Source"
  value={formatEnum(
  context.consultationSource ?? ConsultationSource.PRESCRIPTION_UPLOAD,
)}
        />

      </div>

      {context.hasPreviousConsultation && (
        <div className="border-t border-slate-100 bg-slate-50 px-6 py-4">

          <div className="flex flex-wrap items-center gap-8">

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Previous Consultation
              </p>

              <p className="mt-1 font-medium text-slate-800">
                {context.previousConsultationDate
                  ? formatDate(
    String(context.previousConsultationDate),
)
                  : "Available"}
              </p>
            </div>

            {context.isEmergency && (
              <div className="rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700">
                Emergency Consultation
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoCard({
  icon,
  label,
  value,
}: InfoCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

      <div className="flex items-center gap-2 text-slate-500">
        {icon}

        <span className="text-sm font-medium">
          {label}
        </span>
      </div>

      <p className="mt-3 break-words text-base font-semibold text-slate-900">
        {value}
      </p>

    </div>
  );
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString(
    undefined,
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  );
}

function formatEnum(
  value:
    | ConsultationType
    | ConsultationSource,
): string {
  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, c => c.toUpperCase());
}

function getSourceIcon(
  source: ConsultationSource,
) {
  switch (source) {
    case ConsultationSource.WHATSAPP:
      return (
        <MessageCircle className="h-5 w-5 text-green-600" />
      );

    case ConsultationSource.PRESCRIPTION_UPLOAD:
      return (
        <Building2 className="h-5 w-5 text-sky-600" />
      );

    default:
      return (
        <Activity className="h-5 w-5 text-slate-600" />
      );
  }
}