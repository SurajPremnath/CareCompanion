import OpenAI from "openai";

import { NextResponse } from "next/server";

import type {
  MedicalImageReadings,
} from "@/lib/medical-image/medicalImageTypes";

import {
  supabaseAdmin,
} from "@/lib/supabaseAdmin";

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

type DetectedDeviceType =
  | "thermometer"
  | "blood_pressure_monitor"
  | "pulse_oximeter";

interface ParsedMedicalImageResponse {
  isSupportedMedicalImage: boolean;
  hasConflictingReadings: boolean;
  detectedDeviceTypes: DetectedDeviceType[];
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

detectedDeviceTypes:
  Array.isArray(parsed.detectedDeviceTypes)
    ? parsed.detectedDeviceTypes.filter(
        (
          deviceType
        ): deviceType is DetectedDeviceType =>
          deviceType === "thermometer" ||
          deviceType === "blood_pressure_monitor" ||
          deviceType === "pulse_oximeter"
      )
    : [],

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
// Load Profile And Usage
//--------------------------------------------------------

const {
  data: profile,
  error: profileError,
} =
  await supabaseAdmin
    .from("profiles")
    .select(
      "role, medical_image_usage_count"
    )
    .eq(
      "id",
      user.id
    )
    .single();

if (
  profileError ||
  !profile
) {

  console.error(
    "Medical Image Profile Error:",
    profileError
  );

  return NextResponse.json(
    {
      error:
        "Unable to verify image usage allowance.",
    },
    {
      status: 500,
    }
  );

}

//--------------------------------------------------------
// Check Trial Limit
//--------------------------------------------------------

const isAdmin =
  profile.role === "ADMIN";

const currentUsage =
  profile.medical_image_usage_count;

if (
  !isAdmin &&
  currentUsage >= 5
) {

  return NextResponse.json(
    {
      error:
        "Trial image reading limit reached. Please enter readings manually.",
    },
    {
      status: 403,
    }
  );

}
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
"Identify every supported medical device that is clearly visible and has a clearly readable measurement display. " +

"detectedDeviceTypes must be an array containing zero or more of: thermometer, blood_pressure_monitor, pulse_oximeter. " +

"If the image contains more than one supported device with clearly readable measurements, include every applicable device type in detectedDeviceTypes and extract readings from all of them. " +

"Multiple supported devices with different measurement types in the same image are valid and must not be treated as conflicting readings. " +

"Set hasConflictingReadings to true only when the image contains multiple competing or ambiguous values for the same measurement type and it is not possible to determine which value is the current reading. " +

"For example, one blood pressure reading together with one temperature reading is not a conflict. Multiple blood pressure values or multiple temperature values are conflicting only when the current or latest reading cannot be determined reliably. " +

"If detectedDeviceTypes includes thermometer, a clearly visible temperature reading is required. " +

"If detectedDeviceTypes includes blood_pressure_monitor, both systolic and diastolic readings are required. " +

"If detectedDeviceTypes includes pulse_oximeter, an SpO2 reading is required. " +

"If no supported medical device with a clearly readable measurement is visible, set isSupportedMedicalImage to false and return an empty detectedDeviceTypes array. " +

"Return JSON only with exactly these keys: " +
"isSupportedMedicalImage, hasConflictingReadings, detectedDeviceTypes, temperature, temperatureUnit, systolic, diastolic, pulse, spo2. " +

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

const deviceTypes =
  parsedResponse.detectedDeviceTypes;

const hasValidThermometerReading =
  deviceTypes.includes("thermometer") &&
  readings.temperature !== null;

const hasValidBloodPressureReading =
  deviceTypes.includes(
    "blood_pressure_monitor"
  ) &&
  readings.systolic !== null &&
  readings.diastolic !== null;

const hasValidPulseOximeterReading =
  deviceTypes.includes("pulse_oximeter") &&
  readings.spo2 !== null;

const everyDetectedDeviceIsValid =
  deviceTypes.length > 0 &&
  deviceTypes.every((deviceType) => {

    if (deviceType === "thermometer") {
      return hasValidThermometerReading;
    }

    if (
      deviceType ===
      "blood_pressure_monitor"
    ) {
      return hasValidBloodPressureReading;
    }

    if (
      deviceType === "pulse_oximeter"
    ) {
      return hasValidPulseOximeterReading;
    }

    return false;

  });

if (!everyDetectedDeviceIsValid) {

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
// Increment Successful Image Usage
//--------------------------------------------------------

if (!isAdmin) {

  const nextUsage =
    currentUsage + 1;

  const {
    error: usageUpdateError,
  } =
    await supabaseAdmin
      .from("profiles")
      .update({
        medical_image_usage_count:
          nextUsage,
      })
      .eq(
        "id",
        user.id
      );

  if (usageUpdateError) {

    console.error(
      "Medical Image Usage Update Error:",
      usageUpdateError
    );

    return NextResponse.json(
      {
        error:
          "The image was processed, but usage tracking could not be updated. Please try again.",
      },
      {
        status: 500,
      }
    );

  }

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
      message?: string;
    };

  //--------------------------------------------------------
  // Invalid Or Undecodable Image
  //--------------------------------------------------------

  if (
    apiError.status === 400 &&
    apiError.code === "invalid_value" &&
    apiError.message?.includes(
      "image data you provided does not represent a valid image"
    )
  ) {

    return NextResponse.json(
      {
        error:
          "The selected image could not be read. Please choose a valid JPG, PNG, or WebP image and try again.",
      },
      {
        status: 422,
      }
    );

  }

  //--------------------------------------------------------
  // OpenAI Quota Error
  //--------------------------------------------------------

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

  //--------------------------------------------------------
  // Unexpected Error
  //--------------------------------------------------------

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