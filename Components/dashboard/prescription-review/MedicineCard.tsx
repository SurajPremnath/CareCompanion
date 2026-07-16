"use client";

import type { ExtractedPrescription } from "@/lib/prescription-image/prescriptionImageTypes";

import {
  useLanguage,
} from "@/Components/language/LanguageProvider";

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

const {
    t,
} = useLanguage();

const administrationTimingLabels: Record<string, string> = {

    NOT_SPECIFIED:
        t("medication.notSpecified"),

    BEFORE_FOOD:
        t("medication.beforeFood"),

    AFTER_FOOD:
        t("medication.afterFood"),

    WITH_FOOD:
        t("medication.withFood"),

    EMPTY_STOMACH:
        t("medication.emptyStomach"),

    BEFORE_BREAKFAST:
        t("medication.beforeBreakfast"),

    AFTER_BREAKFAST:
        t("medication.afterBreakfast"),

    BEFORE_LUNCH:
        t("medication.beforeLunch"),

    AFTER_LUNCH:
        t("medication.afterLunch"),

    BEFORE_DINNER:
        t("medication.beforeDinner"),

    AFTER_DINNER:
        t("medication.afterDinner"),

    AT_BEDTIME:
        t("medication.atBedtime"),

    AS_DIRECTED:
        t("medication.asDirected"),

};

    return (
        <>

<>
    <div style={informationBox}>

        <div style={informationTitle}>
            ℹ️ {t("medication.importantAdministrationTiming")}
        </div>

        <p style={informationText}>
            <strong> {t("medication.administrationTimingInfo1")}
            </strong>
        </p>

        <p style={informationText}>
            <strong>
                {t("medication.administrationTimingInfo2")}
            </strong>
        </p>

        <p style={informationText}>
            {t("medication.administrationTimingInfo3")}
        </p>

    </div>

    {prescription.medicines.length > 0 && (

        <section style={section}>

            <h3 style={sectionTitle}>
                {t("medication.medicationsPrescribed")}
            </h3>

            {
                prescription.medicines.length === 0 ? (

                    <p style={sectionValue}>
                        {t("medication.noMedicinesDetected")}
                    </p>

                ) : (

                    <table style={table}>

                        <thead>

                            <tr>

                                <th style={headerCell}>{t("medication.medicine")}</th>

                                <th style={headerCell}>{t("medication.strength")}</th>

                                <th style={headerCell}>{t("medication.dose")}</th>

                                <th style={headerCell}>{t("medication.frequency")}</th>

                                <th style={headerCell}>{t("medication.duration")}</th>

                                <th style={headerCell}>{t("medication.administrationTiming")}</th>

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
                                                    {administrationTimingLabels.NOT_SPECIFIED}
                                                </option>

                                                <option value="BEFORE_FOOD">
                                                    {administrationTimingLabels.BEFORE_FOOD}
                                                </option>

                                                <option value="AFTER_FOOD">
                                                    {administrationTimingLabels.AFTER_FOOD}
                                                </option>

                                                <option value="WITH_FOOD">
                                                    {administrationTimingLabels.WITH_FOOD}
                                                </option>

                                                <option value="EMPTY_STOMACH">
                                                    {administrationTimingLabels.EMPTY_STOMACH}
                                                </option>

                                                <option value="BEFORE_BREAKFAST">
                                                    {administrationTimingLabels.BEFORE_BREAKFAST}
                                                </option>

                                                <option value="AFTER_BREAKFAST">
                                                    {administrationTimingLabels.AFTER_BREAKFAST}
                                                </option>

                                                <option value="BEFORE_LUNCH">
                                                    {administrationTimingLabels.BEFORE_LUNCH}
                                                </option>

                                                <option value="AFTER_LUNCH">
                                                    {administrationTimingLabels.AFTER_LUNCH}
                                                </option>

                                                <option value="BEFORE_DINNER">
                                                    {administrationTimingLabels.BEFORE_DINNER}
                                                </option>

                                                <option value="AFTER_DINNER">
                                                    {administrationTimingLabels.AFTER_DINNER}
                                                </option>

                                                <option value="AT_BEDTIME">
                                                    {administrationTimingLabels.AT_BEDTIME}
                                                </option>

                                                <option value="AS_DIRECTED">
                                                    {administrationTimingLabels.AS_DIRECTED}
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