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

// ============================================================
// DOCTOR NOTES QA TEST LOGGING
// Temporary QA instrumentation.
// Remove this import when Doctor's Notes QA is complete.
// ============================================================

import {
    appendDoctorNotesTestRun,
} from "@/lib/prescription-ai/panels/testLogger";

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

  if (
    value === "PRESCRIPTION" ||
    value === "DOCTOR_NOTES" ||
    value === "OTHER" ||
    value === "DISCHARGE_SUMMARY" ||
    value === "ADMISSION_NOTE" ||
    value === "LAB_REPORT" ||
    value === "MRI" ||
    value === "CT" ||
    value === "PET_CT" ||
    value === "HISTOPATHOLOGY" ||
    value === "IHC" ||
    value === "NGS" ||
    value === "ECHO" ||
    value === "ECG"
  ) {
    return value;
  }

  return "OTHER";
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
          (parsed.consultationVitals as any).bloodPressure ??
          null,

        pulse:
          (parsed.consultationVitals as any).pulse ??
          null,

        respiratoryRate:
          (parsed.consultationVitals as any).respiratoryRate ??
          null,

        spo2:
          (parsed.consultationVitals as any).spo2 ??
          null,

        temperature:
          (parsed.consultationVitals as any).temperature ??
          null,
      }
    : null,


  //----------------------------------------------------------
  // Current State of Health
  //----------------------------------------------------------

  currentStateOfHealth:
    parsed.currentStateOfHealth &&
    typeof parsed.currentStateOfHealth === "object"
      ? {
          conditions:
            toStringArray(
              (parsed.currentStateOfHealth as any).conditions
            ),

          diseaseStatus:
            toStringArray(
              (parsed.currentStateOfHealth as any).diseaseStatus
            ),

          stage:
            toNullableString(
              (parsed.currentStateOfHealth as any).stage
            ),

          clinicalAssessment:
            toStringArray(
              (parsed.currentStateOfHealth as any).clinicalAssessment
            ),

          importantFindings:
            toStringArray(
              (parsed.currentStateOfHealth as any).importantFindings
            ),
        }
      : {
          conditions: [],
          diseaseStatus: [],
          stage: null,
          clinicalAssessment: [],
          importantFindings: [],
        },


  diagnosisOrAssessment:
    toNullableString(
      parsed.diagnosisOrAssessment
    ),


  clinicalAssessments:
    toStringArray(
      parsed.clinicalAssessments
    ),


  symptoms:
    Array.isArray(
      parsed.symptoms
    )
      ? parsed.symptoms.map(
          (item: any) => ({
            symptom:
              typeof item?.symptom === "string"
                ? item.symptom.trim()
                : "",

            duration:
              typeof item?.duration === "string"
                ? item.duration.trim()
                : null,

            severity:
              typeof item?.severity === "string"
                ? item.severity.trim()
                : null,

            qualifiers:
              typeof item?.qualifiers === "string"
                ? item.qualifiers.trim()
                : null,
          })
        )
      : [],


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

            severity:
              typeof item?.severity === "string"
                ? item.severity.trim()
                : null,

            qualifiers:
              typeof item?.qualifiers === "string"
                ? item.qualifiers.trim()
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
  Array.isArray(parsed.doctorInstructions)
    ? parsed.doctorInstructions
        .map(
          item =>
            typeof item === "string"
              ? item.trim()
              : item &&
                typeof item === "object" &&
                typeof (item as { instruction?: unknown }).instruction === "string"
                ? (item as { instruction: string }).instruction.trim()
                : ""
        )
        .filter(Boolean)
    : [],


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


  testsAdvised:

    Array.isArray(
      parsed.testsAdvised
    )
      ? parsed.testsAdvised
          .map(
            (item: any) => ({

              test:
                typeof item?.test === "string"
                  ? item.test.trim()
                  : "",

              action:
                typeof item?.action === "string"
                  ? item.action.trim()
                  : null,

              timing:
                typeof item?.timing === "string"
                  ? item.timing.trim()
                  : null,

              condition:
                typeof item?.condition === "string"
                  ? item.condition.trim()
                  : null,

            })
          )
          .filter(
            item =>
              item.test.length > 0
          )
      : [],


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

  // ============================================================
  // DOCTOR NOTES QA TEST LOGGING
  // Capture every Doctor's Notes extraction attempt.
  // Human QA assessment is performed separately.
  // ============================================================
  let doctorNotesQaLogged = false;
  let doctorNotesQaMode = false;
  let doctorNotesQaDocuments: string[] = [];

const uploadedPdfFileIds:
    string[] = [];

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

    doctorNotesQaMode = extractionMode === "DOCTOR_NOTES";

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

doctorNotesQaDocuments = documents.map(
  document => document.name
);

if (
  documents.length !== 1
) {

  return NextResponse.json(
    {
      error:
        "Exactly one medical document must be processed per request.",
    },
    {
      status: 400
    }
  );

}

const document =
  documents[0];


    //--------------------------------------------------------
    // Validate File Sizes
    //--------------------------------------------------------

if (
  document.size >
  MAX_FILE_SIZE_BYTES
) {

  return NextResponse.json(
    {
      error:
        "The selected file is too large. Maximum allowed size is 10 MB.",
    },
    {
      status: 400,
    }
  );

}


    //--------------------------------------------------------
    // Determine Upload Type
    //--------------------------------------------------------

const isPdf =
  document.type ===
  PDF_TYPE;

const isImage =
  SUPPORTED_IMAGE_TYPES.has(
    document.type
  );


if (
  !isPdf &&
  !isImage
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
 
      }
    ];

//--------------------------------------------------------
// Add Image Inputs
//--------------------------------------------------------

if (isImage) {

    const imageBuffer =
        Buffer.from(
            await document.arrayBuffer()
        );

    const base64Image =
        imageBuffer.toString(
            "base64"
        );

    content.push({

        type:
            "input_image",

        image_url:
            `data:${document.type};base64,${base64Image}`,

        detail:
            "high",

    });

}


    //--------------------------------------------------------
    // Add PDF Input
    //--------------------------------------------------------

if (isPdf) {

    const pdfBuffer =
        Buffer.from(
            await document.arrayBuffer()
        );

    const uploadedPdf =
        await openai.files.create({

            file:
                await toFile(
                    pdfBuffer,
                    document.name,
                    {
                        type:
                            PDF_TYPE,
                    }
                ),

            purpose:
                "user_data",

        });

    uploadedPdfFileIds.push(
        uploadedPdf.id
    );

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

console.log(
    "DOCTOR NOTES RAW AI OUTPUT:",
    outputText
);



if (!outputText) {

      if (doctorNotesQaMode && !doctorNotesQaLogged) {
        appendDoctorNotesTestRun({
          documentsUploaded: doctorNotesQaDocuments,
          readingTimeMs: Math.round(performance.now() - totalStart),
          rawAiOutput: "",
          aiExtractionSuccessful: false,
          extractionStatus: "NO_AI_OUTPUT",
          overallResult: "FAILED",
        });
        doctorNotesQaLogged = true;
      }

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

      if (doctorNotesQaMode && !doctorNotesQaLogged) {
        appendDoctorNotesTestRun({
          documentsUploaded: doctorNotesQaDocuments,
          readingTimeMs: Math.round(performance.now() - totalStart),
          rawAiOutput: outputText,
          aiExtractionSuccessful: false,
          extractionStatus: "PARSE_ERROR",
          overallResult: "FAILED",
        });
        doctorNotesQaLogged = true;
      }

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

  if (doctorNotesQaMode && !doctorNotesQaLogged) {
    appendDoctorNotesTestRun({
      documentsUploaded: doctorNotesQaDocuments,
      readingTimeMs: Math.round(performance.now() - totalStart),
      rawAiOutput: outputText,
      aiExtractionSuccessful: true,
      extractionStatus: "NO_USEFUL_DATA",
      overallResult: "FAILED",
    });
    doctorNotesQaLogged = true;
  }

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

// ============================================================
// DOCTOR NOTES QA TEST LOGGING
// Record the exact raw AI output and reading time.
// Human QA assessment is performed separately.
// ============================================================

if (doctorNotesQaMode && !doctorNotesQaLogged) {
    appendDoctorNotesTestRun({
        documentsUploaded: doctorNotesQaDocuments,
        readingTimeMs: Math.round(performance.now() - totalStart),
        rawAiOutput: outputText,
        aiExtractionSuccessful: true,
        extractionStatus: "SUCCESS",
        overallResult: "PENDING_QA",
    });
    doctorNotesQaLogged = true;
}

//--------------------------------------------------------
// Success
//--------------------------------------------------------

return NextResponse.json({
    data: prescription,
});

  }
  catch (error: unknown) {

    if (doctorNotesQaMode && !doctorNotesQaLogged) {
      appendDoctorNotesTestRun({
        documentsUploaded: doctorNotesQaDocuments,
        readingTimeMs: Math.round(performance.now() - totalStart),
        rawAiOutput: "",
        aiExtractionSuccessful: false,
        extractionStatus: "ROUTE_ERROR",
        overallResult: "FAILED",
      });
      doctorNotesQaLogged = true;
    }

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
    // Delete Temporary OpenAI PDFs
    //--------------------------------------------------------

    for (
        const fileId of uploadedPdfFileIds
    ) {

        try {

            const openai =
                getOpenAIClient();

            await openai.files.delete(
                fileId
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