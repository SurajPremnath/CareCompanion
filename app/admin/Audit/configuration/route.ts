import {
    NextResponse,
} from "next/server";

import {
    supabaseAdmin,
} from "@/lib/supabaseAdmin";


export async function GET() {

    const {
        data: product,
        error: productError,
    } =
        await supabaseAdmin
            .from("founder_audit_products")
            .select(
                "product_id, product_name"
            )
            .eq(
                "product_name",
                "CareVR"
            )
            .single();

    if (
        productError ||
        !product
    ) {
        return NextResponse.json(
            {
                error:
                    productError?.message ??
                    "CareVR product not found.",
            },
            {
                status: 500,
            }
        );
    }


    const {
        data: rule,
        error: ruleError,
    } =
        await supabaseAdmin
            .from("founder_audit_rules")
            .select(
                "rule_id, rule"
            )
            .eq(
                "product_id",
                product.product_id
            )
            .single();

    if (
        ruleError ||
        !rule
    ) {
        return NextResponse.json(
            {
                error:
                    ruleError?.message ??
                    "CareVR audit rule not found.",
            },
            {
                status: 500,
            }
        );
    }


return NextResponse.json({
    productId:
        product.product_id,

    productName:
        product.product_name,

    ruleId:
        rule.rule_id,

    rule:
        rule.rule,

    /*
     * Audit pricing is supplied explicitly by the
     * server-side audit configuration boundary.
     *
     * Monetary pricing has not yet been configured for
     * CareVR. Zero pricing therefore preserves actual
     * observed token usage without inventing model cost.
     *
     * Replace these values with the approved pricing
     * configuration when pricing becomes available.
     */
    pricing: {
        model:
            "STRATAPARSE",

        inputCostPer1K:
            0,

        outputCostPer1K:
            0,

        currency:
            "USD",
    },
});
}