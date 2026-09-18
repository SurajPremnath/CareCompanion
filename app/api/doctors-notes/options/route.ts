import { NextResponse } from "next/server";

import {
  doctorsNotesOptionsRepository,
} from "@/lib/repositories/doctorsNotesOptionsRepository";

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const patientId =
      body?.patientId;

    if (
      typeof patientId !== "string" ||
      !patientId
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Patient identifier is required.",
        },
        {
          status: 400,
        }
      );
    }

    const doctors =
      await doctorsNotesOptionsRepository.getForPatient(
        patientId
      );

    return NextResponse.json(
      {
        success: true,
        data: doctors,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Doctors Notes options retrieval failed:",
      error
    );

    if (
      error instanceof Error &&
      error.message ===
        "User is not authenticated."
    ) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        {
          status: 401,
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to retrieve Doctors Notes options.",
      },
      {
        status: 500,
      }
    );
  }
}