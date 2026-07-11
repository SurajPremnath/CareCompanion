import {
    supabase,
} from "@/lib/supabase";

import type {
    CompletePrescriptionRecord,
    PrescriptionMedicineRecord,
    PrescriptionRecord,
    PrescriptionSaveInput,
} from "@/lib/prescription/prescriptionTypes";


//------------------------------------------------------------
// Database Row Types
//------------------------------------------------------------

interface PrescriptionRow {

    id: string;

    user_id: string;

    patient_id: string | null;

    family_id: string | null;

    record_context:
        "SELF" | "FAMILY";

    doctor_name: string | null;

    consultation_date: string | null;

    consultation_mode:
        | "IN_PERSON"
        | "VIDEO"
        | "PHONE"
        | "HOME_VISIT"
        | "OTHER"
        | null;

    hospital_or_clinic: string | null;

    diagnosis_or_assessment: string | null;

    additional_instructions: string | null;

    reviewed_at: string;

    created_at: string;

    updated_at: string;

}


interface PrescriptionMedicineRow {

    id: string;

    prescription_id: string;

    medicine_name: string;

    strength: string | null;

    form: string | null;

    dose: string | null;

    frequency: string | null;

    timings: string[];

    duration: string | null;

    instructions: string | null;

    display_order: number;

    created_at: string;

    updated_at: string;

}


//------------------------------------------------------------
// Map Database Rows
//------------------------------------------------------------

function mapPrescriptionRow(
    row: PrescriptionRow
): PrescriptionRecord {

    return {

        id:
            row.id,

        userId:
            row.user_id,

        patientId:
            row.patient_id,

        familyId:
            row.family_id,

        recordContext:
            row.record_context,

        doctorName:
            row.doctor_name,

        consultationDate:
            row.consultation_date,

        consultationMode:
            row.consultation_mode,

        hospitalOrClinic:
            row.hospital_or_clinic,

        diagnosisOrAssessment:
            row.diagnosis_or_assessment,

        additionalInstructions:
            row.additional_instructions,

        reviewedAt:
            row.reviewed_at,

        createdAt:
            row.created_at,

        updatedAt:
            row.updated_at,

    };

}


function mapMedicineRow(
    row: PrescriptionMedicineRow
): PrescriptionMedicineRecord {

    return {

        id:
            row.id,

        prescriptionId:
            row.prescription_id,

        medicineName:
            row.medicine_name,

        strength:
            row.strength,

        form:
            row.form,

        dose:
            row.dose,

        frequency:
            row.frequency,

        timings:
            row.timings,

        duration:
            row.duration,

        instructions:
            row.instructions,

        displayOrder:
            row.display_order,

        createdAt:
            row.created_at,

        updatedAt:
            row.updated_at,

    };

}


//------------------------------------------------------------
// Repository
//------------------------------------------------------------

export const prescriptionRepository = {

    async create(

        input:
            PrescriptionSaveInput

    ): Promise<CompletePrescriptionRecord> {


        //----------------------------------------------------
        // Insert Parent Prescription
        //----------------------------------------------------

        const {
            data: prescriptionData,
            error: prescriptionError,
        } =
            await supabase
                .from("prescriptions")
                .insert({

                    user_id:
                        input.userId,

                    patient_id:
                        input.patientId,

                    family_id:
                        input.familyId,

                    record_context:
                        input.recordContext,

                    doctor_name:
                        input.doctorName,

                    consultation_date:
                        input.consultationDate,

                    consultation_mode:
                        input.consultationMode,

                    hospital_or_clinic:
                        input.hospitalOrClinic,

                    diagnosis_or_assessment:
                        input.diagnosisOrAssessment,

                    additional_instructions:
                        input.additionalInstructions,

                })
                .select()
                .single();


        if (
            prescriptionError ||
            !prescriptionData
        ) {

            throw new Error(
                prescriptionError?.message ??
                "Unable to save prescription."
            );

        }


        const prescriptionRow =
            prescriptionData as PrescriptionRow;


        //----------------------------------------------------
        // Insert Medicine Rows
        //----------------------------------------------------

        if (
            input.medicines.length === 0
        ) {

            return {

                prescription:
                    mapPrescriptionRow(
                        prescriptionRow
                    ),

                medicines:
                    [],

            };

        }


        const medicineRows =
            input.medicines.map(
                medicine => ({

                    prescription_id:
                        prescriptionRow.id,

                    medicine_name:
                        medicine.medicineName,

                    strength:
                        medicine.strength,

                    form:
                        medicine.form,

                    dose:
                        medicine.dose,

                    frequency:
                        medicine.frequency,

                    timings:
                        medicine.timings,

                    duration:
                        medicine.duration,

                    instructions:
                        medicine.instructions,

                    display_order:
                        medicine.displayOrder,

                })
            );


        const {
            data: medicinesData,
            error: medicinesError,
        } =
            await supabase
                .from(
                    "prescription_medicines"
                )
                .insert(
                    medicineRows
                )
                .select();


        //----------------------------------------------------
        // Compensating Cleanup
        //----------------------------------------------------

        if (
            medicinesError ||
            !medicinesData
        ) {

            const {
                error: cleanupError,
            } =
                await supabase
                    .from("prescriptions")
                    .delete()
                    .eq(
                        "id",
                        prescriptionRow.id
                    );


            if (cleanupError) {

                console.error(
                    "Prescription cleanup failed:",
                    cleanupError
                );

            }


            throw new Error(
                medicinesError?.message ??
                "Unable to save prescription medicines."
            );

        }


        //----------------------------------------------------
        // Return Complete Record
        //----------------------------------------------------

        return {

            prescription:
                mapPrescriptionRow(
                    prescriptionRow
                ),

            medicines:
                (
                    medicinesData as
                        PrescriptionMedicineRow[]
                ).map(
                    mapMedicineRow
                ),

        };

    },

};