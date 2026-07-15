"use client";

import type {
    ExtractedPrescription,
} from "@/lib/prescription-image/prescriptionImageTypes";

interface InvestigationCardProps {
    prescription: ExtractedPrescription;
}

const section: React.CSSProperties = {
    marginBottom: "24px",
    padding: "18px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
};

const title: React.CSSProperties = {
    margin: "0 0 14px",
    fontSize: "18px",
    fontWeight: 700,
};

const list: React.CSSProperties = {
    margin: 0,
    paddingLeft: "22px",
    lineHeight: 1.8,
};

export default function InvestigationCard({
    prescription,
}: InvestigationCardProps) {

    const items = [
        ...prescription.investigations,
        ...prescription.clinicalPlan,
    ];

    if (items.length === 0) {
        return null;
    }

    return (

        <section style={section}>

            <h3 style={title}>
                🧪 Investigations Ordered
            </h3>

            <ul style={list}>

                {items.map((item,index)=>(

                    <li key={index}>
                        {item}
                    </li>

                ))}

            </ul>

        </section>

    );

}