"use client";

import type {
    ExtractedPrescription,
} from "@/lib/prescription-image/prescriptionImageTypes";

import {
    useLanguage,
} from "@/Components/language/LanguageProvider";

interface Props {

    prescription:
        ExtractedPrescription;

    readOnly:
        boolean;

    onWeightChange:
        (weight: string) => void;

}

//------------------------------------------------------------
// Container
//------------------------------------------------------------

const section = {
    marginBottom: "24px",
    padding: "18px",
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    boxSizing: "border-box",
} satisfies React.CSSProperties;

//------------------------------------------------------------
// Helpers
//------------------------------------------------------------

function numericValue(
    value:
        string |
        number |
        null |
        undefined
): number | null {

    if (
        value === null ||
        value === undefined
    ) {
        return null;
    }

    const parsed =
        Number(
            String(value)
                .replace(/[^0-9.]/g, "")
        );

    return Number.isFinite(parsed)
        ? parsed
        : null;
}

function calculateBmi(
    weight:
        string |
        number |
        null |
        undefined,

    height:
        string |
        number |
        null |
        undefined
): string | null {

    const weightValue =
        numericValue(weight);

    const heightValue =
        numericValue(height);

    if (
        weightValue === null ||
        heightValue === null ||
        weightValue <= 0 ||
        heightValue <= 0
    ) {
        return null;
    }

    const heightInMetres =
        heightValue / 100;

    const bmi =
        weightValue /
        (
            heightInMetres *
            heightInMetres
        );

    if (!Number.isFinite(bmi)) {
        return null;
    }

    return bmi.toFixed(2);
}

function calculateBsa(
    weight:
        string |
        number |
        null |
        undefined,

    height:
        string |
        number |
        null |
        undefined
): string | null {

    const weightValue =
        numericValue(weight);

    const heightValue =
        numericValue(height);

    if (
        weightValue === null ||
        heightValue === null ||
        weightValue <= 0 ||
        heightValue <= 0
    ) {
        return null;
    }

    // Mosteller formula
    const bsa =
        Math.sqrt(
            (
                heightValue *
                weightValue
            ) / 3600
        );

    if (!Number.isFinite(bsa)) {
        return null;
    }

    return bsa.toFixed(2);
}

function hasValue(
    value:
        string |
        number |
        null |
        undefined
): boolean {

    return (
        value !== null &&
        value !== undefined &&
        String(value).trim() !== ""
    );
}

//------------------------------------------------------------
// Component
//------------------------------------------------------------

export default function VitalsCard({

    prescription,

    readOnly,

    onWeightChange,

}: Props) {

    const {
        t,
    } = useLanguage();

    const vitals =
        prescription.consultationVitals;

    //--------------------------------------------------------
    // No consultation vitals object
    //--------------------------------------------------------

    if (!vitals) {

        return (

            <section
                style={section}
                className="vitals-card-section"
            >

                <h3
                    style={{
                        margin:
                            "0 0 12px 0",
                        fontSize: "18px",
                    }}
                >
                    ❤️{" "}
                    {t(
                        "medication.consultationVitals"
                    )}
                </h3>

                <div
                    className="vitals-empty-message"
                >
                    Vitals not recorded in document.
                </div>

                <style>{`

                    .vitals-empty-message {
                        padding: 12px;
                        border-radius: 8px;
                        background: #f8fafc;
                        border: 1px solid #e2e8f0;
                        color: #64748b;
                        font-size: 13px;
                        font-weight: 600;
                    }

                `}</style>

            </section>

        );
    }

    //--------------------------------------------------------
    // Determine whether the document contained ANY vital
    // information.
    //--------------------------------------------------------

const hasRecordedVitals =
    hasValue(vitals.weight) ||
    hasValue(vitals.height) ||
    hasValue(vitals.bmi) ||
    hasValue(vitals.bloodPressure) ||
    hasValue(vitals.pulse) ||
    hasValue(vitals.respiratoryRate) ||
    hasValue(vitals.spo2) ||
    hasValue(vitals.temperature);

    //--------------------------------------------------------
    // BMI
    //
    // Prefer the BMI explicitly extracted from the document.
    // If unavailable, calculate it from weight + height.
    //--------------------------------------------------------

    const bmi =
        hasValue(vitals.bmi)
            ? String(vitals.bmi)
            : calculateBmi(
                vitals.weight,
                vitals.height
            );

    //--------------------------------------------------------
    // BSA
    //
    // Calculated only.
    // Not persisted as a separate database value.
    //--------------------------------------------------------

    const bsa =
        calculateBsa(
            vitals.weight,
            vitals.height
        );

    //--------------------------------------------------------
    // Reusable display component
    //--------------------------------------------------------

    const VitalItem = ({
        label,
        value,
        editable = false,
    }: {
        label: string;
        value:
            string |
            number |
            null |
            undefined;
        editable?: boolean;
    }) => {

        return (

            <div
                className={
                    editable
                        ? "vital-item vital-item-editable"
                        : "vital-item"
                }
            >

                <div className="vital-label">
                    {label}
                </div>

                <div className="vital-value">
                    {hasValue(value)
                        ? String(value)
                        : "-"}
                </div>

            </div>

        );

    };

    return (

        <section
            style={section}
            className="vitals-card-section"
        >

            <style>{`

                .vitals-grid {
                    display: grid;
                    grid-template-columns:
                        repeat(2, minmax(0, 1fr));
                    gap: 10px;
                    width: 100%;
                }

                .vital-item {
                    min-width: 0;
                    padding: 12px;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    background: #f8fafc;
                    box-sizing: border-box;
                }

                .vital-item-editable {
                    background: #ffffff;
                }

                .vital-label {
                    margin-bottom: 5px;
                    font-size: 11px;
                    line-height: 1.3;
                    font-weight: 700;
                    color: #64748b;
                }

                .vital-value {
                    min-width: 0;
                    font-size: 14px;
                    line-height: 1.4;
                    font-weight: 600;
                    color: #1f2937;
                    overflow-wrap: anywhere;
                    word-break: break-word;
                }

                .vital-weight-note {
                    margin-bottom: 6px;
                    font-size: 10px;
                    line-height: 1.35;
                    font-weight: 700;
                    color: #64748b;
                }

                .vital-weight-input {
                    width: 100%;
                    max-width: 140px;
                    min-height: 38px;
                    padding: 6px 8px;
                    box-sizing: border-box;
                    border: 1px solid #cbd5e1;
                    border-radius: 6px;
                    background: #ffffff;
                    font-size: 14px;
                }

                .vitals-empty-message {
                    padding: 12px;
                    border-radius: 8px;
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    color: #64748b;
                    font-size: 13px;
                    font-weight: 600;
                }

                @media (max-width: 420px) {

                    .vitals-grid {
                        gap: 8px;
                    }

                    .vital-item {
                        padding: 10px;
                    }

                    .vital-label {
                        font-size: 10.5px;
                    }

                    .vital-value {
                        font-size: 13px;
                    }

                    .vital-weight-input {
                        max-width: 100%;
                    }

                }

            `}</style>

            <h3
                style={{
                    margin:
                        "0 0 12px 0",
                    fontSize: "18px",
                }}
            >
                ❤️{" "}
                {t(
                    "medication.consultationVitals"
                )}
            </h3>

            {!hasRecordedVitals ? (

                <div className="vitals-empty-message">
                    Vitals not recorded in document.
                </div>

            ) : (

                <div className="vitals-grid">

                    {/* Blood Pressure */}

                    <VitalItem
                        label={
                            t(
                                "medication.bloodPressure"
                            )
                        }
value={
    vitals.bloodPressure
}
                    />

                    {/* Pulse */}

                    <VitalItem
                        label={
                            t(
                                "medication.pulse"
                            )
                        }
                        value={
                            vitals.pulse
                        }
                    />

                    {/* SpO2 */}

                    <VitalItem
                        label={
                            t(
                                "medication.spo2"
                            )
                        }
                        value={
                            vitals.spo2
                        }
                    />

                    {/* Temperature */}

                    <VitalItem
                        label={
                            t(
                                "medication.temperature"
                            )
                        }
                        value={
                            vitals.temperature
                        }
                    />

                    {/* Weight */}

                    <div
                        className={
                            "vital-item " +
                            "vital-item-editable"
                        }
                    >

                        <div className="vital-label">
                            {t(
                                "medication.weight"
                            )}
                        </div>

                        {readOnly ? (

                            <div className="vital-value">
                                {hasValue(
                                    vitals.weight
                                )
                                    ? String(
                                        vitals.weight
                                    )
                                    : "-"}
                            </div>

                        ) : (

                            <>

                                <div className="vital-weight-note">
                                    🤖 AI extracted this value.
                                    Please verify and correct if needed.
                                </div>

                                <input
                                    type="text"
                                    value={
                                        vitals.weight ??
                                        ""
                                    }
                                    onChange={(event) =>
                                        onWeightChange(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter weight"
                                    disabled={
                                        readOnly
                                    }
                                    className={
                                        "vital-weight-input"
                                    }
                                />

                            </>

                        )}

                    </div>

                    {/* Height */}

                    <VitalItem
                        label="Height"
                        value={
                            vitals.height
                        }
                    />

                    {/* BMI */}

                    <VitalItem
                        label="BMI"
                        value={
                            bmi
                        }
                    />

                    {/* BSA */}

                    <VitalItem
                        label="BSA"
                        value={
                            bsa
                                ? `${bsa} m²`
                                : null
                        }
                    />

                    {/* Respiratory Rate */}

                    <VitalItem
                        label="Respiratory Rate"
                        value={
                            vitals.respiratoryRate
                        }
                    />

                </div>

            )}

        </section>

    );

}