import OpenAI from "openai";

import { NextResponse } from "next/server";

import type {
  MedicalImageReadings
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
// Parse Medical Image Output
//------------------------------------------------------------

type DetectedDeviceType =
  | "thermometer"
  | "blood_pressure_monitor"
  | "pulse_oximeter"
  | "weight_scale";

interface ParsedMedicalImageResponse {

  isSupportedMedicalImage:
    boolean;

  hasConflictingReadings:
    boolean;

  detectedDeviceTypes:
    DetectedDeviceType[];

  readings:
    MedicalImageReadings;

}

function parseMedicalReadings(
  outputText: string
): ParsedMedicalImageResponse {

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

  return {

    isSupportedMedicalImage:
      parsed.isSupportedMedicalImage ===
      true,

    hasConflictingReadings:
      parsed.hasConflictingReadings ===
      true,

    detectedDeviceTypes:
      Array.isArray(
        parsed.detectedDeviceTypes
      )
        ? parsed.detectedDeviceTypes.filter(
            (
              deviceType
            ): deviceType is DetectedDeviceType =>
              deviceType ===
                "thermometer" ||
              deviceType ===
                "blood_pressure_monitor" ||
              deviceType ===
                "pulse_oximeter" ||
              deviceType ===
                "weight_scale"
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

    weightKg:
        toNullableNumber(
            parsed.weightKg
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

    // --------------------------------------------------------
    // Record Health - Multiple Image Reading Selection
    // Preserve every valid Temperature value returned by model.
    // --------------------------------------------------------
    temperatureValues:
        Array.isArray(parsed.temperatureValues)
            ? parsed.temperatureValues
                .map(toNullableNumber)
                .filter(
                    (value): value is number =>
                        value !== null
                )
            : [],

    // --------------------------------------------------------
    // Record Health - Multiple Image Reading Selection
    // Preserve every valid Weight value returned by model.
    // --------------------------------------------------------
    weightValues:
        Array.isArray(parsed.weightValues)
            ? parsed.weightValues
                .map(toNullableNumber)
                .filter(
                    (value): value is number =>
                        value !== null
                )
            : [],

    // --------------------------------------------------------
    // Record Health - Multiple Image Reading Selection
    // Preserve every valid Systolic value returned by model.
    // --------------------------------------------------------
    systolicValues:
        Array.isArray(parsed.systolicValues)
            ? parsed.systolicValues
                .map(toNullableNumber)
                .filter(
                    (value): value is number =>
                        value !== null
                )
            : [],

    // --------------------------------------------------------
    // Record Health - Multiple Image Reading Selection
    // Preserve every valid Diastolic value returned by model.
    // --------------------------------------------------------
    diastolicValues:
        Array.isArray(parsed.diastolicValues)
            ? parsed.diastolicValues
                .map(toNullableNumber)
                .filter(
                    (value): value is number =>
                        value !== null
                )
            : [],

    // --------------------------------------------------------
    // Record Health - Multiple Image Reading Selection
    // Preserve every valid Pulse value returned by model.
    // UploadCareWorkspace lets the user choose the value.
    // --------------------------------------------------------
    pulseValues:
        Array.isArray(parsed.pulseValues)
            ? parsed.pulseValues
                .map(toNullableNumber)
                .filter(
                    (value): value is number =>
                        value !== null
                )
            : [],

    // --------------------------------------------------------
    // Record Health - Multiple Image Reading Selection
    // Preserve every valid SpO₂ value returned by model.
    // UploadCareWorkspace lets the user choose the value.
    // --------------------------------------------------------
    spo2Values:
        Array.isArray(parsed.spo2Values)
            ? parsed.spo2Values
                .map(toNullableNumber)
                .filter(
                    (value): value is number =>
                        value !== null
                )
            : [],

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
    // Read Form Data
    //--------------------------------------------------------

const formData =
    await request.formData();

//--------------------------------------------------------
// Determine Images
//--------------------------------------------------------

const images =
    formData
        .getAll("images")
        .filter(
            value =>
                value instanceof File
        ) as File[];

if (
    images.length === 0
) {

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

//--------------------------------------------------------
// Validate Image Count
//--------------------------------------------------------

if (
  images.length ===
  0
) {

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


    //--------------------------------------------------------
    // Validate Images
    //--------------------------------------------------------

    for (
      const image of images
    ) {

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

    }

    //--------------------------------------------------------
    // Check Trial Limit
    //--------------------------------------------------------

    const isAdmin =
      profile.role ===
      "ADMIN";

    const currentUsage =
      profile.medical_image_usage_count;

    const requestedImageCount =
      images.length;

    if (
      !isAdmin &&
      currentUsage +
        requestedImageCount >
        5
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
    // Convert Images To Base64
    //--------------------------------------------------------


    //--------------------------------------------------------
    // OpenAI
    //--------------------------------------------------------

    const openai =
      getOpenAIClient();

//--------------------------------------------------------
// RECORD HEALTH
//--------------------------------------------------------

const imageDataUrls =
    await Promise.all(
        images.map(
            async image => {

                const imageBuffer =
                    Buffer.from(
                        await image.arrayBuffer()
                    );

                const base64Image =
                    imageBuffer.toString(
                        "base64"
                    );

                return (
                    `data:${image.type};base64,${base64Image}`
                );

            }
        )
    );

//--------------------------------------------------------
// OpenAI Vision Request
//--------------------------------------------------------

// --------------------------------------------------------
// Record Health - Multiple Image Reading Selection
//
// One image:
//   Existing behaviour remains the same.
//
// Multiple images:
//   Read each image separately.
//   Collect Pulse / SpO2 values into arrays.
// --------------------------------------------------------
let temperatureValues: number[] = [];

let weightValues: number[] = [];

let systolicValues: number[] = [];

let diastolicValues: number[] = [];

let pulseValues: number[] = [];

let spo2Values: number[] = [];

let parsedResponse:
  ParsedMedicalImageResponse | null =
    null;

//--------------------------------------------------------
// Process Each Image
//--------------------------------------------------------

for (
  const imageDataUrl of imageDataUrls
) {

  const response =
    await openai.responses.create({

      model:
        "gpt-4.1-mini",

      input: [

        {
          role:
            "user",

          content: [

            {
              type:
                "input_text",

text:
  "Identify every supported medical device that is clearly visible and has a clearly readable measurement display. " +

  "detectedDeviceTypes must be an array containing zero or more of: thermometer, blood_pressure_monitor, pulse_oximeter, weight_scale. " +

  "If this image contains more than one supported device with clearly readable measurements, include every applicable device type in detectedDeviceTypes and extract readings from all of them. " +

  "Multiple supported devices with different measurement types in the same image are valid and must not be treated as conflicting readings. " +

  "Set hasConflictingReadings to true only when this image contains multiple competing or ambiguous values for the same measurement type and it is not possible to determine which value is the current reading. " +

  "For example, one blood pressure reading together with one temperature reading is not a conflict. Multiple blood pressure values or multiple temperature values are conflicting only when the current or latest reading cannot be determined reliably. " +

  "If detectedDeviceTypes includes thermometer, a clearly visible temperature reading is required. " +

  "If detectedDeviceTypes includes blood_pressure_monitor, both systolic and diastolic readings are required. " +

  "If detectedDeviceTypes includes pulse_oximeter, an SpO2 reading is required. " +

  "If detectedDeviceTypes includes weight_scale, a clearly readable weight in kilograms is required. " +

  "Return the numeric value only in weightKg. " +

  "Examples: 72 kg -> 72, 72.4 kg -> 72.4. " +

  "Do not include the unit in the value. " +

  "Do not infer weight. " +

  "If no readable weight is present, return null. " +

  "If no supported medical device with a clearly readable measurement is visible, set isSupportedMedicalImage to false and return an empty detectedDeviceTypes array. " +

"Read this image independently and return only the values clearly visible in this image. " +

"Do not use, replace, infer, or reinterpret values from another image. " +

"First identify the device shown in this image and then read the measurements using the labels displayed on that device. " +

"For a blood pressure monitor, read Systolic, Diastolic, and Pulse only from the fields explicitly identified by those labels. " +

"For a pulse oximeter, read SpO2 only from the field labelled SpO2 or oxygen saturation, and read Pulse only from the field labelled Pulse, PR, or heart rate. " +

"On a pulse oximeter, Pulse/PR and SpO2 are two different measurements. Never assign the Pulse/PR number to SpO2, and never assign the SpO2 number to Pulse. " +

"Do not determine Pulse or SpO2 based only on the size, position, or prominence of a number on the screen. Use the associated label. " +

"If the same measurement type appears multiple times in this image, preserve all clearly readable values for that measurement type. " +

"For multiple Temperature readings, return all values in temperatureValues. " +

"For multiple Weight readings, return all values in weightValues. " +

"For multiple Systolic readings, return all values in systolicValues. " +

"For multiple Diastolic readings, return all values in diastolicValues. " +

"For multiple Pulse readings, return all values in pulseValues. " +

"For multiple SpO2 readings, return all values in spo2Values. " +

"If exactly one Temperature reading exists, return it in temperature and also include it in temperatureValues. " +

"If exactly one Weight reading exists, return it in weightKg and also include it in weightValues. " +

"If exactly one Systolic reading exists, return it in systolic and also include it in systolicValues. " +

"If exactly one Diastolic reading exists, return it in diastolic and also include it in diastolicValues. " +

"If exactly one Pulse reading exists, return it in pulse and also include it in pulseValues. " +

"If exactly one SpO2 reading exists, return it in spo2 and also include it in spo2Values. " +

"Do not swap Pulse and SpO2 values. Pulse must remain Pulse and SpO2 must remain SpO2. " +

"Multiple Pulse or SpO2 values are not an error. Preserve them for user selection. " +

"Return JSON only with exactly these keys: isSupportedMedicalImage, hasConflictingReadings, detectedDeviceTypes, " +
"temperature, temperatureUnit, weightKg, systolic, diastolic, pulse, spo2, " +
"temperatureValues, weightValues, systolicValues, diastolicValues, " +
"pulseValues, spo2Values. " +

  "isSupportedMedicalImage and hasConflictingReadings must be true or false. " +

  'temperatureUnit must be "F", "C", or null.',
},
            {
              type:
                "input_image",

              image_url:
                imageDataUrl,

              detail:
                "high",
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

  if (
    !outputText
  ) {

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
  // Parse Current Image
  //--------------------------------------------------------

  let currentResponse:
    ParsedMedicalImageResponse;

  try {

    currentResponse =
      parseMedicalReadings(
        outputText
      );

  }
  catch (
    error: unknown
  ) {

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
      apiError.status ===
        429 &&
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

  //--------------------------------------------------------
  // Keep First Image As Base Response
  //--------------------------------------------------------

  if (
    parsedResponse ===
    null
  ) {

    parsedResponse =
      currentResponse;

  }

//--------------------------------------------------------
// Append Temperature Values
//--------------------------------------------------------

temperatureValues.push(
  ...currentResponse.readings.temperatureValues
);

//--------------------------------------------------------
// Append Weight Values
//--------------------------------------------------------

weightValues.push(
  ...currentResponse.readings.weightValues
);

//--------------------------------------------------------
// Append Systolic Values
//--------------------------------------------------------

systolicValues.push(
  ...currentResponse.readings.systolicValues
);

//--------------------------------------------------------
// Append Diastolic Values
//--------------------------------------------------------

diastolicValues.push(
  ...currentResponse.readings.diastolicValues
);

  //--------------------------------------------------------
  // Append Pulse Values
  //--------------------------------------------------------

  pulseValues.push(
    ...currentResponse.readings.pulseValues
  );

  //--------------------------------------------------------
  // Append SpO2 Values
  //--------------------------------------------------------

  spo2Values.push(
    ...currentResponse.readings.spo2Values
  );

}

//--------------------------------------------------------
// Ensure A Response Exists
//--------------------------------------------------------

if (
  parsedResponse ===
  null
) {

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
// Pass Collected Multiple Values Forward
//--------------------------------------------------------

parsedResponse = {

  ...parsedResponse,

readings: {
  ...parsedResponse.readings,

  temperature:
    temperatureValues.length > 0
      ? temperatureValues[0]
      : null,

  weightKg:
    weightValues.length > 0
      ? weightValues[0]
      : null,

  systolic:
    systolicValues.length > 0
      ? systolicValues[0]
      : null,

  diastolic:
    diastolicValues.length > 0
      ? diastolicValues[0]
      : null,

  pulse:
    pulseValues.length > 0
      ? pulseValues[0]
      : null,

  spo2:
    spo2Values.length > 0
      ? spo2Values[0]
      : null,

  temperatureValues:
    temperatureValues,

  weightValues:
    weightValues,

  systolicValues:
    systolicValues,

  diastolicValues:
    diastolicValues,

  pulseValues:
    pulseValues,

  spo2Values:
    spo2Values,
},

};

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
      deviceTypes.includes(
        "thermometer"
      ) &&
      readings.temperature !==
        null;

    const hasValidBloodPressureReading =
      deviceTypes.includes(
        "blood_pressure_monitor"
      ) &&
      readings.systolic !==
        null &&
      readings.diastolic !==
        null;

const hasValidPulseOximeterReading =
  deviceTypes.includes(
    "pulse_oximeter"
  ) &&
  readings.spo2 !== null;


    const hasValidWeightScaleReading =
      deviceTypes.includes(
        "weight_scale"
      ) &&
      readings.weightKg !==
        null;

    const everyDetectedDeviceIsValid =
      deviceTypes.length >
        0 &&
      deviceTypes.every(
        (
          deviceType
        ) => {

          if (
            deviceType ===
            "thermometer"
          ) {

            return hasValidThermometerReading;

          }

          if (
            deviceType ===
            "blood_pressure_monitor"
          ) {

            return hasValidBloodPressureReading;

          }

          if (
            deviceType ===
            "pulse_oximeter"
          ) {

            return hasValidPulseOximeterReading;

          }

          if (
            deviceType ===
            "weight_scale"
          ) {

            return hasValidWeightScaleReading;

          }

          return false;

        }
      );

    if (
      !everyDetectedDeviceIsValid
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

    //--------------------------------------------------------
    // Ensure At Least One Reading Exists
    //--------------------------------------------------------

    const hasReading =
      readings.temperature !==
        null ||
      readings.weightKg !==
        null ||
      readings.systolic !==
        null ||
      readings.diastolic !==
        null ||
      readings.pulse !==
        null ||
      readings.spo2 !==
        null;

    if (
      !hasReading
    ) {

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

    if (
      !isAdmin
    ) {

const nextUsage =
    currentUsage +
    requestedImageCount;

      const {
        error:
          usageUpdateError,
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

      if (
        usageUpdateError
      ) {

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

      data:
        readings,

    });

  }
  catch (
    error: unknown
  ) {

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
      apiError.status ===
        400 &&
      apiError.code ===
        "invalid_value" &&
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
      apiError.status ===
        429 &&
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
          "Unable to process the medical image. Please try again.",
      },
      {
        status: 500,
      }
    );

  }

}