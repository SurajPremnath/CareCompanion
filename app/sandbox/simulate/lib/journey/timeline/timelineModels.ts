import type {
    TimelineCategory,
    TimelineEventType,
    TimelinePriority,
    TimelineSource
} from "./timelineTypes";

/* ==========================================================
 * Timeline Model
 * ========================================================== */

export interface TimelineModel {

    id: string;

    patientId: string;

    consultationId?: string;

    category: TimelineCategory;

    eventType: TimelineEventType;

    priority: TimelinePriority;

    title: string;

    description: string;

    occurredAt: string;

    source: TimelineSource;

    referenceIds: string[];

    metadata?: Record<string, unknown>;

    createdAt: string;

    updatedAt: string;
}

/* ==========================================================
 * Timeline Group
 * ========================================================== */

export interface TimelineGroup {

    date: string;

    events: TimelineModel[];
}

/* ==========================================================
 * Timeline Statistics
 * ========================================================== */

export interface TimelineStatistics {

    totalEvents: number;

    consultationCount: number;

    medicationCount: number;

    diagnosisCount: number;

    investigationCount: number;

    assessmentCount: number;

    dailyCareCount: number;

    followUpCount: number;

    criticalCount: number;

    highCount: number;

    mediumCount: number;

    lowCount: number;
}