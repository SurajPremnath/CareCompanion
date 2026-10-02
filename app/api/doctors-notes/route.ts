import { NextResponse } from "next/server";

import {
  doctorsNotesRepository,
} from "@/lib/repositories/doctorsNotesRepository";

import {
  saveHealthcareDetails,
} from "@/lib/healthcare/healthcarePersistenceService";

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const patientId =
      body?.patientId;

const providerId =
  body?.providerId ?? null;

const doctorName =
  body?.doctorName ?? null;

const facilityName =
  body?.facilityName ?? null;

const specialisation =
  body?.specialisation ?? null;

    const doctorProfileId =
      body?.doctorProfileId ?? null;

    const facilityId =
      body?.facilityId ?? null;

    const noteAt =
      body?.noteAt;

    const note =
      body?.note;

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

if (
  providerId !== null &&
  typeof providerId !== "string"
) {
  return NextResponse.json(
    {
      success: false,
      error:
        "Invalid doctor identifier.",
    },
    {
      status: 400,
    }
  );
}

if (
  doctorName !== null &&
  typeof doctorName !== "string"
) {
  return NextResponse.json(
    {
      success: false,
      error:
        "Invalid doctor name.",
    },
    {
      status: 400,
    }
  );
}

if (
  facilityName !== null &&
  typeof facilityName !== "string"
) {
  return NextResponse.json(
    {
      success: false,
      error:
        "Invalid hospital name.",
    },
    {
      status: 400,
    }
  );
}

if (
  specialisation !== null &&
  typeof specialisation !== "string"
) {
  return NextResponse.json(
    {
      success: false,
      error:
        "Invalid specialisation.",
    },
    {
      status: 400,
    }
  );
}

    if (
      doctorProfileId !== null &&
      typeof doctorProfileId !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid doctor profile.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      facilityId !== null &&
      typeof facilityId !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid facility.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      typeof noteAt !== "string" ||
      !noteAt
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Note date and time are required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      typeof note !== "string" ||
      !note.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Doctor note cannot be empty.",
        },
        {
          status: 400,
        }
      );
    }

    if (note.length > 2000) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Doctor note cannot exceed 2000 characters.",
        },
        {
          status: 400,
        }
      );
    }

const healthcareDetails =
  await saveHealthcareDetails({
    patientId,
    providerId,
    doctorName,
    facilityId,
    facilityName,
    specialisation,
  });

const savedNote =
  await doctorsNotesRepository.create({
    patientId,
    providerId:
      healthcareDetails.providerId,
    doctorProfileId,
    facilityId:
      healthcareDetails.facilityId,
    noteAt,
    note,
  });

    return NextResponse.json(
      {
        success: true,
        data: savedNote,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Doctors Note creation failed:",
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
          "Unable to save Doctors Note.",
      },
      {
        status: 500,
      }
    );
  }
}