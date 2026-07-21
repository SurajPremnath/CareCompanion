//------------------------------------------------------------
// Clinical Comparison Engine
//------------------------------------------------------------

import type {
    Assessment,
    Complaint,
    ConsultationRecord,
    ConsultationVitals,
    DoctorInstruction,
    FollowUp,
    History,
    Investigation,
    Medicine,
} from "@/lib/prescription-ai/models/consultationModel";

import {
    type ClinicalComparisonResult,
    type ComparisonEngineOptions,
    type MedicineComparison,
    type ComplaintComparison,
    type HistoryComparison,
    type AssessmentComparison,
    type InvestigationComparison,
    type DoctorInstructionComparison,
    type FollowUpComparison,
    type VitalsComparison,
    type ComparisonStatistics,
    type ClinicalNote,
    type ClarificationQuestion,
    type CollectionComparison,

    DEFAULT_COMPARISON_OPTIONS,
    DEFAULT_CONFIDENCE_SCORE,
} from "./comparisonTypes";

export class ClinicalComparisonEngine {

    private readonly options: Required<ComparisonEngineOptions>;

    constructor(
        options?: ComparisonEngineOptions,
    ) {

        this.options = {

            ...DEFAULT_COMPARISON_OPTIONS,

            ...options,

        };

    }

    //--------------------------------------------------------
    // Public Entry
    //--------------------------------------------------------

    public compare(
        previous: ConsultationRecord | null,
        current: ConsultationRecord,
    ): ClinicalComparisonResult {

        const patient =
            this.comparePatient(previous, current);

        const doctor =
            this.compareDoctor(previous, current);

        const hospital =
            this.compareHospital(previous, current);

        const consultationMode =
            this.compareConsultationMode(previous, current);

        const consultationDate =
            this.compareConsultationDate(previous, current);

        const additionalNotes =
            this.compareAdditionalNotes(previous, current);

        const medicines =
            this.compareMedicines(previous, current);

        const complaints =
            this.compareComplaints(previous, current);

        const history =
            this.compareHistory(previous, current);

        const assessments =
            this.compareAssessments(previous, current);

        const investigations =
            this.compareInvestigations(previous, current);

        const doctorInstructions =
            this.compareDoctorInstructions(previous, current);

        const followUps =
            this.compareFollowUps(previous, current);

        const vitals =
            this.compareVitals(previous, current);

        const notes =
    this.generateClinicalNotes(
        previous,
        current,
        medicines,
        complaints,
        assessments,
        investigations,
        doctorInstructions,
        followUps,
        doctor,
        hospital,
        vitals,
    );

        const questions =
            this.generateClarificationQuestions(
                medicines,
            );

        const statistics =
            this.buildStatistics(
                medicines,
                complaints,
                assessments,
                investigations,
                doctorInstructions,
                followUps,
                vitals,
                doctor.changed,
                hospital.changed,
            );

        return this.buildResult(

            previous,

            current,

            patient,

            doctor,

            hospital,

            consultationMode,

            consultationDate,

            additionalNotes,

            medicines,

            complaints,

            history,

            assessments,

            investigations,

            doctorInstructions,

            followUps,

            vitals,

            notes,

            questions,

            statistics,

        );

    }


    //--------------------------------------------------------
    // Generic Helpers
    //--------------------------------------------------------

    private normalize(
        value: string | null | undefined,
    ): string {

        if (!value) {

            return "";

        }

        let normalized = value.trim();

        if (this.options.ignoreWhitespace) {

            normalized =
                normalized.replace(/\s+/g, " ");

        }

        if (this.options.ignoreCase) {

            normalized =
                normalized.toLowerCase();

        }

        return normalized;

    }

    private equals(

        left: string | null | undefined,

        right: string | null | undefined,

    ): boolean {

        return (

            this.normalize(left) ===

            this.normalize(right)

        );

    }

    private changed(

        left: string | null | undefined,

        right: string | null | undefined,

    ): boolean {

        return !this.equals(left, right);

    }

    //--------------------------------------------------------
    // Generic Collection Helper
    //--------------------------------------------------------

    protected compareCollection<T>(

        previous: T[],

        current: T[],

        identity: (item: T) => string,

    ) {

        const previousMap =
            new Map<string, T>();

        const currentMap =
            new Map<string, T>();

        previous.forEach(item => {

            previousMap.set(

                this.normalize(identity(item)),

                item,

            );

        });

        current.forEach(item => {

            currentMap.set(

                this.normalize(identity(item)),

                item,

            );

        });

        return {

            previousMap,

            currentMap,

        };

    }



//--------------------------------------------------------
// Patient
//--------------------------------------------------------

private comparePatient(
    previous: ConsultationRecord | null,
    current: ConsultationRecord,
) {

    return {

changed:
    previous === null
        ? false
        : (

            this.changed(
                previous.patient.patientName,
                current.patient.patientName,
            )

            ||

            this.changed(
                previous.patient.uhid,
                current.patient.uhid,
            )

        ),

        previous:
            previous?.patient ?? null,

        current:
            current.patient,

    };

}

//--------------------------------------------------------
// Doctor
//--------------------------------------------------------

private compareDoctor(
    previous: ConsultationRecord | null,
    current: ConsultationRecord,
) {

    const previousDoctor =
        previous?.consultation?.doctorName ?? null;

    const currentDoctor =
        current.consultation?.doctorName ?? null;

    return {

        changed:
            previous === null
                ? false
                : this.changed(
                    previousDoctor,
                    currentDoctor,
                ),

        previous:
            previousDoctor,

        current:
            currentDoctor,

    };

}

//--------------------------------------------------------
// Hospital
//--------------------------------------------------------

private compareHospital(
    previous: ConsultationRecord | null,
    current: ConsultationRecord,
) {

    const previousHospital =
        previous?.consultation?.hospitalName ?? null;

    const currentHospital =
        current.consultation?.hospitalName ?? null;

    return {

        changed:
            previous === null
                ? false
                : this.changed(
                    previousHospital,
                    currentHospital,
                ),

        previous:
            previousHospital,

        current:
            currentHospital,

    };

}

//--------------------------------------------------------
// Consultation Mode
//--------------------------------------------------------

private compareConsultationMode(
    previous: ConsultationRecord | null,
    current: ConsultationRecord,
) {

    const previousMode =
        previous?.consultation?.consultationMode ?? null;

    const currentMode =
        current.consultation?.consultationMode ?? null;

    return {

        changed:
            previous === null
                ? false
                : previousMode !== currentMode,

        previous:
            previousMode,

        current:
            currentMode,

    };

}

//--------------------------------------------------------
// Consultation Date
//--------------------------------------------------------

private compareConsultationDate(
    previous: ConsultationRecord | null,
    current: ConsultationRecord,
) {

    const previousDate =
        previous?.consultation?.consultationDate ?? null;

    const currentDate =
        current.consultation?.consultationDate ?? null;

    return {

        changed:
            previous === null
                ? false
                : previousDate !== currentDate,

        previous:
            previousDate,

        current:
            currentDate,

    };

}

//--------------------------------------------------------
// Additional Notes
//--------------------------------------------------------

private compareAdditionalNotes(
    previous: ConsultationRecord | null,
    current: ConsultationRecord,
) {

    const previousNotes =
        previous?.additionalNotes ?? null;

    const currentNotes =
        current.additionalNotes ?? null;

    return {

        changed:
            previous === null
                ? false
                : this.changed(
                    previousNotes,
                    currentNotes,
                ),

        previous:
            previousNotes,

        current:
            currentNotes,

    };

}

//--------------------------------------------------------
// Medicines
//--------------------------------------------------------

private compareMedicines(
    previous: ConsultationRecord | null,
    current: ConsultationRecord,
): MedicineComparison[] {

    const previousMedicines =
        previous?.medicines ?? [];

    const currentMedicines =
        current.medicines ?? [];

    const previousMap = new Map<string, Medicine>();

    previousMedicines.forEach(medicine => {

        previousMap.set(
            this.normalize(medicine.name),
            medicine,
        );

    });

    const comparisons: MedicineComparison[] = [];

    currentMedicines.forEach(currentMedicine => {

        const key =
            this.normalize(currentMedicine.name);

        const previousMedicine =
            previousMap.get(key);

        if (!previousMedicine) {

            comparisons.push({

                medicineName:
                    currentMedicine.name,

                changeType: "NEW",

                previous: null,

                current: currentMedicine,

                changedFields: [],

            });

            return;

        }

        const changedFields: MedicineComparison["changedFields"] = [];

        if (
            this.changed(
                previousMedicine.strength,
                currentMedicine.strength,
            )
        ) {

            changedFields.push("strength");

        }

        if (
            this.changed(
                previousMedicine.form,
                currentMedicine.form,
            )
        ) {

            changedFields.push("form");

        }

        if (
            this.changed(
                previousMedicine.dose,
                currentMedicine.dose,
            )
        ) {

            changedFields.push("dose");

        }

        if (
            this.changed(
                previousMedicine.frequency,
                currentMedicine.frequency,
            )
        ) {

            changedFields.push("frequency");

        }

        if (
            this.changed(
                previousMedicine.duration,
                currentMedicine.duration,
            )
        ) {

            changedFields.push("duration");

        }

        if (
            this.changed(
                previousMedicine.administrationTiming,
                currentMedicine.administrationTiming,
            )
        ) {

            changedFields.push("administrationTiming");

        }

        if (
            this.changed(
                previousMedicine.instructions,
                currentMedicine.instructions,
            )
        ) {

            changedFields.push("instructions");

        }

        let changeType: MedicineComparison["changeType"] =
            "CONTINUED";

        if (changedFields.length === 1) {

            switch (changedFields[0]) {

                case "dose":
                    changeType = "DOSE_CHANGED";
                    break;

                case "frequency":
                    changeType = "FREQUENCY_CHANGED";
                    break;

                case "duration":
                    changeType = "DURATION_CHANGED";
                    break;

                case "administrationTiming":
                    changeType = "TIMING_CHANGED";
                    break;

                default:
                    changeType = "MULTIPLE_CHANGES";

            }

        } else if (changedFields.length > 1) {

            changeType = "MULTIPLE_CHANGES";

        }

        comparisons.push({

            medicineName:
                currentMedicine.name,

            changeType,

            previous:
                previousMedicine,

            current:
                currentMedicine,

            changedFields,

        });

        previousMap.delete(key);

    });

    previousMap.forEach(previousMedicine => {

        comparisons.push({

            medicineName:
                previousMedicine.name,

            changeType: "STOPPED",

            previous:
                previousMedicine,

            current: null,

            changedFields: [],

        });

    });

    comparisons.sort((a, b) =>
        a.medicineName.localeCompare(b.medicineName),
    );

    return comparisons;

}

//--------------------------------------------------------
// Complaints
//--------------------------------------------------------

private compareComplaints(
    previous: ConsultationRecord | null,
    current: ConsultationRecord,
): ComplaintComparison[] {

    return this.compareSimpleCollection(
        previous?.complaints ?? [],
        current.complaints ?? [],
        complaint => complaint.complaint,
    );

}

//--------------------------------------------------------
// History
//--------------------------------------------------------

private compareHistory(
    previous: ConsultationRecord | null,
    current: ConsultationRecord,
): HistoryComparison[] {

    return this.compareSimpleCollection(
        previous?.history ?? [],
        current.history ?? [],
        history => history.value,
    );

}

//--------------------------------------------------------
// Assessments
//--------------------------------------------------------

private compareAssessments(
    previous: ConsultationRecord | null,
    current: ConsultationRecord,
): AssessmentComparison[] {

    return this.compareSimpleCollection(
        previous?.assessments ?? [],
        current.assessments ?? [],
        assessment => assessment.assessment,
    );

}

//--------------------------------------------------------
// Investigations
//--------------------------------------------------------

private compareInvestigations(
    previous: ConsultationRecord | null,
    current: ConsultationRecord,
): InvestigationComparison[] {

    return this.compareSimpleCollection(
        previous?.investigations ?? [],
        current.investigations ?? [],
        investigation => investigation.investigation,
    );

}

//--------------------------------------------------------
// Doctor Instructions
//--------------------------------------------------------

private compareDoctorInstructions(
    previous: ConsultationRecord | null,
    current: ConsultationRecord,
): DoctorInstructionComparison[] {

    return this.compareSimpleCollection(
        previous?.doctorInstructions ?? [],
        current.doctorInstructions ?? [],
        instruction => instruction.instruction,
    );

}

//--------------------------------------------------------
// Follow Ups
//--------------------------------------------------------

private compareFollowUps(
    previous: ConsultationRecord | null,
    current: ConsultationRecord,
): FollowUpComparison[] {

    return this.compareSimpleCollection(
        previous?.followUps ?? [],
        current.followUps ?? [],
        followUp => followUp.followUp,
    );

}

//--------------------------------------------------------
// Generic Collection Comparison
//--------------------------------------------------------

private compareSimpleCollection<T>(
    previousItems: T[],
    currentItems: T[],
    identity: (item: T) => string,
) {

const {
    previousMap,
} = this.compareCollection(
    previousItems,
    currentItems,
    identity,
);


    const comparisons: CollectionComparison<T>[] = [];

    currentItems.forEach(currentItem => {

        const key =
            this.normalize(identity(currentItem));

        const previousItem =
            previousMap.get(key);

        if (!previousItem) {

            comparisons.push({

                changeType: "ADDED",

                previous: null,

                current: currentItem,

            });

        } else {

            comparisons.push({

                changeType: "UNCHANGED",

                previous: previousItem,

                current: currentItem,

            });

            previousMap.delete(key);

        }

    });

    previousMap.forEach(previousItem => {

        comparisons.push({

            changeType: "REMOVED",

            previous: previousItem,

            current: null,

        });

    });

    return comparisons;

}

//--------------------------------------------------------
// Vitals
//--------------------------------------------------------

private compareVitals(
    previous: ConsultationRecord | null,
    current: ConsultationRecord,
): VitalsComparison {

    const previousVitals =
        previous?.vitals ?? {} as ConsultationVitals;

    const currentVitals =
        current.vitals ?? {} as ConsultationVitals;

    return {

        weight: this.compareVital(
            "weight",
            previousVitals.weight,
            currentVitals.weight,
        ),

        height: this.compareVital(
            "height",
            previousVitals.height,
            currentVitals.height,
        ),

        bmi: this.compareVital(
            "bmi",
            previousVitals.bmi,
            currentVitals.bmi,
        ),

        bloodPressure: this.compareVital(
            "bloodPressure",
            previousVitals.bloodPressure,
            currentVitals.bloodPressure,
        ),

        pulse: this.compareVital(
            "pulse",
            previousVitals.pulse,
            currentVitals.pulse,
        ),

        respiratoryRate: this.compareVital(
            "respiratoryRate",
            previousVitals.respiratoryRate,
            currentVitals.respiratoryRate,
        ),

        spo2: this.compareVital(
            "spo2",
            previousVitals.spo2,
            currentVitals.spo2,
        ),

        temperature: this.compareVital(
            "temperature",
            previousVitals.temperature,
            currentVitals.temperature,
        ),

    };

}

private compareVital(
    vital: keyof ConsultationVitals,
    previous: string | null | undefined,
    current: string | null | undefined,
) {

    return {

        vital,

        changed: this.changed(previous, current),

        previous: previous ?? null,

        current: current ?? null,

    };

}

//--------------------------------------------------------
// Clinical Notes
//--------------------------------------------------------

private generateClinicalNotes(
    previous: ConsultationRecord | null,
    current: ConsultationRecord,
    medicines: MedicineComparison[],
    complaints: ComplaintComparison[],
    assessments: AssessmentComparison[],
    investigations: InvestigationComparison[],
    doctorInstructions: DoctorInstructionComparison[],
    followUps: FollowUpComparison[],
    doctor: ReturnType<ClinicalComparisonEngine["compareDoctor"]>,
    hospital: ReturnType<ClinicalComparisonEngine["compareHospital"]>,
    vitals: VitalsComparison,
): ClinicalNote[] {

    const notes: ClinicalNote[] = [];

    if (!previous) {

        notes.push({

            type: "CONSULTATION",

            title: "Initial Consultation",

            description:
                "First consultation available for comparison.",

        });

    }

if (doctor.changed) {

    notes.push({

        type: "CONSULTATION",

        title: "Consulting Doctor Changed",

        description:
            `${doctor.previous ?? "Unknown"} → ${doctor.current ?? "Unknown"}`,

    });

}

if (hospital.changed) {

    notes.push({

        type: "CONSULTATION",

        title: "Hospital Changed",

        description:
            `${hospital.previous ?? "Unknown"} → ${hospital.current ?? "Unknown"}`,

    });

}

complaints.forEach(complaint => {

    const complaintName =
        complaint.current?.complaint ??
        complaint.previous?.complaint ??
        "Complaint";

    switch (complaint.changeType) {

        case "ADDED":

            notes.push({

                type: "COMPLAINT",

                title: "New Complaint",

                description:
                    `${complaintName} reported.`,

            });

            break;

        case "REMOVED":

            notes.push({

                type: "COMPLAINT",

                title: "Complaint Resolved",

                description:
                    `${complaintName} no longer reported.`,

            });

            break;

    }

});

assessments.forEach(assessment => {

    const assessmentName =
        assessment.current?.assessment ??
        assessment.previous?.assessment ??
        "Assessment";

    switch (assessment.changeType) {

        case "ADDED":

            notes.push({

                type: "ASSESSMENT",

                title: "Clinical Assessment Added",

                description:
                    assessmentName,

            });

            break;

        case "REMOVED":

            notes.push({

                type: "ASSESSMENT",

                title: "Clinical Assessment Removed",

                description:
                    assessmentName,

            });

            break;

    }

});

investigations.forEach(investigation => {

    const investigationName =
        investigation.current?.investigation ??
        investigation.previous?.investigation ??
        "Investigation";

    switch (investigation.changeType) {

        case "ADDED":

            notes.push({

                type: "INVESTIGATION",

                title: "Investigation Ordered",

                description:
                    investigationName,

            });

            break;

        case "REMOVED":

            notes.push({

                type: "INVESTIGATION",

                title: "Investigation Removed",

                description:
                    investigationName,

            });

            break;

    }

});

doctorInstructions.forEach(instruction => {

    const instructionText =
        instruction.current?.instruction ??
        instruction.previous?.instruction ??
        "Doctor instruction";

    switch (instruction.changeType) {

        case "ADDED":

            notes.push({

                type: "INSTRUCTION",

                title: "Doctor Instruction Added",

                description:
                    instructionText,

            });

            break;

        case "REMOVED":

            notes.push({

                type: "INSTRUCTION",

                title: "Doctor Instruction Removed",

                description:
                    instructionText,

            });

            break;

    }

});

followUps.forEach(followUp => {

    const followUpText =
        followUp.current?.followUp ??
        followUp.previous?.followUp ??
        "Follow-up";

    switch (followUp.changeType) {

        case "ADDED":

            notes.push({

                type: "FOLLOW_UP",

                title: "Follow-up Scheduled",

                description:
                    followUpText,

            });

            break;

        case "REMOVED":

            notes.push({

                type: "FOLLOW_UP",

                title: "Follow-up Removed",

                description:
                    followUpText,

            });

            break;

    }

});

    medicines.forEach(medicine => {

        switch (medicine.changeType) {

            case "NEW":

                notes.push({

                    type: "MEDICINE",

                    title: "Medicine Started",

                    description:
                        `${medicine.medicineName} was started.`,

                });

                break;

            case "STOPPED":

                notes.push({

                    type: "MEDICINE",

                    title: "Medicine Stopped",

                    description:
                        `${medicine.medicineName} was discontinued.`,

                });

                break;

            case "DOSE_CHANGED":

                notes.push({

                    type: "MEDICINE",

                    title: "Dose Modified",

                    description:
                        `${medicine.medicineName} dose changed.`,

                });

                break;

        }

    });

    Object.values(vitals).forEach(vital => {

        if (!vital.changed) {

            return;

        }

        notes.push({

            type: "VITAL",

            title: `${vital.vital} Updated`,

            description:
                `${vital.previous ?? "-"} → ${vital.current ?? "-"}`,

        });

    });

    return notes;

}

//--------------------------------------------------------
// Clarification Questions
//--------------------------------------------------------

private generateClarificationQuestions(
    medicines: MedicineComparison[],
): ClarificationQuestion[] {

    const questions: ClarificationQuestion[] = [];

    medicines.forEach(medicine => {

        if (
            medicine.changeType === "MULTIPLE_CHANGES"
        ) {

            questions.push({

                id: crypto.randomUUID(),

                type: "MEDICINE",

                priority: "HIGH",

                question:
                    `Please confirm the changes made to ${medicine.medicineName}.`,

                description:
                    "Multiple medicine attributes have changed.",

                required: true,

                options: [

                    {

                        label: "Confirmed",

                        value: "confirmed",

                    },

                    {

                        label: "Needs Correction",

                        value: "correction",

                    },

                ],

            });

        }

    });

    return questions;

}

//--------------------------------------------------------
// Statistics
//--------------------------------------------------------

private buildStatistics(
    medicines: MedicineComparison[],
    complaints: ComplaintComparison[],
    assessments: AssessmentComparison[],
    investigations: InvestigationComparison[],
    doctorInstructions: DoctorInstructionComparison[],
    followUps: FollowUpComparison[],
    vitals: VitalsComparison,
    doctorChanged: boolean,
    hospitalChanged: boolean,
): ComparisonStatistics {

    const medicinesAdded =
        medicines.filter(m => m.changeType === "NEW").length;

    const medicinesStopped =
        medicines.filter(m => m.changeType === "STOPPED").length;

    const medicinesContinued =
        medicines.filter(m => m.changeType === "CONTINUED").length;

    const medicinesModified =
        medicines.filter(m =>
            m.changeType !== "NEW" &&
            m.changeType !== "STOPPED" &&
            m.changeType !== "CONTINUED",
        ).length;

    const complaintsAdded =
        complaints.filter(c => c.changeType === "ADDED").length;

    const complaintsResolved =
        complaints.filter(c => c.changeType === "REMOVED").length;

    const assessmentsChanged =
        assessments.filter(a => a.changeType !== "UNCHANGED").length;

    const investigationsChanged =
        investigations.filter(i => i.changeType !== "UNCHANGED").length;

    const instructionsChanged =
        doctorInstructions.filter(i => i.changeType !== "UNCHANGED").length;

    const followUpsChanged =
        followUps.filter(f => f.changeType !== "UNCHANGED").length;

    const vitalsChanged =
        Object.values(vitals)
            .filter(v => v.changed)
            .length;

    return {

        totalChanges:

            medicinesAdded +

            medicinesStopped +

            medicinesModified +

            complaintsAdded +

            complaintsResolved +

            assessmentsChanged +

            investigationsChanged +

            instructionsChanged +

            followUpsChanged +

            vitalsChanged +

            (doctorChanged ? 1 : 0) +

            (hospitalChanged ? 1 : 0),

        medicinesAdded,

        medicinesStopped,

        medicinesModified,

        medicinesContinued,

        complaintsAdded,

        complaintsResolved,

        assessmentsChanged,

        investigationsChanged,

        instructionsChanged,

        followUpsChanged,

        vitalsChanged,

        doctorChanged,

        hospitalChanged,

    };

}

//--------------------------------------------------------
// Confidence
//--------------------------------------------------------

private calculateConfidence(
    questions: ClarificationQuestion[],
): number {

    let score = DEFAULT_CONFIDENCE_SCORE;

    questions.forEach(question => {

        switch (question.type) {

            case "MEDICINE":
                score -= 15;
                break;

            case "CONSULTATION":
                score -= 10;
                break;

            case "FOLLOW_UP":
                score -= 5;
                break;

            default:
                score -= 8;

        }

    });

    return Math.max(60, score);

}

//--------------------------------------------------------
// Result Builder
//--------------------------------------------------------

private buildResult(

    previous: ConsultationRecord | null,

    current: ConsultationRecord,

    patient: ReturnType<ClinicalComparisonEngine["comparePatient"]>,

    doctor: ReturnType<ClinicalComparisonEngine["compareDoctor"]>,

    hospital: ReturnType<ClinicalComparisonEngine["compareHospital"]>,

    consultationMode: ReturnType<ClinicalComparisonEngine["compareConsultationMode"]>,

    consultationDate: ReturnType<ClinicalComparisonEngine["compareConsultationDate"]>,

    additionalNotes: ReturnType<ClinicalComparisonEngine["compareAdditionalNotes"]>,

    medicines: MedicineComparison[],

    complaints: ComplaintComparison[],

    history: HistoryComparison[],

    assessments: AssessmentComparison[],

    investigations: InvestigationComparison[],

    doctorInstructions: DoctorInstructionComparison[],

    followUps: FollowUpComparison[],

    vitals: VitalsComparison,

    notes: ClinicalNote[],

    questions: ClarificationQuestion[],

    statistics: ComparisonStatistics,

): ClinicalComparisonResult {

    return {

        previousConsultation: previous,

        currentConsultation: current,

        patient,

        doctor,

        hospital,

        consultationMode,

        consultationDate,

        additionalNotes,

        medicines,

        complaints,

        history,

        assessments,

        investigations,

        doctorInstructions,

        followUps,

        vitals,

        notes,

        questions,

        statistics,

confidence: {

    score:
        this.calculateConfidence(
            questions,
        ),

    requiresConfirmation:
        questions.length > 0,

    reasons:
        questions.map(q => q.question),

},

        confirmationStatus: "PENDING",

    };

}

}