import { NextResponse } from "next/server";

import {
    runVerifyPinAccessDiagnostic,
} from "@/lib/security/verifyPinAccessDiagnostic";

export async function GET() {
    try {
        const accessRecords =
            await runVerifyPinAccessDiagnostic();

        return NextResponse.json({
            success: true,
            accessRecords,
        });
    } catch (error) {
        console.error(
            "[SECURITY-DIAGNOSTIC] carevr_access failed:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Diagnostic failed.",
            },
            {
                status: 500,
            }
        );
    }
}