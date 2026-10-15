export type CareVRAuthorizationHandoff = {
    userId: string;
    carevrRole: string;
    familyId: string | null;
    patientId: string | null;
    consentStage: string;
    governanceId: string | null;
    governanceVersion: string | null;
};

let authorizationHandoff: CareVRAuthorizationHandoff | null = null;

export const carevrAuthorizationHandoff = {
    set(
        handoff: CareVRAuthorizationHandoff
    ): void {
        authorizationHandoff = handoff;
    },

    get(): CareVRAuthorizationHandoff | null {
        return authorizationHandoff;
    },

    clear(): void {
        authorizationHandoff = null;
    },
};