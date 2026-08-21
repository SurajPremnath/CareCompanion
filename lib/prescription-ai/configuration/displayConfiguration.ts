// ============================================================
// CareVR — Care Journey Display Configuration
// ============================================================
//
// This configuration controls ONLY what the user chooses to
// see on screen during a Care Journey.
//
// It does NOT control document classification.
//
// Information that is not selected for display is retained as
// Hidden according to the document-processing rules.
//
// Temporary information is NOT configurable. Temporary is a
// system-defined classification and remains outside this file.
//
// Current scope:
//   Care Journey → Doctor's Notes
//
// Record Health configuration is intentionally separate and
// will be handled later.
// ============================================================


// ============================================================
// Configurable Rest
// ============================================================
//
// General Doctor's Notes / consultation information that the
// user may choose to display.
// ============================================================

export type ConfigurableRestPanel =
    | "PATIENT"
    | "DOCTOR"
    | "HOSPITAL"
    | "CONSULTATION"
    | "CURRENT_STATE_OF_HEALTH"
    | "DIAGNOSIS"
    | "CLINICAL_ASSESSMENTS"
    | "SYMPTOMS"
    | "PRESENTING_COMPLAINTS"
    | "CLINICAL_HISTORY"
    | "EXAMINATION_FINDINGS"
    | "TESTS_ADVISED"
    | "DOCTOR_INSTRUCTIONS"
    | "MEDICATIONS"
    | "FOLLOW_UP_PLAN"
    | "CLINICAL_PLAN";

/**
 * Backward-compatible Care Journey panel type.
 *
 * Existing Care Journey configuration code already depends
 * on this exported name. Keep the alias so the configuration
 * contract remains stable while the underlying configurable
 * panel model is clarified.
 */
export type CareJourneyDisplayPanel =
    ConfigurableRestPanel;



// ============================================================
// Display Configuration
// ============================================================
//
// The user makes this selection once when starting a
// Care Journey.
//
// The selection controls presentation only.
// It does not change what the extraction engine reads,
// understands, classifies, or retains.
// ============================================================

export interface DoctorNotesDisplayConfiguration {

    configurable_Rest:
        ConfigurableRestPanel[];


}



// ============================================================
// Configurable Rest Options
// ============================================================

export const CONFIGURABLE_REST_OPTIONS: {
    value: ConfigurableRestPanel;
    label: string;
}[] = [

    {
        value: "PATIENT",
        label: "Patient",
    },

    {
        value: "DOCTOR",
        label: "Doctor",
    },

    {
        value: "HOSPITAL",
        label: "Hospital",
    },

    {
        value: "CONSULTATION",
        label: "Consultation",
    },

    {
        value: "CURRENT_STATE_OF_HEALTH",
        label: "Current State of Health",
    },

    {
        value: "TESTS_ADVISED",
        label: "Tests Advised",
    },

    {
        value: "DOCTOR_INSTRUCTIONS",
        label: "Doctor Instructions",
    },

    {
        value: "MEDICATIONS",
        label: "Medications",
    },

    {
        value: "FOLLOW_UP_PLAN",
        label: "Follow-up Plan",
    },
];


