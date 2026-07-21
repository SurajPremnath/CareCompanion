/**
 * ============================================================
 * CAREVR Medication Comparator
 * ============================================================
 * Compares two medication lists and identifies:
 * - Added medicines
 * - Removed medicines
 * - Dosage changes
 * - Frequency changes
 * - Timing changes
 * - Duration changes
 * - Status changes
 * ============================================================
 */

import {
  Medicine,
  MedicationInstruction,
} from "./medicationTypes";

export enum MedicationChangeType {
  ADDED = "ADDED",
  REMOVED = "REMOVED",
  MODIFIED = "MODIFIED",

  DOSE_CHANGED = "DOSE_CHANGED",
  STRENGTH_CHANGED = "STRENGTH_CHANGED",
  FORMULATION_CHANGED = "FORMULATION_CHANGED",

  FREQUENCY_CHANGED = "FREQUENCY_CHANGED",
  TIMING_CHANGED = "TIMING_CHANGED",

  DURATION_CHANGED = "DURATION_CHANGED",

  STATUS_CHANGED = "STATUS_CHANGED",
}

export interface MedicationChange {
  medicineName: string;

  changeType: MedicationChangeType;

  previousValue?: unknown;

  currentValue?: unknown;

  description: string;
}

export interface MedicationComparisonResult {
  hasChanges: boolean;

  added: Medicine[];

  removed: Medicine[];

  modified: MedicationChange[];

  totalChanges: number;
}

export class MedicationComparator {
  static compare(
    previous: Medicine[],
    current: Medicine[]
  ): MedicationComparisonResult {
    const previousMap = this.buildMedicineMap(previous);
    const currentMap = this.buildMedicineMap(current);

    const added: Medicine[] = [];
    const removed: Medicine[] = [];
    const modified: MedicationChange[] = [];

    // Added & Modified
    currentMap.forEach((currentMedicine, key) => {
      const previousMedicine = previousMap.get(key);

      if (!previousMedicine) {
        added.push(currentMedicine);
        return;
      }

      modified.push(
        ...this.compareMedicine(
          previousMedicine,
          currentMedicine
        )
      );
    });

    // Removed
    previousMap.forEach((previousMedicine, key) => {
      if (!currentMap.has(key)) {
        removed.push(previousMedicine);
      }
    });

    return {
      hasChanges:
        added.length > 0 ||
        removed.length > 0 ||
        modified.length > 0,

      added,

      removed,

      modified,

      totalChanges:
        added.length +
        removed.length +
        modified.length,
    };
  }

  private static compareMedicine(
    previous: Medicine,
    current: Medicine
  ): MedicationChange[] {
    const changes: MedicationChange[] = [];

    this.compareValue(
      changes,
      previous.brandName,
      current.brandName,
      current.brandName,
      MedicationChangeType.MODIFIED,
      "Medicine name changed"
    );

    this.compareValue(
      changes,
      previous.strength,
      current.strength,
      current.brandName,
      MedicationChangeType.STRENGTH_CHANGED,
      "Strength changed"
    );

    this.compareValue(
      changes,
      previous.formulation,
      current.formulation,
      current.brandName,
      MedicationChangeType.FORMULATION_CHANGED,
      "Formulation changed"
    );

    this.compareValue(
      changes,
      previous.dose,
      current.dose,
      current.brandName,
      MedicationChangeType.DOSE_CHANGED,
      "Dose changed"
    );

    this.compareInstruction(
      previous.instruction,
      current.instruction,
      current.brandName,
      changes
    );

    this.compareValue(
      changes,
      previous.duration,
      current.duration,
      current.brandName,
      MedicationChangeType.DURATION_CHANGED,
      "Duration changed"
    );

    this.compareValue(
      changes,
      previous.status,
      current.status,
      current.brandName,
      MedicationChangeType.STATUS_CHANGED,
      "Medication status changed"
    );

    return changes;
  }

  private static compareInstruction(
    previous: MedicationInstruction,
    current: MedicationInstruction,
    medicineName: string,
    changes: MedicationChange[]
  ): void {
    this.compareValue(
      changes,
      previous.frequency,
      current.frequency,
      medicineName,
      MedicationChangeType.FREQUENCY_CHANGED,
      "Frequency changed"
    );

    this.compareValue(
      changes,
      previous.timing,
      current.timing,
      medicineName,
      MedicationChangeType.TIMING_CHANGED,
      "Timing changed"
    );
  }

  private static compareValue(
    changes: MedicationChange[],
    previousValue: unknown,
    currentValue: unknown,
    medicineName: string,
    type: MedicationChangeType,
    description: string
  ): void {
    if (
      JSON.stringify(previousValue) !==
      JSON.stringify(currentValue)
    ) {
      changes.push({
        medicineName,
        changeType: type,
        previousValue,
        currentValue,
        description,
      });
    }
  }

  private static buildMedicineMap(
    medicines: Medicine[]
  ): Map<string, Medicine> {
    const map = new Map<string, Medicine>();

    medicines.forEach((medicine) => {
      map.set(
        this.buildKey(medicine),
        medicine
      );
    });

    return map;
  }

  private static buildKey(
    medicine: Medicine
  ): string {
    return [
      medicine.genericName ?? "",
      medicine.brandName,
      medicine.strength ?? "",
      medicine.formulation ?? "",
    ]
      .join("|")
      .toLowerCase();
  }
}