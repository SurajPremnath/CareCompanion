"use client";

import type {
    ExtractedPrescription,
} from "@/lib/prescription-image/prescriptionImageTypes";

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

    const additionalDiagnoses =

        prescription.clinicalAssessments.filter(item => {

            const value =

                item
                    .toLowerCase()
                    .trim();

            return (

                value !==
                prescription.diagnosisOrAssessment
                    ?.toLowerCase()

                &&

                value.length > 3

            );

        });

    const hasAssessment =

        prescription.diagnosisOrAssessment ||

        additionalDiagnoses.length ||

        prescription.examinationFindings.length;

    if (!hasAssessment) {

        return null;

    }

    return (

        <section style={section}>

            <h3 style={sectionTitle}>

                🩺 Assessment

            </h3>

            {

                prescription.diagnosisOrAssessment && (

                    <>

                        <h4>

                            Diagnosis

                        </h4>

                        <p>

                            {

                                prescription.diagnosisOrAssessment

                            }

                        </p>

                    </>

                )

            }

            {

                additionalDiagnoses.length > 0 && (

                    <>

                        <h4>

                            Additional Diagnoses

                        </h4>

                        <ul style={bulletList}>

                            {

                                additionalDiagnoses.map(

                                    (item,index)=>(

                                        <li
                                            key={index}
                                            style={bulletItem}
                                        >

                                            {item}

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

                            Examination Findings

                        </h4>

                        <ul style={bulletList}>

                            {

                                prescription.examinationFindings.map(

                                    (item,index)=>(

                                        <li
                                            key={index}
                                            style={bulletItem}
                                        >

                                            {

                                                item.finding

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