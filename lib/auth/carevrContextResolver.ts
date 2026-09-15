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

class CareVRContextResolver {

    async getAvailableContexts(
        userId: string
    ): Promise<CareVRAvailableContext[]> {

        const activeAccess =
            await carevrAccessRepository
                .getActiveAccessForUser(
                    userId
                );

        const contexts =
            activeAccess
                .map(
                    (access) => {

                        switch (
                            access.accessType
                        ) {

                            case "PRIMARY":

                                return {
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

                            case "SECONDARY_FAMILY_MEMBER":

                                return {
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

                            case "CARETAKER":

                                return {
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

                            case "DOCTOR":

                                return {
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

                            default:

                                return null;
                        }

                    }
                )
                .filter(
                    (
                        context
                    ): context is CareVRAvailableContext =>
                        context !== null
                );

        return contexts;
    }

}

export const carevrContextResolver =
    new CareVRContextResolver();