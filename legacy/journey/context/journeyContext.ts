/**
 * Master context shared across every Journey Engine.
 *
 * Each engine enriches this object.
 * No engine should mutate database entities directly.
 */
export interface JourneyContext {

    /**
     * Patient
     */
    patient: JourneyPatient;

    /**
     * Current consultation being processed
     */
    consultation: JourneyConsultation;

    /**
     * Previous consultation
     */
    previousConsultation?: JourneyConsultation;

    /**
     * Current active treatment
     */
    activeTreatment?: JourneyActiveTreatment;

    /**
     * Extracted prescription
     */
    prescription: JourneyPrescription;

    /**
     * Comparison with previous consultation
     */
    comparison?: JourneyComparison;

    /**
     * Classification result
     */
    classification?: JourneyClassificationResult;

    /**
     * Scenario selected
     */
    scenario?: JourneyScenario;

    /**
     * Medication reconciliation
     */
    reconciliation?: JourneyMedicationReconciliation;

    /**
     * Treatment decision
     */
    treatmentDecision?: JourneyTreatmentDecision;

    /**
     * Timeline events
     */
    timelineEvents?: JourneyTimelineEvent[];

    /**
     * Governance decision
     */
    governance?: JourneyGovernanceDecision;

}