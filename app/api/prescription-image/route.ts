
import OpenAI, {
  toFile,
} from "openai";

import {
  NextResponse,
} from "next/server";

import type {
  ConsultationMode,
  MedicalDocumentType,
  ExtractedPrescription,
  ExtractedPrescriptionMedicine,
} from "@/lib/prescription-image/prescriptionImageTypes";

import {
  supabaseAdmin,
} from "@/lib/supabaseAdmin";

import {
    EXTRACTION_INSTRUCTIONS,
    DOCTOR_NOTES_EXTRACTION_INSTRUCTIONS,
} from "@/lib/prescription-ai/extractionInstructions";

import { resolveMedicine } from "@/lib/medication/medicineResolver";

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

const OPENAI_PRESCRIPTION_MODEL =
  process.env.OPENAI_PRESCRIPTION_MODEL ??
  "gpt-4.1-mini";

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
// Plain Object
//------------------------------------------------------------

function toPlainObject(
  value: unknown
): Record<string, unknown> {

  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value)
  ) {
    return {};
  }

  return value as Record<string, unknown>;
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
    value === "WHATSAPP" ||
    value === "EMAIL" ||
    value === "HOME_VISIT" ||
    value === "HOSPITAL_ADMISSION" ||
    value === "HOSPITAL_DISCHARGE" ||
    value === "OTHER"
  ) {

    return value;

  }

  return null;

}

//------------------------------------------------------------
// Document Type
//------------------------------------------------------------


function toDocumentType(
  value: unknown
): MedicalDocumentType {

  if (value === "PRESCRIPTION") {
    return "PRESCRIPTION";
  }

  return "PRESCRIPTION";
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

const patientIdentity =
  toPlainObject(
    parsed.patientIdentity
  );

const encounterIdentity =
  toPlainObject(
    parsed.encounterIdentity
  );

const documentMetadata =
  toPlainObject(
    parsed.documentMetadata
  );

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

  //----------------------------------------------------------
  // Patient Identity
  //----------------------------------------------------------

patientIdentity: {

  patientName:
    toNullableString(
      patientIdentity.patientName
    ),

  patientDateOfBirth:
    toNullableString(
      patientIdentity.patientDateOfBirth
    ),

  patientAge:
    toNullableString(
      patientIdentity.patientAge
    ),

  patientGender:
    toNullableString(
      patientIdentity.patientGender
    ),

  patientUHID:
    toNullableString(
      patientIdentity.patientUHID
    ),

  patientNameVariations:
    toStringArray(
      patientIdentity.patientNameVariations
    ),

  //----------------------------------------------------------
  // Demographic Extraction Provenance
  //----------------------------------------------------------

  ageFlag:
    Boolean(
      toNullableString(
        patientIdentity.patientAge
      )
    ),

  sexFlag:
    Boolean(
      toNullableString(
        patientIdentity.patientGender
      )
    ),

  ageSource:
    toNullableString(
      patientIdentity.patientAge
    )
      ? "DOCUMENT"
      : null,

  sexSource:
    toNullableString(
      patientIdentity.patientGender
    )
      ? "DOCUMENT"
      : null,

},


  //----------------------------------------------------------
  // Encounter Identity
  //----------------------------------------------------------

  encounterIdentity: {

    doctorName:
      toNullableString(
        encounterIdentity.doctorName
      ),

    doctorType:
      toNullableString(
        encounterIdentity.doctorType
      ),

    hospitalOrClinic:
      toNullableString(
        encounterIdentity.hospitalOrClinic
      ),

    hospitalNameVariations:
      toStringArray(
        encounterIdentity.hospitalNameVariations
      ),

    consultationDate:
      toNullableString(
        encounterIdentity.consultationDate
      ),

    consultationMode:
      toConsultationMode(
        encounterIdentity.consultationMode
      ),

  },


  //----------------------------------------------------------
  // Document Metadata
  //----------------------------------------------------------

  documentMetadata: {

    studyDateTime:
      toNullableString(
        documentMetadata.studyDateTime
      ),

    reportDateTime:
      toNullableString(
        documentMetadata.reportDateTime
      ),

    originalPatientName:
      toNullableString(
        documentMetadata.originalPatientName
      ),

    originalHospitalName:
      toNullableString(
        documentMetadata.originalHospitalName
      ),

    documentType:
      toDocumentType(
        documentMetadata.documentType
      ),

  },


  //----------------------------------------------------------
  // Existing Clinical Data
  //----------------------------------------------------------

  consultationVitals:
    parsed.consultationVitals &&
    typeof parsed.consultationVitals === "object"
      ? {
          weight:
            toNullableString(
              (parsed.consultationVitals as any).weight
            ),

          height:
            toNullableString(
              (parsed.consultationVitals as any).height
            ),

          bmi:
            toNullableString(
              (parsed.consultationVitals as any).bmi
            ),

          bloodPressure:
            toNullableString(
              (parsed.consultationVitals as any).bloodPressure
            ),

          pulse:
            toNullableString(
              (parsed.consultationVitals as any).pulse
            ),

          respiratoryRate:
            toNullableString(
              (parsed.consultationVitals as any).respiratoryRate
            ),

          spo2:
            toNullableString(
              (parsed.consultationVitals as any).spo2
            ),

          temperature:
            toNullableString(
              (parsed.consultationVitals as any).temperature
            ),
        }
      : null,


  diagnosisOrAssessment:
    toNullableString(
      parsed.diagnosisOrAssessment
    ),


  clinicalAssessments:
    toStringArray(
      parsed.clinicalAssessments
    ),


  symptoms:
    toStringArray(
      parsed.symptoms
    ),


  presentingComplaints:
    Array.isArray(
      parsed.presentingComplaints
    )
      ? parsed.presentingComplaints.map(
          (item: any) => ({
            complaint:
              typeof item?.complaint === "string"
                ? item.complaint.trim()
                : "",

            duration:
              typeof item?.duration === "string"
                ? item.duration.trim()
                : null,
          })
        )
      : [],


  pastMedicalHistory:
    toStringArray(
      parsed.pastMedicalHistory
    ),


  history:
    Array.isArray(
      parsed.history
    )
      ? parsed.history.map(
          (item: any) => ({
            category:
              item.category ?? "OTHER",

            value:
              typeof item.value === "string"
                ? item.value.trim()
                : "",
          })
        )
      : [],


  examinationFindings:
    Array.isArray(
      parsed.examinationFindings
    )
      ? parsed.examinationFindings.map(
          (item: any) => ({
            finding:
              typeof item?.finding === "string"
                ? item.finding.trim()
                : typeof item === "string"
                  ? item.trim()
                  : "",
          })
        )
      : [],


  doctorInstructions:
    toStringArray(
      parsed.doctorInstructions
    ),


  followUpPlan:
    toStringArray(
      parsed.followUpPlan
    ),


  medicines,


  additionalNotes:
    toStringArray(
      parsed.additionalNotes
    ),


  investigations:
    toStringArray(
      parsed.investigations
    ),


  clinicalPlan:
    toStringArray(
      parsed.clinicalPlan
    ),

};

}




//------------------------------------------------------------
// POST
//------------------------------------------------------------

export async function POST(
  request: Request
) {

  const totalStart = performance.now();

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


const authStart = performance.now();

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

const extractionMode =
    formData.get("mode") === "DOCTOR_NOTES"
        ? "DOCTOR_NOTES"
        : "PRESCRIPTION";

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
    extractionMode === "DOCTOR_NOTES"
        ? DOCTOR_NOTES_EXTRACTION_INSTRUCTIONS
        : EXTRACTION_INSTRUCTIONS,
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

const openAIStart = performance.now();

const response =
  await openai.responses.create({

    model:
      OPENAI_PRESCRIPTION_MODEL,

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

const outputText = response.output_text?.trim();

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
    error,
    outputText
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


function mergeDuplicateMedicines(
    medicines: ExtractedPrescriptionMedicine[]
): ExtractedPrescriptionMedicine[] {

    const map = new Map<string, ExtractedPrescriptionMedicine>();

    for (const medicine of medicines) {

        const key = [
    medicine.name.trim().toLowerCase(),
    medicine.strength ?? "",
    medicine.form ?? "",
].join("|");

        const existing = map.get(key);

        if (!existing) {

            map.set(key, { ...medicine });

            continue;
        }

        existing.strength ??= medicine.strength;
        existing.form ??= medicine.form;
        existing.frequency ??= medicine.frequency;
        existing.duration ??= medicine.duration;

        if (!existing.instructions && medicine.instructions) {
            existing.instructions = medicine.instructions;
        }

        // Prefer the more descriptive administration text
if (
    medicine.dose &&
    (
        !existing.dose ||
        medicine.dose.length > existing.dose.length
    )
) {
    existing.dose = medicine.dose;
}

        existing.timings = Array.from(
            new Set([
                ...existing.timings,
                ...medicine.timings,
            ])
        );
    }

    return [...map.values()];
}

prescription.medicines =
    mergeDuplicateMedicines(
        prescription.medicines
    );

//--------------------------------------------------------
// Resolve Medicines
//--------------------------------------------------------

const medicineResolveStart =
    performance.now();

for (const medicine of prescription.medicines) {

  const result = await resolveMedicine({
    medicineName: medicine.name,
  });


  medicine.matchStatus = result.status;

  if (
    result.status === "FOUND" &&
    result.medicine
  ) {

    medicine.resolvedMedicineId =
      result.medicine.id;

    medicine.resolvedMedicineName =
      result.medicine.brand_name;

  }

  else if (
    result.status === "SUGGESTIONS" &&
    result.suggestions
  ) {

    medicine.suggestedMedicines =
      result.suggestions.map(item => ({
        id: item.id,
        brandName: item.brand_name,
        genericName: item.generic_name,
        strength: item.strength,
        formulation: item.formulation,
      }));

  }

}

for (const medicine of prescription.medicines) {

    medicine.reviewStatus ??= "REVIEW";

}


//--------------------------------------------------------
// Minimum Validation
//--------------------------------------------------------

const hasUsefulPrescriptionData =

  prescription.patientIdentity.patientName !== null ||

  prescription.patientIdentity.patientUHID !== null ||

  prescription.encounterIdentity.doctorName !== null ||

  prescription.encounterIdentity.hospitalOrClinic !== null ||

  prescription.encounterIdentity.consultationDate !== null ||

  prescription.diagnosisOrAssessment !== null ||

  prescription.symptoms.length > 0 ||

  prescription.pastMedicalHistory.length > 0 ||

  prescription.doctorInstructions.length > 0 ||

  prescription.followUpPlan.length > 0 ||

  prescription.examinationFindings.length > 0 ||

  prescription.medicines.length > 0 ||

  prescription.additionalNotes.length > 0 ||

  prescription.investigations.length > 0;



if (!hasUsefulPrescriptionData) {

  return NextResponse.json(
    {
      error:
        "The document could not be read reliably. Please upload a clearer prescription.",
    },
    {
      status: 422,
    }
  );

}

console.log(
    `TOTAL : ${(
        performance.now() -
        totalStart
    ).toFixed(0)} ms`
);

    //--------------------------------------------------------
    // Success
    //--------------------------------------------------------

    return NextResponse.json({

      data:
        prescription,

    });

  }
  catch (error: unknown) {

console.error("Prescription Document Route Error");

if (error instanceof Error) {
    console.error("Name:", error.name);
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
} else {
    console.error(error);
}


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