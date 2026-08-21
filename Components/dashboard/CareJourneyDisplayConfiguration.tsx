"use client";

import {
    useState,
} from "react";

import {
    CONFIGURABLE_REST_OPTIONS,
    type ConfigurableRestPanel,
} from "@/lib/prescription-ai/configuration/displayConfiguration";

interface CareJourneyDisplayConfigurationProps {

    onContinue: (
        configurable_Rest: ConfigurableRestPanel[]
    ) => void;

}

export default function CareJourneyDisplayConfiguration({
    onContinue,
}: CareJourneyDisplayConfigurationProps) {

const [
    configurable_Rest,
    setConfigurableRest,
] = useState<ConfigurableRestPanel[]>([]);


    function toggleRestPanel(
        panel: ConfigurableRestPanel
    ) {

        setConfigurableRest((current) => {

            if (current.includes(panel)) {

                return current.filter(
                    (item) => item !== panel
                );

            }

            return [
                ...current,
                panel,
            ];

        });

    }

function handleContinue() {

    onContinue(
        configurable_Rest
    );

}

    return (
        <section
            style={{
                width: "100%",
                maxWidth: "900px",
                margin: "0 auto",
                padding: "20px",
                boxSizing: "border-box",
            }}
        >

            <div
                style={{
                    border: "1px solid #E2E8F0",
                    borderRadius: "16px",
                    background: "#FFFFFF",
                    padding: "24px",
                }}
            >

                <h2
                    style={{
                        margin: "0 0 8px",
                        fontSize: "22px",
                        color: "#111827",
                    }}
                >
                    What would you like to see?
                </h2>

                <p
                    style={{
                        margin: "0 0 24px",
                        color: "#6B7280",
                        fontSize: "14px",
                        lineHeight: 1.5,
                    }}
                >
Patient, Hospital, Doctor and Consultation details
will always be shown.
Please choose from below what additional information
you would like to see during this Care Journey.
Your choice will be locked once you continue.
                </p>


                {/* ==================================================
                    Configurable Rest
                ================================================== */}

{/* ==================================================
    Standard Information
================================================== */}

<div
    style={{
        marginBottom: "28px",
    }}
>

    <h3
        style={{
            margin: "0 0 14px",
            fontSize: "16px",
            color: "#374151",
        }}
    >
        Standard Information
    </h3>

    <div
        style={{
            display: "grid",
            gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "10px",
        }}
    >

        {[
            "PATIENT",
            "HOSPITAL",
            "DOCTOR",
            "CONSULTATION",
        ].map((panel) => {

            const option =
                CONFIGURABLE_REST_OPTIONS.find(
                    (item) =>
                        item.value === panel
                );

            if (!option) {
                return null;
            }

            return (
                <div
                    key={option.value}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "10px",
                        border:
                            "1px solid #E5E7EB",
                        borderRadius: "8px",
                        fontSize: "14px",
                        color: "#374151",
                    }}
                >

                    <span
                        style={{
                            fontSize: "16px",
                            fontWeight: 700,
                        }}
                    >
                        ✓
                    </span>

                    <span>
                        {option.label}
                    </span>

                </div>
            );

        })}

    </div>

</div>


{/* ==================================================
    Additional Information
================================================== */}

<div
    style={{
        marginBottom: "28px",
    }}
>

    <h3
        style={{
            margin: "0 0 14px",
            fontSize: "16px",
            color: "#374151",
        }}
    >
        Additional Information
    </h3>

    <div
        style={{
            display: "grid",
            gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "10px",
        }}
    >

        {([
            {
                value: "CURRENT_STATE_OF_HEALTH",
                label: "Current State of Health",
            },
            {
                value: "TESTS_ADVISED",
                label: "Tests Advised",
            },
            {
                value: "MEDICATIONS",
                label: "Medications",
            },
            {
                value: "DOCTOR_INSTRUCTIONS",
                label: "Doctor Instructions",
            },
            {
                value: "FOLLOW_UP_PLAN",
                label: "Follow-up Plan",
            },
        ] satisfies {
            value: ConfigurableRestPanel;
            label: string;
        }[]).map((option) => (

            <label
                key={option.value}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px",
                    border:
                        "1px solid #E5E7EB",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "14px",
                    color: "#374151",
                }}
            >

                <input
                    type="checkbox"
                    checked={
                        configurable_Rest.includes(
                            option.value
                        )
                    }
                    onChange={() =>
                        toggleRestPanel(
                            option.value
                        )
                    }
                />

                <span>
                    {option.label}
                </span>

            </label>

        ))}

    </div>

</div>



                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                    }}
                >

                    <button
                        type="button"
                        onClick={handleContinue}
                        style={{
                            border: "none",
                            borderRadius: "10px",
                            padding: "11px 24px",
                            background: "#7043F5",
                            color: "#FFFFFF",
                            fontWeight: 700,
                            cursor: "pointer",
                        }}
                    >
                        Continue
                    </button>

                </div>

            </div>

        </section>
    );

}