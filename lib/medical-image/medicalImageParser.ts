import type {
  MedicalImageReadings,
} from "./medicalImageTypes";

//------------------------------------------------------------
// Helpers
//------------------------------------------------------------

function extractNumberAfterLabel(
  text: string,
  labels: string[]
): number | null {

  for (const label of labels) {

    const pattern =
      new RegExp(
        `${label}\\s*[:\\-]?\\s*(\\d{2,3}(?:\\.\\d+)?)`,
        "i"
      );

    const match =
      text.match(pattern);

    if (match?.[1]) {

      const value =
        Number(match[1]);

      if (Number.isFinite(value)) {

        return value;

      }

    }

  }

  return null;

}

//------------------------------------------------------------
// Temperature
//------------------------------------------------------------

function extractTemperature(
  text: string
): {
  temperature: number | null;
  temperatureUnit: "F" | "C" | null;
} {

  const fahrenheit =
    text.match(
      /(\d{2,3}(?:\.\d+)?)\s*°?\s*F/i
    );

  if (fahrenheit?.[1]) {

    return {
      temperature:
        Number(fahrenheit[1]),

      temperatureUnit: "F",
    };

  }

  const celsius =
    text.match(
      /(\d{2,3}(?:\.\d+)?)\s*°?\s*C/i
    );

  if (celsius?.[1]) {

    return {
      temperature:
        Number(celsius[1]),

      temperatureUnit: "C",
    };

  }

  return {
    temperature: null,
    temperatureUnit: null,
  };

}

function extractWeight(
  text: string
): number | null {

  const match =
    text.match(
      /(\d{2,3}(?:\.\d+)?)\s*(?:kg|kgs|kilogram|kilograms)\b/i
    );

  if (!match?.[1]) {

    return null;

  }

  const value =
    Number(match[1]);

  return Number.isFinite(value)
    ? value
    : null;

}

//------------------------------------------------------------
// Parse Medical Image OCR Text
//------------------------------------------------------------

export function parseMedicalImageText(
  rawText: string
): MedicalImageReadings {

  const text =
    rawText
      .replace(/\r/g, "\n")
      .replace(/[ \t]+/g, " ")
      .trim();

  const temperatureResult =
    extractTemperature(text);

const weightKg =
    extractWeight(text);

  const systolic =
    extractNumberAfterLabel(
      text,
      [
        "SYS",
        "SYSTOLIC",
      ]
    );

  const diastolic =
    extractNumberAfterLabel(
      text,
      [
        "DIA",
        "DIASTOLIC",
      ]
    );

  const pulse =
    extractNumberAfterLabel(
      text,
      [
        "PULSE",
        "PUL",
        "PR",
      ]
    );

  const spo2 =
    extractNumberAfterLabel(
      text,
      [
        "SPO2",
        "SPO₂",
      ]
    );

  return {

    temperature:
      temperatureResult.temperature,

    temperatureUnit:
      temperatureResult.temperatureUnit,

weightKg,

    systolic,

    diastolic,

    pulse,

    spo2,

  };

}

//------------------------------------------------------------
// Check Whether Any Reading Was Found
//------------------------------------------------------------

export function hasMedicalReading(
  readings: MedicalImageReadings
): boolean {

  return (
    readings.temperature !== null ||
    readings.weightKg !== null ||
    readings.systolic !== null ||
    readings.diastolic !== null ||
    readings.pulse !== null ||
    readings.spo2 !== null
  );

}