export type InviteeToPrimarySourceRole =
    | "CARETAKER"
    | "SECONDARY_FAMILY_MEMBER"
    | "DOCTOR";

export type InviteeToPrimaryHandoff = {
    userId: string;
    sourceRole: InviteeToPrimarySourceRole;
    targetRole: "PRIMARY";
    createdAt: string;
};

let handoff: InviteeToPrimaryHandoff | null = null;

/**
 * Transitional handoff for an existing invited CareVR user
 * who is establishing a PRIMARY profile.
 *
 * This is intentionally null when no invitee → PRIMARY
 * transition is in progress.
 */
export const inviteeToPrimaryHandoff = {
    /**
     * Creates the invitee → PRIMARY transition.
     */
    set(next: InviteeToPrimaryHandoff): void {
        handoff = next;
    },

    /**
     * Returns the current invitee → PRIMARY handoff.
     *
     * null means this is NOT an invitee → PRIMARY
     * registration flow.
     */
    get(): InviteeToPrimaryHandoff | null {
        return handoff;
    },

    /**
     * Returns true only when an invitee → PRIMARY
     * transition currently exists.
     */
    exists(): boolean {
        return handoff !== null;
    },

    /**
     * Validates that the handoff belongs to the
     * currently authenticated user.
     */
    belongsToUser(userId: string): boolean {
        return handoff !== null && handoff.userId === userId;
    },

    /**
     * Clears the transitional handoff.
     *
     * After successful PRIMARY registration/authorization,
     * this must return the application to the normal state.
     */
    clear(): void {
        handoff = null;
    },
};