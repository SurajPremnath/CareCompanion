export enum TreatmentCategory {

    MEDICATION = "medication",

    DIAGNOSIS = "diagnosis",

    COMPLAINT = "complaint",

    VITAL = "vital",

    INVESTIGATION = "investigation",

    ASSESSMENT = "assessment",

    FOLLOW_UP = "followUp",

    DOCTOR_INSTRUCTION = "doctorInstruction"

}

export enum TreatmentAction {

    START = "start",

    STOP = "stop",

    CONTINUE = "continue",

    MODIFY = "modify",

    MONITOR = "monitor",

    ESCALATE = "escalate",

    REVIEW = "review",

    COMPLETE = "complete"

}

export enum TreatmentPriority {

    CRITICAL = "critical",

    HIGH = "high",

    MEDIUM = "medium",

    LOW = "low"

}

export enum TreatmentStatus {

    SUCCESS = "success",

    FAILED = "failed"

}

export interface TreatmentResolution {

    id: string;

    category: TreatmentCategory;

    action: TreatmentAction;

    priority: TreatmentPriority;

    title: string;

    description: string;

    sourceDifferenceIds: string[];

    recommendation?: string;

}

export interface TreatmentSummary {

    totalResolutions: number;

    critical: number;

    high: number;

    medium: number;

    low: number;

}

export interface TreatmentResult {

    resolutions: TreatmentResolution[];

    summary: TreatmentSummary;

    warnings: string[];

    errors: string[];

}

export interface TreatmentEngineResult {

    status: TreatmentStatus;

    result?: TreatmentResult;

    errors: string[];

}