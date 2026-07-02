"use client";

import type { ClinicalSummary } from "@/lib/clinical-summary/ClinicalSummaryTypes";
import { formatRecordedDate } from "@/lib/utils/displayFormatter";

interface ClinicalSummaryCardProps {

  summary: ClinicalSummary;

  recordedAt: string;

}

export default function ClinicalSummaryCard({

  summary,

  recordedAt,

}: ClinicalSummaryCardProps) {

  return (

    <section style={cardStyle}>

      {/*------------------------------------------------*/}
      {/* Clinical Assessment */}
      {/*------------------------------------------------*/}

      <div style={sectionStyle}>

        <h3 style={sectionHeading}>
          Observation Summary
        </h3>

<p style={paragraphStyle}>

  The following is a summary based on the observations recorded during this assessment.

</p>

      </div>

      {/*------------------------------------------------*/}
      {/* Normal Observations */}
      {/*------------------------------------------------*/}

      {summary.normalFindings.length > 0 && (

        <div style={sectionStyle}>

          <h3 style={sectionHeading}>
            ✅ Normal Observations
          </h3>

          <ul style={listStyle}>

            {summary.normalFindings.map(
              (finding, index) => (

                <li key={index}>

                  {finding.description}

                </li>

              )
            )}

          </ul>

        </div>

      )}

      {/*------------------------------------------------*/}
      {/* Observations Requiring Attention */}
      {/*------------------------------------------------*/}

      {summary.attentionFindings.length > 0 && (

        <div style={sectionStyle}>

          <h3 style={sectionHeading}>
            📋 Reported Observations
          </h3>

          <ul style={listStyle}>

            {summary.attentionFindings.map(
              (finding, index) => (

                <li key={index}>

                  {finding.description}

                </li>

              )
            )}

          </ul>

        </div>

      )}

      {/*------------------------------------------------*/}
      {/* Incomplete Observations */}
      {/*------------------------------------------------*/}

      {summary.missingFindings.length > 0 && (

        <div style={sectionStyle}>

          <h3 style={sectionHeading}>
            📝 Additional Notes
          </h3>

          <ul style={listStyle}>

            {summary.missingFindings.map(
              (finding, index) => (

                <li key={index}>

                  {finding.description}

                </li>

              )
            )}

          </ul>

        </div>

      )}

      {/*------------------------------------------------*/}
      {/* Recommendation */}
      {/*------------------------------------------------*/}

      {summary.recommendations.length > 0 && (

        <div style={sectionStyle}>

          <h3 style={sectionHeading}>
            📌 Recommendation
          </h3>

          <p style={paragraphStyle}>

            {summary.recommendations[0].description}

          </p>

        </div>

      )}

    </section>

  );

}

const cardStyle: React.CSSProperties = {

  background: "#ffffff",

  border: "1px solid #e5e7eb",

  borderRadius: "12px",

  padding: "24px",

  marginTop: "24px",

};

const cardTitle: React.CSSProperties = {

  margin: 0,

  marginBottom: "24px",

  fontSize: "24px",

  fontWeight: 700,

  color: "#111827",

};

const sectionStyle: React.CSSProperties = {

  marginBottom: "24px",

};

const sectionHeading: React.CSSProperties = {

  margin: 0,

  marginBottom: "10px",

  fontSize: "18px",

  fontWeight: 600,

  color: "#111827",

};

const paragraphStyle: React.CSSProperties = {

  margin: 0,

  lineHeight: 1.7,

  color: "#374151",

};

const listStyle: React.CSSProperties = {

  margin: 0,

  paddingLeft: "20px",

  lineHeight: 1.8,

  color: "#374151",

};