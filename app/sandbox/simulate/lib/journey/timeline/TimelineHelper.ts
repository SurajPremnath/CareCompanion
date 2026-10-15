import {
    TimelineCategory,
    TimelinePriority,
    TimelineEvent,
    TimelineSummary
} from "./timelineTypes";

export class TimelineHelper {

    static sort(events: TimelineEvent[]): TimelineEvent[] {

        return [...events].sort((a, b) =>
            new Date(b.occurredAt).getTime() -
            new Date(a.occurredAt).getTime()
        );
    }

    static groupByDate(events: TimelineEvent[]): Map<string, TimelineEvent[]> {

        const groups = new Map<string, TimelineEvent[]>();

        for (const event of events) {

            const date = event.occurredAt.substring(0, 10);

            const existing = groups.get(date) ?? [];

            existing.push(event);

            groups.set(date, existing);
        }

        return groups;
    }

    static filterByCategory(
        events: TimelineEvent[],
        category: TimelineCategory
    ): TimelineEvent[] {

        return events.filter(event => event.category === category);
    }

    static filterByPriority(
        events: TimelineEvent[],
        priority: TimelinePriority
    ): TimelineEvent[] {

        return events.filter(event => event.priority === priority);
    }

    static buildSummary(events: TimelineEvent[]): TimelineSummary {

        return {

            totalEvents: events.length,

            critical: events.filter(
                x => x.priority === TimelinePriority.CRITICAL
            ).length,

            high: events.filter(
                x => x.priority === TimelinePriority.HIGH
            ).length,

            medium: events.filter(
                x => x.priority === TimelinePriority.MEDIUM
            ).length,

            low: events.filter(
                x => x.priority === TimelinePriority.LOW
            ).length
        };
    }

    static hasCriticalEvents(events: TimelineEvent[]): boolean {

        return events.some(
            event => event.priority === TimelinePriority.CRITICAL
        );
    }

    static latestEvent(
        events: TimelineEvent[]
    ): TimelineEvent | undefined {

        return this.sort(events)[0];
    }

    static countByCategory(
        events: TimelineEvent[],
        category: TimelineCategory
    ): number {

        return events.filter(
            event => event.category === category
        ).length;
    }
}