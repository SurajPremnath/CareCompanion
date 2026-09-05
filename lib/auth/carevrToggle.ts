//------------------------------------------------------------
// CareVR Dashboard Toggle
//
// Purpose:
// Determines which existing CareVR dashboard care-mode
// options should be visible and which mode should be selected
// initially, based on the resolved Dashboard handoff.
//
// This function controls presentation only.
// It does not load Patients, calculate vitals, authenticate,
// authorize, navigate, or change Dashboard functionality.
//------------------------------------------------------------

import type {
    CareVRDashboardHandoff,
} from "@/lib/auth/carevrDashboardHandoff";


//------------------------------------------------------------
// Dashboard Toggle Configuration
//------------------------------------------------------------

export interface CareVRToggleConfiguration {

    showToggle: boolean;

    showSelf: boolean;

    showFamily: boolean;

    initialMode:
        | "SELF"
        | "FAMILY"
        | null;

}


//------------------------------------------------------------
// Resolve Dashboard Toggle
//------------------------------------------------------------
//
// Rules:
//
// SELF
//   No Patients  -> SELF only
//   Patients     -> SELF + FAMILY, SELF selected
//
// FAMILY
//   -> SELF + FAMILY, FAMILY selected
//
// CARETAKER
//   -> FAMILY only, FAMILY selected
//
// DOCTOR
//   -> No toggle
//------------------------------------------------------------

export function getCareVRToggle(
    handoff: CareVRDashboardHandoff
): CareVRToggleConfiguration {

    if (
        handoff.role === "SELF"
    ) {

        if (
            handoff.patientCount > 0
        ) {

            return {
                showToggle: true,
                showSelf: true,
                showFamily: true,
                initialMode: "SELF",
            };

        }

        return {
            showToggle: false,
            showSelf: true,
            showFamily: false,
            initialMode: "SELF",
        };

    }


if (
    handoff.role === "FAMILY"
) {

    if (
        handoff.patientCount > 0
    ) {

        return {
            showToggle: true,
            showSelf: true,
            showFamily: true,
            initialMode: "FAMILY",
        };

    }

    return {
        showToggle: false,
        showSelf: true,
        showFamily: false,
        initialMode: "SELF",
    };

}


    if (
        handoff.role === "CARETAKER"
    ) {

        return {
            showToggle: false,
            showSelf: false,
            showFamily: true,
            initialMode: "FAMILY",
        };

    }


    // DOCTOR

    return {
        showToggle: false,
        showSelf: false,
        showFamily: false,
        initialMode: null,
    };

}