import {
    DuplicatePrescriptionModel,
} from "../models";

import type {
    ExtractedPrescription,
} from "@/lib/prescription-image/prescriptionImageTypes";

import type {
    CompletePrescriptionRecord,
} from "@/lib/prescription/prescriptionTypes";

export class DuplicatePrescriptionMapper {

static fromOCR(
    prescription: ExtractedPrescription,
): DuplicatePrescriptionModel {

    return {

        consultationDate:
            prescription.consultationDate ?? "",

        doctorName:
            prescription.doctorName ?? "",

        hospitalName:
            prescription.hospitalOrClinic ?? "",

        diagnosis:
            prescription.diagnosisOrAssessment ?? "",

        medicines:
            (prescription.medicines ?? []).map(
                medicine => ({

                    name:
    medicine.name ?? "",

                    strength:
                        medicine.strength ?? "",

                    dose:
                        medicine.dose ?? "",

                    frequency:
                        medicine.frequency ?? "",

                    duration:
                        medicine.duration ?? "",

                })
            ),

    };

}

static fromDatabase(
    prescription: CompletePrescriptionRecord,
): DuplicatePrescriptionModel {

    return {

        consultationDate:
            prescription.prescription.consultationDate ?? "",

        doctorName:
            prescription.prescription.doctorName ?? "",

        hospitalName:
            prescription.prescription.hospitalOrClinic ?? "",

        diagnosis:
            prescription.prescription.diagnosisOrAssessment ?? "",

        medicines:
            (prescription.medicines ?? []).map(
                medicine => ({

                    name:
                        medicine.medicineName ?? "",

                    strength:
                        medicine.strength ?? "",

                    dose:
                        medicine.dose ?? "",

                    frequency:
                        medicine.frequency ?? "",

                    duration:
                        medicine.duration ?? "",

                })
            ),

    };

}

}