import {
    DuplicatePrescriptionModel,
    ComparisonResult,
} from "./models";

import { DuplicatePrescriptionMapper } from "./mapper/DuplicatePrescriptionMapper";

import type { ExtractedPrescription } from "@/lib/prescription-image/prescriptionImageTypes";

import type {
    CompletePrescriptionRecord
} from "@/lib/prescription/prescriptionTypes";

import { PrescriptionNormalizer } from "./utils/PrescriptionNormalizer";

import { HospitalNormalizer } from "./normalizers/HospitalNormalizer";

import { DoctorNormalizer } from "./normalizers/DoctorNormalizer";

import { MedicineNormalizer } from "./normalizers/MedicineNormalizer";

export interface DuplicateMatchResult {
    isDuplicate: boolean;
    confidence: number;
    matchedPrescriptionId: string | null;
    reason: string;
}

export class DuplicatePrescriptionEngine {

static check(
    current: ExtractedPrescription,
    previous: CompletePrescriptionRecord
): DuplicateMatchResult {

    const currentPrescription =
        DuplicatePrescriptionMapper.fromOCR(current);

    const previousPrescription =
        DuplicatePrescriptionMapper.fromDatabase(previous);

const comparison =
    DuplicatePrescriptionEngine.compare(
        currentPrescription,
        previousPrescription,
    );


return {

    isDuplicate:
        comparison.isDuplicate,

    confidence:
        comparison.overallConfidence,

    matchedPrescriptionId:
        comparison.isDuplicate
            ? previous.prescription.id
            : null,

    reason:
        comparison.isDuplicate
            ? "Prescription already exists."
            : "",

};
    }

static compare(
    current: DuplicatePrescriptionModel,
    previous: DuplicatePrescriptionModel,
): ComparisonResult {

    const parameters = [];

const sameDoctor =
    DoctorNormalizer.normalize(
        current.doctorName,
    ) ===
    DoctorNormalizer.normalize(
        previous.doctorName,
    );

parameters.push({

    parameter: "Doctor",

    currentValue:
        current.doctorName,

    previousValue:
        previous.doctorName,

    matched:
        sameDoctor,

    confidence:
        sameDoctor ? 100 : 0,

});

const sameHospital =
    HospitalNormalizer.normalize(
        current.hospitalName,
    ) ===
    HospitalNormalizer.normalize(
        previous.hospitalName,
    );

parameters.push({

    parameter: "Hospital",

    currentValue:
        current.hospitalName,

    previousValue:
        previous.hospitalName,

    matched:
        sameHospital,

    confidence:
        sameHospital ? 100 : 0,

});

const sameDiagnosis =
    normalize(current.diagnosis) ===
    normalize(previous.diagnosis);

parameters.push({

    parameter: "Diagnosis",

    currentValue:
        current.diagnosis,

    previousValue:
        previous.diagnosis,

    matched:
        sameDiagnosis,

    confidence:
        sameDiagnosis ? 100 : 0,

});

const sameMedicines =
    compareDuplicateMedicines(
        current.medicines,
        previous.medicines
    );

parameters.push({

    parameter: "Medicines",

currentValue:
    `${current.medicines.length} medicine(s)`,

previousValue:
    `${previous.medicines.length} medicine(s)`,

    matched:
        sameMedicines,

    confidence:
        sameMedicines ? 100 : 0,

});

const totalConfidence =
    parameters.reduce(

        (sum, parameter) =>

            sum + parameter.confidence,

        0,

    );

const overallConfidence =
    Math.round(

        totalConfidence / parameters.length,

    );

const isDuplicate =
    overallConfidence >= 80;

alert(JSON.stringify(parameters, null, 2));

return {

    isDuplicate,

    overallConfidence,

    parameters,

};

}

}

function normalize(
    value?: string | null,
) {

    return PrescriptionNormalizer.normalize(
        value,
    );

}

function compareDuplicateMedicines(
    current: DuplicatePrescriptionModel["medicines"],
    previous: DuplicatePrescriptionModel["medicines"],
) {

    if (current.length !== previous.length) {

        return false;

    }



const currentMedicines = current
    .map(medicine =>
        MedicineNormalizer.normalize(
            medicine.name,
        ),
    )
    .sort();

const previousMedicines = previous
    .map(medicine =>
        MedicineNormalizer.normalize(
            medicine.name,
        ),
    )
    .sort();


console.log(currentMedicines);
console.log(previousMedicines);


    return currentMedicines.every(

        (medicine, index) =>

            medicine === previousMedicines[index],

    );

}