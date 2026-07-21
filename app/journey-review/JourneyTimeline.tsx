// components/journey-review/JourneyTimeline.tsx

"use client";

import {
  CalendarDays,
  Clock3,
  Building2,
  Stethoscope,
  Pill,
  FlaskConical,
  FileText,
  ChevronRight,
} from "lucide-react";

import {
  TimelineEventType,
} from "@/lib/journey";

import {
  TimelineEventView,
} from "@/lib/journey/view-models";

interface JourneyTimelineProps {
  events: TimelineEventView[];
}

export function JourneyTimeline({
  events,
}: JourneyTimelineProps) {
  if (events.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">

        <CalendarDays className="mx-auto mb-4 h-12 w-12 text-slate-300" />

        <h3 className="text-lg font-semibold text-slate-900">
          No Timeline Available
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Timeline events will automatically appear as new
          consultations are processed.
        </p>

      </div>
    );
  }

  const sortedEvents = [...events].sort(
    (a, b) =>
      new Date(a.eventDate).getTime() -
      new Date(b.eventDate).getTime(),
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

      <div className="border-b border-slate-100 px-6 py-5">

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-indigo-100 p-3">
            <CalendarDays className="h-6 w-6 text-indigo-700" />
          </div>

          <div>

            <h3 className="text-xl font-bold text-slate-900">
              Patient Journey Timeline
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Complete chronological view of the patient's
              clinical journey.
            </p>

          </div>

        </div>

      </div>

      <div className="p-8">

        <div className="relative">

          <div className="absolute bottom-0 left-5 top-0 w-px bg-slate-200" />

          <div className="space-y-8">

            {sortedEvents.map((event) => (
              <TimelineCard
                key={event.id}
                event={event}
              />
            ))}

          </div>

        </div>

      </div>

    </div>
  );
}

interface TimelineCardProps {
  event: TimelineEventView;
}

function TimelineCard({
  event,
}: TimelineCardProps) {
  const Icon = getIcon(event.eventType);

  return (
    <div className="relative flex gap-5">

      <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-sky-600 shadow">

        <Icon className="h-5 w-5 text-white" />

      </div>

      <div className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-sky-300 hover:shadow-sm">

        <div className="flex flex-wrap items-start justify-between gap-3">

          <div>

            <h4 className="text-lg font-semibold text-slate-900">
              {event.title}
            </h4>

            <p className="mt-1 text-sm text-slate-600">
              {event.description}
            </p>

          </div>

          <div className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm">

            {formatDate(event.eventDate)}

          </div>

        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">

          {event.doctorName && (
            <InfoTile
              icon={
                <Stethoscope className="h-4 w-4 text-sky-600" />
              }
              label="Doctor"
              value={event.doctorName}
            />
          )}

          {event.hospitalName && (
            <InfoTile
              icon={
                <Building2 className="h-4 w-4 text-indigo-600" />
              }
              label="Hospital"
              value={event.hospitalName}
            />
          )}

          {event.source && (
            <InfoTile
              icon={
                <FileText className="h-4 w-4 text-emerald-600" />
              }
              label="Source"
              value={event.source}
            />
          )}

        </div>

        {event.metadata && (
          <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">

            <div className="mb-3 flex items-center gap-2">

              <ChevronRight className="h-4 w-4 text-slate-500" />

              <span className="text-sm font-semibold text-slate-700">
                Additional Details
              </span>

            </div>

            <pre className="overflow-auto whitespace-pre-wrap text-xs text-slate-600">
              {JSON.stringify(
                event.metadata,
                null,
                2,
              )}
            </pre>

          </div>
        )}

      </div>

    </div>
  );
}

interface InfoTileProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoTile({
  icon,
  label,
  value,
}: InfoTileProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">

      <div className="flex items-center gap-2">

        {icon}

        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {label}
        </span>

      </div>

      <div className="mt-2 text-sm font-medium text-slate-900">
        {value}
      </div>

    </div>
  );
}

function getIcon(
  type: TimelineEventType,
) {
  switch (type) {
    case TimelineEventType.CONSULTATION:
      return Stethoscope;

    case TimelineEventType.MEDICATION:
      return Pill;

    case TimelineEventType.INVESTIGATION:
      return FlaskConical;

    case TimelineEventType.PROCEDURE:
      return FileText;

    case TimelineEventType.FOLLOW_UP:
      return CalendarDays;

    case TimelineEventType.NOTE:
      return FileText;

    default:
      return Clock3;
  }
}

function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}