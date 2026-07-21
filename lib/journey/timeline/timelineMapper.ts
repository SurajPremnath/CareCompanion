import {
    TimelineEvent
} from "./timelineTypes";

import {
    TimelineModel
} from "./timelineModels";

export class TimelineMapper {

    static toModel(event: TimelineEvent): TimelineModel {

        const now = new Date().toISOString();

        return {

            id: event.id,

            patientId: event.patientId,

            consultationId: event.consultationId,

            category: event.category,

            eventType: event.eventType,

            priority: event.priority,

            title: event.title,

            description: event.description,

            occurredAt: event.occurredAt,

            source: event.source,

            referenceIds: [...event.referenceIds],

            metadata: event.metadata,

            createdAt: now,

            updatedAt: now
        };
    }

    static toEntity(model: TimelineModel): TimelineEvent {

        return {

            id: model.id,

            patientId: model.patientId,

            consultationId: model.consultationId,

            category: model.category,

            eventType: model.eventType,

            priority: model.priority,

            title: model.title,

            description: model.description,

            occurredAt: model.occurredAt,

            source: model.source,

            referenceIds: [...model.referenceIds],

            metadata: model.metadata
        };
    }

    static toModels(events: TimelineEvent[]): TimelineModel[] {

        return events.map(event => this.toModel(event));
    }

    static toEntities(models: TimelineModel[]): TimelineEvent[] {

        return models.map(model => this.toEntity(model));
    }
}