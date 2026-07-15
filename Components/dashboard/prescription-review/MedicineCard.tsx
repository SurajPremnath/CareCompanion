"use client";

import type { ExtractedPrescription } from "@/lib/prescription-image/prescriptionImageTypes";

interface MedicineCardProps {
    prescription: ExtractedPrescription;
    medicineTimings: string[];
    onMedicineTimingChange: (
        index: number,
        value: string
    ) => void;
}

export default function MedicineCard({
    prescription,
    medicineTimings,
    onMedicineTimingChange,
}: MedicineCardProps) {

    return (
        <>

<>
    <div style={informationBox}>

        <div style={informationTitle}>
            ℹ️ Important: Administration Timing
        </div>

        <p style={informationText}>
            CareVR does not infer whether a medicine should be taken
            <strong> before food, after food, with food, or at another specific time.</strong>
        </p>

        <p style={informationText}>
            <strong>
                Please confirm the correct Administration Timing with the consulting doctor before selecting a value.
            </strong>
        </p>

        <p style={informationText}>
            If the administration timing has not yet been confirmed with the consulting doctor,
            leave the value as <strong>"Not Specified"</strong> and update it later after verification.
        </p>

    </div>

    {prescription.medicines.length > 0 && (

        <section style={section}>

            <h3 style={sectionTitle}>
                Medications Prescribed
            </h3>

            {
                prescription.medicines.length === 0 ? (

                    <p style={sectionValue}>
                        No medicines could be identified.
                    </p>

                ) : (

                    <table style={table}>

                        <thead>

                            <tr>

                                <th style={headerCell}>Medicine</th>

                                <th style={headerCell}>Strength</th>

                                <th style={headerCell}>Dose</th>

                                <th style={headerCell}>Frequency / Schedule</th>

                                <th style={headerCell}>Duration</th>

                                <th style={headerCell}>Administration Timing</th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                prescription.medicines.map((medicine, index) => (

                                    <tr key={`${medicine.name}-${index}`}>

                                        <td style={cell}>
                                            {medicine.name}
                                        </td>

                                        <td style={cell}>
                                            {medicine.strength ?? "-"}
                                        </td>

                                        <td style={cell}>
                                            {medicine.dose ?? "-"}
                                        </td>

                                        <td style={cell}>
                                            {medicine.frequency ?? "-"}
                                        </td>

                                        <td style={cell}>
                                            {medicine.duration ?? "-"}
                                        </td>

                                        <td style={cell}>

                                            <select
                                                value={medicineTimings[index]}
                                                onChange={(event) =>
                                                    onMedicineTimingChange(
                                                        index,
                                                        event.target.value
                                                    )
                                                }
                                                style={selectStyle}
                                            >

                                                <option value="NOT_SPECIFIED">
                                                    Not Specified
                                                </option>

                                                <option value="BEFORE_FOOD">
                                                    Before Food
                                                </option>

                                                <option value="AFTER_FOOD">
                                                    After Food
                                                </option>

                                                <option value="WITH_FOOD">
                                                    With Food
                                                </option>

                                                <option value="EMPTY_STOMACH">
                                                    Empty Stomach
                                                </option>

                                                <option value="BEFORE_BREAKFAST">
                                                    Before Breakfast
                                                </option>

                                                <option value="AFTER_BREAKFAST">
                                                    After Breakfast
                                                </option>

                                                <option value="BEFORE_LUNCH">
                                                    Before Lunch
                                                </option>

                                                <option value="AFTER_LUNCH">
                                                    After Lunch
                                                </option>

                                                <option value="BEFORE_DINNER">
                                                    Before Dinner
                                                </option>

                                                <option value="AFTER_DINNER">
                                                    After Dinner
                                                </option>

                                                <option value="AT_BEDTIME">
                                                    At Bedtime
                                                </option>

                                                <option value="AS_DIRECTED">
                                                    As Directed
                                                </option>

                                            </select>

                                        </td>

                                    </tr>

                                ))

                            }

                        </tbody>

                    </table>

                )

            }

        </section>

    )}

</>

        </>
    );
}

const section: React.CSSProperties = {
    marginBottom: "24px",
    padding: "18px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
};

const sectionTitle: React.CSSProperties = {
    margin: "0 0 14px 0",
    fontSize: "18px",
    fontWeight: 700,
    color: "#111827",
};

const sectionValue: React.CSSProperties = {
    margin: 0,
    color: "#374151",
    lineHeight: 1.7,
};

const table: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
};

const headerCell: React.CSSProperties = {
    textAlign: "left",
    padding: "12px",
    borderBottom: "2px solid #e2e8f0",
    background: "#f8fafc",
    fontWeight: 700,
    color: "#334155",
};

const cell: React.CSSProperties = {
    padding: "12px",
    borderBottom: "1px solid #e2e8f0",
    color: "#111827",
    verticalAlign: "top",
};

const selectStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    fontSize: "14px",
};

const informationBox: React.CSSProperties = {
    marginTop: "18px",
    padding: "16px",
    border: "1px solid #bfdbfe",
    borderRadius: "8px",
    backgroundColor: "#eff6ff",
};

const informationTitle: React.CSSProperties = {
    fontWeight: 700,
    color: "#1d4ed8",
    marginBottom: "10px",
    fontSize: "15px",
};

const informationText: React.CSSProperties = {
    margin: "0 0 8px",
    color: "#374151",
    lineHeight: 1.6,
    fontSize: "14px",
};