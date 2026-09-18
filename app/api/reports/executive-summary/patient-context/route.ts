import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

import {
    getExecutiveSummaryPatientContext,
} from "@/lib/security/dataProtection/executiveSummaryDataProtectionService";

export async function GET(
    request: Request,
) {
    try {
        const supabase =
            await createSupabaseServerClient();

        const {
            data: {
                user,
            },
            error: userError,
        } =
            await supabase.auth.getUser();

        if (userError) {
            return NextResponse.json(
                {
                    error:
                        "Unable to verify the current user.",
                },
                {
                    status: 401,
                },
            );
        }

        if (!user) {
            return NextResponse.json(
                {
                    error:
                        "User is not authenticated.",
                },
                {
                    status: 401,
                },
            );
        }

        const url =
            new URL(request.url);

const patientId =
    url.searchParams.get(
        "patientId",
    );

const accessId =
    url.searchParams.get(
        "accessId",
    );

const selectedRole =
    url.searchParams.get(
        "selectedRole",
    );

if (!patientId) {
    return NextResponse.json(
        {
            error:
                "Patient is required.",
        },
        {
            status: 400,
        },
    );
}

if (!accessId) {
    return NextResponse.json(
        {
            error:
                "CareVR access is required.",
        },
        {
            status: 400,
        },
    );
}

if (
    selectedRole !== "SELF" &&
    selectedRole !== "FAMILY" &&
    selectedRole !== "CARETAKER" &&
    selectedRole !== "DOCTOR"
) {
    return NextResponse.json(
        {
            error:
                "Selected CareVR role is invalid.",
        },
        {
            status: 400,
        },
    );
}

const context =
    await getExecutiveSummaryPatientContext(
        patientId,
        accessId,
        selectedRole,
    );

        return NextResponse.json(
            context,
            {
                status: 200,
            },
        );
    } catch (error) {
        console.error(
            "Executive summary patient context error:",
            error,
        );

        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Unable to load patient context.",
            },
            {
                status: 500,
            },
        );
    }
}