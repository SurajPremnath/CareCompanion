"use client";

import {
    useState,
    type CSSProperties,
} from "react";

import type {
    ExtractedPrescription,
} from "@/lib/prescription-image/prescriptionImageTypes";

import DoctorNotesHeader
    from "./DoctorNotesHeader";

import DoctorNotesPatientCard
    from "./DoctorNotesPatientCard";

import DoctorNotesConsultationCard
    from "./DoctorNotesConsultationCard";

import DoctorNotesDocumentsCard, {
    type DoctorNotesDocumentItem,
} from "./DoctorNotesDocumentsCard";

import DoctorNotesCurrentStateCard
    from "./DoctorNotesCurrentStateCard"

import DoctorNotesClinicalHistoryCard
    from "./DoctorNotesClinicalHistoryCard";

import DoctorNotesSymptomsCard
    from "./DoctorNotesSymptomsCard";

import DoctorNotesInvestigationsCard
    from "./DoctorNotesInvestigationsCard";

import DoctorNotesInstructionsCard
    from "./DoctorNotesInstructionsCard";

import DoctorNotesTestsAdvisedCard
    from "./DoctorNotesTestsAdvisedCard";

import DoctorNotesMedicinesCard
    from "./DoctorNotesMedicinesCard";

import DoctorNotesFollowUpCard
    from "./DoctorNotesFollowUpCard";

import DoctorNotesVitalsCard
    from "./DoctorNotesVitalsCard";

interface DoctorNotesReviewProps {
    prescription: ExtractedPrescription;
    documents: DoctorNotesDocumentItem[];
    onBack: () => void;
    onSave?: () => void;
}

const pageStyle: CSSProperties = {
    width: "100%",
    maxWidth: "1180px",
    margin: "0 auto",
    padding: "24px",
    boxSizing: "border-box",
};

const panelGridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns:
        "repeat(3, minmax(0, 1fr))",
    gap: "14px",
    marginTop: "20px",
};

const panelButtonStyle: CSSProperties = {
    width: "100%",
    minHeight: "50px",
    padding: "8px 11px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "9px",
    background: "#FFFFFF",
    border: "1px solid #D9E2F2",
    borderRadius: "10px",
    cursor: "pointer",
    textAlign: "left",
    boxSizing: "border-box",
};

const selectedPanelButtonStyle: CSSProperties = {
    ...panelButtonStyle,
    border: "2px solid #2167D5",
    background: "#F5F9FF",
};

const panelIconStyle: CSSProperties = {
    width: "24px",
    height: "24px",
    borderRadius: "7px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#EEF4FF",
    color: "#2167D5",
    fontSize: "13px",
    flexShrink: 0,
};

const panelTitleStyle: CSSProperties = {
    fontSize: "15px",
    lineHeight: 1.25,
    fontWeight: 600,
    color: "#111A3A",
};

const detailAreaStyle: CSSProperties = {
    width: "100%",
    marginTop: "20px",
};

const footerStyle: CSSProperties = {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "20px",
};


type DoctorNotesPanel =
    | "PATIENT"
    | "CONSULTATION"
    | "DOCUMENTS"
    | "STATE_OF_HEALTH"
    | "MEDICINES"
    | "SYMPTOMS"
    | "VITALS"
    | "CLINICAL_HISTORY"
    | "INVESTIGATIONS"
    | "INSTRUCTIONS"
    | "TESTS_ADVISED"
    | "FOLLOW_UP";

const panels: {
    id: DoctorNotesPanel;
    icon: string;
    title: string;
    subtitle: string;
}[] = [

{
    id: "PATIENT",
    icon: "👤",
    title: "Patient",
    subtitle: "Patient details",
},

{
    id: "CONSULTATION",
    icon: "🩺",
    title: "Consultation",
    subtitle: "Doctor and consultation",
},

{
    id: "DOCUMENTS",
    icon: "📄",
    title: "Documents Uploaded",
    subtitle: "Source documents",
},

{
    id: "STATE_OF_HEALTH",
    icon: "❤️",
    title: "State of Health",
    subtitle: "Current clinical state",
},

{
    id: "MEDICINES",
    icon: "💊",
    title: "Medicines Suggested",
    subtitle: "Prescribed medicines",
},

{
    id: "SYMPTOMS",
    icon: "🩹",
    title: "Symptoms",
    subtitle: "Symptoms and complaints",
},

{
    id: "VITALS",
    icon: "♥",
    title: "Vitals",
    subtitle: "Recorded vital signs",
},

{
    id: "CLINICAL_HISTORY",
    icon: "📋",
    title: "Clinical History",
    subtitle: "Relevant history",
},

{
    id: "INVESTIGATIONS",
    icon: "🔬",
    title: "Investigations",
    subtitle: "Clinical investigations",
},

{
    id: "INSTRUCTIONS",
    icon: "📝",
    title: "Instructions",
    subtitle: "Doctor's instructions",
},

{
    id: "TESTS_ADVISED",
    icon: "🧪",
    title: "Tests Advised",
    subtitle: "Tests and procedures",
},

{
    id: "FOLLOW_UP",
    icon: "📅",
    title: "Follow-up Plan",
    subtitle: "Future review",
},
];

export default function DoctorNotesReview({
    prescription,
    documents,
    onBack,
    onSave,
}: DoctorNotesReviewProps) {

const consultationMode =
    prescription.encounterIdentity
        ?.consultationMode;

const [
    selectedPanel,
    setSelectedPanel,
] = useState<DoctorNotesPanel>(
    "PATIENT"
);

function renderSelectedPanel() {

    switch (selectedPanel) {

        case "PATIENT":

            return (
                <DoctorNotesPatientCard
                    patient={
                        prescription.patientIdentity
                    }
                />
            );

        case "CONSULTATION":

            return (
                <>
                    <DoctorNotesConsultationCard
                        encounter={
                            prescription.encounterIdentity
                        }
                    />

                    {!consultationMode && (
                        <div
                            style={{
                                marginTop: "10px",
                                padding: "12px 14px",
                                borderRadius: "10px",
                                background: "#FFF7ED",
                                color: "#9A3412",
                                fontSize: "13px",
                                lineHeight: 1.45,
                            }}
                        >
                            Consultation mode was not
                            explicitly stated in the
                            document. Please check or
                            select.
                        </div>
                    )}
                </>
            );

        case "DOCUMENTS":

            return (
                <DoctorNotesDocumentsCard
                    documents={documents}
                />
            );

        case "STATE_OF_HEALTH":

            return (
                <DoctorNotesCurrentStateCard
                    currentState={
                        prescription.currentStateOfHealth
                    }
                />
            );

        case "MEDICINES":

            return (
                <DoctorNotesMedicinesCard
                    medicines={
                        prescription.medicines
                    }
                />
            );

        case "SYMPTOMS":

            return (
                <DoctorNotesSymptomsCard
                    symptoms={
                        prescription.symptoms
                    }
                />
            );

case "VITALS":

    return (
        <DoctorNotesVitalsCard
            vitals={
                prescription.consultationVitals
            }
        />
    );

        case "CLINICAL_HISTORY":

            return (
                <DoctorNotesClinicalHistoryCard
                    history={
                        prescription.history
                    }
                />
            );

        case "INVESTIGATIONS":

            return (
                <DoctorNotesInvestigationsCard
                    investigations={
                        prescription.investigations
                    }
                />
            );

        case "INSTRUCTIONS":

            return (
                <DoctorNotesInstructionsCard
                    instructions={
                        prescription.doctorInstructions
                    }
                />
            );

        case "TESTS_ADVISED":

            return (
                <DoctorNotesTestsAdvisedCard
                    testsAdvised={
                        prescription.testsAdvised
                    }
                />
            );

        case "FOLLOW_UP":

            return (
                <DoctorNotesFollowUpCard
                    followUpPlan={
                        prescription.followUpPlan
                    }
                />
            );

        default:

            return null;
    }
}

return (
    <div
        style={pageStyle}
        className="doctor-notes-page"
    >

<style>{`
    @media (max-width: 800px) {

        .doctor-notes-panel-grid {
            grid-template-columns:
                repeat(2, minmax(0, 1fr)) !important;
        }

    }

    @media (max-width: 480px) {

        .doctor-notes-page {
            padding: 14px !important;
        }

        .doctor-notes-panel-grid {
            grid-template-columns:
                1fr !important;

            gap: 10px !important;
        }

        .doctor-notes-panel-button {
            min-height: 76px !important;
        }

        .doctor-notes-panel-button > div:first-child {
            width: 30px !important;
            height: 30px !important;
        }

        .doctor-notes-footer {
            flex-direction: column-reverse !important;
        }

        .doctor-notes-footer button {
            width: 100% !important;
        }

    }
`}</style>

        <DoctorNotesHeader
            onBack={onBack}
        />

<div
    className="doctor-notes-panel-grid"
    style={panelGridStyle}
>

    {panels.map(panel => {

        const selected =
            selectedPanel === panel.id;

        return (
            <button
                key={panel.id}
                type="button"
                className="doctor-notes-panel-button"
                onClick={() =>
                    setSelectedPanel(panel.id)
                }
                aria-pressed={selected}
                style={
                    selected
                        ? selectedPanelButtonStyle
                        : panelButtonStyle
                }
            >

<div
    style={panelIconStyle}
    aria-hidden="true"
>
    {panel.icon}
</div>

<div style={panelTitleStyle}>
    {panel.title}
</div>

            </button>
        );

    })}

</div>


<div
    style={detailAreaStyle}
    aria-live="polite"
>
    {renderSelectedPanel()}
</div>


<div style={footerStyle}>

    <button
        type="button"
        onClick={onBack}
    >
        Re-upload
    </button>

    <button
        type="button"
        onClick={onSave}
    >
        Save Doctor's Notes
    </button>

</div>
        </div>
    );
}