import OpenAI, {
  toFile,
} from "openai";

import {
  NextResponse,
} from "next/server";

import type {
  ConsultationMode,
  ExtractedPrescription,
  ExtractedPrescriptionMedicine,
} from "@/lib/prescription-image/prescriptionImageTypes";

import {
  supabaseAdmin,
} from "@/lib/supabaseAdmin";


//------------------------------------------------------------
// Route Configuration
//------------------------------------------------------------

export const runtime =
  "nodejs";


//------------------------------------------------------------
// Constants
//------------------------------------------------------------

const MAX_FILE_SIZE_BYTES =
  10 * 1024 * 1024;


const MAX_IMAGE_FILES =
  10;


const SUPPORTED_IMAGE_TYPES =
  new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
  ]);


const PDF_TYPE =
  "application/pdf";


//------------------------------------------------------------
// OpenAI Client
//------------------------------------------------------------

function getOpenAIClient(): OpenAI {

  const apiKey =
    process.env.OPENAI_API_KEY;


  if (!apiKey) {

    throw new Error(
      "OPENAI_API_KEY is not configured."
    );

  }


  return new OpenAI({
    apiKey,
  });

}


//------------------------------------------------------------
// Nullable String
//------------------------------------------------------------

function toNullableString(
  value: unknown
): string | null {

  if (
    typeof value !== "string"
  ) {

    return null;

  }


  const cleaned =
    value.trim();


  return cleaned
    ? cleaned
    : null;

}


//------------------------------------------------------------
// String Array
//------------------------------------------------------------

function toStringArray(
  value: unknown
): string[] {

  if (!Array.isArray(value)) {

    return [];

  }


  return value
    .filter(
      (
        item
      ): item is string =>
        typeof item === "string"
    )
    .map(
      item =>
        item.trim()
    )
    .filter(Boolean);

}


//------------------------------------------------------------
// Consultation Mode
//------------------------------------------------------------

function toConsultationMode(
  value: unknown
): ConsultationMode | null {

  if (
    value === "IN_PERSON" ||
    value === "VIDEO" ||
    value === "PHONE" ||
    value === "HOME_VISIT" ||
    value === "OTHER"
  ) {

    return value;

  }


  return null;

}


//------------------------------------------------------------
// Parse Medicine
//------------------------------------------------------------

function parseMedicine(
  value: unknown
): ExtractedPrescriptionMedicine | null {

  if (
    !value ||
    typeof value !== "object"
  ) {

    return null;

  }


  const medicine =
    value as Record<
      string,
      unknown
    >;


  const name =
    toNullableString(
      medicine.name
    );


  if (!name) {

    return null;

  }


  return {

    name,

    strength:
      toNullableString(
        medicine.strength
      ),

    form:
      toNullableString(
        medicine.form
      ),

    dose:
      toNullableString(
        medicine.dose
      ),

    frequency:
      toNullableString(
        medicine.frequency
      ),

    timings:
      toStringArray(
        medicine.timings
      ),

    duration:
      toNullableString(
        medicine.duration
      ),

    instructions:
      toNullableString(
        medicine.instructions
      ),

  };

}


//------------------------------------------------------------
// Parse Prescription Response
//------------------------------------------------------------

function parsePrescription(
  outputText: string
): ExtractedPrescription {

  const cleanedOutput =
    outputText
      .trim()
      .replace(
        /^```json\s*/i,
        ""
      )
      .replace(
        /^```\s*/i,
        ""
      )
      .replace(
        /\s*```$/i,
        ""
      )
      .trim();


  const parsed =
    JSON.parse(
      cleanedOutput
    ) as Record<
      string,
      unknown
    >;


  const medicines =
    Array.isArray(
      parsed.medicines
    )
      ? parsed.medicines
          .map(
            parseMedicine
          )
          .filter(
            (
              medicine
            ): medicine is ExtractedPrescriptionMedicine =>
              medicine !== null
          )
      : [];


  return {

    patientName:
      toNullableString(
        parsed.patientName
      ),

    patientDateOfBirth:
      toNullableString(
        parsed.patientDateOfBirth
      ),

    doctorName:
      toNullableString(
        parsed.doctorName
      ),

    consultationDate:
      toNullableString(
        parsed.consultationDate
      ),

    consultationMode:
      toConsultationMode(
        parsed.consultationMode
      ),

    hospitalOrClinic:
      toNullableString(
        parsed.hospitalOrClinic
      ),

    diagnosisOrAssessment:
      toNullableString(
        parsed.diagnosisOrAssessment
      ),

    medicines,

    additionalInstructions:
      toNullableString(
        parsed.additionalInstructions
      ),

  };

}


//------------------------------------------------------------
// Extraction Instructions
//------------------------------------------------------------

const EXTRACTION_INSTRUCTIONS =

  "Read all supplied pages as one related medical document set. " +

  "The document may be a prescription, consultation note, hospital discharge summary, or emergency admission and discharge record. " +

  "Extract only information that is clearly visible or reliably readable. " +

  "Do not invent, infer, or medically complete missing information. " +

  "If a scalar field is not visible or cannot be read reliably, return null. " +

  "For array fields, return an empty array when no reliable value is found. " +

  "Return JSON only. " +

  "Use exactly these top-level keys: " +

  "patientName, patientDateOfBirth, doctorName, consultationDate, consultationMode, hospitalOrClinic, diagnosisOrAssessment, medicines, additionalInstructions. " +

  "consultationMode must be one of IN_PERSON, VIDEO, PHONE, HOME_VISIT, OTHER, or null. " +

  "Only populate consultationMode when it is explicitly stated or clearly indicated in the document. " +

  "Do not infer IN_PERSON merely because a physical document exists. " +

  "Extract diagnosisOrAssessment only when a diagnosis, clinical impression, assessment, provisional diagnosis, working diagnosis, or equivalent clinical assessment is explicitly written and reliably readable in the supplied document. " +

  "Preserve the source wording where practical. " +

  "Do not infer diagnosisOrAssessment from medicines, symptoms, tests, investigations, procedures, or general medical knowledge. " +

  "If diagnosisOrAssessment is not explicitly stated or cannot be read reliably, return null. " +

  "For a discharge summary, consultationDate should represent the discharge date when clearly available. " +

  "patientDateOfBirth and consultationDate should use YYYY-MM-DD format only when the date can be reliably interpreted. Otherwise return the visible text or null. " +

  "medicines must contain only medicines that form part of the active outpatient, home-care, follow-up, or discharge medication plan. " +

  "For a discharge summary, include medicines explicitly prescribed, advised, continued, or instructed for use after discharge. " +

  "Do not include medicines merely administered during hospitalization, emergency treatment, surgery, infusion, or inpatient care unless the document also clearly says they must continue after discharge. " +

  "Do not include medicines explicitly stopped or discontinued. " +

  "Each medicine object must contain exactly these keys: name, strength, form, dose, frequency, timings, duration, instructions. " +

  "Preserve medicine names and prescription wording where practical. " +

  "timings must always be an array of strings. " +

  "Do not translate medicine names. " +

  "Do not merge separate medicines. " +

  "If the same medicine continues across multiple pages, consolidate it into one medicine entry only when it is clearly the same medication and schedule. " +

  "Do not treat diagnosis, symptoms, tests, investigations, procedures, or general advice as medicines. " +

  "Place relevant follow-up medication advice that does not belong to a specific medicine in additionalInstructions.";


//------------------------------------------------------------
// POST
//------------------------------------------------------------

export async function POST(
  request: Request
) {

  let uploadedPdfFileId:
    string | null =
      null;


  try {

    //--------------------------------------------------------
    // Authenticate User
    //--------------------------------------------------------

    const authorizationHeader =
      request.headers.get(
        "authorization"
      );


    if (
      !authorizationHeader?.startsWith(
        "Bearer "
      )
    ) {

      return NextResponse.json(
        {
          error:
            "Authentication required.",
        },
        {
          status: 401,
        }
      );

    }


    const accessToken =
      authorizationHeader.slice(
        7
      );


    const {
      data: {
        user,
      },
      error: authError,
    } =
      await supabaseAdmin.auth.getUser(
        accessToken
      );


    if (
      authError ||
      !user
    ) {

      return NextResponse.json(
        {
          error:
            "Your session is invalid or has expired. Please sign in again.",
        },
        {
          status: 401,
        }
      );

    }


    //--------------------------------------------------------
    // Read Documents
    //--------------------------------------------------------

    const formData =
      await request.formData();


    const documentEntries =
      formData.getAll(
        "documents"
      );


    const documents =
      documentEntries.filter(
        (
          item
        ): item is File =>
          item instanceof File
      );


    if (
      documents.length === 0
    ) {

      return NextResponse.json(
        {
          error:
            "No prescription document was provided.",
        },
        {
          status: 400,
        }
      );

    }


    //--------------------------------------------------------
    // Validate File Sizes
    //--------------------------------------------------------

    for (const document of documents) {

      if (
        document.size >
        MAX_FILE_SIZE_BYTES
      ) {

        return NextResponse.json(
          {
            error:
              "A selected file is too large. Maximum allowed size is 10 MB per file.",
          },
          {
            status: 400,
          }
        );

      }

    }


    //--------------------------------------------------------
    // Determine Upload Type
    //--------------------------------------------------------

    const pdfDocuments =
      documents.filter(
        document =>
          document.type ===
          PDF_TYPE
      );


    const imageDocuments =
      documents.filter(
        document =>
          SUPPORTED_IMAGE_TYPES.has(
            document.type
          )
      );


    const unsupportedDocuments =
      documents.filter(
        document =>
          document.type !==
            PDF_TYPE &&
          !SUPPORTED_IMAGE_TYPES.has(
            document.type
          )
      );


    if (
      unsupportedDocuments.length > 0
    ) {

      return NextResponse.json(
        {
          error:
            "Unsupported file format. Please use JPG, PNG, WebP, or PDF.",
        },
        {
          status: 400,
        }
      );

    }


    //--------------------------------------------------------
    // Prevent Mixed PDF + Image Set
    //--------------------------------------------------------

    if (
      pdfDocuments.length > 0 &&
      imageDocuments.length > 0
    ) {

      return NextResponse.json(
        {
          error:
            "Please upload either one PDF or a set of photos, not both together.",
        },
        {
          status: 400,
        }
      );

    }


    //--------------------------------------------------------
    // Validate PDF Count
    //--------------------------------------------------------

    if (
      pdfDocuments.length > 1
    ) {

      return NextResponse.json(
        {
          error:
            "Please upload one PDF at a time.",
        },
        {
          status: 400,
        }
      );

    }


    //--------------------------------------------------------
    // Validate Image Count
    //--------------------------------------------------------

    if (
      imageDocuments.length >
      MAX_IMAGE_FILES
    ) {

      return NextResponse.json(
        {
          error:
            `You can upload up to ${MAX_IMAGE_FILES} photos at a time.`,
        },
        {
          status: 400,
        }
      );

    }


    //--------------------------------------------------------
    // OpenAI Client
    //--------------------------------------------------------

    const openai =
      getOpenAIClient();


    //--------------------------------------------------------
    // Build Model Content
    //--------------------------------------------------------

    const content:
      Array<
        | {
            type: "input_text";
            text: string;
          }
        | {
            type: "input_image";
            image_url: string;
            detail: "high";
          }
        | {
            type: "input_file";
            file_id: string;
          }
      > =
        [
          {
            type:
              "input_text",

            text:
              EXTRACTION_INSTRUCTIONS,
          },
        ];


    //--------------------------------------------------------
    // Add Image Inputs
    //--------------------------------------------------------

    for (
      const image of imageDocuments
    ) {

      const imageBuffer =
        Buffer.from(
          await image.arrayBuffer()
        );


      const base64Image =
        imageBuffer.toString(
          "base64"
        );


      content.push({

        type:
          "input_image",

        image_url:
          `data:${image.type};base64,${base64Image}`,

        detail:
          "high",

      });

    }


    //--------------------------------------------------------
    // Add PDF Input
    //--------------------------------------------------------

    if (
      pdfDocuments.length === 1
    ) {

      const pdf =
        pdfDocuments[0];


      const pdfBuffer =
        Buffer.from(
          await pdf.arrayBuffer()
        );


      const uploadedPdf =
        await openai.files.create({

          file:
            await toFile(
              pdfBuffer,
              pdf.name,
              {
                type:
                  PDF_TYPE,
              }
            ),

          purpose:
            "user_data",

        });


      uploadedPdfFileId =
        uploadedPdf.id;


      content.push({

        type:
          "input_file",

        file_id:
          uploadedPdf.id,

      });

    }


    //--------------------------------------------------------
    // Extract Document
    //--------------------------------------------------------

    const response =
      await openai.responses.create({

        model:
          "gpt-4.1-mini",

        input: [
          {

            role:
              "user",

            content,

          },
        ],

      });


    //--------------------------------------------------------
    // Validate Response
    //--------------------------------------------------------

    const outputText =
      response.output_text?.trim();


    if (!outputText) {

      return NextResponse.json(
        {
          error:
            "No prescription details could be extracted.",
        },
        {
          status: 422,
        }
      );

    }


    //--------------------------------------------------------
    // Parse Response
    //--------------------------------------------------------

    let prescription:
      ExtractedPrescription;


    try {

      prescription =
        parsePrescription(
          outputText
        );

    }
    catch (error) {

      console.error(
        "Prescription Parse Error:",
        error
      );


      return NextResponse.json(
        {
          error:
            "The document could not be read reliably. Please try clearer photos or a clearer PDF.",
        },
        {
          status: 422,
        }
      );

    }


    //--------------------------------------------------------
    // Minimum Validation
    //--------------------------------------------------------

    const hasUsefulPrescriptionData =

      prescription.patientName !== null ||

      prescription.doctorName !== null ||

      prescription.medicines.length > 0;


    if (
      !hasUsefulPrescriptionData
    ) {

      return NextResponse.json(
        {
          error:
            "No clear prescription or discharge medication information was found.",
        },
        {
          status: 422,
        }
      );

    }


    //--------------------------------------------------------
    // Success
    //--------------------------------------------------------

    return NextResponse.json({

      data:
        prescription,

    });

  }
  catch (error: unknown) {

    console.error(
      "Prescription Document Route Error:",
      error
    );


    const apiError =
      error as {

        status?: number;

        code?: string;

        type?: string;

      };


    //--------------------------------------------------------
    // OpenAI Quota
    //--------------------------------------------------------

    if (
      apiError.status === 429 &&
      (
        apiError.code ===
          "insufficient_quota" ||

        apiError.type ===
          "insufficient_quota"
      )
    ) {

      return NextResponse.json(
        {
          error:
            "Credits over. Contact Admin.",
        },
        {
          status: 503,
        }
      );

    }


    //--------------------------------------------------------
    // Unexpected Error
    //--------------------------------------------------------

    return NextResponse.json(
      {
        error:
          "Unable to process the prescription document. Please try again.",
      },
      {
        status: 500,
      }
    );

  }
  finally {

    //--------------------------------------------------------
    // Delete Temporary OpenAI PDF
    //--------------------------------------------------------

    if (
      uploadedPdfFileId
    ) {

      try {

        const openai =
          getOpenAIClient();


        await openai.files.delete(
          uploadedPdfFileId
        );

      }
      catch (cleanupError) {

        console.error(
          "Temporary PDF Cleanup Error:",
          cleanupError
        );

      }

    }

  }

}