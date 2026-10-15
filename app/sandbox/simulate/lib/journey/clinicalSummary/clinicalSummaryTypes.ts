export enum ClinicalSummarySection {

    OVERVIEW = "overview",

    PROGRESS = "progress",

    MEDICATION = "medication",

    DIAGNOSIS = "diagnosis",

    SYMPTOMS = "symptoms",

    VITALS = "vitals",

    INVESTIGATIONS = "investigations",

    RISKS = "risks",

    FOLLOW_UP = "followUp",

    RECOMMENDATIONS = "recommendations"

}

export enum ClinicalRisk {

    CRITICAL = "critical",

    HIGH = "high",

    MEDIUM = "medium",

    LOW = "low"

}

export enum ClinicalSummaryStatus {

    SUCCESS = "success",

    FAILED = "failed"

}

export interface ClinicalSummaryItem {

    id: string;

    section: ClinicalSummarySection;

    risk: ClinicalRisk;

    title: string;

    summary: string;

    sourceQuestionIds: string[];

}

export interface ClinicalSummary {

    items: ClinicalSummaryItem[];

    overview: string;

    totalFindings: number;

    criticalFindings: number;

}

export interface ClinicalSummaryEngineResult {

    status: ClinicalSummaryStatus;

    summary?: ClinicalSummary;

    errors: string[];

}