import { NextResponse } from "next/server";

import {
  getProtectedPatient,
} from "@/lib/security/dataProtection/patientPersistenceService";

export async function GET(
  request: Request,
  context: {
    params: Promise<{
      patientId: string;
    }>;
  }
) {
  try {
    const {
      patientId,
    } = await context.params;

    if (!patientId) {
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

    const patient =
      await getProtectedPatient(
        patientId
      );

    if (!patient) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Patient not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: patient,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Protected patient retrieval failed:",
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
          error:
            error.message,
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
          "Unable to retrieve patient.",
      },
      {
        status: 500,
      }
    );
  }
}