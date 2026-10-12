
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST() {
    try {
        const serverSupabase =
            await createSupabaseServerClient();

        const {
            data: { user },
            error: authError,
        } = await serverSupabase.auth.getUser();

        if (authError || !user?.email) {
            return NextResponse.json(
                { success: false, message: "Authentication required." },
                { status: 401 }
            );
        }

        const email = user.email.trim().toLowerCase();

        const { data: invitation, error: lookupError } =
            await supabaseAdmin
                .from("carevr_product_invitations")
                .select("id")
                .eq("email", email)
                .eq("status", "PENDING")
                .order("created_at", { ascending: false })
                .limit(1)
                .maybeSingle();

        if (lookupError) {
            throw lookupError;
        }

        // No pending product invitation is a valid no-op.
        if (!invitation) {
            return NextResponse.json({
                success: true,
                updated: false,
            });
        }

        const { data: updatedInvitation, error: updateError } =
            await supabaseAdmin
                .from("carevr_product_invitations")
                .update({
                    status: "ACCEPTED",
                    accepted_at: new Date().toISOString(),
                })
                .eq("id", invitation.id)
                .eq("status", "PENDING")
                .select("id")
                .maybeSingle();

        if (updateError) {
            throw updateError;
        }

        return NextResponse.json({
            success: true,
            updated: Boolean(updatedInvitation),
        });
    } catch (error) {
        console.error(
            "Product invitation status update failed.",
            error
        );

        return NextResponse.json(
            { success: false },
            { status: 500 }
        );
    }
}
