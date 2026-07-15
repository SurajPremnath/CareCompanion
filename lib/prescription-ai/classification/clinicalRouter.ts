// lib/prescription-ai/classification/clinicalRouter.ts

import {
    ExtractedPrescription,
    ExtractedPrescriptionMedicine,
    ExtractedHistory,
    ExtractedExaminationFinding,
} from "@/lib/prescription-image/prescriptionImageTypes";

export interface RoutedAssessment {
    primary: string[];
    secondary: string[];
    differential: string[];
}

export interface RoutedInvestigation {
    name: string;
    category:
        | "Blood Test"
        | "Imaging"
        | "Urine"
        | "Cardiac"
        | "Pulmonary"
        | "Other";
    priority: "Routine" | "Urgent";
    status: "Ordered" | "Completed";
}

export interface RoutedInstruction {
    text: string;
    category:
        | "Medication"
        | "Home Care"
        | "Diet"
        | "Activity"
        | "Follow-up"
        | "General";
}

export interface RoutedPrescription {

    identity: {
        patientName: string | null;
        age: string | null;
        gender: string | null;
        doctor: string | null;
        hospital: string | null;
        consultationDate: string | null;
        consultationType: string | null;
        uhid: string | null;
    };

    vitals: {
        weight: string | null;
        bloodPressure: string | null;
        pulse: string | null;
        spo2: string | null;
        temperature: string | null;
    };

    symptoms: string[];

    medicalHistory: ExtractedHistory[];

    examination: ExtractedExaminationFinding[];

    assessment: RoutedAssessment;

    medicines: ExtractedPrescriptionMedicine[];

    investigations: RoutedInvestigation[];

    careInstructions: RoutedInstruction[];

    followUpNotes: string[];
}

export function routeClinicalInformation(
    prescription: ExtractedPrescription
): RoutedPrescription {

    return {

        identity: {

            patientName:
                clean(prescription.patientName),

            age:
                clean(prescription.patientAge),

            gender:
                clean(prescription.patientGender),

            doctor:
                clean(prescription.doctorName),

            hospital:
                clean(prescription.hospitalOrClinic),

            consultationDate:
                clean(prescription.consultationDate),

            consultationType:
                clean(prescription.consultationMode),

            uhid:
                clean(prescription.patientUHID),
        },

        vitals: {

weight:
    clean(prescription.consultationVitals?.weight),

bloodPressure:
    clean(prescription.consultationVitals?.bloodPressure),

pulse:
    clean(prescription.consultationVitals?.pulse),

spo2:
    clean(prescription.consultationVitals?.spo2),

temperature:
    clean(prescription.consultationVitals?.temperature),
        },

        symptoms:
            uniqueStrings(
    (prescription.presentingComplaints ?? []).map(
        complaint => complaint.complaint
    )
),

        medicalHistory:
            prescription.history ?? [],

        examination:
            prescription.examinationFindings ?? [],

        assessment:
            buildAssessment(
                prescription.diagnosisOrAssessment
            ),

        medicines:
            deduplicateMedicines(
                prescription.medicines ?? []
            ),

        investigations:
            buildInvestigations(
                prescription.investigations ?? []
            ),

        careInstructions:
            buildInstructions(
                prescription.doctorInstructions ?? []
            ),

        followUpNotes:
            buildFollowUpNotes(
                prescription.additionalNotes
            ),
    };
}

/* ------------------------------------------------------- */
/* Helpers                                                  */
/* ------------------------------------------------------- */

function clean(
    value: string | null | undefined
): string | null {

    if (!value) return null;

    const v = value.trim();

    return v.length === 0 ? null : v;
}

function uniqueStrings(
    values: string[]
): string[] {

    return [...new Set(values.map(v => v.trim()))]
        .filter(Boolean);
}

function deduplicateMedicines(
    medicines: ExtractedPrescriptionMedicine[]
): ExtractedPrescriptionMedicine[] {

    const seen = new Set<string>();

    return medicines.filter(m => {

        const key =
            m.name.toLowerCase().trim();

        if (seen.has(key))
            return false;

        seen.add(key);

        return true;

    });
}

function buildAssessment(
    diagnosis: string | null | undefined
): RoutedAssessment {

    if (!diagnosis) {

        return {

            primary: [],
            secondary: [],
            differential: [],
        };
    }

    const text = diagnosis.trim();

    const differential: string[] = [];

    const primary: string[] = [];

    const secondary: string[] = [];

    text
        .split(/[,\n]/)
        .map(x => x.trim())
        .filter(Boolean)
        .forEach(item => {

            if (item.startsWith("?")) {

                differential.push(item);

            } else if (primary.length === 0) {

                primary.push(item);

            } else {

                secondary.push(item);

            }

        });

    return {

        primary,

        secondary,

        differential,
    };
}

function buildInvestigations(
    items: string[]
): RoutedInvestigation[] {

    return uniqueStrings(items).map(item => ({

        name: item,

        category:
            classifyInvestigation(item),

        priority: "Routine",

        status: "Ordered",

    }));
}

function classifyInvestigation(
    value: string
): RoutedInvestigation["category"] {

    const text =
        value.toLowerCase();

    if (
        text.includes("ultrasound") ||
        text.includes("ct") ||
        text.includes("mri") ||
        text.includes("xray")
    )
        return "Imaging";

    if (
        text.includes("cbc") ||
        text.includes("crp") ||
        text.includes("iron") ||
        text.includes("vitamin") ||
        text.includes("psa")
    )
        return "Blood Test";

    if (
        text.includes("urine")
    )
        return "Urine";

    return "Other";
}

function buildInstructions(
    items: string[]
): RoutedInstruction[] {

    return uniqueStrings(items).map(item => ({

        text: item,

        category:
            classifyInstruction(item),

    }));
}

function classifyInstruction(
    value: string
): RoutedInstruction["category"] {

    const text =
        value.toLowerCase();

    if (
        text.includes("steam") ||
        text.includes("gargle")
    )
        return "Home Care";

    if (
        text.includes("diet")
    )
        return "Diet";

    if (
        text.includes("walk") ||
        text.includes("exercise")
    )
        return "Activity";

    if (
        text.includes("follow")
    )
        return "Follow-up";

    return "General";
}

function buildFollowUpNotes(
    notes: string | null | undefined
): string[] {

    if (!notes)
        return [];

    return notes
        .split(/\n|,/)
        .map(x => x.trim())
        .filter(Boolean);
}