import {
    DuplicatePrescriptionModel,
    DuplicateMedicineModel,
} from "../duplicate/models";

import {
    PrescriptionDifference,
    MedicineDifference,
} from "./models/PrescriptionDifference";

export class PrescriptionDifferenceEngine {

    static compare(
        previous: DuplicatePrescriptionModel,
        current: DuplicatePrescriptionModel,
    ): PrescriptionDifference {

        const doctorChanged =
    previous.doctorName !==
    current.doctorName;

const hospitalChanged =
    previous.hospitalName !==
    current.hospitalName;

const diagnosisChanged =
    previous.diagnosis !==
    current.diagnosis;

return {

    doctor: {

        field: "Doctor",

        changed:
            doctorChanged,

        previousValue:
            previous.doctorName,

        currentValue:
            current.doctorName,

    },

    hospital: {

    field: "Hospital",

    changed:
        hospitalChanged,

    previousValue:
        previous.hospitalName,

    currentValue:
        current.hospitalName,

},

diagnosis: {

    field: "Diagnosis",

    changed:
        diagnosisChanged,

    previousValue:
        previous.diagnosis,

    currentValue:
        current.diagnosis,

},

    medicines: this.compareMedicines(
    previous.medicines,
    current.medicines,
),

hasChanges:
    doctorChanged ||
    hospitalChanged ||
    diagnosisChanged,

};

    }

private static compareMedicines(
    previous: DuplicateMedicineModel[],
    current: DuplicateMedicineModel[],
): MedicineDifference[] {

    const differences: MedicineDifference[] = [];

differences.push(
    ...this.findAddedMedicines(
        previous,
        current,
    ),
);

differences.push(
    ...this.findRemovedMedicines(
        previous,
        current,
    ),
);

differences.push(
    ...this.findUpdatedMedicines(
        previous,
        current,
    ),
);

    return differences;

}

private static findAddedMedicines(
    previous: DuplicateMedicineModel[],
    current: DuplicateMedicineModel[],
): MedicineDifference[] {

    const differences: MedicineDifference[] = [];

    for (const medicine of current) {

        const exists = previous.some(
            previousMedicine =>
                previousMedicine.name ===
                medicine.name,
        );

        if (!exists) {

differences.push({

    medicine:
        medicine.name,

    action:
        "added",

    currentDose:
        medicine.dose,

    currentFrequency:
        medicine.frequency,

    currentDuration:
        medicine.duration,

});

       }

    }

    return differences;

}

private static findRemovedMedicines(
    previous: DuplicateMedicineModel[],
    current: DuplicateMedicineModel[],
): MedicineDifference[] {

    const differences: MedicineDifference[] = [];

    for (const medicine of previous) {

        const exists = current.some(
            currentMedicine =>
                currentMedicine.name ===
                medicine.name,
        );

        if (!exists) {

            differences.push({

                medicine:
                    medicine.name,

                action:
                    "removed",

                previousDose:
                    medicine.dose,

                previousFrequency:
                    medicine.frequency,

                previousDuration:
                    medicine.duration,

            });

        }

    }

    return differences;

}

private static findUpdatedMedicines(
    previous: DuplicateMedicineModel[],
    current: DuplicateMedicineModel[],
): MedicineDifference[] {

    const differences: MedicineDifference[] = [];

    for (const currentMedicine of current) {

        const previousMedicine = previous.find(
            medicine =>
                medicine.name ===
                currentMedicine.name,
        );

        if (!previousMedicine) {
            continue;
        }

        const medicineChanged =

            previousMedicine.dose !==
                currentMedicine.dose ||

            previousMedicine.frequency !==
                currentMedicine.frequency ||

            previousMedicine.duration !==
                currentMedicine.duration;

        if (medicineChanged) {

            const changedFields: (
                | "dose"
                | "frequency"
                | "duration"
            )[] = [];

            if (
                previousMedicine.dose !==
                currentMedicine.dose
            ) {
                changedFields.push("dose");
            }

            if (
                previousMedicine.frequency !==
                currentMedicine.frequency
            ) {
                changedFields.push("frequency");
            }

            if (
                previousMedicine.duration !==
                currentMedicine.duration
            ) {
                changedFields.push("duration");
            }

            differences.push({

                medicine:
                    currentMedicine.name,

                action:
                    "updated",

                changedFields,

                previousDose:
                    previousMedicine.dose,

                currentDose:
                    currentMedicine.dose,

                previousFrequency:
                    previousMedicine.frequency,

                currentFrequency:
                    currentMedicine.frequency,

                previousDuration:
                    previousMedicine.duration,

                currentDuration:
                    currentMedicine.duration,

            });

        }

    }

    return differences;

}

}