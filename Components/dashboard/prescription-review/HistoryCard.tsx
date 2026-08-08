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

console.table(prescription.history);

    const hasHistory =

        prescription.pastMedicalHistory.length > 0 ||

        prescription.history.length > 0;

    if (!hasHistory) {

        return null;

    }

    return (

        <section style={section} className="history-card-section">


<style>{`
@media (max-width: 700px) {
    .history-card-section {
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        padding: 12px !important;
        margin-bottom: 16px !important;
        box-sizing: border-box !important;
        overflow: hidden !important;
    }

    .history-card-section h3 {
        margin: 0 0 12px 0 !important;
        font-size: 16px !important;
        line-height: 1.3 !important;
    }

    .history-card-section h4 {
        margin-top: 14px !important;
        margin-bottom: 7px !important;
        font-size: 13px !important;
        line-height: 1.35 !important;
    }

    .history-card-section ul {
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 !important;
        padding-left: 20px !important;
        box-sizing: border-box !important;
    }

    .history-card-section li {
        width: 100% !important;
        max-width: 100% !important;
        padding: 3px 0 !important;
        font-size: 13px !important;
        line-height: 1.5 !important;
        overflow-wrap: anywhere !important;
        word-break: break-word !important;
        box-sizing: border-box !important;
    }

    .history-card-section li > div {
        max-width: 100% !important;
        overflow-wrap: anywhere !important;
        word-break: break-word !important;
    }
}

@media (max-width: 420px) {
    .history-card-section {
        padding: 10px !important;
    }

    .history-card-section h3 {
        font-size: 15px !important;
    }

    .history-card-section h4 {
        font-size: 12.5px !important;
    }

    .history-card-section ul {
        padding-left: 18px !important;
    }

    .history-card-section li {
        font-size: 12.5px !important;
        line-height: 1.45 !important;
    }
}
`}</style>

            <h3 style={sectionTitle}>

                📖 {t("medication.relevantMedicalHistory")}

            </h3>

<ul style={bulletList}>

    {
        prescription.history.length > 0
            ? (
                prescription.history

                    .filter(

                        item =>

                            item.category.includes("MEDICAL") ||

                            item.category.includes("SURGICAL")

                    )

                    .map(

                        (item, index) => (

                            <li
                                key={index}
                                style={bulletItem}
                            >

                                {formatMedicalHistory(item.value)}

                            </li>

                        )

                    )
            )
            : (
                prescription.pastMedicalHistory.map(

                    (item, index) => (

                        <li
                            key={index}
                            style={bulletItem}
                        >

                            {formatMedicalHistory(item)}

                        </li>

                    )

                )
            )
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