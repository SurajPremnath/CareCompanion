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
        email: string
    ): Promise<ProductInvitationValidationResult> {

        const normalizedEmail =
            email.trim().toLowerCase();

        if (!normalizedEmail) {
            return {
                status: "NO_INVITATION",
            };
        }

        const { data, error } =
            await supabaseAdmin
                .from("carevr_product_invitations")
                .select(
                    "status, expires_at"
                )
                .eq(
                    "email",
                    normalizedEmail
                )
                .order(
                    "created_at",
                    {
                        ascending: false,
                    }
                )
                .limit(1)
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