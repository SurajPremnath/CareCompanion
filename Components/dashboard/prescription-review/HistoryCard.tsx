"use client";

import { expandMedicalText } from "@/lib/medicalFormatter";

import type {
    ExtractedPrescription,
} from "@/lib/prescription-image/prescriptionImageTypes";

import {
  useLanguage,
} from "@/Components/language/LanguageProvider";

interface HistoryCardProps {

    prescription: ExtractedPrescription;

}

function formatMedicalHistory(text: string): string {

    return expandMedicalText(text)

.replace(
    /\blive\s+i?n?\s+apt\b/i,
    "\nLives in Apartment"
)
.replace(
    /\blives\s+in\s+apartment\b/i,
    "\nLives in Apartment"
)

}

const section: React.CSSProperties = {

    background: "#fff",

    border: "1px solid #E5E7EB",

    borderRadius: 12,

    padding: 20,

    marginBottom: 20,

};

const sectionTitle: React.CSSProperties = {

    fontSize: 18,

    fontWeight: 700,

    marginBottom: 16,

};

const bulletList: React.CSSProperties = {

    paddingLeft: 20,

    margin: 0,

};

const bulletItem: React.CSSProperties = {

    marginBottom: 8,

};

export default function HistoryCard({

    prescription,

}: HistoryCardProps) {

const {
    t,
} = useLanguage();

    const hasHistory =

        prescription.pastMedicalHistory.length > 0 ||

        prescription.history.length > 0;

    if (!hasHistory) {

        return null;

    }

    return (

        <section style={section}>

            <h3 style={sectionTitle}>

                📖 {t("medication.relevantMedicalHistory")}

            </h3>

            <ul style={bulletList}>

                {

prescription.pastMedicalHistory

    .map((item, index) => (
        <li
            key={index}
            style={bulletItem}
        >

            {formatMedicalHistory(item)}

        </li>

    ))

                }

            </ul>

            {

                prescription.history.some(

                    h =>

                        h.category === "LIFESTYLE"

                ) && (

                    <>

                        <h4
                            style={{
                                marginTop: 20,
                                marginBottom: 10,
                            }}
                        >

                            {t("medication.lifestyle")}

                        </h4>

                        <ul style={bulletList}>

                            {

                                prescription.history

                                    .filter(

                                        h =>

                                            h.category === "LIFESTYLE"

                                    )

                                    .map(

                                        (item, index) => (

                                            <li
                                                key={index}
                                                style={bulletItem}
                                            >

{formatMedicalHistory(item.value)
    .split("\n")
    .map((line, index) => (

        <div
            key={index}
            style={{
                marginTop: index === 0 ? 0 : 6,
                marginLeft: index === 0 ? 0 : 18,
            }}
        >
            {line.trim()}
        </div>

    ))
}
                                            </li>

                                        )

                                    )

                            }

                        </ul>

                    </>

                )

            }

        </section>

    );

}