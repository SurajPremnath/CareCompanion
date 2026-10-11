import { NextResponse } from "next/server";

import {
    createSupabaseServerClient,
} from "@/lib/supabase/server";

import {
    doctorsNotesRepository,
} from "@/lib/repositories/doctorsNotesRepository";


export async function GET(
    request: Request,
) {

    try {

        //--------------------------------------------------
        // Authentication
        //--------------------------------------------------

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



        //--------------------------------------------------
        // Read request parameters
        //--------------------------------------------------

        const url = new URL(request.url);

        const careMode = url.searchParams.get("careMode");
        const requestedPatientId = url.searchParams.get("patientId");
        const patientId = url.searchParams.get("patientId");
        const startDate = url.searchParams.get("startDate");
        const endDate = url.searchParams.get("endDate");

        //--------------------------------------------------
        // Validate parameters
        //--------------------------------------------------

        if (careMode !== "SELF" && careMode !== "FAMILY") {
            return NextResponse.json(
                { error: "Invalid care mode." },
                { status: 400 },
            );
        }

        if (careMode === "SELF" && patientId) {
            return NextResponse.json(
                { error: "SELF mode must not include a patient." },
                { status: 400 },
            );
        }

        if (careMode === "FAMILY" && !patientId) {
            return NextResponse.json(
                { error: "A patient is required in FAMILY mode." },
                { status: 400 },
            );
        }

        if (!startDate || !endDate) {
            return NextResponse.json(
                { error: "Start date and end date are required." },
                { status: 400 },
            );
        }


        //--------------------------------------------------
        // Retrieve authorized notes and treatments.
        // Supabase RLS remains enforced; decryption is server-side.
        //--------------------------------------------------

        const {
            doctorsNotes,
            treatments,
        } = await doctorsNotesRepository.getNotesAndTreatmentsForPeriod(
            careMode,
            patientId,
            startDate,
            endDate,
        );

        //--------------------------------------------------
        // Return application-level note data.
        //--------------------------------------------------

        return NextResponse.json(
            {
                doctorsNotes,
                treatments,
            },
            {
                status: 200,
            },
        );

    } catch (error) {

        console.error(
            "Executive summary Doctors Notes error:",
            error,
        );

        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Unable to load Doctors Notes.",
            },
            {
                status: 500,
            },
        );
    }
}