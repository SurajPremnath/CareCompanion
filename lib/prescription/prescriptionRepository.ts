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

    record_context: "SELF" | "FAMILY";

    doctor_name: string | null;

    consultation_date: string | null;

    consultation_mode:
        | "IN_PERSON"
        | "VIDEO"
        | "PHONE"
        | "WHATSAPP"
        | "EMAIL"
        | "HOME_VISIT"
        | "HOSPITAL_ADMISSION"
        | "HOSPITAL_DISCHARGE"
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

interface PrescriptionVitalRow {

    id: string;

    prescription_id: string;

    weight: string | null;

    height: string | null;

    bmi: string | null;

    blood_pressure: string |null;

    pulse: string | null;

    respiratory_rate: string | null;

    spo2: string | null;

    temperature: string | null;

    created_at: string;

    updated_at: string;

}

interface PrescriptionSymptomRow {

    id: string;

    prescription_id: string;

    symptom: string;

    duration: string | null;

    display_order: number;

    created_at: string;

    updated_at: string;

}

//------------------------------------------------------------
// Database Mappers
//------------------------------------------------------------

function mapPrescriptionRow(
    row: PrescriptionRow
): PrescriptionRecord {

    return {

        id: row.id,

        userId: row.user_id,

        patientId: row.patient_id,

        familyId: row.family_id,

        recordContext: row.record_context,

        doctorName: row.doctor_name,

        consultationDate: row.consultation_date,

        consultationMode: row.consultation_mode,

        hospitalOrClinic: row.hospital_or_clinic,

        diagnosisOrAssessment: row.diagnosis_or_assessment,

        additionalNotes: row.additional_instructions,

        reviewedAt: row.reviewed_at,

        createdAt: row.created_at,

        updatedAt: row.updated_at,

    };

}

function mapMedicineRow(
    row: PrescriptionMedicineRow
): PrescriptionMedicineRecord {

    return {

        id: row.id,

        prescriptionId: row.prescription_id,

        medicineName: row.medicine_name,

        strength: row.strength,

        form: row.form,

        dose: row.dose,

        frequency: row.frequency,

        timings: row.timings,

        duration: row.duration,

        instructions: row.instructions,

        displayOrder: row.display_order,

        createdAt: row.created_at,

        updatedAt: row.updated_at,

    };

}

//------------------------------------------------------------
// Child Table Helpers
//------------------------------------------------------------

async function saveVitals(

    prescriptionId: string,

    input: PrescriptionSaveInput

): Promise<void> {

    if (!input.vitals) {

        return;

    }

    const { error } = await supabase

        .from("prescription_vitals")

        .insert({

            prescription_id: prescriptionId,

            weight: input.vitals.weight,

            height: input.vitals.height,

            bmi: input.vitals.bmi,

            blood_pressure: input.vitals.bloodPressure,

            pulse: input.vitals.pulse,

            respiratory_rate: input.vitals.respiratoryRate,

            spo2: input.vitals.spo2,

            temperature: input.vitals.temperature,

        });

    if (error) {

        throw new Error(
            error.message ??
            "Unable to save prescription vitals."
        );

    }

}

async function saveSymptoms(

    prescriptionId: string,

    input: PrescriptionSaveInput

): Promise<void> {

    if (
        input.symptoms.length === 0
    ) {

        return;

    }

    const rows =
        input.symptoms.map(
            symptom => ({

                prescription_id:
                    prescriptionId,

                symptom:
                    symptom.symptom,

                duration:
                    symptom.duration,

                display_order:
                    symptom.displayOrder,

            })
        );

    const { error } =
        await supabase

            .from(
                "prescription_symptoms"
            )

            .insert(
                rows
            );

    if (error) {

        throw new Error(
            error.message ??
            "Unable to save prescription symptoms."
        );

    }

}


//------------------------------------------------------------
// Save Prescription History
//------------------------------------------------------------

async function saveHistory(

    prescriptionId: string,

    input: PrescriptionSaveInput

): Promise<void> {

    if (

        input.history.length === 0

    ) {

        return;

    }

    const rows =

        input.history.map(

            history => ({

                prescription_id:

                    prescriptionId,

                category:

                    history.category,

                value:

                    history.value,

                display_order:

                    history.displayOrder,

            })

        );

    const { error } =

        await supabase

            .from(

                "prescription_history"

            )

            .insert(

                rows

            );

    if (error) {

        throw new Error(

            error.message ??

            "Unable to save prescription history."

        );

    }

}

//------------------------------------------------------------
// Save Prescription Assessments
//------------------------------------------------------------

async function saveAssessments(

    prescriptionId: string,

    input: PrescriptionSaveInput

): Promise<void> {

    if (

        input.assessments.length === 0

    ) {

        return;

    }

    const rows =

        input.assessments.map(

            assessment => ({

                prescription_id:

                    prescriptionId,

                assessment_type:

                    assessment.assessmentType,

                value:

                    assessment.value,

                display_order:

                    assessment.displayOrder,

            })

        );

    const { error } =

        await supabase

            .from(

                "prescription_assessments"

            )

            .insert(

                rows

            );

    if (error) {

        throw new Error(

            error.message ??

            "Unable to save prescription assessments."

        );

    }

}

//------------------------------------------------------------
// Save Prescription Investigations
//------------------------------------------------------------

async function saveInvestigations(
    prescriptionId: string,
    input: PrescriptionSaveInput
): Promise<void> {

    if (input.investigations.length === 0) {
        return;
    }

    const rows = input.investigations.map(investigation => ({
        prescription_id: prescriptionId,
        investigation: investigation.investigation,
        display_order: investigation.displayOrder,
    }));

    const { error } = await supabase
        .from("prescription_investigations")
        .insert(rows);

    if (error) {
        throw new Error(
            error.message ??
            "Unable to save prescription investigations."
        );
    }

}

//------------------------------------------------------------
// Save Prescription Instructions
//------------------------------------------------------------

async function saveInstructions(
    prescriptionId: string,
    input: PrescriptionSaveInput
): Promise<void> {

    if (input.instructions.length === 0) {
        return;
    }

    const rows = input.instructions.map(instruction => ({
        prescription_id: prescriptionId,
        instruction: instruction.instruction,
        display_order: instruction.displayOrder,
    }));

    const { error } = await supabase
        .from("prescription_instructions")
        .insert(rows);

    if (error) {
        throw new Error(
            error.message ??
            "Unable to save prescription instructions."
        );
    }

}

//------------------------------------------------------------
// Save Prescription Notes
//------------------------------------------------------------

async function saveNotes(
    prescriptionId: string,
    input: PrescriptionSaveInput
): Promise<void> {

    if (input.notes.length === 0) {
        return;
    }

    const rows = input.notes.map(note => ({
        prescription_id: prescriptionId,
        note: note.note,
        display_order: note.displayOrder,
    }));

    const { error } = await supabase
        .from("prescription_notes")
        .insert(rows);

    if (error) {
        throw new Error(
            error.message ??
            "Unable to save prescription notes."
        );
    }

}

//------------------------------------------------------------
// Repository
//------------------------------------------------------------

export const prescriptionRepository = {

    async create(

        input: PrescriptionSaveInput

    ): Promise<CompletePrescriptionRecord> {

        //----------------------------------------------------
        // Insert Parent Prescription
        //----------------------------------------------------

        const {

            data: prescriptionData,

            error: prescriptionError,

        } = await supabase

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
                    input.additionalNotes,

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
        // Save Child Tables
        //----------------------------------------------------

        try {

            await saveVitals(

                prescriptionRow.id,

                input

            );

            await saveSymptoms(

                prescriptionRow.id,

                input

            );

//----------------------------------------------------
// Save History
//----------------------------------------------------

await saveHistory(

    prescriptionRow.id,

    input

);

//----------------------------------------------------
// Save Assessments
//----------------------------------------------------

await saveAssessments(

    prescriptionRow.id,

    input

);

//----------------------------------------------------
// Save Investigations
//----------------------------------------------------

await saveInvestigations(

    prescriptionRow.id,

    input

);

//----------------------------------------------------
// Save Instructions
//----------------------------------------------------

await saveInstructions(
    prescriptionRow.id,
    input
);

//----------------------------------------------------
// Save Notes
//----------------------------------------------------

await saveNotes(
    prescriptionRow.id,
    input
);

}
        catch (error) {

            //------------------------------------------------
            // Rollback Parent
            //------------------------------------------------

            await supabase

                .from("prescriptions")

                .delete()

                .eq(

                    "id",

                    prescriptionRow.id

                );

            throw error;

        }

        //----------------------------------------------------
        // Save Medicines
        //----------------------------------------------------

        if (

            input.medicines.length === 0

        ) {

            return {

                prescription:

                    mapPrescriptionRow(

                        prescriptionRow

                    ),

                medicines: [],

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

        } = await supabase

            .from(

                "prescription_medicines"

            )

            .insert(

                medicineRows

            )

            .select();

        if (

            medicinesError ||

            !medicinesData

        ) {

            //------------------------------------------------
            // Rollback Entire Prescription
            //------------------------------------------------

            await supabase

                .from("prescriptions")

                .delete()

                .eq(

                    "id",

                    prescriptionRow.id

                );

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