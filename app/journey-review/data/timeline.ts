import {
    TimelineEvent,
} from "../components/types";

interface BuildTimelineParams {
    patient: any;
    dailyCare: any[];
    selfDailyCare: any[];
    assessments: any[];
}

export function buildTimeline({
    dailyCare,
    selfDailyCare,
    assessments,
}: BuildTimelineParams): TimelineEvent[] {

    const events: TimelineEvent[] = [];

    dailyCare.forEach((record: any, index: number) => {

        events.push({
            id: `daily-care-${index}`,
            type: "daily_care",
            title: "Daily Care",
            description: "Daily health record captured.",
            date: record.recorded_at,
            icon: "activity",
            color: "bg-blue-600",
            payload: record,
        });

    });

    selfDailyCare.forEach((record: any, index: number) => {

        events.push({
            id: `self-daily-care-${index}`,
            type: "self_daily_care",
            title: "Self Daily Care",
            description: "Self health record captured.",
            date: record.recorded_at,
            icon: "activity",
            color: "bg-emerald-600",
            payload: record,
        });

    });

    assessments.forEach((record: any, index: number) => {

        events.push({
            id: `assessment-${index}`,
            type: "assessment",
            title: "Assessment Completed",
            description: "Health assessment completed.",
            date: record.completed_at,
            icon: "activity",
            color: "bg-violet-600",
            payload: record,
        });

    });

    events.sort(
        (a, b) =>
            new Date(a.date).getTime() -
            new Date(b.date).getTime()
    );

    return events;

}