import { NextResponse } from "next/server";

import {
  doctorsNotesRepository,
} from "@/lib/repositories/doctorsNotesRepository";

import {
  saveHealthcareDetails,
} from "@/lib/healthcare/healthcarePersistenceService";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request body.",
        },
        { status: 400 }
      );
    }

    const careMode = body.careMode;
    const patientId = body.patientId ?? null;
    let providerId = body.providerId ?? null;
    let facilityId = body.facilityId ?? null;

    const doctorName = body.doctorName ?? null;
    const doctorProfileId = body.doctorProfileId ?? null;
    const facilityName = body.facilityName ?? null;
    const specialisation = body.specialisation ?? null;
    const noteAt = body.noteAt ?? null;
    const note = body.note ?? null;
    const treatments = body.treatments ?? [];

    // --------------------------------------------------
    // Care mode and identity validation
    // --------------------------------------------------

    if (careMode !== "SELF" && careMode !== "FAMILY") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid care mode.",
        },
        { status: 400 }
      );
    }

    if (
      careMode === "SELF" &&
      patientId !== null
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "SELF mode must not include a patient.",
        },
        { status: 400 }
      );
    }

    if (
      careMode === "FAMILY" &&
      (typeof patientId !== "string" || !patientId.trim())
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Patient identifier is required in FAMILY mode.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // Treatment validation
    // --------------------------------------------------

    if (!Array.isArray(treatments) || treatments.length > 20) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid treatment entries.",
        },
        { status: 400 }
      );
    }

    for (const treatment of treatments) {
      if (
        !treatment ||
        typeof treatment !== "object" ||
        typeof treatment.medication !== "string" ||
        typeof treatment.dosage !== "string" ||
        typeof treatment.duration !== "string" ||
        treatment.medication.length > 500 ||
        treatment.dosage.length > 200 ||
        treatment.duration.length > 200
      ) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid treatment information.",
          },
          { status: 400 }
        );
      }

      if (
        !treatment.medication.trim() &&
        (treatment.dosage.trim() || treatment.duration.trim())
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Enter a treatment or medication for each completed entry.",
          },
          { status: 400 }
        );
      }
    }

    const completedTreatments = treatments.filter(
      (treatment: {
        medication: string;
        dosage: string;
        duration: string;
      }) => treatment.medication.trim().length > 0
    );

    // --------------------------------------------------
    // Determine whether a note is being submitted
    // --------------------------------------------------

    const hasNote =
      typeof note === "string" &&
      note.trim().length > 0;

    if (!hasNote && completedTreatments.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Enter a doctor's note or at least one treatment.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // Validate optional note/provider fields
    // --------------------------------------------------

    if (
      providerId !== null &&
      typeof providerId !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid doctor identifier.",
        },
        { status: 400 }
      );
    }

    if (
      doctorName !== null &&
      typeof doctorName !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid doctor name.",
        },
        { status: 400 }
      );
    }

    if (
      doctorProfileId !== null &&
      typeof doctorProfileId !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid doctor profile.",
        },
        { status: 400 }
      );
    }

    if (
      facilityId !== null &&
      typeof facilityId !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid facility.",
        },
        { status: 400 }
      );
    }

    if (
      facilityName !== null &&
      typeof facilityName !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid hospital name.",
        },
        { status: 400 }
      );
    }

    if (
      specialisation !== null &&
      typeof specialisation !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid specialisation.",
        },
        { status: 400 }
      );
    }

    let validatedNoteAt: string | null = null;

    if (hasNote) {
      if (note.length > 2000) {
        return NextResponse.json(
          {
            success: false,
            error: "Doctor note cannot exceed 2000 characters.",
          },
          { status: 400 }
        );
      }

      if (
        typeof noteAt !== "string" ||
        !noteAt.trim() ||
        Number.isNaN(new Date(noteAt).getTime())
      ) {
        return NextResponse.json(
          {
            success: false,
            error: "A valid note date and time are required.",
          },
          { status: 400 }
        );
      }

      validatedNoteAt = new Date(noteAt).toISOString();

      if (
        careMode === "SELF" &&
        !providerId
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Select a registered doctor before saving a SELF-mode note.",
          },
          { status: 400 }
        );
      }
    }

    // --------------------------------------------------
    // Resolve healthcare details only for note submissions
    //
    // This service is FAMILY/patient-specific. Do not call
    // it for SELF mode or treatment-only submissions.
    // --------------------------------------------------

    if (hasNote && careMode === "FAMILY") {
      const healthcareDetails = await saveHealthcareDetails({
        patientId: patientId as string,
        providerId,
        doctorName,
        facilityId,
        facilityName,
        specialisation,
      });

      providerId = healthcareDetails.providerId;
      facilityId = healthcareDetails.facilityId;
    }

    // --------------------------------------------------
    // Atomic database save
    // --------------------------------------------------

    const savedResult = await doctorsNotesRepository.create({
      careMode,
      patientId: careMode === "FAMILY" ? patientId : null,
      providerId: hasNote ? providerId : null,
      doctorName: hasNote ? doctorName : null,
      doctorProfileId: hasNote ? doctorProfileId : null,
      facilityId: hasNote ? facilityId : null,
      facilityName: hasNote ? facilityName : null,
      specialisation: hasNote ? specialisation : null,
      noteAt: validatedNoteAt,
      note: hasNote ? note.trim() : null,
      treatments: completedTreatments,
    });

    return NextResponse.json(
      {
        success: true,
        data: savedResult,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Doctors Note creation failed:", error);

    if (
      error instanceof Error &&
      error.message === "User is not authenticated."
    ) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Unable to save Doctors Note.",
      },
      { status: 500 }
    );
  }
}