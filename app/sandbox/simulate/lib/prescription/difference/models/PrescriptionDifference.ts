export interface FieldDifference {

    field: string;

    changed: boolean;

    previousValue: string;

    currentValue: string;

}

export interface MedicineDifference {

    medicine: string;

    action:
        | "added"
        | "removed"
        | "updated"
        | "unchanged";

changedFields?: (
    | "dose"
    | "frequency"
    | "duration"
)[];

    previousDose?: string;

    currentDose?: string;

    previousFrequency?: string;

    currentFrequency?: string;

    previousDuration?: string;

    currentDuration?: string;

}

export interface PrescriptionDifference {

    doctor: FieldDifference;

    hospital: FieldDifference;

    diagnosis: FieldDifference;

    medicines: MedicineDifference[];

    hasChanges: boolean;

}