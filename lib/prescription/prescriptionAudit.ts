import { supabase } from "@/lib/supabase";
import type { CompletePrescriptionRecord } from "@/lib/prescription/prescriptionTypes";

export async function savePrescriptionAudit(
    previous: CompletePrescriptionRecord | null,
    current: CompletePrescriptionRecord
): Promise<void> {

    //------------------------------------------------------------
    // First Prescription
    //------------------------------------------------------------

    if (!previous) {

        await supabase
            .from("prescription_comparisons")
            .insert({
                previous_prescription_id: null,
                current_prescription_id: current.prescription.id,
                comparison_type: "NEW",
                total_changes: 0,
            });

        return;
    }

    //------------------------------------------------------------
    // Create comparison
    //------------------------------------------------------------

    const comparisonResult =
        await supabase
            .from("prescription_comparisons")
            .insert({
                previous_prescription_id:
                    previous.prescription.id,

                current_prescription_id:
                    current.prescription.id,

                comparison_type:
                    "FOLLOW_UP",

                total_changes:
                    0,
            })
            .select()
            .single();

    if (comparisonResult.error || !comparisonResult.data) {

        console.error(
            "Unable to save comparison",
            comparisonResult.error
        );

        return;
    }

    const comparisonId =
        comparisonResult.data.id;

    const changes: any[] = [];

    //------------------------------------------------------------
    // Header Comparison
    //------------------------------------------------------------

    compareField(
        changes,
        comparisonId,
        "HEADER",
        null,
        "doctor_name",
        previous.prescription.doctorName,
        current.prescription.doctorName
    );

    compareField(
        changes,
        comparisonId,
        "HEADER",
        null,
        "hospital_or_clinic",
        previous.prescription.hospitalOrClinic,
        current.prescription.hospitalOrClinic
    );

    compareField(
        changes,
        comparisonId,
        "HEADER",
        null,
        "consultation_date",
        previous.prescription.consultationDate,
        current.prescription.consultationDate
    );

    compareField(
        changes,
        comparisonId,
        "HEADER",
        null,
        "consultation_mode",
        previous.prescription.consultationMode,
        current.prescription.consultationMode
    );

    compareField(
        changes,
        comparisonId,
        "HEADER",
        null,
        "diagnosis",
        previous.prescription.diagnosisOrAssessment,
        current.prescription.diagnosisOrAssessment
    );


//------------------------------------------------------------
// Vitals Comparison
//------------------------------------------------------------

compareVitals(
    changes,
    comparisonId,
    previous,
    current
);

compareMedicines(
    changes,
    comparisonId,
    previous,
    current
);

//------------------------------------------------------------
// Symptoms Comparison
//------------------------------------------------------------

compareCollection(
    changes,
    comparisonId,
    "SYMPTOM",
    previous.symptoms,
    current.symptoms,
    symptom => symptom.symptom,
    [
        "symptom",
        "duration"
    ]
);

//------------------------------------------------------------
// History Comparison
//------------------------------------------------------------

compareCollection(
    changes,
    comparisonId,
    "HISTORY",
    previous.history,
    current.history,
    history => history.category,
    [
        "category",
        "value"
    ]
);

//------------------------------------------------------------
// Assessments Comparison
//------------------------------------------------------------

compareCollection(
    changes,
    comparisonId,
    "ASSESSMENT",
    previous.assessments,
    current.assessments,
    assessment => assessment.assessmentType,
    [
        "assessmentType",
        "value"
    ]
);

//------------------------------------------------------------
// Investigation Comparison
//------------------------------------------------------------

compareCollection(
    changes,
    comparisonId,
    "INVESTIGATION",
    previous.investigations,
    current.investigations,
    investigation => investigation.investigation,
    [
        "investigation"
    ]
);

//------------------------------------------------------------
// Instruction Comparison
//------------------------------------------------------------


compareCollection(
    changes,
    comparisonId,
    "INSTRUCTION",
    previous.instructions,
    current.instructions,
    instruction => instruction.instruction,
    [
        "instruction"
    ]
);

//------------------------------------------------------------
// Notes Comparison
//------------------------------------------------------------


compareCollection(
    changes,
    comparisonId,
    "NOTE",
    previous.notes,
    current.notes,
    note => note.note,
    [
        "note"
    ]
);

    //------------------------------------------------------------
    // Save Details
    //------------------------------------------------------------

    if (changes.length > 0) {

        await supabase
            .from("prescription_change_details")
            .insert(changes);

        await supabase
            .from("prescription_comparisons")
            .update({
                total_changes:
                    changes.length,
            })
            .eq(
                "id",
                comparisonId
            );
    }
}

function compareVitals(
    changes: any[],
    comparisonId: string,
    previous: CompletePrescriptionRecord,
    current: CompletePrescriptionRecord
) {

    compareField(
        changes,
        comparisonId,
        "VITAL",
        "Vitals",
        "weight",
        previous.vitals?.weight,
        current.vitals?.weight
    );

    compareField(
        changes,
        comparisonId,
        "VITAL",
        "Vitals",
        "height",
        previous.vitals?.height,
        current.vitals?.height
    );

    compareField(
        changes,
        comparisonId,
        "VITAL",
        "Vitals",
        "bmi",
        previous.vitals?.bmi,
        current.vitals?.bmi
    );

    compareField(
        changes,
        comparisonId,
        "VITAL",
        "Vitals",
        "blood_pressure",
        previous.vitals?.bloodPressure,
        current.vitals?.bloodPressure
    );

    compareField(
        changes,
        comparisonId,
        "VITAL",
        "Vitals",
        "pulse",
        previous.vitals?.pulse,
        current.vitals?.pulse
    );

    compareField(
        changes,
        comparisonId,
        "VITAL",
        "Vitals",
        "spo2",
        previous.vitals?.spo2,
        current.vitals?.spo2
    );

    compareField(
        changes,
        comparisonId,
        "VITAL",
        "Vitals",
        "temperature",
        previous.vitals?.temperature,
        current.vitals?.temperature
    );

    compareField(
        changes,
        comparisonId,
        "VITAL",
        "Vitals",
        "respiratory_rate",
        previous.vitals?.respiratoryRate,
        current.vitals?.respiratoryRate
    );

}




function compareMedicines(
    changes: any[],
    comparisonId: string,
    previous: CompletePrescriptionRecord,
    current: CompletePrescriptionRecord
) {

    //------------------------------------------------------------
    // Medicines
    //------------------------------------------------------------

    const max =
        Math.max(
            previous.medicines.length,
            current.medicines.length
        );

    for (let i = 0; i < max; i++) {

        const oldMedicine =
            previous.medicines[i];

        const newMedicine =
            current.medicines[i];

        if (!oldMedicine && newMedicine) {

            changes.push({
                comparison_id: comparisonId,
                entity: "MEDICINE",
                entity_name: newMedicine.medicineName,
                field_name: "medicine",
                action: "ADDED",
                old_value: null,
                new_value: newMedicine.medicineName,
            });

            continue;
        }

        if (oldMedicine && !newMedicine) {

            changes.push({
                comparison_id: comparisonId,
                entity: "MEDICINE",
                entity_name: oldMedicine.medicineName,
                field_name: "medicine",
                action: "REMOVED",
                old_value: oldMedicine.medicineName,
                new_value: null,
            });

            continue;
        }

        if (!oldMedicine || !newMedicine) {
            continue;
        }

        compareField(
            changes,
            comparisonId,
            "MEDICINE",
            newMedicine.medicineName,
            "medicine_name",
            oldMedicine.medicineName,
            newMedicine.medicineName
        );

compareField(
    changes,
    comparisonId,
    "MEDICINE",
    newMedicine.medicineName,
    "strength",
    oldMedicine.strength,
    newMedicine.strength
);


compareField(
    changes,
    comparisonId,
    "MEDICINE",
    newMedicine.medicineName,
    "form",
    oldMedicine.form,
    newMedicine.form
);

        compareField(
            changes,
            comparisonId,
            "MEDICINE",
            newMedicine.medicineName,
            "dose",
            oldMedicine.dose,
            newMedicine.dose
        );


compareField(
    changes,
    comparisonId,
    "MEDICINE",
    newMedicine.medicineName,
    "frequency",
    oldMedicine.frequency,
    newMedicine.frequency
);

        compareField(
            changes,
            comparisonId,
            "MEDICINE",
            newMedicine.medicineName,
            "timings",
            JSON.stringify(oldMedicine.timings),
            JSON.stringify(newMedicine.timings)
        );


        compareField(
            changes,
            comparisonId,
            "MEDICINE",
            newMedicine.medicineName,
            "duration",
            oldMedicine.duration,
            newMedicine.duration
        );

compareField(
    changes,
    comparisonId,
    "MEDICINE",
    newMedicine.medicineName,
    "instructions",
    oldMedicine.instructions,
    newMedicine.instructions
);

    }

}

function compareField(
    changes: any[],
    comparisonId: string,
    entity: string,
    entityName: string | null,
    field: string,
    oldValue: unknown,
    newValue: unknown
) {

    const oldText =
        oldValue == null ? "" : String(oldValue);

    const newText =
        newValue == null ? "" : String(newValue);

    if (oldText === newText) {
        return;
    }

    changes.push({
        comparison_id: comparisonId,
        entity,
        entity_name: entityName,
        field_name: field,
        action: "UPDATED",
        old_value: oldText,
        new_value: newText,
    });

}

function compareCollection<
    T extends Record<string, any>
>(
    changes: any[],
    comparisonId: string,
    entity: string,
    previousItems: T[],
    currentItems: T[],
    entityName: (item: T) => string,
    fields: (keyof T)[]
) {

    const max = Math.max(
        previousItems.length,
        currentItems.length
    );

    for (let i = 0; i < max; i++) {

        const oldItem = previousItems[i];
        const newItem = currentItems[i];

        if (!oldItem && newItem) {

            changes.push({
                comparison_id: comparisonId,
                entity,
                entity_name: entityName(newItem),
                field_name: entity.toLowerCase(),
                action: "ADDED",
                old_value: null,
                new_value: entityName(newItem),
            });

            continue;
        }

        if (oldItem && !newItem) {

            changes.push({
                comparison_id: comparisonId,
                entity,
                entity_name: entityName(oldItem),
                field_name: entity.toLowerCase(),
                action: "REMOVED",
                old_value: entityName(oldItem),
                new_value: null,
            });

            continue;
        }

        if (!oldItem || !newItem) {
            continue;
        }

        for (const field of fields) {

            compareField(
                changes,
                comparisonId,
                entity,
                entityName(newItem),
                String(field),
                oldItem[field],
                newItem[field]
            );

        }

    }

}

