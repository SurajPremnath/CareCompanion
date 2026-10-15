import {
    NextResponse,
} from "next/server";

import {
    saveAudit,
} from "@/CareVRTestAuditAgent/runtime/auditSave";

import type {
    AuditSaveInput,
} from "@/CareVRTestAuditAgent/runtime/auditSave";


export async function POST(
    request: Request
) {

    try {

        const body =
            await request.json() as AuditSaveInput;

        const result =
            await saveAudit(
                body
            );

        return NextResponse.json(
            result
        );

    } catch (
        error
    ) {

        console.error(
            "AUDIT DATABASE SAVE ERROR:",
            error
        );

        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to save audit.",
            },
            {
                status:
                    500,
            }
        );
    }
}