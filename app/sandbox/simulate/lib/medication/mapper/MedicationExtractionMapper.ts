import type { MedicationExtraction } from "../types/MedicationExtraction";

export interface MedicationExtractionMapper {

  map(
    extraction: unknown
  ): MedicationExtraction[];

}