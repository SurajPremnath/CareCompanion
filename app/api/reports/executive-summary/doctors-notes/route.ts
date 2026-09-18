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

        const url =
            new URL(request.url);

        const patientId =
            url.searchParams.get(
                "patientId",
            );

        const startDate =
            url.searchParams.get(
                "startDate",
            );

        const endDate =
            url.searchParams.get(
                "endDate",
            );


        //--------------------------------------------------
        // Validate parameters
        //--------------------------------------------------

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

        if (!startDate) {

            return NextResponse.json(
                {
                    error:
                        "Start date is required.",
                },
                {
                    status: 400,
                },
            );
        }

        if (!endDate) {

            return NextResponse.json(
                {
                    error:
                        "End date is required.",
                },
                {
                    status: 400,
                },
            );
        }


        //--------------------------------------------------
        // Retrieve protected Doctors Notes.
        //
        // Repository → persistence service → Supabase RLS
        // → decrypt after authorized retrieval.
        //--------------------------------------------------

        const doctorsNotes =
            await doctorsNotesRepository.getForPeriod(
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