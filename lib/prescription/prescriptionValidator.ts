import type {
    ExtractedPrescription,
} from "@/lib/prescription-image/prescriptionImageTypes";

export interface PrescriptionValidationResult {

    valid: boolean;

    errors: string[];

    warnings: string[];

}

export function validatePrescriptionBeforeSave(

    prescription: ExtractedPrescription,

    selectedPatientName: string,

    recordContext: "SELF" | "FAMILY"

): PrescriptionValidationResult {

    const errors: string[] = [];

    const warnings: string[] = [];

    //--------------------------------------------------
    // Patient Validation
    //--------------------------------------------------

    if (!selectedPatientName.trim()) {

        errors.push(
            "Please select a patient."
        );

    }

    if (

        prescription.patientName &&
        selectedPatientName &&
        prescription.patientName.trim().toLowerCase() !==
        selectedPatientName.trim().toLowerCase()

    ) {

        errors.push(

            `This prescription appears to belong to ${prescription.patientName}.`

        );

    }

    //--------------------------------------------------
    // Consultation Date
    //--------------------------------------------------

    if (!prescription.consultationDate?.trim()) {

        errors.push(
            "Consultation date is required."
        );

    }
    else {

        const consultationDate =
            new Date(
                prescription.consultationDate
            );

        if (

            Number.isNaN(
                consultationDate.getTime()
            )

        ) {

            errors.push(
                "Consultation date is invalid."
            );

        }
        else {

            const today =
                new Date();

            today.setHours(
                0,
                0,
                0,
                0
            );

            consultationDate.setHours(
                0,
                0,
                0,
                0
            );

            if (
                consultationDate > today
            ) {

                errors.push(
                    "Consultation date cannot be in the future."
                );

            }

        }

    }

    //--------------------------------------------------
    // Consultation Mode
    //--------------------------------------------------

    if (

        !prescription.consultationMode ||
        !prescription.consultationMode.trim()

    ) {

        errors.push(
            "Please select the consultation type."
        );

    }

    //--------------------------------------------------
    // Medicines
    //--------------------------------------------------

    if (

        prescription.medicines.length === 0

    ) {

        warnings.push(

            "No medicines were detected."

        );

    }

    //--------------------------------------------------
    // Doctor
    //--------------------------------------------------

    if (

        !prescription.doctorName?.trim()

    ) {

        warnings.push(

            "Doctor name was not detected."

        );

    }

//--------------------------------------------------
// Hospital / Clinic
//--------------------------------------------------

if (

    !prescription.hospitalOrClinic?.trim()

) {

    warnings.push(

        "Hospital or clinic was not detected."

    );

}

//--------------------------------------------------
// Diagnosis / Assessment
//--------------------------------------------------

if (

    !prescription.diagnosisOrAssessment?.trim()

) {

    warnings.push(

        "Diagnosis or assessment was not detected."

    );

}

//--------------------------------------------------

return {

    valid:
        errors.length === 0,

    errors,

    warnings,

};

}