import {
    carevrAccessRepository,
} from "@/lib/repositories/carevrAccessRepository";

import type {
    ActiveCareVRAccess,
    CareVRLoginRole,
} from "@/lib/repositories/carevrAccessRepository";

export interface CareVRAvailableContext {

    accessId: string;

    loginRole: CareVRLoginRole;

    accessType: ActiveCareVRAccess["accessType"];

    familyId: string | null;

    patientId: string | null;

    label: string;

}

export interface CareVRAvailableContextsResult {

    activeAccessRecords: ActiveCareVRAccess[];

    contexts: CareVRAvailableContext[];

}

class CareVRContextResolver {

    async getAvailableContexts(
        userId: string
    ): Promise<CareVRAvailableContextsResult> {

        /*
         * ONE carevr_access query.
         *
         * Retain the complete authoritative result so
         * subsequent stages can reuse the access records
         * instead of querying carevr_access again merely
         * to reconstruct the same context.
         */
        const activeAccess =
            await carevrAccessRepository
                .getActiveAccessForUser(
                    userId
                );

        const contexts: CareVRAvailableContext[] = [];

        const seenRoles =
            new Set<CareVRLoginRole>();

        for (
            const access
            of activeAccess
        ) {

            let context:
                CareVRAvailableContext | null =
                null;

            switch (
                access.accessType
            ) {

                case "PRIMARY":

                    context = {
                        accessId:
                            access.id,

                        loginRole:
                            "SELF",

                        accessType:
                            access.accessType,

                        familyId:
                            access.familyId,

                        patientId:
                            access.patientId,

                        label:
                            "Self",
                    };

                    break;

                case "SECONDARY_FAMILY_MEMBER":

                    context = {
                        accessId:
                            access.id,

                        loginRole:
                            "FAMILY",

                        accessType:
                            access.accessType,

                        familyId:
                            access.familyId,

                        patientId:
                            access.patientId,

                        label:
                            "Family Member",
                    };

                    break;

                case "CARETAKER":

                    context = {
                        accessId:
                            access.id,

                        loginRole:
                            "CARETAKER",

                        accessType:
                            access.accessType,

                        familyId:
                            access.familyId,

                        patientId:
                            access.patientId,

                        label:
                            "CareTaker",
                    };

                    break;

                case "DOCTOR":

                    context = {
                        accessId:
                            access.id,

                        loginRole:
                            "DOCTOR",

                        accessType:
                            access.accessType,

                        familyId:
                            access.familyId,

                        patientId:
                            access.patientId,

                        label:
                            "Doctor",
                    };

                    break;

                default:

                    context = null;
            }

            if (
                context &&
                !seenRoles.has(
                    context.loginRole
                )
            ) {

                seenRoles.add(
                    context.loginRole
                );

                contexts.push(
                    context
                );
            }
        }

        return {
            activeAccessRecords:
                activeAccess,

            contexts,
        };
    }

}

export const carevrContextResolver =
    new CareVRContextResolver();