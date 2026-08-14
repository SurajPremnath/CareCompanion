import type {
    ExtractedPrescription,
} from "@/lib/prescription-image/prescriptionImageTypes";

import {
    mapReviewedPrescriptionToSaveInput,
} from "@/lib/prescription/prescriptionMapper";

import {
    prescriptionRepository,
} from "@/lib/prescription/prescriptionRepository";

import {
    patientStorage,
} from "@/lib/storage/patientStorage";

import type {
    CompletePrescriptionRecord,
    PrescriptionRecordContext,
} from "@/lib/prescription/prescriptionTypes";

import {
    ClinicalEventBuilder,
} from "@/lib/builders/clinicalEventBuilder";

import {
    ClinicalEventStorage,
} from "@/lib/storage/clinicalEventStorage";

import {
    ClinicalEventDetailBuilder,
} from "@/lib/builders/clinicalEventDetailBuilder";

import {
    ClinicalEventDetailStorage,
} from "@/lib/storage/clinicalEventDetailStorage";


//------------------------------------------------------------
// Save Context
//------------------------------------------------------------

export interface PrescriptionSaveContext {

    userId: string;

    patientId: string | null;

    familyId: string | null;

    recordContext:
        PrescriptionRecordContext;

}


//------------------------------------------------------------
// Normalise Consultation Date
//------------------------------------------------------------

function normaliseConsultationDate(
    value: string | null
): string | null {

    if (!value) {

        return null;

    }


    const trimmedValue =
        value.trim();


    if (!trimmedValue) {

        return null;

    }


    //--------------------------------------------------------
    // Already ISO YYYY-MM-DD
    //--------------------------------------------------------

    const isoDatePattern =
        /^\d{4}-\d{2}-\d{2}$/;


    if (
        isoDatePattern.test(
            trimmedValue
        )
    ) {

        const parsedDate =
            new Date(
                `${trimmedValue}T00:00:00Z`
            );


        if (
            !Number.isNaN(
                parsedDate.getTime()
            )
        ) {

            return trimmedValue;

        }

    }


//--------------------------------------------------------
// DD/MM/YYYY, DD/MM/YY, DD-MM-YYYY or DD-MM-YY
//--------------------------------------------------------

const dayFirstMatch =
    trimmedValue.match(
        /^(\d{1,2})[/-](\d{1,2})[/-](\d{2}|\d{4})$/
    );

if (dayFirstMatch) {

    const day =
        Number(dayFirstMatch[1]);

    const month =
        Number(dayFirstMatch[2]);

    let year =
        Number(dayFirstMatch[3]);

    if (year < 100) {

        year += 2000;

    }

    const candidate =
        new Date(
            Date.UTC(
                year,
                month - 1,
                day
            )
        );

    const isValid =
        candidate.getUTCFullYear() === year &&
        candidate.getUTCMonth() === month - 1 &&
        candidate.getUTCDate() === day;

    if (isValid) {

        return [
            year.toString().padStart(4, "0"),
            month.toString().padStart(2, "0"),
            day.toString().padStart(2, "0"),
        ].join("-");

    }

}


    //--------------------------------------------------------
    // Do Not Guess Ambiguous / Unrecognised Dates
    //--------------------------------------------------------

    return null;

}

//------------------------------------------------------------
// Calculate Age From Date Of Birth
//------------------------------------------------------------

function calculateAgeFromDateOfBirth(
    dateOfBirth: string | null,
    referenceDate: string | null
): string | null {

    if (
        !dateOfBirth ||
        !referenceDate
    ) {
        return null;
    }

    const dob =
        new Date(
            `${dateOfBirth}T00:00:00Z`
        );

    const reference =
        new Date(
            `${referenceDate}T00:00:00Z`
        );

    if (
        Number.isNaN(
            dob.getTime()
        ) ||
        Number.isNaN(
            reference.getTime()
        )
    ) {
        return null;
    }

    let age =
        reference.getUTCFullYear() -
        dob.getUTCFullYear();

    const referenceMonth =
        reference.getUTCMonth();

    const dobMonth =
        dob.getUTCMonth();

    const birthdayNotReached =
        referenceMonth < dobMonth ||
        (
            referenceMonth === dobMonth &&
            reference.getUTCDate() <
                dob.getUTCDate()
        );

    if (birthdayNotReached) {
        age -= 1;
    }

    if (age < 0) {
        return null;
    }

    return `${age} Yrs`;
}


//------------------------------------------------------------
// Validate Context
//------------------------------------------------------------

function validateContext(
    context:
        PrescriptionSaveContext
): void {


    if (
        !context.userId.trim()
    ) {

        throw new Error(
            "Authenticated user is required."
        );

    }


    if (
        context.recordContext === "SELF" &&
        context.patientId !== null
    ) {

        throw new Error(
            "Self prescription cannot have a patient."
        );

    }


    if (
        context.recordContext === "FAMILY" &&
        !context.patientId
    ) {

        throw new Error(
            "Please select a patient before saving the prescription."
        );

    }

}


//------------------------------------------------------------
// Prescription Storage
//------------------------------------------------------------

export const prescriptionStorage = {

    async savePrescription(

        prescription:
            ExtractedPrescription,

        context:
            PrescriptionSaveContext

    ): Promise<CompletePrescriptionRecord> {


        //----------------------------------------------------
        // Validate Context
        //----------------------------------------------------

        validateContext(
            context
        );


//----------------------------------------------------
// Prepare Reviewed Copy
//----------------------------------------------------

const normalisedConsultationDate =
    normaliseConsultationDate(
        prescription
            .encounterIdentity
            .consultationDate
    );


let resolvedPatientAge =
    prescription
        .patientIdentity
        .patientAge;

let resolvedPatientGender =
    prescription
        .patientIdentity
        .patientGender;

let resolvedAgeSource =
    prescription
        .patientIdentity
        .ageSource;

let resolvedSexSource =
    prescription
        .patientIdentity
        .sexSource;


//----------------------------------------------------
// Patient Profile Fallback
//----------------------------------------------------

if (
    context.patientId &&
    (
        !prescription
            .patientIdentity
            .ageFlag ||
        !prescription
            .patientIdentity
            .sexFlag
    )
) {

    const patientResult =
        await patientStorage.getPatient(
            context.patientId
        );

    if (
        patientResult.success &&
        patientResult.data
    ) {

        const patient =
            patientResult.data;

        //------------------------------------------------
        // Age fallback
        //------------------------------------------------

        if (
            !prescription
                .patientIdentity
                .ageFlag
        ) {

            const profileAge =
                calculateAgeFromDateOfBirth(
                    patient.dateOfBirth,
                    normalisedConsultationDate
                );

            if (profileAge) {

                resolvedPatientAge =
                    profileAge;

                resolvedAgeSource =
                    "PATIENT_PROFILE";

            }

        }

        //------------------------------------------------
        // Sex fallback
        //------------------------------------------------

        if (
            !prescription
                .patientIdentity
                .sexFlag
        ) {

            if (patient.gender) {

                resolvedPatientGender =
                    patient.gender;

                resolvedSexSource =
                    "PATIENT_PROFILE";

            }

        }

    }

}

const preparedPrescription:
    ExtractedPrescription = {

        ...prescription,

        patientIdentity: {

            ...prescription.patientIdentity,

            patientAge:
                resolvedPatientAge,

            patientGender:
                resolvedPatientGender,

            ageSource:
                resolvedAgeSource,

            sexSource:
                resolvedSexSource,

        },

        encounterIdentity: {

            ...prescription.encounterIdentity,

            consultationDate:
                normalisedConsultationDate,

        },

    };


        //----------------------------------------------------
        // Map To Persistence Input
        //----------------------------------------------------

        const saveInput =
            mapReviewedPrescriptionToSaveInput(

                preparedPrescription,

                {

                    userId:
                        context.userId,

                    patientId:
                        context.patientId,

                    familyId:
                        context.familyId,

                    recordContext:
                        context.recordContext,

                }

            );


//----------------------------------------------------
// Save Structured Data
//----------------------------------------------------

const savedPrescription =
    await prescriptionRepository.create(
        saveInput
    );


//----------------------------------------------------
// Create Common Clinical Event
//----------------------------------------------------

const clinicalEvent =
    ClinicalEventBuilder.fromPrescription(
        savedPrescription
    );

const savedClinicalEvent =
    await ClinicalEventStorage.create(
        clinicalEvent
    );


//----------------------------------------------------
// Create Clinical Event Detail
//----------------------------------------------------

const clinicalEventDetail =
    ClinicalEventDetailBuilder.fromPrescription(
        savedPrescription,
        savedClinicalEvent.id
    );

await ClinicalEventDetailStorage.create(
    clinicalEventDetail
);


//----------------------------------------------------
// Return Saved Prescription
//----------------------------------------------------

return savedPrescription;

    },

    async getPatientPrescriptions(

        context: PrescriptionSaveContext

    ): Promise<CompletePrescriptionRecord[]> {

        validateContext(context);

        return prescriptionRepository.getPatientPrescriptions(

            context.userId,

            context.recordContext,

            context.patientId

        );

    },

async getPendingMedicationValidation(
    context: PrescriptionSaveContext
): Promise<CompletePrescriptionRecord | null> {

    return prescriptionRepository.getPendingMedicationValidation(
        context.userId,
        context.recordContext,
        context.patientId
    );

},

//------------------------------------------------------------
// Update Pending Medicines
//------------------------------------------------------------

async updatePendingMedicines(

    prescriptionId: string,

    medicines: CompletePrescriptionRecord["medicines"]

): Promise<void> {

    return prescriptionRepository
        .updatePendingMedicines(

            prescriptionId,

            medicines

        );

},

};