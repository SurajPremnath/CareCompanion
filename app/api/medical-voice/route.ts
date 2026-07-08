import OpenAI from "openai";

import {
  NextResponse,
} from "next/server";

import {
  supabaseAdmin,
} from "@/lib/supabaseAdmin";

import type {
  DailyCareSymptom,
  PainLocation,
} from "@/lib/types/dailyCare";

import type {
  MedicalVoiceDailyCareDraft,
} from "@/lib/medical-voice/medicalVoiceTypes";


//------------------------------------------------------------
// Route Configuration
//------------------------------------------------------------

export const runtime =
  "nodejs";


//------------------------------------------------------------
// Constants
//------------------------------------------------------------

const VOICE_TRIAL_LIMIT =
  5;

const MAX_AUDIO_SIZE_BYTES =
  15 * 1024 * 1024;

const SUPPORTED_AUDIO_TYPES =
  new Set([

    "audio/webm",

    "audio/mp4",

    "audio/mpeg",

    "audio/wav",

    "audio/x-wav",

    "audio/ogg",

  ]);


//------------------------------------------------------------
// Canonical Daily Care Vocabulary
//------------------------------------------------------------

const VALID_SYMPTOMS =
  new Set<DailyCareSymptom>([

    "FEVER",

    "WEAKNESS",

    "BODY_PAIN",

    "COUGH",

    "BLOOD_IN_COUGH",

    "BREATHLESSNESS",

    "WALKING_DIFFICULTY",

    "LOSS_OF_APPETITE",

    "LOOSE_MOTIONS",

    "VOMITING",

    "DRY_MOUTH",

    "OTHER",

  ]);


const VALID_PAIN_LOCATIONS =
  new Set<PainLocation>([

    "HEAD",

    "NECK",

    "CHEST",

    "ABDOMEN",

    "BACK",

    "SHOULDER",

    "ARM",

    "THIGH",

    "KNEE",

    "CALF",

    "FEET",

    "OTHER",

  ]);

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
// Nullable Number
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

  return Number.isFinite(number)
    ? number
    : null;

}


//------------------------------------------------------------
// Temperature Unit
//------------------------------------------------------------

function toTemperatureUnit(
  value: unknown
): "F" | "C" | null {

  if (
    value === "F" ||
    value === "C"
  ) {

    return value;

  }

  return null;

}


//------------------------------------------------------------
// Nullable Text
//------------------------------------------------------------

function toNullableText(
  value: unknown
): string | null {

  if (
    typeof value !== "string"
  ) {

    return null;

  }

  const trimmed =
    value.trim();

  return trimmed
    ? trimmed
    : null;

}

//------------------------------------------------------------
// Overall Observation
//------------------------------------------------------------

function toOverallObservation(
  value: unknown
):
  | "NO_CONCERNS_REPORTED"
  | "CONCERNS_REPORTED"
  | null {

  if (
    value === "NO_CONCERNS_REPORTED" ||
    value === "CONCERNS_REPORTED"
  ) {

    return value;

  }

  return null;

}

//------------------------------------------------------------
// Parse Structured Voice Draft
//------------------------------------------------------------

function parseVoiceDraft(
  outputText: string
): MedicalVoiceDailyCareDraft {

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


  const symptoms =
    Array.isArray(parsed.symptoms)
      ? parsed.symptoms.filter(
          (
            value
          ): value is DailyCareSymptom =>
            typeof value === "string" &&
            VALID_SYMPTOMS.has(
              value as DailyCareSymptom
            )
        )
      : [];


    const painLocations =
    Array.isArray(
      parsed.painLocations
    )
      ? parsed.painLocations.filter(
          (
            value
          ): value is PainLocation =>
            typeof value === "string" &&
            VALID_PAIN_LOCATIONS.has(
              value as PainLocation
            )
        )
      : [];


  return {

    overallObservation:
      toOverallObservation(
        parsed.overallObservation
      ),

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

    symptoms,

    otherSymptom:
      toNullableText(
        parsed.otherSymptom
      ),

    painLocations,

    otherPainLocation:
      toNullableText(
        parsed.otherPainLocation
      ),

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
    // Load Profile And Voice Usage
    //--------------------------------------------------------

    const {
      data: profile,
      error: profileError,
    } =
      await supabaseAdmin
        .from("profiles")
        .select(
          "role, voice_usage_count"
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
        "Medical Voice Profile Error:",
        profileError
      );

      return NextResponse.json(
        {
          error:
            "Unable to verify voice usage allowance.",
        },
        {
          status: 500,
        }
      );

    }


    //--------------------------------------------------------
    // Check Shared Trial Limit
    //--------------------------------------------------------

    const isAdmin =
      profile.role === "ADMIN";

    const currentUsage =
      profile.voice_usage_count ?? 0;

    if (
      !isAdmin &&
      currentUsage >=
        VOICE_TRIAL_LIMIT
    ) {

      return NextResponse.json(
        {
          error:
            "Trial voice limit reached. Please enter Daily Care details manually.",
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

    const audio =
      formData.get(
        "audio"
      );


const modeValue =
    formData.get("mode");

const mode =
    modeValue === "care_recording"
        ? "care_recording"
        : "daily_care";

    //--------------------------------------------------------
    // Validate Audio
    //--------------------------------------------------------

    if (
      !(audio instanceof File)
    ) {

      return NextResponse.json(
        {
          error:
            "No voice recording was provided.",
        },
        {
          status: 400,
        }
      );

    }

const normalizedAudioType =
  audio.type
    .split(";")[0]
    .trim()
    .toLowerCase();


if (
  !SUPPORTED_AUDIO_TYPES.has(
    normalizedAudioType
  )
) {

  console.error(
    "Unsupported Medical Voice Audio Type:",
    audio.type
  );

  return NextResponse.json(
    {
      error:
        "Unsupported audio format.",
    },
    {
      status: 400,
    }
  );

}

    if (
      audio.size === 0
    ) {

      return NextResponse.json(
        {
          error:
            "The voice recording is empty.",
        },
        {
          status: 400,
        }
      );

    }

    if (
      audio.size >
      MAX_AUDIO_SIZE_BYTES
    ) {

      return NextResponse.json(
        {
          error:
            "Voice recording is too large.",
        },
        {
          status: 400,
        }
      );

    }


    //--------------------------------------------------------
    // Transcribe Natural Speech
    //--------------------------------------------------------

    const openai =
      getOpenAIClient();

    const transcription =
      await openai.audio.transcriptions.create({

        file:
          audio,

        model:
          "gpt-4o-mini-transcribe",

        response_format:
          "text",

        prompt:
          "This is a Daily Care health observation. " +
          "The speaker may use English, Hindi, Kannada, Tamil, Telugu, Malayalam, Marathi, Bengali, Gujarati, Punjabi, Odia, Assamese, or a natural mixture of these languages with English medical terms. " +
          "Preserve medical measurements, numbers, medicine-related words, symptom descriptions, and body locations accurately. " +
          "Do not translate the speech. Transcribe what the speaker said as naturally and accurately as possible.",

      });


    //--------------------------------------------------------
    // Validate Transcript
    //--------------------------------------------------------

const transcriptionResult:
  unknown =
    transcription;


const transcript =

  typeof transcriptionResult === "string"

    ? transcriptionResult.trim()

    : (
        typeof transcriptionResult === "object" &&
        transcriptionResult !== null &&
        "text" in transcriptionResult &&
        typeof (
          transcriptionResult as {
            text?: unknown;
          }
        ).text === "string"
      )

    ? (
        transcriptionResult as {
          text: string;
        }
      ).text.trim()

    : "";

    if (!transcript) {

  const errorMessage =
    mode === "care_recording"
      ? "We could not understand how you are feeling today. Please record again in your own words."
      : "No clear speech could be understood. Please record again.";

  return NextResponse.json(
    {
      error: errorMessage,
    },
    {
      status: 422,
    }
  );

}

//--------------------------------------------------------
// Interpret Transcript Into Daily Care Structure
//--------------------------------------------------------

const interpretationResponse =
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

              "Interpret the following Daily Care health observation transcript. " +

              "The transcript may be in English, Hindi, Kannada, Tamil, Telugu, Malayalam, Marathi, Bengali, Gujarati, Punjabi, Odia, Assamese, or a natural mixture of these languages and English medical terminology. " +

              "Identify whether the speaker explicitly reports general wellbeing. " +

"Set overallObservation to NO_CONCERNS_REPORTED when the speaker clearly communicates that they or the person being described are okay, fine, good, doing well, all good, have nothing concerning to report, or express an equivalent meaning. " +

"Interpret wellbeing statements semantically and not only by exact English phrases. Support equivalent expressions in all supported languages and natural code-switched speech. " +

"Do not convert a general wellbeing statement into invented normal vital readings or invented negative symptom observations. " +

"If the speaker reports general wellbeing together with an explicit health observation, preserve both the overallObservation and every explicit health observation. " +

"Do not classify uncertain statements such as I don't know, I am not sure, or maybe I am okay as NO_CONCERNS_REPORTED. " +

"Do not infer symptoms that were not explicitly stated as present. " +

"Handle symptom negation strictly. If the speaker says that they do not have a symptom, including expressions such as no cough, no body pain, no fever, do not have cough, do not have body pain, or equivalent negated expressions in any supported language, do not include that symptom in the symptoms array. " +

"If multiple symptoms are negated together, such as 'no body pain or cough', treat every symptom in that negated phrase as absent and do not include any of them in the symptoms array. " +

"A temperature measurement and a fever symptom declaration are separate observations. A temperature value alone, regardless of how high it is, must not cause FEVER to be added to the symptoms array. Add FEVER only when the speaker explicitly states that they have fever or uses a directly equivalent expression. " +

"Do not include a symptom merely because the symptom name appears in a negated statement. " +

"Do not infer that an unmentioned symptom is absent. " +

              "Do not invent measurements, units, symptoms, or pain locations. " +

              "Map symptoms only to these canonical values: " +
              "FEVER, WEAKNESS, BODY_PAIN, COUGH, BLOOD_IN_COUGH, BREATHLESSNESS, WALKING_DIFFICULTY, LOSS_OF_APPETITE, LOOSE_MOTIONS, VOMITING, DRY_MOUTH, OTHER. " +

              "Map pain locations only to these canonical values: " +
              "HEAD, NECK, CHEST, ABDOMEN, BACK, SHOULDER, ARM, THIGH, KNEE, CALF, FEET, OTHER. " +

              "If a symptom is clearly described but does not map to a canonical symptom, include OTHER and place the speaker's symptom description in otherSymptom. " +

              "If a pain location is clearly described but does not map to a canonical pain location, include OTHER and place the speaker's pain location description in otherPainLocation. " +

              "For blood pressure expressions such as 120 over 80, 120 by 80, or equivalent local-language expressions, map the first number to systolic and the second to diastolic. " +

              "Temperature unit must be F, C, or null. Do not infer the unit if it was not stated. " +

              "Return JSON only with exactly these keys: " +
"overallObservation, temperature, temperatureUnit, systolic, diastolic, pulse, spo2, symptoms, otherSymptom, painLocations, otherPainLocation. " +

              "Use null for overallObservation and unknown scalar values when not explicitly supported by the transcript. Use empty arrays for unmentioned symptoms or pain locations. " +

              "\n\nTranscript:\n" +
              transcript,

          },

        ],

      },

    ],

  });


//--------------------------------------------------------
// Validate Interpretation Output
//--------------------------------------------------------

const interpretationText =
  interpretationResponse.output_text
    ?.trim();

if (!interpretationText) {

  return NextResponse.json(
    {
      error:
        "The voice recording was transcribed, but the health details could not be structured. Please try again.",
    },
    {
      status: 422,
    }
  );

}


let draft:
  MedicalVoiceDailyCareDraft;

try {

  draft =
    parseVoiceDraft(
      interpretationText
    );

}
catch (error) {

  console.error(
    "Medical Voice Draft Parse Error:",
    error
  );

  return NextResponse.json(
    {
      error:
        "The health details could not be structured reliably. Please record again.",
    },
    {
      status: 422,
    }
  );

}


//--------------------------------------------------------
// Ensure At Least One Health Observation Exists
//--------------------------------------------------------

const hasStructuredObservation =

  draft.temperature !== null ||

  draft.systolic !== null ||

  draft.diastolic !== null ||

  draft.pulse !== null ||

  draft.spo2 !== null ||

  draft.symptoms.length > 0 ||

  draft.painLocations.length > 0 ||

  draft.otherSymptom !== null ||

  draft.otherPainLocation !== null;


const hasCareObservation =

  hasStructuredObservation ||

  draft.overallObservation !== null;


const hasValidObservation =

  mode === "care_recording"

    ? hasCareObservation

    : hasStructuredObservation;


if (!hasValidObservation) {

  const errorMessage =
    mode === "care_recording"
      ? "We could not understand how you are feeling today. Please record again in your own words."
      : "No Daily Care health observation could be identified. Please record temperature, vitals, symptoms, or pain details.";

  return NextResponse.json(
    {
      error:
        errorMessage,
    },
    {
      status: 422,
    }
  );

}

//--------------------------------------------------------
// Atomically Consume Successful Voice Usage
//--------------------------------------------------------

let finalUsage =
  currentUsage;

if (!isAdmin) {

  const {
    data: consumedUsage,
    error: usageError,
  } =
    await supabaseAdmin.rpc(
      "consume_voice_trial_usage",
      {
        p_user_id:
          user.id,

        p_limit:
          VOICE_TRIAL_LIMIT,
      }
    );


  if (usageError) {

    if (
      usageError.message?.includes(
        "VOICE_TRIAL_LIMIT_REACHED"
      )
    ) {

      return NextResponse.json(
        {
          error:
            "Trial voice limit reached. Please enter Daily Care details manually.",
        },
        {
          status: 403,
        }
      );

    }

    console.error(
      "Medical Voice Usage Error:",
      usageError
    );

    return NextResponse.json(
      {
        error:
          "The voice recording was processed, but usage tracking could not be completed. Please try again.",
      },
      {
        status: 500,
      }
    );

  }


  if (
    typeof consumedUsage !== "number"
  ) {

    console.error(
      "Medical Voice Usage Error: Invalid usage result",
      consumedUsage
    );

    return NextResponse.json(
      {
        error:
          "Unable to confirm voice usage allowance.",
      },
      {
        status: 500,
      }
    );

  }


  finalUsage =
    consumedUsage;

}

//--------------------------------------------------------
// Success
//--------------------------------------------------------

return NextResponse.json({

  data: {

    transcript,

    draft,

    usage: {

      used:
        finalUsage,

      limit:
        VOICE_TRIAL_LIMIT,

      remaining:
        isAdmin
          ? VOICE_TRIAL_LIMIT
          : Math.max(
              VOICE_TRIAL_LIMIT -
              finalUsage,
              0
            ),

      unlimited:
        isAdmin,

    },

  },

});

  }
  catch (error: unknown) {

    console.error(
      "Medical Voice Route Error:",
      error
    );

    const apiError =
      error as {

        status?: number;

        code?: string;

        type?: string;

      };

    //--------------------------------------------------------
    // OpenAI Quota Error
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
          "Unable to process the voice recording. Please try again.",
      },
      {
        status: 500,
      }
    );

  }

}

