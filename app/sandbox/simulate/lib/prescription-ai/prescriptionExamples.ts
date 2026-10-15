//------------------------------------------------------------
// CareVR Prescription Examples
//------------------------------------------------------------

export interface PrescriptionExample {

    title: string;

    doctorWrites: string;

expectedExtraction: {

    diagnosis: string | null;

    clinicalAssessments?: string[];

    presentingComplaints?: {

        complaint: string;

        duration: string | null;

    }[];

    history?: {

        category:
            | "MEDICAL"
            | "SURGICAL"
            | "MEDICATION"
            | "ALLERGY"
            | "LIFESTYLE"
            | "SOCIAL"
            | "OTHER";

        value: string;

    }[];

    consultationVitals?: {

        weight: string | null;

        height: string | null;

        bmi: string | null;

        bloodPressure: string | null;

        pulse: string | null;

        respiratoryRate: string | null;

        spo2: string | null;

        temperature: string | null;

    };

    medicines: {

        name: string;

        strength: string | null;

        dose: string | null;

        frequency: string | null;

        duration: string | null;

    }[];

    doctorInstructions?: string[];

    investigations: string[];

    clinicalPlan?: string[];

    followUpPlan?: string[];

    additionalNotes: string[];

};

}