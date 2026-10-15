import {
  TimelineEvent,
} from "../journeyAnalysisModels";

import {
  TimelineEventView,
} from "../view-models";

export function mapTimelineEvent(
  event: TimelineEvent,
): TimelineEventView {
  return {
    id: event.id,

    eventDate:
      event.eventDate ??
      event.timestamp,

    eventType:
      event.eventType ??
      event.type,

    title: event.title,

    description: event.description,

    subtitle: event.subtitle,

    severity: event.severity,

    status: event.status,

    confidence: event.confidence,

    consultationId: event.consultationId,

    prescriptionId: event.prescriptionId,

    medicineId: event.medicineId,

    investigationId: event.investigationId,

    procedureId: event.procedureId,

    highlighted: event.highlighted,

    color: event.color,

    icon: event.icon,

    metadata: event.metadata,
  };
}

export function mapTimelineEvents(
  events: TimelineEvent[],
): TimelineEventView[] {
  return events.map(mapTimelineEvent);
}