"use client";

import { expandMedicalText } from "@/lib/medicalFormatter";

import type {
    ExtractedPrescription,
} from "@/lib/prescription-image/prescriptionImageTypes";

import {
  useLanguage,
} from "@/Components/language/LanguageProvider";

interface InvestigationCardProps {
    prescription: ExtractedPrescription;

    mode?: "PRESCRIPTION" | "DOCTOR_NOTES";
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
    mode = "PRESCRIPTION",
}: InvestigationCardProps) {

const {
    t,
} = useLanguage();

const uniqueItems = new Map<string, string>();

prescription.investigations
    .filter(Boolean)
    .forEach(item => {

        const value =
            expandMedicalText(item).trim();

        const key =
            value
                .toLowerCase()
                .replace(/\s+/g, " ");

        if (!uniqueItems.has(key)) {
            uniqueItems.set(key, value);
        }

    });

const items =
    [...uniqueItems.values()];

    if (items.length === 0) {
        return null;
    }

    return (

        <section style={section} className="investigation-card-section">


<style>{`
@media (max-width: 700px) {
    .investigation-card-section {
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        padding: 12px !important;
        margin-bottom: 16px !important;
        box-sizing: border-box !important;
        overflow: hidden !important;
    }

    .investigation-card-section h3 {
        margin: 0 0 12px 0 !important;
        font-size: 16px !important;
        line-height: 1.3 !important;
    }

    .investigation-card-section ul {
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 !important;
        padding-left: 20px !important;
        box-sizing: border-box !important;
    }

    .investigation-card-section li {
        width: 100% !important;
        max-width: 100% !important;
        padding: 3px 0 !important;
        font-size: 13px !important;
        line-height: 1.5 !important;
        overflow-wrap: anywhere !important;
        word-break: break-word !important;
        box-sizing: border-box !important;
    }
}

@media (max-width: 420px) {
    .investigation-card-section {
        padding: 10px !important;
    }

    .investigation-card-section h3 {
        font-size: 15px !important;
    }

    .investigation-card-section ul {
        padding-left: 18px !important;
    }

    .investigation-card-section li {
        font-size: 12.5px !important;
        line-height: 1.45 !important;
    }
}
`}</style>

            <h3 style={title}>
                🧪 {t("medication.investigationsOrdered")}
            </h3>

            <ul style={list}>

                {items.map((item,index)=>(

                    <li key={index}>
{expandMedicalText(item)}
                    </li>

                ))}

            </ul>

        </section>

    );

}