import { createHash } from "crypto";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

export type ProductInvitationStatus =
    | "NO_INVITATION"
    | "PENDING"
    | "ACCEPTED";

export interface ProductInvitationValidationResult {
    status: ProductInvitationStatus;
}

class ProductInvitationValidation {

    async validate(
        token: string,
        email: string
    ): Promise<ProductInvitationValidationResult> {

        const normalizedToken =
            token.trim();

        const normalizedEmail =
            email.trim().toLowerCase();

        if (!normalizedToken) {
            return {
                status: "NO_INVITATION",
            };
        }

        const tokenHash =
            createHash("sha256")
                .update(
                    normalizedToken,
                    "utf8"
                )
                .digest("hex");

        const { data, error } =
            await supabaseAdmin
                .from("carevr_product_invitations")
                .select(
                    "email, status, expires_at"
                )
                .eq(
                    "token_hash",
                    tokenHash
                )
                .maybeSingle();

        if (error) {
            throw new Error(
                "Unable to validate the CareVR invitation."
            );
        }

        if (!data) {
            return {
                status: "NO_INVITATION",
            };
        }

        /*
         * The token identifies the invitation.
         * Email is only a consistency check.
         */
        if (
            normalizedEmail &&
            data.email
                .trim()
                .toLowerCase() !==
                normalizedEmail
        ) {
            return {
                status: "NO_INVITATION",
            };
        }

        if (
            data.status === "ACCEPTED"
        ) {
            return {
                status: "ACCEPTED",
            };
        }

        if (
            data.status === "PENDING" &&
            new Date(data.expires_at) > new Date()
        ) {
            return {
                status: "PENDING",
            };
        }

        return {
            status: "NO_INVITATION",
        };
    }
}

export const productInvitationValidation =
    new ProductInvitationValidation();