"use client";

import { expandMedicalText } from "@/lib/medicalFormatter";

import type {
    ExtractedPrescription,
} from "@/lib/prescription-image/prescriptionImageTypes";

import {
  useLanguage,
} from "@/Components/language/LanguageProvider";

interface AssessmentCardProps {

    prescription: ExtractedPrescription;

}

const section: React.CSSProperties = {

    background: "#FFFFFF",

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

export default function AssessmentCard({

    prescription,

}: AssessmentCardProps) {

const {
    t,
} = useLanguage();

const diagnosis = expandMedicalText(
    prescription.diagnosisOrAssessment ?? ""
).toLowerCase();

const additionalDiagnoses =
    prescription.clinicalAssessments.filter((item) => {

        const value = expandMedicalText(item)
            .toLowerCase()
            .trim();

        return (
            value !== diagnosis &&
            value.length > 3
        );

    });

const hasAssessment =

    prescription.diagnosisOrAssessment ||

    additionalDiagnoses.length ||

    prescription.clinicalPlan.length ||

    prescription.examinationFindings.length;

    if (!hasAssessment) {

        return null;

    }

    return (

        <section style={section} className="assessment-card-section">


<style>{`
@media (max-width: 700px) {
    .assessment-card-section {
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        padding: 12px !important;
        margin-bottom: 16px !important;
        box-sizing: border-box !important;
        overflow: hidden !important;
    }

    .assessment-card-section h3 {
        margin: 0 0 12px 0 !important;
        font-size: 16px !important;
        line-height: 1.3 !important;
    }

    .assessment-card-section h4 {
        margin-top: 14px !important;
        margin-bottom: 7px !important;
        font-size: 13px !important;
        line-height: 1.35 !important;
    }

    .assessment-card-section p,
    .assessment-card-section li {
        max-width: 100% !important;
        font-size: 13px !important;
        line-height: 1.5 !important;
        overflow-wrap: anywhere !important;
        word-break: break-word !important;
        box-sizing: border-box !important;
    }

    .assessment-card-section ul {
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
        padding-left: 20px !important;
        margin: 0 !important;
    }
}

@media (max-width: 420px) {
    .assessment-card-section {
        padding: 10px !important;
    }

    .assessment-card-section h3 {
        font-size: 15px !important;
    }

    .assessment-card-section h4 {
        font-size: 12.5px !important;
    }

    .assessment-card-section p,
    .assessment-card-section li {
        font-size: 12.5px !important;
        line-height: 1.45 !important;
    }

    .assessment-card-section ul {
        padding-left: 18px !important;
    }
}
`}</style>

            <h3 style={sectionTitle}>

                🩺 {t("medication.assessment")}

            </h3>

            {

                prescription.diagnosisOrAssessment && (

                    <>

                        <h4>

                            {t("medication.diagnosisAssessment")}

                        </h4>

                        <p>



                                {expandMedicalText(
    prescription.diagnosisOrAssessment
)}


                        </p>

                    </>

                )

            }

            {

                additionalDiagnoses.length > 0 && (

                    <>

                        <h4>

                            {t("medication.additionalDiagnoses")}

                        </h4>

                        <ul style={bulletList}>

                            {

                                additionalDiagnoses.map(

                                    (item,index)=>(

                                        <li
                                            key={index}
                                            style={bulletItem}
                                        >

                                            {expandMedicalText(item)}

                                        </li>

                                    )

                                )

                            }

                        </ul>

                    </>

                )

            }

{
    prescription.clinicalPlan.length > 0 && (

        <>

            <h4>
                Clinical Plan
            </h4>

            <ul style={bulletList}>

                {

                    prescription.clinicalPlan.map(

                        (item, index) => (

                            <li
                                key={index}
                                style={bulletItem}
                            >

                                {expandMedicalText(item)}

                            </li>

                        )

                    )

                }

            </ul>

        </>

    )
}

            {

                prescription.examinationFindings.length > 0 && (

                    <>

                        <h4>

                            {t("medication.examinationFindings")}

                        </h4>

                        <ul style={bulletList}>

                            {

                                prescription.examinationFindings.map(

                                    (item,index)=>(

                                        <li
                                            key={index}
                                            style={bulletItem}
                                        >

{expandMedicalText(item.finding)}

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