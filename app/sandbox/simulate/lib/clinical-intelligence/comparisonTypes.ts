//------------------------------------------------------------
// Clinical Intelligence
// Comparison Types
//------------------------------------------------------------

import type {
    Assessment,
    Complaint,
    ConsultationRecord,
    ConsultationVitals,
    DoctorInstruction,
    FollowUp,
    History,
    Investigation,
    Medicine,
} from "@/lib/prescription-ai/models/consultationModel";

//------------------------------------------------------------
// Generic Change Types
//------------------------------------------------------------

export type ChangeType =
    | "UNCHANGED"
    | "ADDED"
    | "REMOVED"
    | "MODIFIED";

export type MedicineChangeType =
    | "CONTINUED"
    | "NEW"
    | "STOPPED"
    | "DOSE_CHANGED"
    | "FREQUENCY_CHANGED"
    | "DURATION_CHANGED"
    | "TIMING_CHANGED"
    | "MULTIPLE_CHANGES";

export type ClarificationPriority =
    | "LOW"
    | "MEDIUM"
    | "HIGH";

//------------------------------------------------------------
// Medicine
//------------------------------------------------------------

export type MedicineField =
    | "strength"
    | "form"
    | "dose"
    | "frequency"
    | "duration"
    | "administrationTiming"
    | "instructions";

export interface MedicineComparison {

    medicineName: string;

    changeType: MedicineChangeType;

    previous: Medicine | null;

    current: Medicine | null;

    changedFields: MedicineField[];

}

//------------------------------------------------------------
// Generic Collection Comparison
//------------------------------------------------------------

export interface CollectionComparison<T> {

    changeType: ChangeType;

    previous: T | null;

    current: T | null;

}

//------------------------------------------------------------
// Collection Comparisons
//------------------------------------------------------------

export type ComplaintComparison =
    CollectionComparison<Complaint>;

export type HistoryComparison =
    CollectionComparison<History>;

export type AssessmentComparison =
    CollectionComparison<Assessment>;

export type InvestigationComparison =
    CollectionComparison<Investigation>;

export type DoctorInstructionComparison =
    CollectionComparison<DoctorInstruction>;

export type FollowUpComparison =
    CollectionComparison<FollowUp>;

//------------------------------------------------------------
// Consultation Comparisons
//------------------------------------------------------------

export interface PatientComparison {

    changed: boolean;

    previous:
        ConsultationRecord["patient"] | null;

    current:
        ConsultationRecord["patient"];

}

export interface DoctorComparison {

    changed: boolean;

    previous: string | null;

    current: string | null;

}

export interface HospitalComparison {

    changed: boolean;

    previous: string | null;

    current: string | null;

}

export interface ConsultationModeComparison {

    changed: boolean;

    previous:
        ConsultationRecord["consultation"]["consultationMode"];

    current:
        ConsultationRecord["consultation"]["consultationMode"];

}

export interface ConsultationDateComparison {

    changed: boolean;

    previous: string | null;

    current: string | null;

}

export interface AdditionalNotesComparison {

    changed: boolean;

    previous: string | null;

    current: string | null;

}

//------------------------------------------------------------
// Vitals
//------------------------------------------------------------

export type VitalField = keyof ConsultationVitals;

export interface VitalComparison {

    vital: VitalField;

    changed: boolean;

    previous: string | null;

    current: string | null;

}

export interface VitalsComparison {

    weight: VitalComparison;

    height: VitalComparison;

    bmi: VitalComparison;

    bloodPressure: VitalComparison;

    pulse: VitalComparison;

    respiratoryRate: VitalComparison;

    spo2: VitalComparison;

    temperature: VitalComparison;

}

//------------------------------------------------------------
// Clinical Notes
//------------------------------------------------------------

export type ClinicalNoteType =
    | "CONSULTATION"
    | "MEDICINE"
    | "COMPLAINT"
    | "ASSESSMENT"
    | "INVESTIGATION"
    | "INSTRUCTION"
    | "FOLLOW_UP"
    | "VITAL";

export interface ClinicalNote {

    type: ClinicalNoteType;

    title: string;

    description: string;

}

//------------------------------------------------------------
// Clarification
//------------------------------------------------------------

export type ClarificationType =
    | "MEDICINE"
    | "CONSULTATION"
    | "FOLLOW_UP"
    | "GENERAL";

export interface ClarificationOption {

    label: string;

    value: string;

}

export interface ClarificationQuestion {

    id: string;

    type: ClarificationType;

    priority: ClarificationPriority;

    question: string;

    description?: string;

    options: ClarificationOption[];

    required: boolean;

}

//------------------------------------------------------------
// Statistics
//------------------------------------------------------------

export interface ComparisonStatistics {

    totalChanges: number;

    medicinesAdded: number;

    medicinesStopped: number;

    medicinesModified: number;

    medicinesContinued: number;

    complaintsAdded: number;

    complaintsResolved: number;

    assessmentsChanged: number;

    investigationsChanged: number;

    instructionsChanged: number;

    followUpsChanged: number;

    vitalsChanged: number;

    doctorChanged: boolean;

    hospitalChanged: boolean;

}

//------------------------------------------------------------
// Engine Options
//------------------------------------------------------------

export interface ComparisonEngineOptions {

    ignoreCase?: boolean;

    ignoreWhitespace?: boolean;

    normalizeMedicineNames?: boolean;

    normalizeUnits?: boolean;

}

export const DEFAULT_COMPARISON_OPTIONS:
Required<ComparisonEngineOptions> = {

    ignoreCase: true,

    ignoreWhitespace: true,

    normalizeMedicineNames: true,

    normalizeUnits: true,

};

//------------------------------------------------------------
// Confidence
//------------------------------------------------------------

export interface ComparisonConfidence {

    score: number;

    requiresConfirmation: boolean;

    reasons: string[];

}

//------------------------------------------------------------
// Confirmation
//------------------------------------------------------------

export type ConfirmationStatus =
    | "PENDING"
    | "CONFIRMED"
    | "SKIPPED";

//------------------------------------------------------------
// Clinical Comparison Result
//------------------------------------------------------------

export interface ClinicalComparisonResult {

    previousConsultation:
        ConsultationRecord | null;

    currentConsultation:
        ConsultationRecord;

    patient:
        PatientComparison;

    doctor:
        DoctorComparison;

    hospital:
        HospitalComparison;

    consultationMode:
        ConsultationModeComparison;

    consultationDate:
        ConsultationDateComparison;

    additionalNotes:
        AdditionalNotesComparison;

    medicines:
        MedicineComparison[];

    complaints:
        ComplaintComparison[];

    history:
        HistoryComparison[];

    assessments:
        AssessmentComparison[];

    investigations:
        InvestigationComparison[];

    doctorInstructions:
        DoctorInstructionComparison[];

    followUps:
        FollowUpComparison[];

    vitals:
        VitalsComparison;

    notes:
        ClinicalNote[];

    questions:
        ClarificationQuestion[];

    statistics:
        ComparisonStatistics;

    confidence:
        ComparisonConfidence;

    confirmationStatus:
        ConfirmationStatus;

}

//------------------------------------------------------------
// Timeline
//------------------------------------------------------------

export interface TimelineEventDraft {

    title: string;

    description: string;

    category: ClinicalNoteType;

    eventDate: string;

}

//------------------------------------------------------------
// Engine Output
//------------------------------------------------------------

export interface ClinicalComparisonOutput {

    comparison: ClinicalComparisonResult;

    timelineEvents: TimelineEventDraft[];

}

//------------------------------------------------------------
// Helper Constants
//------------------------------------------------------------

export const DEFAULT_CONFIDENCE_SCORE = 100;

export const LOW_CONFIDENCE_THRESHOLD = 80;