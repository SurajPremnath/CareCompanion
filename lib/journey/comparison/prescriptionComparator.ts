import type { ConsultationRecord } from "@/lib/medication";

import {
    ChangeSeverity,
    ChangeType,
    ComparisonCategory,
    ComparisonConfidence,
    ComparisonDifference,
    ComparisonMetadata,
    ComparisonRequest,
    ComparisonResult,
    ComparisonSummary
} from "./comparisonTypes";

/**
 * ============================================================
 * Prescription Comparator
 *
 * Clinical comparison orchestrator.
 *
 * Responsible only for identifying changes between two
 * consultations.
 *
 * This class deliberately does NOT:
 *
 * • make treatment decisions
 * • generate timeline events
 * • create scenarios
 * • ask questions
 *
 * Those responsibilities belong to downstream engines.
 * ============================================================
 */
export class PrescriptionComparator {

    private static readonly ENGINE_VERSION = "1.0.0";

    /**
     * --------------------------------------------------------
     * Entry point
     * --------------------------------------------------------
     */
    compare(
        request: ComparisonRequest
    ): ComparisonResult {

        const started = Date.now();

        const differences: ComparisonDifference[] = [];

        const warnings: string[] = [];
        const errors: string[] = [];

differences.push(
    ...this.comparePatient(
        request.previousConsultation,
        request.currentConsultation
    )
);

differences.push(
    ...this.compareFollowUps(
        request.previousConsultation,
        request.currentConsultation
    )
);

differences.push(
    ...this.compareConsultation(
        request.previousConsultation,
        request.currentConsultation
    )
);

        differences.push(
            ...this.compareComplaints(
                request.previousConsultation,
                request.currentConsultation
            )
        );

        differences.push(
            ...this.compareHistory(
                request.previousConsultation,
                request.currentConsultation
            )
        );

        differences.push(
            ...this.compareMedications(
                request.previousConsultation,
                request.currentConsultation
            )
        );

        differences.push(
            ...this.compareExamination(
                request.previousConsultation,
                request.currentConsultation
            )
        );

        differences.push(
            ...this.compareVitals(
                request.previousConsultation,
                request.currentConsultation
            )
        );

        differences.push(
            ...this.compareInvestigations(
                request.previousConsultation,
                request.currentConsultation
            )
        );

        differences.push(
            ...this.compareDoctorInstructions(
                request.previousConsultation,
                request.currentConsultation
            )
        );

        differences.push(
            ...this.compareAssessment(
                request.previousConsultation,
                request.currentConsultation
            )
        );

const uniqueDifferences =
    this.removeDuplicates(differences);


uniqueDifferences.sort((left, right) => {

    const severityOrder = {
        critical: 4,
        major: 3,
        moderate: 2,
        minor: 1,
        informational: 0
    };

    return (
        severityOrder[right.severity] -
        severityOrder[left.severity]
    );

});


        const metadata = this.buildMetadata(started);

const summary =
    this.buildSummary(uniqueDifferences);

return {

    differences: uniqueDifferences,

    timelineEvents: [],

    questionCandidates: [],

    clinicalFlags: [],

    summary,

    metadata,

    warnings,

    errors

};

}

    /**
     * =========================================================
     * Metadata
     * =========================================================
     */

    private buildMetadata(
        started: number
    ): ComparisonMetadata {

        return {

            comparedAt: new Date(),

            processingTimeMs: Date.now() - started,

            engineVersion:
                PrescriptionComparator.ENGINE_VERSION

        };

    }

    /**
     * =========================================================
     * Summary
     * =========================================================
     */

    private buildSummary(
        differences: ComparisonDifference[]
    ): ComparisonSummary {

return {

    totalDifferences:
        differences.length,

    added:
        this.countChangeType(
            differences,
            "added"
        ),

    removed:
        this.countChangeType(
            differences,
            "removed"
        ),

    modified:
        this.countChangeType(
            differences,
            "modified"
        ),

    unchanged:
        this.countChangeType(
            differences,
            "unchanged"
        ),

    criticalChanges:
        this.countSeverity(
            differences,
            "critical"
        ),

    majorChanges:
        this.countSeverity(
            differences,
            "major"
        ),

    timelineEvents: 0,

    questionsGenerated: 0,

    clinicalFlags: 0

};

    }

    /**
     * =========================================================
     * Helpers
     * =========================================================
     */

    protected countChangeType(
        differences: ComparisonDifference[],
        type: ComparisonDifference["changeType"]
    ): number {

        return differences.filter(
            d => d.changeType === type
        ).length;

    }

    protected countSeverity(
        differences: ComparisonDifference[],
        severity: ComparisonDifference["severity"]
    ): number {

        return differences.filter(
            d => d.severity === severity
        ).length;

    }

    protected asArray<T>(
        value: T[] | undefined | null
    ): T[] {

        if (!value) {
            return [];
        }

        return Array.isArray(value)
            ? value
            : [];

    }

    protected equals(
        a: unknown,
        b: unknown
    ): boolean {

        return JSON.stringify(a)
            === JSON.stringify(b);

    }

    /**
     * =========================================================
     * Comparison Methods
     *
     * Implemented in Parts 2–4.
     * =========================================================
     */

protected compareConsultation(
    previous: ConsultationRecord,
    current: ConsultationRecord
): ComparisonDifference[] {

    const differences: ComparisonDifference[] = [];

    const previousConsultation = this.consultation(previous);
    const currentConsultation = this.consultation(current);

    const fields = [
        {
            field: "doctorName",
            label: "Doctor",
            previous: previousConsultation.doctorName,
            current: currentConsultation.doctorName,
            severity: "major" as const
        },
        {
            field: "hospitalName",
            label: "Hospital",
            previous: previousConsultation.hospitalName,
            current: currentConsultation.hospitalName,
            severity: "moderate" as const
        },
        {
            field: "consultationDate",
            label: "Consultation Date",
            previous: previousConsultation.consultationDate,
            current: currentConsultation.consultationDate,
            severity: "informational" as const
        },
        {
            field: "consultationMode",
            label: "Consultation Mode",
            previous: previousConsultation.consultationMode,
            current: currentConsultation.consultationMode,
            severity: "minor" as const
        }
    ];

    for (const field of fields) {

        if (this.equals(field.previous, field.current)) {
            continue;
        }

differences.push(
    this.difference(
        "consultation",
        field.field,
        field.label,
        field.previous,
        field.current,
        "modified",
        field.severity,
        "high",
        `${field.label} changed.`
    )
);

    }

    return differences;

}


protected compareComplaints(
    previous: ConsultationRecord,
    current: ConsultationRecord
): ComparisonDifference[] {

    const differences: ComparisonDifference[] = [];

    const previousComplaints = this.complaints(previous);
    const currentComplaints = this.complaints(current);

    const {
        previousMap,
        currentMap
    } = this.compareCollection(
        previousComplaints,
        currentComplaints,
        complaint =>
    this.normalize(
        typeof complaint === "string"
            ? complaint
            : complaint.complaint
    )
    );

    /**
     * Removed / Modified
     */

    previousMap.forEach((previousComplaint, key) => {

        const currentComplaint = currentMap.get(key);

        if (!currentComplaint) {

differences.push(
    this.difference(
        "complaints",
        "complaint",
        typeof previousComplaint === "string"
            ? previousComplaint
            : previousComplaint.complaint,
        previousComplaint,
        undefined,
        "removed",
        "moderate",
        "high",
        "Complaint no longer reported."
    )
);

            return;

        }

        if (!this.same(
            previousComplaint.duration,
            currentComplaint.duration
        )) {

differences.push(
    this.difference(
        "complaints",
        "duration",
        previousComplaint.complaint,
        previousComplaint.duration,
        currentComplaint.duration,
        "modified",
        "major",
        "high",
        "Complaint duration changed."
    )
);

        }

    });

    /**
     * Added
     */

    currentMap.forEach((currentComplaint, key) => {

        if (previousMap.has(key)) {
            return;
        }

differences.push(
    this.difference(
        "complaints",
        "complaint",
        typeof currentComplaint === "string"
            ? currentComplaint
            : currentComplaint.complaint,
        undefined,
        currentComplaint,
        "added",
        "moderate",
        "high",
        "New complaint reported."
    )
);

    });

    return differences;

}

protected compareHistory(
    previous: ConsultationRecord,
    current: ConsultationRecord
): ComparisonDifference[] {

    const differences: ComparisonDifference[] = [];

    const previousHistory = this.history(previous);
    const currentHistory = this.history(current);

    const {
        previousMap,
        currentMap
    } = this.compareCollection(
        previousHistory,
        currentHistory,
        history =>
            `${history.category}:${this.normalize(history.value)}`
    );

    previousMap.forEach((history, key) => {

differences.push(
    this.difference(
        "history",
        history.category,
        history.category,
        history,
        undefined,
        "removed",
        "minor",
        "high",
        "History item removed."
    )
);

    });

    currentMap.forEach((history, key) => {

        if (previousMap.has(key)) {
            return;
        }

differences.push(
    this.difference(
        "history",
        history.category,
        history.category,
        undefined,
        history,
        "added",
        "major",
        "high",
        "New history recorded."
    )
);
    });

    return differences;

}

protected compareMedications(
    previous: ConsultationRecord,
    current: ConsultationRecord
): ComparisonDifference[] {

    const differences: ComparisonDifference[] = [];

    const previousMedicines = this.medicines(previous);
    const currentMedicines = this.medicines(current);

    const {
        previousMap,
        currentMap
    } = this.compareCollection(
        previousMedicines,
        currentMedicines,
        medicine => this.normalize(medicine.name)
    );

    /**
     * Removed / Modified Medicines
     */
    previousMap.forEach((previousMedicine, key) => {

        const currentMedicine = currentMap.get(key);

        if (!currentMedicine) {

            differences.push(this.difference(
                "medicines",
                "medicine",
                previousMedicine.name ?? previousMedicine.brandName,
                previousMedicine,
                undefined,
                "removed",
                "major",
                "high",
                "Medicine discontinued."
            ));

            return;

        }

        this.compareMedicineField(
            differences,
            previousMedicine.name ?? previousMedicine.brandName,
            "dose",
            "Dose",
            previousMedicine.dose,
            currentMedicine.dose
        );

        this.compareMedicineField(
            differences,
            previousMedicine.name ?? previousMedicine.brandName,
            "frequency",
            "Frequency",
            previousMedicine.frequency,
            currentMedicine.frequency
        );

        this.compareMedicineField(
            differences,
            previousMedicine.name ?? previousMedicine.brandName,
            "duration",
            "Duration",
            previousMedicine.duration,
            currentMedicine.duration
        );

        this.compareMedicineField(
            differences,
            previousMedicine.name ?? previousMedicine.brandName,
            "timing",
            "Timing",
            previousMedicine.timing,
            currentMedicine.timing
        );

    });

    /**
     * Newly Added Medicines
     */
    currentMap.forEach((currentMedicine, key) => {

        if (previousMap.has(key)) {
            return;
        }

        differences.push(this.difference(
            "medicines",
            "medicine",
            currentMedicine.name ?? currentMedicine.brandName,
            undefined,
            currentMedicine,
            "added",
            "major",
            "high",
            "New medicine prescribed."
        ));

    });

    return differences;

}

protected compareMedicineField(
    differences: ComparisonDifference[],
    medicineName: string,
    field: string,
    label: string,
    previousValue: unknown,
    currentValue: unknown
): void {

    if (this.equals(previousValue, currentValue)) {
        return;
    }

    differences.push(this.difference(
        "medicines",
        field,
        `${medicineName} - ${label}`,
        previousValue,
        currentValue,
        "modified",
        "major",
        "high",
        `${label} changed.`
    ));

}

    protected compareExamination(
        previous: ConsultationRecord,
        current: ConsultationRecord
    ): ComparisonDifference[] {

        return [];

    }

protected compareVitals(
    previous: ConsultationRecord,
    current: ConsultationRecord
): ComparisonDifference[] {

    const differences: ComparisonDifference[] = [];

    const previousVitals = this.vitals(previous);
    const currentVitals = this.vitals(current);

    const fields = [
        {
            field: "temperature",
            label: "Temperature"
        },
        {
            field: "bloodPressure",
            label: "Blood Pressure"
        },
        {
            field: "pulse",
            label: "Pulse"
        },
        {
            field: "spo2",
            label: "SpO₂"
        },
        {
            field: "respiratoryRate",
            label: "Respiratory Rate"
        },
        {
            field: "weight",
            label: "Weight"
        }
    ] as const;

    for (const item of fields) {

        const previousValue = previousVitals[item.field];
        const currentValue = currentVitals[item.field];

        if (this.equals(previousValue, currentValue)) {
            continue;
        }

        differences.push(this.difference(
            "vitals",
            item.field,
            item.label,
            previousValue,
            currentValue,
            "modified",
            "major",
            "high",
            `${item.label} changed.`
        ));

    }

    return differences;

}

protected compareInvestigations(
    previous: ConsultationRecord,
    current: ConsultationRecord
): ComparisonDifference[] {

    const differences: ComparisonDifference[] = [];

    const previousInvestigations = this.investigations(previous);
    const currentInvestigations = this.investigations(current);

    const {
        previousMap,
        currentMap
    } = this.compareCollection(
        previousInvestigations,
        currentInvestigations,
        investigation =>
            this.normalize(investigation.name)
    );

    previousMap.forEach((investigation, key) => {

        if (currentMap.has(key)) {
            return;
        }

        differences.push(this.difference(
            "investigations",
            "investigation",
            investigation.name,
            investigation,
            undefined,
            "removed",
            "minor",
            "high",
            "Investigation removed."
        ));

    });

    currentMap.forEach((investigation, key) => {

        if (previousMap.has(key)) {
            return;
        }

        differences.push(this.difference(
            "investigations",
            "investigation",
            investigation.name,
            undefined,
            investigation,
            "added",
            "major",
            "high",
            "New investigation ordered."
        ));

    });

    return differences;

}

protected compareDoctorInstructions(
    previous: ConsultationRecord,
    current: ConsultationRecord
): ComparisonDifference[] {

    const differences: ComparisonDifference[] = [];

    const previousInstructions = this.doctorInstructions(previous);
    const currentInstructions = this.doctorInstructions(current);

    const {
        previousMap,
        currentMap
    } = this.compareCollection(
        previousInstructions,
        currentInstructions,
        instruction =>
            this.normalize(instruction.instruction)
    );

    previousMap.forEach((instruction, key) => {

        if (currentMap.has(key)) {
            return;
        }

        differences.push(this.difference(
            "doctorInstructions",
            "instruction",
            instruction.instruction,
            instruction,
            undefined,
            "removed",
            "minor",
            "high",
            "Doctor instruction removed."
        ));

    });

    currentMap.forEach((instruction, key) => {

        if (previousMap.has(key)) {
            return;
        }

        differences.push(this.difference(
            "doctorInstructions",
            "instruction",
            instruction.instruction,
            undefined,
            instruction,
            "added",
            "major",
            "high",
            "New doctor instruction."
        ));

    });

    return differences;

}

protected compareFollowUps(
    previous: ConsultationRecord,
    current: ConsultationRecord
): ComparisonDifference[] {

    const differences: ComparisonDifference[] = [];

    const previousFollowUps = this.followUps(previous);
    const currentFollowUps = this.followUps(current);

    const {
        previousMap,
        currentMap
    } = this.compareCollection(
        previousFollowUps,
        currentFollowUps,
        followUp =>
            this.normalize(
                followUp.title ??
                followUp.type ??
                followUp.description ??
                ""
            )
    );

    /**
     * Removed Follow-ups
     */

    previousMap.forEach((followUp, key) => {

        if (currentMap.has(key)) {
            return;
        }

        differences.push(
            this.difference(
                "followUps",
                "followUp",
                followUp.title ??
                followUp.type ??
                "Follow-up",
                followUp,
                undefined,
                "removed",
                "moderate",
                "high",
                "Follow-up removed."
            )
        );

    });

    /**
     * Added Follow-ups
     */

    currentMap.forEach((followUp, key) => {

        if (previousMap.has(key)) {
            return;
        }

        differences.push(
            this.difference(
                "followUps",
                "followUp",
                followUp.title ??
                followUp.type ??
                "Follow-up",
                undefined,
                followUp,
                "added",
                "major",
                "high",
                "New follow-up added."
            )
        );

    });

    return differences;

}


protected compareAssessment(
    previous: ConsultationRecord,
    current: ConsultationRecord
): ComparisonDifference[] {

    const differences: ComparisonDifference[] = [];

    const previousAssessments = this.assessments(previous);
    const currentAssessments = this.assessments(current);

    const {
        previousMap,
        currentMap
    } = this.compareCollection(
        previousAssessments,
        currentAssessments,
        assessment =>
            this.normalize(assessment.name)
    );

    previousMap.forEach((assessment, key) => {

        if (currentMap.has(key)) {
            return;
        }

        differences.push(this.difference(
            "assessments",
            "assessment",
            assessment.name,
            assessment,
            undefined,
            "removed",
            "minor",
            "high",
            "Assessment removed."
        ));

    });

    currentMap.forEach((assessment, key) => {

        if (previousMap.has(key)) {
            return;
        }

        differences.push(this.difference(
            "assessments",
            "assessment",
            assessment.name,
            undefined,
            assessment,
            "added",
            "major",
            "high",
            "New assessment recorded."
        ));

    });

    return differences;

}

   /**
     * =========================================================
     * Typed Accessors
     *
     * These methods isolate the comparator from the underlying
     * ConsultationRecord structure while preserving strong typing.
     * =========================================================
     */

    protected patient(
        record: ConsultationRecord
    ) {
        return record.patient;
    }

    protected consultation(
        record: ConsultationRecord
    ) {
        return record.consultation;
    }

    protected vitals(
        record: ConsultationRecord
    ) {
        return record.vitals;
    }

    protected complaints(
        record: ConsultationRecord
    ) {
        return this.asArray(record.complaints);
    }

    protected history(
        record: ConsultationRecord
    ) {
        return this.asArray(record.history);
    }

    protected assessments(
        record: ConsultationRecord
    ) {
        return this.asArray(record.assessments);
    }

    protected investigations(
        record: ConsultationRecord
    ) {
        return this.asArray(record.investigations);
    }

    protected medicines(
        record: ConsultationRecord
    ) {
        return this.asArray(record.medicines);
    }

    protected doctorInstructions(
        record: ConsultationRecord
    ) {
        return this.asArray(record.doctorInstructions);
    }

    protected followUps(
        record: ConsultationRecord
    ) {
        return this.asArray(record.followUps);
    }

    /**
     * =========================================================
     * Difference Builder
     * =========================================================
     */

    protected difference(
        category: ComparisonCategory,
        field: string,
        label: string,
        previousValue: unknown,
        currentValue: unknown,
        changeType: ChangeType,
        severity: ChangeSeverity,
        confidence: ComparisonConfidence,
        reason?: string
    ): ComparisonDifference {

return {
    id: crypto.randomUUID(),

    category,

    field,

    label,

    previousValue,

    currentValue,

    changeType,

    severity,

    clinicalImpact:
        severity === "critical"
            ? "CRITICAL"
            : severity === "major"
              ? "HIGH"
              : severity === "moderate"
                ? "MEDIUM"
                : "LOW",

    confidence,

    reason,
};

    }

    /**
     * =========================================================
     * Generic Collection Comparison
     *
     * Compares two collections using a selector that returns
     * the business identity for each item.
     * =========================================================
     */

    protected compareCollection<T>(
        previous: T[],
        current: T[],
        selector: (item: T) => string
    ) {

        const previousMap = new Map<string, T>();
        const currentMap = new Map<string, T>();

        previous.forEach(item => {
            previousMap.set(
                selector(item).toLowerCase(),
                item
            );
        });

        current.forEach(item => {
            currentMap.set(
                selector(item).toLowerCase(),
                item
            );
        });

        return {

            previousMap,

            currentMap

        };

    }

    /**
     * =========================================================
     * String Normalization
     * =========================================================
     */

    protected normalize(
        value: string | null | undefined
    ): string {

        if (!value) {
            return "";
        }

        return value
            .trim()
            .replace(/\s+/g, " ")
            .toLowerCase();

    }

    /**
     * =========================================================
     * Null-safe Equality
     * =========================================================
     */

    protected same(
        left: string | null | undefined,
        right: string | null | undefined
    ): boolean {

        return this.normalize(left)
            === this.normalize(right);

    }

    /**
     * =========================================================
     * Has Value
     * =========================================================
     */

    protected hasValue(
        value: unknown
    ): boolean {

        if (value === null || value === undefined) {
            return false;
        }

        if (typeof value === "string") {
            return value.trim().length > 0;
        }

        if (Array.isArray(value)) {
            return value.length > 0;
        }

        return true;

    }

protected removeDuplicates(
    differences: ComparisonDifference[]
): ComparisonDifference[] {

    const unique = new Map<string, ComparisonDifference>();

    for (const difference of differences) {

        const key = [
            difference.category,
            difference.field,
            difference.label,
            JSON.stringify(difference.previousValue),
            JSON.stringify(difference.currentValue),
            difference.changeType
        ].join("|");

        if (!unique.has(key)) {
            unique.set(key, difference);
        }

    }

    return [...unique.values()];

}


protected hasClinicalChanges(
    differences: ComparisonDifference[]
): boolean {

    return differences.some(
        difference =>
            difference.changeType !== "unchanged"
    );

}


protected comparePatient(
    previous: ConsultationRecord,
    current: ConsultationRecord
): ComparisonDifference[] {

    const differences: ComparisonDifference[] = [];

    const previousPatient = this.patient(previous);
    const currentPatient = this.patient(current);

    if (!this.same(previousPatient.uhid, currentPatient.uhid)) {
differences.push(
    this.difference(
        "patient",
        "uhid",
        "UHID",
        previousPatient.uhid,
        currentPatient.uhid,
        "modified",
        "major",
        "high",
        "Patient identifier changed."
    )
);
    }

    if (!this.same(previousPatient.patientName, currentPatient.patientName)) {
differences.push(
    this.difference(
        "patient",
        "patientName",
        "Patient Name",
        previousPatient.patientName,
        currentPatient.patientName,
        "modified",
        "minor",
        "high",
        "Patient name changed."
    )
);

    }

    if (!this.same(previousPatient.age, currentPatient.age)) {
differences.push(
    this.difference(
        "patient",
        "age",
        "Age",
        previousPatient.age,
        currentPatient.age,
        "modified",
        "informational",
        "high",
        "Patient age changed."
    )
);
    }

    if (!this.same(previousPatient.gender, currentPatient.gender)) {
differences.push(
    this.difference(
        "patient",
        "gender",
        "Gender",
        previousPatient.gender,
        currentPatient.gender,
        "modified",
        "major",
        "high",
        "Patient gender changed."
    )
);
    }

    return differences;
}


}
 