"use client";

import type {
    ExtractedPrescription,
} from "@/lib/prescription-image/prescriptionImageTypes";

interface HistoryCardProps {

    prescription: ExtractedPrescription;

}

function formatMedicalHistory(
    text: string
): string {

    return text
        .replace(/^HTN\b/i, "Hypertension")
        .replace(/\bx\s*(\d+)\s*yrs\b/i, " ($1 years)")
        .replace(/\bveg\b/i, "Vegetarian")
        .replace(/\bmixed diet\b/i, "Mixed Diet")
        .replace(/\blive in apt\b/i, "Lives in Apartment");

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

    const hasHistory =

        prescription.pastMedicalHistory.length > 0 ||

        prescription.history.length > 0;

    if (!hasHistory) {

        return null;

    }

    return (

        <section style={section}>

            <h3 style={sectionTitle}>

                📖 Relevant Medical History

            </h3>

            <ul style={bulletList}>

                {

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

                            Lifestyle

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

                                                {formatMedicalHistory(

                                                    item.value

                                                )}

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