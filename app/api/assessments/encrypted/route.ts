
import { NextResponse } from "next/server";
import { saveEncryptedAssessment } from "@/lib/security/dataProtection/assessmentPersistenceService";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const saved = await saveEncryptedAssessment(body);

    return NextResponse.json(
      {
        success: true,
        data: saved,
      },
      { status: 201 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "";

    if (message === "User is not authenticated.") {
      return NextResponse.json(
        { success: false, error: message },
        { status: 401 }
      );
    }

    if (
      message.includes("not authorized") ||
      message.includes("access is required")
    ) {
      return NextResponse.json(
        { success: false, error: message },
        { status: 403 }
      );
    }

    console.error("Encrypted assessment save failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to save the encrypted assessment.",
      },
      { status: 400 }
    );
  }
}
