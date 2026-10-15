import type {
    CareVRAvailableContext,
} from "@/lib/auth/carevrContextResolver";

export type CareVRContextSelectionHandoff = {

    userId: string;

    context: CareVRAvailableContext;

    createdAt: string;

};

let handoff:
    CareVRContextSelectionHandoff | null =
    null;

/**
 * Short-lived handoff used when an authenticated
 * CareVR user selects a profile/context on the
 * dedicated profile-selection screen.
 *
 * This does not grant access.
 * The selected context must be re-resolved and
 * validated after returning to Login.
 */
export const carevrContextSelectionHandoff = {

    set(
        next: CareVRContextSelectionHandoff
    ): void {

        handoff = next;

    },

    get():
        CareVRContextSelectionHandoff | null {

        return handoff;

    },

    exists(): boolean {

        return handoff !== null;

    },

    belongsToUser(
        userId: string
    ): boolean {

        return (
            handoff !== null &&
            handoff.userId === userId
        );

    },

    clear(): void {

        handoff = null;

    },

};