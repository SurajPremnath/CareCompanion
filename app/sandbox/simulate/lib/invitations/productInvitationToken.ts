import {
    createHash,
    randomBytes,
} from "crypto";


const TOKEN_BYTES = 32;


export interface ProductInvitationTokenResult {
    token: string;
    tokenHash: string;
}


class ProductInvitationToken {

    generate():
        ProductInvitationTokenResult {

        const token =
            randomBytes(
                TOKEN_BYTES
            ).toString(
                "base64url"
            );


        const tokenHash =
            createHash(
                "sha256"
            )
                .update(
                    token,
                    "utf8"
                )
                .digest(
                    "hex"
                );


        return {
            token,
            tokenHash,
        };

    }

}


export const productInvitationToken =
    new ProductInvitationToken();