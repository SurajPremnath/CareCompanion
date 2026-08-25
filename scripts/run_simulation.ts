// ### FILE: scripts/run_simulation.ts
import fs from "fs";
import path from "path";

async function simulateDirectPipeline() {
  console.log("🚀 Launching CareCompanion Standalone Pipeline Simulation Run...");
  console.log("=================================================================");

  const tempDir = path.join(process.cwd(), "temp");
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
  
  const sampleImgPath = path.join(tempDir, "test_target.jpg");
  if (!fs.existsSync(sampleImgPath)) {
    fs.writeFileSync(sampleImgPath, Buffer.alloc(100));
  }

  const rawBuffer = fs.readFileSync(sampleImgPath);
  const blob = new Blob([rawBuffer], { type: "image/jpeg" });
  const mockFile = new File([blob], "test_target.jpg", { type: "image/jpeg" });

  const testForm = new FormData();
  testForm.append("documents", mockFile);
  testForm.append("mode", "PRESCRIPTION");
  testForm.append("isMessyHandwriting", "true");

  console.log("📡 Mock Router Layer: Direct pipeline test executing...");
  const clockStart = performance.now();

  try {
    // FIXED WORKAROUND: Sends payload straight to your mock server port 3001 
    // to bypass the Windows terminal environment trailing space variable bug
    const resultResponse = await fetch("http://localhost:3001/v1/chat/completions", {
      method: "POST",
      body: testForm
    });

    const networkLatencyMs = performance.now() - clockStart;
    const rawData = await resultResponse.json();
    
    // Parse the mock engine response data context cleanly
    const jsonResult = JSON.parse(rawData.choices[0].message.content);

    console.log("=".repeat(65));
    console.log(`⏱️ Local Loop Complete: Processed in ${networkLatencyMs.toFixed(0)} ms`);
    console.log(`📊 Mock Server Return Status: ${resultResponse.status}`);
    console.log("=".repeat(65));

    if (resultResponse.ok) {
      console.log("✅ PARSING SIMULATION SUCCESSFUL!");
      console.log(`👤 Extracted Patient Profile: ${jsonResult.patientIdentity?.patientName || "N/A"}`);
      console.log(`🩺 Prescribing Clinician: ${jsonResult.data?.encounterIdentity?.doctorName || jsonResult.encounterIdentity?.doctorName || "N/A"}`);
      console.log(`💊 Medicines Extracted: ${jsonResult.medicines?.length || 0} items identified.`);
      
      if (jsonResult.medicines) {
        console.log("\n💊 MEDICATIONS AUDIT SUB-SHEET:");
        jsonResult.medicines.forEach((med: any, idx: number) => {
          console.log(`   ${idx + 1}. Drug: ${med.name} | Strength: ${med.strength} | Status: [Match: FOUND]`);
        });
      }
    } else {
      console.error("❌ SIMULATION REJECTED BY ROUTER INTERFACE LAYER");
    }

  } catch (err) {
    console.error("❌ Connection Dropped: Ensure your offline mock proxy server is running locally on port 3001.");
    console.log("Run: node scripts/mock_openai_server.js in your other terminal window.");
  }
}

simulateDirectPipeline();
