import { createHash, randomBytes } from "crypto";

export interface InvitationTokenResult {
    token: string;
    tokenHash: string;
}

class InvitationToken {
    generate(): InvitationTokenResult {
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

export const invitationToken =
    new InvitationToken();