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

weightKg: number | null;

  systolic: number | null;

  diastolic: number | null;

  pulse: number | null;

  spo2: number | null;

}

//------------------------------------------------------------
// Doctor's Notes Types
//------------------------------------------------------------

export type DoctorNoteMedicineAction =
  | "NEW"
  | "STOP"
  | "CHANGE"
  | "CONTINUE"
  | "UNCLEAR";

export interface DoctorNoteMonitor {

  item: string;

  frequency:
    string | null;

}

export interface DoctorNoteTest {

  test: string;

  instruction:
    string | null;

}

export interface DoctorNoteMedicine {

  name: string;

  action:
    DoctorNoteMedicineAction;

  dose:
    string | null;

  frequency:
    string | null;

  duration:
    string | null;

}

export interface DoctorNotesExtraction {

  monitor:
    DoctorNoteMonitor[];

  tests:
    DoctorNoteTest[];

  medicines:
    DoctorNoteMedicine[];

  advice:
    string[];

  followUp:
    string[];

  unclearItems:
    string[];

}

//------------------------------------------------------------
// Medical Image Processing Result
//------------------------------------------------------------

export interface MedicalImageProcessingResult {

  success: boolean;

  data?: MedicalImageReadings;

  error?: string;

}

//------------------------------------------------------------
// Doctor's Notes Processing Result
//------------------------------------------------------------

export interface DoctorNotesImageProcessingResult {

  success: boolean;

  data?: DoctorNotesExtraction;

  error?: string;

}