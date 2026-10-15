import type {
    ExtractedPrescription,
} from "@/lib/prescription-image/prescriptionImageTypes";

/**
 * Temporary document-session buckets.
 *
 * These exist only while the user is reviewing uploaded documents.
 * They are not persisted to the database.
 *
 * VisibleForPatient:
 * Information that can ultimately be presented to the patient/caregiver.
 *
 * HiddenFromPatient:
 * Extracted clinical information that should not be directly presented
 * through the patient-facing UI.
 *
 * TemporaryArtifacts:
 * Information from documents that are not part of the current
 * prescription/doctor-notes workflow, such as lab/test/diagnostic reports.
 */
export interface PrescriptionDocumentSession {

    VisibleForPatient:
        ExtractedPrescription[];

    HiddenFromPatient:
        ExtractedPrescription[];

    TemporaryArtifacts:
        ExtractedPrescription[];

}

/**
 * Creates a completely empty document session.
 *
 * A new session is created for every upload workflow.
 * Nothing is persisted outside the current session.
 */
export function createPrescriptionDocumentSession():
    PrescriptionDocumentSession {

    return {

        VisibleForPatient: [],

        HiddenFromPatient: [],

        TemporaryArtifacts: [],

    };

}