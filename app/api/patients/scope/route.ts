import { NextResponse } from "next/server";

import {
  getProtectedPatientScopeForAccess,
} from "@/lib/security/dataProtection/patientPersistenceService";

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const accessId =
      body?.accessId;

    const selectedRole =
      body?.selectedRole;

    if (
      typeof accessId !== "string" ||
      !accessId
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "CareVR access identifier is required.",
        },
        {
          status: 400,
        }
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
          success: false,
          error:
            "Valid CareVR role is required.",
        },
        {
          status: 400,
        }
      );
    }

    const scope =
      await getProtectedPatientScopeForAccess(
        accessId,
        selectedRole
      );

    return NextResponse.json(
      {
        success: true,
        data: scope,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Protected patient scope retrieval failed:",
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

    if (
      error instanceof Error &&
      (
        error.message ===
          "CareVR access is not available." ||
        error.message ===
          "Selected CareVR role is not authorized for this access."
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        {
          status: 403,
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to retrieve patient scope.",
      },
      {
        status: 500,
      }
    );
  }
}