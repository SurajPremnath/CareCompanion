import {
  JourneyMedicine,
  JourneyProcedure,
  JourneyInvestigation,
} from "../journeyAnalysisModels";

/**
 * Presentation model for the Active Treatment section
 * displayed on the Journey Review screen.
 */
export interface ActiveTreatmentView {
  /**
   * Treating doctor.
   */
  doctorName?: string;

  /**
   * Hospital or clinic.
   */
  hospitalName?: string;

  /**
   * Primary diagnosis for the active treatment.
   */
  diagnosis?: string;

  /**
   * Treatment start date.
   */
  startDate?: string;

  /**
   * Planned treatment end date.
   * Undefined indicates ongoing treatment.
   */
  endDate?: string;

  /**
   * Current medicines.
   */
  medicines: JourneyMedicine[];

  /**
   * Current procedures.
   */
  procedures: JourneyProcedure[];

  /**
   * Current investigations.
   */
  investigations: JourneyInvestigation[];

  /**
   * Clinical notes.
   */
  notes?: string;
}