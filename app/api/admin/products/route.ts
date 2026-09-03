import {
    NextResponse,
} from "next/server";

import {
    supabaseAdmin,
} from "@/lib/supabaseAdmin";


export async function GET() {

    try {

        const {
            data,
            error,
        } =
            await supabaseAdmin
                .from(
                    "founder_audit_products"
                )
                .select(
                    "product_id, product_name"
                )
                .order(
                    "product_name",
                    {
                        ascending:
                            true,
                    }
                );

        if (
            error
        ) {
            throw new Error(
                error.message
            );
        }

        return NextResponse.json({
            products:
                data ?? [],
        });

    } catch (
        error
    ) {

        console.error(
            "AUDIT PRODUCTS LOAD ERROR:",
            error
        );

        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Unable to load audit products.",
            },
            {
                status:
                    500,
            }
        );
    }
}