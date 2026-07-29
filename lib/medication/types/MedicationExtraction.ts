/**
 * ============================================================
 * CAREVR
 * Medication Extraction
 * ============================================================
 * Represents raw AI/OCR extracted medication data before
 * resolver matching and user review.
 * ============================================================
 */

export interface MedicationExtraction {

  extractedMedicineName: string;

  extractedStrength?: string;

  extractedDose?: string;

  extractedFrequency?: string;

  extractedDuration?: string;

  extractedAdministration?: string;

  extractedInstruction?: string;

  extractedText: string;

  confidence: number;

  source: "OCR" | "VOICE" | "MANUAL" | "IMPORT";

}