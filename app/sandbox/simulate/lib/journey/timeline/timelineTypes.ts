/* ==========================================================
 * Timeline Categories
 * ========================================================== */

export enum TimelineCategory {
    CONSULTATION = "consultation",
    MEDICATION = "medication",
    DIAGNOSIS = "diagnosis",
    COMPLAINT = "complaint",
    VITAL = "vital",
    INVESTIGATION = "investigation",
    ASSESSMENT = "assessment",
    DAILY_CARE = "dailyCare",
    DOCTOR_INSTRUCTION = "doctorInstruction",
    FOLLOW_UP = "followUp",
    AI_OBSERVATION = "aiObservation",
    DOCUMENT = "document",
    SYSTEM = "system"
}

/* ==========================================================
 * Timeline Event Types
 * ========================================================== */

export enum TimelineEventType {
    CREATED = "created",
    UPDATED = "updated",
    STARTED = "started",
    STOPPED = "stopped",
    CONTINUED = "continued",
    MODIFIED = "modified",
    COMPLETED = "completed",
    ORDERED = "ordered",
    RESULT_RECEIVED = "resultReceived",
    REVIEWED = "reviewed",
    ESCALATED = "escalated",
    RESOLVED = "resolved",
    RECORDED = "recorded",
    OBSERVED = "observed"
}

/* ==========================================================
 * Timeline Priority
 * ========================================================== */

export enum TimelinePriority {
    CRITICAL = "critical",
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low"
}

/* ==========================================================
 * Timeline Source
 * ========================================================== */

export enum TimelineSource {
    CONSULTATION = "consultation",
    PRESCRIPTION = "prescription",
    DAILY_CARE = "dailyCare",
    SELF_ASSESSMENT = "selfAssessment",
    FAMILY_ASSESSMENT = "familyAssessment",
    COMPARISON_ENGINE = "comparisonEngine",
    TREATMENT_ENGINE = "treatmentEngine",
    AI = "ai",
    USER = "user",
    SYSTEM = "system"
}

/* ==========================================================
 * Timeline Status
 * ========================================================== */

export enum TimelineStatus {
    SUCCESS = "success",
    FAILED = "failed"
}

/* ==========================================================
 * Timeline Event
 * ========================================================== */

export interface TimelineEvent {

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
}

/* ==========================================================
 * Timeline Summary
 * ========================================================== */

export interface TimelineSummary {

    totalEvents: number;

    critical: number;

    high: number;

    medium: number;

    low: number;
}

/* ==========================================================
 * Timeline Result
 * ========================================================== */

export interface TimelineResult {

    events: TimelineEvent[];

    summary: TimelineSummary;

    warnings: string[];

    errors: string[];
}

/* ==========================================================
 * Timeline Engine Result
 * ========================================================== */

export interface TimelineEngineResult {

    status: TimelineStatus;

    result?: TimelineResult;

    errors: string[];
}