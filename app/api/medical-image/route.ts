import OpenAI from "openai";

import { NextResponse } from "next/server";

import type {
  MedicalImageReadings,
} from "@/lib/medical-image/medicalImageTypes";

//------------------------------------------------------------
// Route Configuration
//------------------------------------------------------------

export const runtime = "nodejs";

//------------------------------------------------------------
// Constants
//------------------------------------------------------------

const MAX_IMAGE_SIZE_BYTES =
  10 * 1024 * 1024;

const SUPPORTED_IMAGE_TYPES =
  new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
  ]);

//------------------------------------------------------------
// Helpers
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
// Validate Numeric Value
//------------------------------------------------------------

function toNullableNumber(
  value: unknown
): number | null {

  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {

    return null;

  }

  const number =
    Number(value);

  if (!Number.isFinite(number)) {

    return null;

  }

  return number;

}

//------------------------------------------------------------
// Validate Temperature Unit
//------------------------------------------------------------

function toTemperatureUnit(
  value: unknown
): "F" | "C" | null {

  if (value === "F") {

    return "F";

  }

  if (value === "C") {

    return "C";

  }

  return null;

}

//------------------------------------------------------------
// Parse Model Output
//------------------------------------------------------------

interface ParsedMedicalImageResponse {

  isSupportedMedicalImage: boolean;

  hasConflictingReadings: boolean;

  readings: MedicalImageReadings;

}

function parseMedicalReadings(
  outputText: string
): ParsedMedicalImageResponse {

  const cleanedOutput =
    outputText
      .trim()
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

  const parsed =
    JSON.parse(
      cleanedOutput
    ) as Record<
      string,
      unknown
    >;

  return {

    isSupportedMedicalImage:
      parsed.isSupportedMedicalImage === true,

hasConflictingReadings:
  parsed.hasConflictingReadings === true,

    readings: {

      temperature:
        toNullableNumber(
          parsed.temperature
        ),

      temperatureUnit:
        toTemperatureUnit(
          parsed.temperatureUnit
        ),

      systolic:
        toNullableNumber(
          parsed.systolic
        ),

      diastolic:
        toNullableNumber(
          parsed.diastolic
        ),

      pulse:
        toNullableNumber(
          parsed.pulse
        ),

      spo2:
        toNullableNumber(
          parsed.spo2
        ),

    },

  };

}
//------------------------------------------------------------
// POST
//------------------------------------------------------------

export async function POST(
  request: Request
) {

  try {

    //--------------------------------------------------------
    // Read Form Data
    //--------------------------------------------------------

    const formData =
      await request.formData();

    const image =
      formData.get("image");

    //--------------------------------------------------------
    // Validate Image
    //--------------------------------------------------------

    if (!(image instanceof File)) {

      return NextResponse.json(
        {
          error:
            "No image was provided.",
        },
        {
          status: 400,
        }
      );

    }

    if (
      !SUPPORTED_IMAGE_TYPES.has(
        image.type
      )
    ) {

      return NextResponse.json(
        {
          error:
            "Unsupported image format. Please use JPG, PNG, or WebP.",
        },
        {
          status: 400,
        }
      );

    }


    if (
      image.size >
      MAX_IMAGE_SIZE_BYTES
    ) {

      return NextResponse.json(
        {
          error:
            "Image is too large. Maximum allowed size is 10 MB.",
        },
        {
          status: 400,
        }
      );

    }

    //--------------------------------------------------------
    // Convert Image To Base64 Data URL
    //--------------------------------------------------------

    const imageBuffer =
      Buffer.from(
        await image.arrayBuffer()
      );

    const base64Image =
      imageBuffer.toString("base64");

    const imageDataUrl =
      `data:${image.type};base64,${base64Image}`;

    //--------------------------------------------------------
    // OpenAI Vision Request
    //--------------------------------------------------------

    const openai =
      getOpenAIClient();

    const response =
      await openai.responses.create({

        model: "gpt-4.1-mini",

        input: [
          {
            role: "user",

            content: [
              {
                type: "input_text",

text:
  "Analyse this image only for supported home medical device displays. " +
  "Supported devices are: thermometer, blood pressure monitor, and pulse oximeter. " +

  "Determine whether at least one supported medical device display is clearly visible and readable. " +

  "Also determine whether the image contains multiple conflicting readings of the same measurement type. " +

  "If the same reading is repeated more than once, treat it as one reading and set hasConflictingReadings to false. " +

  "If two or more different blood pressure readings are visible, set hasConflictingReadings to true. " +
  "A blood pressure reading means the systolic and diastolic pair from one device reading. " +

  "If two or more different temperature readings are visible, set hasConflictingReadings to true. " +

  "If two or more different SpO2 readings are visible, set hasConflictingReadings to true. " +

  "If conflicting readings exist, do not choose or guess which reading is latest. " +

  "A single blood pressure reading together with a single temperature reading is valid and must not be treated as conflicting. " +

  "If no supported medical device display is clearly visible and readable, set isSupportedMedicalImage to false and return null for every reading. " +

  "If at least one supported device display is clearly visible and readable, set isSupportedMedicalImage to true. " +

  "Extract only readings that are clearly visible on supported medical device displays. " +

  "Do not read numbers from unrelated objects, clocks, labels, packaging, documents, screens, signs, or background text. " +

  "Do not infer, estimate, calculate, correct, or invent any value. " +

  "If a reading is not clearly visible, return null for that field. " +

  "Return JSON only with exactly these keys: " +
  "isSupportedMedicalImage, hasConflictingReadings, temperature, temperatureUnit, systolic, diastolic, pulse, spo2. " +

  "isSupportedMedicalImage and hasConflictingReadings must be true or false. " +

  'temperatureUnit must be "F", "C", or null.',

              },

              {
                type: "input_image",

                image_url:
                  imageDataUrl,

                detail: "high",
              },
            ],
          },
        ],

      });

    //--------------------------------------------------------
    // Validate Model Response
    //--------------------------------------------------------

    const outputText =
      response.output_text?.trim();

    if (!outputText) {

      return NextResponse.json(
        {
          error:
            "No readings could be extracted from the image.",
        },
        {
          status: 422,
        }
      );

    }

    //--------------------------------------------------------
    // Parse Structured Readings
    //--------------------------------------------------------

let parsedResponse:
  ParsedMedicalImageResponse;

try {

  parsedResponse =
    parseMedicalReadings(
      outputText
    );

}
catch (error: unknown) {

  console.error(
    "Medical Image Route Error:",
    error
  );

  const apiError =
    error as {
      status?: number;
      code?: string;
      type?: string;
    };

  if (
    apiError.status === 429 &&
    (
      apiError.code === "insufficient_quota" ||
      apiError.type === "insufficient_quota"
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

  return NextResponse.json(
    {
      error:
        "Unable to process the medical image. Please try again.",
    },
    {
      status: 500,
    }
  );

}


if (
  !parsedResponse.isSupportedMedicalImage
) {

  return NextResponse.json(
    {
      error:
        "Please upload a clear photo of a thermometer, blood pressure monitor, or pulse oximeter display.",
    },
    {
      status: 422,
    }
  );

}

if (
  parsedResponse.hasConflictingReadings
) {

  return NextResponse.json(
    {
      error:
        "Multiple readings were found. Please upload a photo showing only the latest reading.",
    },
    {
      status: 422,
    }
  );

}

const readings =
  parsedResponse.readings;

    //--------------------------------------------------------
    // Ensure At Least One Reading Exists
    //--------------------------------------------------------

    const hasReading =
      readings.temperature !== null ||
      readings.systolic !== null ||
      readings.diastolic !== null ||
      readings.pulse !== null ||
      readings.spo2 !== null;

    if (!hasReading) {

      return NextResponse.json(
        {
          error:
            "No clear medical readings were found in the image.",
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

      data: readings,

    });

  }
catch (error: unknown) {

  console.error(
    "Medical Image Route Error:",
    error
  );

  const apiError =
    error as {
      status?: number;
      code?: string;
      type?: string;
    };

  if (
    apiError.status === 429 &&
    (
      apiError.code === "insufficient_quota" ||
      apiError.type === "insufficient_quota"
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

  return NextResponse.json(
    {
      error:
        "Unable to process the medical image. Please try again.",
    },
    {
      status: 500,
    }
  );

}

}