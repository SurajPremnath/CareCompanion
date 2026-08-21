// ============================================================
// CareVR — Doctor Notes Temporary JSON Store
// ============================================================
//
// These three JSON buckets exist only for the current
// document-processing session.
//
// They are intentionally kept in memory.
// They must NOT be persisted to database, localStorage,
// sessionStorage, or filesystem.
//
// Classification is deliberately simple:
//
// PERMANENT
//   ├── VisibleForPatient
//   └── HiddenFromPatient
//
// TEMPORARY
//   └── Temporary
//
// The upload flow is responsible for deciding where an
// extracted document belongs and which extracted fields are
// visible or hidden.
// ============================================================

import type {
    ExtractedPrescription,
} from "./prescriptionImageTypes";

export interface TemporaryJsonStore {

    // --------------------------------------------------------
    // Permanent — information currently displayed to patient
    // --------------------------------------------------------

    PermanentVisible:
        ExtractedPrescription[];

    // --------------------------------------------------------
    // Permanent — information retained but not displayed
    // --------------------------------------------------------

    PermanentHidden:
        ExtractedPrescription[];

    // --------------------------------------------------------
    // Temporary — reports/results that must not become part
    // of the permanent patient-facing consultation record.
    // --------------------------------------------------------

    Temporary:
        ExtractedPrescription[];
}

function createEmptyTemporaryJson(): TemporaryJsonStore {
    return {

        PermanentVisible: [],

        PermanentHidden: [],

        Temporary: [],

    };
}

let temporaryJson:
    TemporaryJsonStore =
        createEmptyTemporaryJson();

// ============================================================
// Reset
// ============================================================

export function resetTemporaryJson(): void {

    temporaryJson =
        createEmptyTemporaryJson();

}

// ============================================================
// Read
// ============================================================

export function getTemporaryJson():
    TemporaryJsonStore {

    return temporaryJson;

}

// ============================================================
// Permanent — Visible
// ============================================================

export function appendPermanentVisible(
    data: ExtractedPrescription
): void {

    temporaryJson
        .PermanentVisible
        .push(data);

}

// ============================================================
// Permanent — Hidden
// ============================================================

export function appendPermanentHidden(
    data: ExtractedPrescription
): void {

    temporaryJson
        .PermanentHidden
        .push(data);

}

// ============================================================
// Temporary
// ============================================================

export function appendTemporary(
    data: ExtractedPrescription
): void {

    temporaryJson
        .Temporary
        .push(data);

}

// ============================================================
// Destroy
// ============================================================

export function destroyTemporaryJson(): void {

    temporaryJson =
        createEmptyTemporaryJson();

}