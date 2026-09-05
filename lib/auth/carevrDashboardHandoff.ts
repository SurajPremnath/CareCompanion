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

import {
    carevrAccessRepository,
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
// This method only collates information that already exists
// in the CareVR access and permission repositories.
//------------------------------------------------------------

export async function resolveCareVRDashboardHandoff(
    userId: string,
    selectedRole: CareVRLoginRole
): Promise<CareVRDashboardHandoff> {

    //--------------------------------------------------------
    // Resolve active CareVR access for the selected role.
    //--------------------------------------------------------

    const access =
        await carevrAccessRepository
            .getActiveAccessForLoginRole(
                userId,
                selectedRole
            );

if (!access) {

    if (selectedRole === "DOCTOR") {

        throw new Error(
            "Doctor access is not assigned. Please contact your Primary."
        );

    }

    if (selectedRole === "CARETAKER") {

        throw new Error(
            "Caretaker access is not assigned. Please contact your Primary."
        );

    }

    throw new Error(
        "Selected CareVR role is not assigned. Please contact your Primary."
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

if (permissions.length === 0) {

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

    const patientScope =
        await carevrAccessRepository
            .getPatientScope(
                access,
                selectedRole
            );

    const handoff: CareVRDashboardHandoff = {
        userId,
        role: selectedRole,
        access: {
            id: access.id,
            accessType: access.accessType,
            familyId: access.familyId,
            patientId: access.patientId,
        },
        modules,
        moduleCount: modules.length,
        patients: patientScope.patients.map(
            (patient) => ({
                id: patient.id,
                userId: patient.userId,
                name: patient.fullName,
                relationship: patient.relationship,
            })
        ),
        patientCount: patientScope.patients.length,
        scope: patientScope.scope,
    };



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
