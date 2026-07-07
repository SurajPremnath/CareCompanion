import type {
  DailyCareSymptom,
  PainLocation,
} from "@/lib/types/dailyCare";


//------------------------------------------------------------
// Voice Daily Care Structured Draft
//------------------------------------------------------------

export interface MedicalVoiceDailyCareDraft {

  temperature: number | null;

  temperatureUnit:
    "F" |
    "C" |
    null;

  systolic: number | null;

  diastolic: number | null;

  pulse: number | null;

  spo2: number | null;

  symptoms:
    DailyCareSymptom[];

  otherSymptom:
    string | null;

  painLocations:
    PainLocation[];

  otherPainLocation:
    string | null;

}


//------------------------------------------------------------
// Voice Processing Data
//------------------------------------------------------------

export interface MedicalVoiceProcessingData {

  transcript: string;

  draft:
    MedicalVoiceDailyCareDraft;

  usage: {

    used: number;

    limit: number;

    remaining: number;

    unlimited: boolean;

  };

}


//------------------------------------------------------------
// Voice Processing Result
//------------------------------------------------------------

export type MedicalVoiceProcessingResult =

  |
  {

      success: true;

      data:
        MedicalVoiceProcessingData;

    }

  |
  {

      success: false;

      error: string;

    };