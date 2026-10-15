import {
    TimelineEngineResult,
    TimelineEvent,
    TimelineStatus
} from "./timelineTypes";

export class TimelineValidator {

    static validateEvents(events: TimelineEvent[]): TimelineEngineResult | null {

        if (!Array.isArray(events)) {
            return this.failure("Timeline events collection is invalid.");
        }

        for (const event of events) {

            const validation = this.validateEvent(event);

            if (validation !== null) {
                return validation;
            }
        }

        return null;
    }

    static validateEvent(event: TimelineEvent): TimelineEngineResult | null {

        if (!event) {
            return this.failure("Timeline event is required.");
        }

        if (!event.id?.trim()) {
            return this.failure("Timeline event id is required.");
        }

        if (!event.patientId?.trim()) {
            return this.failure("Patient id is required.");
        }

        if (!event.title?.trim()) {
            return this.failure("Timeline title is required.");
        }

        if (!event.description?.trim()) {
            return this.failure("Timeline description is required.");
        }

        if (!event.occurredAt?.trim()) {
            return this.failure("Timeline event date is required.");
        }

        if (!event.category) {
            return this.failure("Timeline category is required.");
        }

        if (!event.eventType) {
            return this.failure("Timeline event type is required.");
        }

        if (!event.priority) {
            return this.failure("Timeline priority is required.");
        }

        if (!event.source) {
            return this.failure("Timeline source is required.");
        }

        if (!Array.isArray(event.referenceIds)) {
            return this.failure("Reference ids must be an array.");
        }

        return null;
    }

    private static failure(message: string): TimelineEngineResult {

        return {
            status: TimelineStatus.FAILED,
            errors: [message]
        };
    }
}