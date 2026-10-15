import {
    TimelineEvent,
    TimelineResult
} from "./timelineTypes";

import { TimelineHelper } from "./TimelineHelper";
import { TimelineValidator } from "./timelineValidator";

export class TimelineBuilder {

    build(events: TimelineEvent[]): TimelineResult {

        const validation = TimelineValidator.validateEvents(events);

        if (validation) {
            return {
                events: [],
                summary: {
                    totalEvents: 0,
                    critical: 0,
                    high: 0,
                    medium: 0,
                    low: 0
                },
                warnings: [],
                errors: validation.errors
            };
        }

        const sortedEvents = TimelineHelper.sort(events);

        return {
            events: sortedEvents,
            summary: TimelineHelper.buildSummary(sortedEvents),
            warnings: this.buildWarnings(sortedEvents),
            errors: []
        };
    }

    private buildWarnings(events: TimelineEvent[]): string[] {

        const warnings: string[] = [];

        if (events.length === 0) {
            warnings.push("No timeline events found.");
        }

        if (TimelineHelper.hasCriticalEvents(events)) {
            warnings.push("Timeline contains critical clinical events.");
        }

        return warnings;
    }
}