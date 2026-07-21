// components/journey/TimelinePreview.tsx

"use client";

import {
  CalendarDays,
  Clock3,
  Building2,
  FileText,
  FlaskConical,
  Pill,
  Stethoscope,
} from "lucide-react";

import {
  TimelineEventType,
} from "@/lib/journey";

import {
  TimelineEventView,
} from "@/lib/journey/view-models";

interface TimelinePreviewProps {
  events: TimelineEventView[];
}

export function TimelinePreview({
  events,
}: TimelinePreviewProps) {
  if (events.length === 0) {
    return null;
  }

  const previewEvents = [...events]
    .sort(
      (a, b) =>
        new Date(a.eventDate).getTime() -
        new Date(b.eventDate).getTime(),
    )
    .slice(-5);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

      <div className="border-b border-slate-100 px-6 py-5">

        <div className="flex items-center gap-3">

          <CalendarDays className="h-6 w-6 text-sky-600" />

          <div>

            <h3 className="text-lg font-bold text-slate-900">
              Journey Preview
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Latest events before saving this journey.
            </p>

          </div>

        </div>

      </div>

      <div className="p-6">

        <div className="relative">

          <div className="absolute bottom-0 left-4 top-0 w-px bg-slate-200" />

          <div className="space-y-6">

            {previewEvents.map((event) => {
              const Icon = getIcon(
                event.eventType,
              );

              return (
                <div
                  key={event.id}
                  className="relative flex gap-4"
                >

                  <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-sky-600">

                    <Icon className="h-4 w-4 text-white" />

                  </div>

                  <div className="flex-1 rounded-xl border border-slate-200 bg-slate-50 p-4">

                    <div className="flex flex-wrap items-center justify-between gap-3">

                      <h4 className="font-semibold text-slate-900">
                        {event.title}
                      </h4>

                      <span className="text-xs text-slate-500">
                        {formatDate(
                          event.eventDate,
                        )}
                      </span>

                    </div>

                    <p className="mt-2 text-sm text-slate-600">
                      {event.description}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">

{event.subtitle && (
  <span>
    👨‍⚕️ {event.subtitle}
  </span>
)}

{event.status && (
  <span>
    📄 {event.status}
  </span>
)}

{typeof event.confidence === "number" && (
  <span>
    🎯 {Math.round(event.confidence * 100)}%
  </span>
)}

                    </div>

                  </div>

                </div>
              );
            })}

          </div>

        </div>

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

    case TimelineEventType.OTHER:
    default:
      return Clock3;
  }
}

function formatDate(
  date: string | Date,
) {
  return new Date(date).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}