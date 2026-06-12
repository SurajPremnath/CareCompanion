"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FamilyPage() {
  const router = useRouter();

  const [patientName, setPatientName] =
    useState("");

  const [patientAge, setPatientAge] =
    useState("");

  const [observerName, setObserverName] =
    useState("");

  const [
    relationship,
    setRelationship,
  ] = useState("");

  const [
    otherRelationship,
    setOtherRelationship,
  ] = useState("");

  const handleStart = () => {
    if (!patientName.trim()) {
      alert(
        "Please enter patient name."
      );
      return;
    }

    if (!patientAge.trim()) {
      alert(
        "Please enter patient age."
      );
      return;
    }

    if (!observerName.trim()) {
      alert(
        "Please enter your name."
      );
      return;
    }

    if (!relationship) {
      alert(
        "Please select relationship."
      );
      return;
    }

    if (
      relationship === "Other" &&
      !otherRelationship.trim()
    ) {
      alert(
        "Please specify relationship."
      );
      return;
    }

    localStorage.setItem(
      "assessmentType",
      "family"
    );

    localStorage.setItem(
      "patientName",
      patientName
    );

    localStorage.setItem(
      "patientAge",
      patientAge
    );

    localStorage.setItem(
      "observerName",
      observerName
    );

    localStorage.setItem(
      "observerRelationship",
      relationship
    );

    localStorage.setItem(
      "observerRelationshipOther",
      otherRelationship
    );

    localStorage.setItem(
      "assessmentDate",
      new Date().toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        }
      )
    );

    router.push("/family/page2");
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        padding: "20px",
        fontFamily:
          "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "25px",
          }}
        >
          <h1
            style={{
              fontSize: "42px",
              marginBottom: "8px",
            }}
          >
            ❤️ CareCompanion
          </h1>

          <p
            style={{
              color: "#666",
            }}
          >
            Family Assessment
          </p>
        </div>

        <div
          style={{
            backgroundColor: "white",
            borderRadius: "16px",
            border: "1px solid #ddd",
            padding: "30px",
          }}
        >
          <h2
            style={{
              marginBottom: "20px",
            }}
          >
            Assessment Details
          </h2>

          <label>
            Patient Name
          </label>

          <input
            type="text"
            value={patientName}
            onChange={(e) =>
              setPatientName(
                e.target.value
              )
            }
            placeholder="Enter patient name"
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "6px",
              marginBottom: "18px",
              border:
                "1px solid #ccc",
              borderRadius: "10px",
              boxSizing:
                "border-box",
            }}
          />

          <label>
            Patient Age
          </label>

          <input
            type="number"
            value={patientAge}
            onChange={(e) =>
              setPatientAge(
                e.target.value
              )
            }
            placeholder="Enter patient age"
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "6px",
              marginBottom: "18px",
              border:
                "1px solid #ccc",
              borderRadius: "10px",
              boxSizing:
                "border-box",
            }}
          />

          <label>
            Your Name
          </label>

          <input
            type="text"
            value={observerName}
            onChange={(e) =>
              setObserverName(
                e.target.value
              )
            }
            placeholder="Enter your name"
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "6px",
              marginBottom: "18px",
              border:
                "1px solid #ccc",
              borderRadius: "10px",
              boxSizing:
                "border-box",
            }}
          />

          <label>
            Relationship To Patient
          </label>

          <select
            value={relationship}
            onChange={(e) =>
              setRelationship(
                e.target.value
              )
            }
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "6px",
              border:
                "1px solid #ccc",
              borderRadius: "10px",
            }}
          >
            <option value="">
              Select Relationship
            </option>

            <option value="Son">
              Son
            </option>

            <option value="Daughter">
              Daughter
            </option>

            <option value="Spouse">
              Spouse
            </option>

            <option value="Brother">
              Brother
            </option>

            <option value="Sister">
              Sister
            </option>

            <option value="Parent">
              Parent
            </option>

            <option value="Caregiver">
              Caregiver
            </option>

            <option value="Friend">
              Friend
            </option>

            <option value="Neighbour">
              Neighbour
            </option>

            <option value="Other">
              Other
            </option>
          </select>

          {relationship ===
            "Other" && (
            <input
              type="text"
              placeholder="Specify relationship"
              value={
                otherRelationship
              }
              onChange={(e) =>
                setOtherRelationship(
                  e.target.value
                )
              }
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "15px",
                border:
                  "1px solid #ccc",
                borderRadius:
                  "10px",
                boxSizing:
                  "border-box",
              }}
            />
          )}

          <button
            onClick={handleStart}
            style={{
              width: "100%",
              marginTop: "25px",
              padding: "14px",
              backgroundColor:
                "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Start Assessment →
          </button>
        </div>
      </div>
    </main>
  );
}
