//------------------------------------------------------------
// Medical Image Reading Types
//------------------------------------------------------------

export type TemperatureUnit = "F" | "C";

//------------------------------------------------------------
// Extracted Medical Readings
//------------------------------------------------------------

export interface MedicalImageReadings {

  temperature: number | null;

  temperatureUnit: TemperatureUnit | null;

  systolic: number | null;

  diastolic: number | null;

  pulse: number | null;

  spo2: number | null;

}

//------------------------------------------------------------
// Medical Image Processing Result
//------------------------------------------------------------

export interface MedicalImageProcessingResult {

  success: boolean;

  data?: MedicalImageReadings;

  error?: string;

}