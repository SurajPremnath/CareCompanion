import { createHash, randomBytes } from "crypto";

export interface InviteeInvitationTokenResult {
    token: string;
    tokenHash: string;
}

class InviteeInvitationToken {
    generate(): InviteeInvitationTokenResult {
        const token =
            randomBytes(32).toString("base64url");

        const tokenHash =
            createHash("sha256")
                .update(token)
                .digest("hex");

        return {
            token,
            tokenHash,
        };
    }
}

export const inviteeInvitationToken =
    new InviteeInvitationToken();