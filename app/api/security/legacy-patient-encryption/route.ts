import { NextResponse } from "next/server";

import {
  encryptLegacyPatientsPostRoleAssessment,
  type LegacyPatientProtectionRole,
} from "@/lib/security/dataProtection/legacyPatientEncryptionService";

const VALID_ROLES: LegacyPatientProtectionRole[] = [
  "SELF",
  "FAMILY",
  "CARETAKER",
  "DOCTOR",
];

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
      accessId.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Access context is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !VALID_ROLES.includes(
        selectedRole
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "A valid confirmed CareVR role is required.",
        },
        {
          status: 400,
        }
      );
    }

    await encryptLegacyPatientsPostRoleAssessment(
      {
        accessId,
        selectedRole,
      }
    );

    return NextResponse.json(
      {
        success: true,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Post-role-assessment patient data protection failed:",
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
          "Unable to complete patient data protection.",
      },
      {
        status: 500,
      }
    );
  }
}