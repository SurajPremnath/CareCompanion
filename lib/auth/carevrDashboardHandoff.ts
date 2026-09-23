//------------------------------------------------------------
// CareVR Dashboard Handoff
//
// Purpose:
// Collates the CareVR access, active module permissions, and
// Patient scope already assigned to the authenticated user.
//
// This file does NOT authenticate the user or grant access.
// It only prepares the resolved information for Dashboard.
//------------------------------------------------------------

import type {
    ActiveCareVRAccess,
    CareVRAccessType,
    CareVRLoginRole,
} from "@/lib/repositories/carevrAccessRepository";

import {
    carevrModulePermissions,
} from "@/lib/repositories/carevrModulePermissions";


//------------------------------------------------------------
// Dashboard Module
//------------------------------------------------------------

export interface CareVRDashboardModule {

    module: string;

    permission:
        | "VIEW"
        | "CONTRIBUTE"
        | "ADMIN";

}


//------------------------------------------------------------
// Dashboard Patient
//------------------------------------------------------------

export interface CareVRDashboardPatient {

    id: string;

    userId: string | null;

    name: string;

    relationship: string | null;

}


//------------------------------------------------------------
// Dashboard Handoff
//------------------------------------------------------------

export interface CareVRDashboardHandoff {

    userId: string;

    role: CareVRLoginRole;

    access: {

        id: string;

        accessType: CareVRAccessType;

        familyId: string | null;

        patientId: string | null;

    };

    modules: CareVRDashboardModule[];

    moduleCount: number;

    patients: CareVRDashboardPatient[];

    patientCount: number;

    scope:
        | "SELF_ONLY"
        | "PATIENTS";

}


//------------------------------------------------------------
// Resolve Dashboard Handoff
//
// The selected active CareVR access record is supplied by the
// existing CareVR context resolution stage.
//
// This avoids querying carevr_access a second time merely to
// reconstruct the same access record.
//
// Module permissions and protected Patient scope remain
// independently resolved and validated.
//------------------------------------------------------------

export async function resolveCareVRDashboardHandoff(
    userId: string,
    selectedRole: CareVRLoginRole,
    access: ActiveCareVRAccess
): Promise<CareVRDashboardHandoff> {

    //--------------------------------------------------------
    // The access record has already been resolved from the
    // authenticated user's active CareVR contexts.
    //
    // Do not perform another carevr_access lookup here.
    //--------------------------------------------------------

    if (
        access.userId !== userId ||
        access.accessStatus !== "ACTIVE"
    ) {

        throw new Error(
            "Selected CareVR access is not valid for this account."
        );

    }


    //--------------------------------------------------------
    // Resolve active modules assigned to that access.
    //--------------------------------------------------------

    const permissions =
        await carevrModulePermissions
            .getActivePermissions(
                access.id
            );


    //--------------------------------------------------------
    // Gate 3: At least one active module must be assigned.
    // Without module access, the user cannot enter Dashboard.
    //--------------------------------------------------------

    if (
        access.accessType !== "PRIMARY" &&
        permissions.length === 0
    ) {

        throw new Error(
            "No CareVR modules are assigned. Please reach out to Primary for module access."
        );

    }


    const modules:
        CareVRDashboardModule[] =
        permissions.map(
            (permission) => ({

                module:
                    permission.module,

                permission:
                    permission.permission as
                        | "VIEW"
                        | "CONTRIBUTE"
                        | "ADMIN",

            })
        );


    //--------------------------------------------------------
    // Resolve Patient scope assigned to that access.
    //--------------------------------------------------------

    const patientScopeResponse =
        await fetch(
            "/api/patients/scope",
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json",
                },
                body: JSON.stringify({
                    accessId: access.id,
                    selectedRole,
                }),
            }
        );

    const patientScopeResult =
        await patientScopeResponse.json();

    if (
        !patientScopeResponse.ok ||
        !patientScopeResult?.success
    ) {

        throw new Error(
            patientScopeResult?.error ??
                "Unable to retrieve protected patient scope."
        );

    }

    const patientScope =
        patientScopeResult.data;


    //--------------------------------------------------------
    // Build Dashboard handoff.
    //--------------------------------------------------------

    const handoff:
        CareVRDashboardHandoff = {

        userId,

        role:
            selectedRole,

        access: {

            id:
                access.id,

            accessType:
                access.accessType,

            familyId:
                access.familyId,

            patientId:
                access.patientId,

        },

        modules,

        moduleCount:
            modules.length,

        patients:
            patientScope.patients.map(
                (patient: {
                    id: string;
                    userId: string | null;
                    fullName: string;
                    relationship:
                        | string
                        | null;
                }) => ({

                    id:
                        patient.id,

                    userId:
                        patient.userId,

                    name:
                        patient.fullName,

                    relationship:
                        patient.relationship,

                })
            ),

        patientCount:
            patientScope.patients.length,

        scope:
            patientScope.scope,

    };


    //--------------------------------------------------------
    // Store Dashboard handoff for the Dashboard page.
    //--------------------------------------------------------

    if (
        typeof window !== "undefined"
    ) {

        sessionStorage.setItem(
            "carevr_dashboard_handoff",
            JSON.stringify(handoff)
        );

    }


    return handoff;
}


export function getCareVRDashboardHandoff():
    CareVRDashboardHandoff | null {

    if (
        typeof window === "undefined"
    ) {

        return null;

    }


    const storedHandoff =
        sessionStorage.getItem(
            "carevr_dashboard_handoff"
        );


    if (!storedHandoff) {

        return null;

    }


    try {

        return JSON.parse(
            storedHandoff
        ) as CareVRDashboardHandoff;

    }
    catch {

        sessionStorage.removeItem(
            "carevr_dashboard_handoff"
        );

        return null;

    }

}