import {
    NextResponse,
} from "next/server";

import {
    supabaseAdmin,
} from "@/lib/supabaseAdmin";


export async function GET(
    request: Request
) {

    try {

        const url =
            new URL(
                request.url
            );

        const productId =
            url.searchParams.get(
                "productId"
            );

        if (
            !productId
        ) {
            return NextResponse.json(
                {
                    error:
                        "productId is required.",
                },
                {
                    status:
                        400,
                }
            );
        }

        const {
            data,
            error,
        } =
            await supabaseAdmin
                .from(
                    "founder_audit_rules"
                )
                .select(
                    "rule_id, product_id, rule"
                )
                .eq(
                    "product_id",
                    productId
                )
                .order(
                    "rule"
                );

        if (
            error
        ) {
            throw new Error(
                error.message
            );
        }

        return NextResponse.json({
            rules:
                data ?? [],
        });

    } catch (
        error
    ) {

        console.error(
            "AUDIT RULES LOAD ERROR:",
            error
        );

        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Unable to load audit rules.",
            },
            {
                status:
                    500,
            }
        );
    }
}