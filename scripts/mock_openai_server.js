// ### FILE: scripts/mock_openai_server.js
const http = require('http');

const PORT = 3001; // Runs on a separate port to act as an external service

// Pre-baked mock response payload mimicking a messy prescription output map
const mockOpenAIResponse = {
  choices: [
    {
      message: {
        content: JSON.stringify({
          patientIdentity: {
            patientName: "John Doe",
            patientDateOfBirth: "1988-11-23",
            patientAge: "37",
            patientGender: "MALE",
            patientUHID: "UHID-998231",
            patientNameVariations: ["J. Doe", "John D."]
          },
          encounterIdentity: {
            doctorName: "Dr. Sarah Jenkins",
            doctorType: "Cardiologist",
            hospitalOrClinic: "Metro Heart Care Center",
            hospitalNameVariations: ["Metro Cardiology"],
            consultationDate: "2026-08-24",
            consultationMode: "IN_PERSON"
          },
          documentMetadata: {
            studyDateTime: "2026-08-24T10:00:00Z",
            reportDateTime: "2026-08-24T11:30:00Z",
            originalPatientName: "John Doe",
            originalHospitalName: "Metro Heart",
            documentType: "PRESCRIPTION"
          },
          consultationVitals: {
            weight: "78kg",
            height: "175cm",
            bmi: "25.5",
            bloodPressure: "120/80",
            pulse: "72",
            respiratoryRate: "16",
            spo2: "98%",
            temperature: "36.8"
          },
          currentStateOfHealth: {
            conditions: ["Mild Hypertension"],
            diseaseStatus: ["Stable"],
            stage: null,
            clinicalAssessment: ["Regular sinus rhythm"],
            importantFindings: ["Blood pressure slightly elevated but controlled"]
          },
          diagnosisOrAssessment: "Essential Hypertension",
          clinicalAssessments: ["Routine follow-up evaluation complete."],
          symptoms: [
            { symptom: "Occasional headaches", duration: "2 weeks", severity: "Mild", qualifiers: "Worse in morning" }
          ],
          presentingComplaints: [
            { complaint: "Mild fatigue", duration: "1 month", severity: "Low", qualifiers: "Intermittent" }
          ],
          pastMedicalHistory: ["No prior major cardiac events."],
          history: [
            { category: "FAMILY_HISTORY", value: "Father had hypertension." }
          ],
          examinationFindings: [
            { finding: "S1 S2 heard normally. No murmurs." }
          ],
          doctorInstructions: ["Reduce dietary sodium intake.", "Maintain daily activity log."],
          followUpPlan: ["Review clinic records in 3 months."],
          medicines: [
            {
              name: "Amlodipine",
              strength: "5mg",
              form: "Tablet",
              dose: "1 tablet",
              frequency: "Once daily",
              timings: ["Morning"],
              duration: "30 days",
              instructions: "Take after breakfast."
            },
            {
              name: "Amoxicillin", // Added to double-test your database resolver match
              strength: "500mg",
              form: "Capsule",
              dose: "1 capsule",
              frequency: "Three times daily",
              timings: ["Morning", "Afternoon", "Night"],
              duration: "7 days",
              instructions: "Complete full antibiotic course."
            }
          ],
          additionalNotes: ["Patient advised on smoking cessation strategies."],
          investigations: ["Serum electrolytes panel ordered."],
          testsAdvised: [
            { test: "Lipid Profile Panel", action: "FASTING", timing: "Next week", condition: "12 hours fasting" }
          ],
          clinicalPlan: ["Initiate single-agent therapy. Monitor adherence closely."]
        })
      }
    }
  ]
};

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  
  if (req.url === '/v1/chat/completions' && req.method === 'POST') {
    console.log("📥 [MOCK OPENAI] Intercepted a secure document parsing call request.");
    res.writeHead(200);
    res.end(JSON.stringify(mockOpenAIResponse));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: "Route context matching path not found." }));
  }
});

server.listen(PORT, () => {
  console.log(`📡 Local Offline Mock OpenAI Server successfully active on: http://localhost:${PORT}`);
});
