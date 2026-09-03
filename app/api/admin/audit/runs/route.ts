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

        const ruleId =
            url.searchParams.get(
                "ruleId"
            );

        if (
            !productId ||
            !ruleId
        ) {
            return NextResponse.json(
                {
                    error:
                        "productId and ruleId are required.",
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
                    "founder_audit_summary"
                )
                .select(
                    `
                    run_id,
                    product_id,
                    rule_id,
                    run_date,
                    run_started_at,
                    run_ended_at,
                    audit_status,
                    audit_status_reason,
                    document_count,
                    completed_documents,
                    failed_documents,
                    total_pages,
                    request_count,
                    completed_requests,
                    failed_requests,
                    input_tokens,
                    output_tokens,
                    total_tokens,
                    total_cost,
                    currency,
                    rule_snapshot,
                    metadata
                    `
                )
                .eq(
                    "product_id",
                    productId
                )
                .eq(
                    "rule_id",
                    ruleId
                )
                .order(
                    "run_started_at",
                    {
                        ascending:
                            false,
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
            runs:
                data ?? [],
        });

    } catch (
        error
    ) {

        console.error(
            "AUDIT RUNS LOAD ERROR:",
            error
        );

        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Unable to load audit runs.",
            },
            {
                status:
                    500,
            }
        );
    }
}