import { createSupabaseServerClient } from "@/lib/supabase/server";

class ProductInvitationProvisioning {

    async provisionAccepted(
        email: string,
        createdBy: string
    ): Promise<void> {

        const normalizedEmail =
            email.trim().toLowerCase();

        if (!normalizedEmail) {
            throw new Error(
                "Email is required to provision CareVR access."
            );
        }

        const serverSupabase =
            await createSupabaseServerClient();

        const {
            data: existingInvitation,
            error: lookupError
        } =
            await serverSupabase
                .from("carevr_product_invitations")
                .select(
                    "id, status"
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

        if (lookupError) {
            throw new Error(
                "Unable to check the CareVR product invitation."
            );
        }

        if (
            existingInvitation?.status ===
            "ACCEPTED"
        ) {
            return;
        }

        if (existingInvitation) {

            const {
                error: updateError
            } =
                await serverSupabase
                    .from("carevr_product_invitations")
                    .update({
                        status:
                            "ACCEPTED",

                        expires_at:
                            "9999-12-31T23:59:59.999Z",

                        accepted_at:
                            new Date().toISOString(),

                        revoked_at:
                            null,

                        updated_at:
                            new Date().toISOString(),
                    })
                    .eq(
                        "id",
                        existingInvitation.id
                    );

            if (updateError) {
                throw new Error(
                    "Unable to activate the CareVR product invitation."
                );
            }

            return;
        }

        const {
            error: insertError
        } =
            await serverSupabase
                .from("carevr_product_invitations")
                .insert({
                    email:
                        normalizedEmail,

                    status:
                        "ACCEPTED",

                    invitation_sent_at:
                        new Date().toISOString(),

                    expires_at:
                        "9999-12-31T23:59:59.999Z",

                    invitation_count:
                        1,

                    accepted_at:
                        new Date().toISOString(),

                    revoked_at:
                        null,

                    created_by:
                        createdBy,

                    created_at:
                        new Date().toISOString(),

                    updated_at:
                        new Date().toISOString(),
                });

        if (insertError) {
            throw new Error(
                "Unable to create the CareVR product invitation."
            );
        }
    }
}

export const productInvitationProvisioning =
    new ProductInvitationProvisioning();