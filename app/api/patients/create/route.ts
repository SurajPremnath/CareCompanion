import { NextResponse } from "next/server";

import {
  createProtectedPatient,
} from "@/lib/security/dataProtection/patientPersistenceService";

export async function POST(
  request: Request
) {

  try {

    //------------------------------------------------------
    // Read request body
    //------------------------------------------------------

    const body =
      await request.json();

    //------------------------------------------------------
    // Create Patient through protected server boundary
    //------------------------------------------------------

    const patient =
      await createProtectedPatient({
        fullName:
          body.fullName,

        dateOfBirth:
          body.dateOfBirth ?? null,

        gender:
          body.gender,

        relationship:
          body.relationship,

        status:
          body.status,
      });

    //------------------------------------------------------
    // Return only the identifier required by the caller
    //------------------------------------------------------

    return NextResponse.json(
      {
        success: true,
        data: {
          id: patient.id,
        },
      },
      {
        status: 201,
      }
    );

  } catch (error) {

    console.error(
      "Patient creation failed:",
      error
    );

    //------------------------------------------------------
    // Known business validation failures
    //------------------------------------------------------

    if (
      error instanceof Error &&
      (
        error.message ===
          "User is not authenticated." ||
        error.message ===
          "Active PRIMARY CareVR Family could not be resolved."
      )
    ) {

      return NextResponse.json(
        {
          success: false,
          error:
            error.message,
        },
        {
          status: 403,
        }
      );

    }

    if (
      error instanceof Error &&
      (
        error.message ===
          "A patient with the same name and date of birth already exists." ||
        error.message ===
          "Standard accounts can manage only one family member."
      )
    ) {

      return NextResponse.json(
        {
          success: false,
          error:
            error.message,
        },
        {
          status: 409,
        }
      );

    }

    //------------------------------------------------------
    // Generic failure
    //------------------------------------------------------

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to create patient.",
      },
      {
        status: 500,
      }
    );
  }
}