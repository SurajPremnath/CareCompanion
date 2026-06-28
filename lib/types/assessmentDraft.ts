// lib/types/assessmentDraft.ts

import type { AssessmentType } from "@/lib/types/assessment";

export interface AssessmentDraft {
  // Assessment Context
  assessmentType: AssessmentType;

  assessmentDate: string;

  // User / Patient
  patientId: string;
  patientName: string;
  patientAge: string;

  observerName: string;
  observerRelationship: string;

  // Respiratory
  breathing: string;
  cough: boolean;
  bloodInCough: boolean;

  // General Health
  fever: boolean;
  temperature: number | null;
  energy: string;

  // Nutrition
  appetite: string;
  water: string;
  waterGlasses: string;

  // Pain / Discomfort
  discomfort: boolean;
  discomfortAreas: string[];
  otherDiscomfortArea: string;

  // Mobility
  walking: string;
  walkingHelp: string;

  // Gastrointestinal
  looseMotions: boolean;
  looseMotionType: string;

  // Cognitive
  confusion: boolean;
}