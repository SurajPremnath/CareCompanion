"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CheckinPage() {
  const router = useRouter();

  const [assessmentType, setAssessmentType] =
    useState("");

  // Self

  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  // Family

  const [patientName, setPatientName] =
    useState("");

  const [patientAge, setPatientAge] =
    useState("");

  const [observerName, setObserverName] =
    useState("");

  const [
    observerRelationship,
    setObserverRelationship,
  ] = useState("");

  const [
    observerRelationshipOther,
    setObserverRelationshipOther,
  ] = useState("");

  useEffect(() => {
    const type =
      localStorage.getItem(
        "assessmentType"
      ) || "";

    setAssessmentType(type);
  }, []);

  const handleStart = () => {
    if (assessmentType === "self") {
      if (!name.trim()) {
        alert("Please enter your name.");
        return;
      }

      if (!age.trim()) {
        alert("Please enter your age.");
        return;
      }

      localStorage.setItem(
        "patientName",
        name
      );

      localStorage.setItem(
        "patientAge",
        age
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

      router.push("/self");

      return;
    }

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

    if (!observerRelationship) {
      alert(
        "Please select relationship."
      );
      return;
    }

    if (
      observerRelationship ===
        "Other" &&
      !observerRelationshipOther.trim()
    ) {
      alert(
        "Please specify relationship."
      );
      return;
    }

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
      observerRelationship
    );

    localStorage.setItem(
      "observerRelationshipOther",
      observerRelationshipOther
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
            Assessment Details
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
          {assessmentType ===
          "self" ? (
            <>
              <h2
                style={{
                  marginBottom: "20px",
                }}
              >
                Self Assessment
              </h2>

              <label>
                Your Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(
                    e.target.value
                  )
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  marginTop: "6px",
                  marginBottom:
                    "18px",
                  border:
                    "1px solid #ccc",
                  borderRadius:
                    "10px",
                  boxSizing:
                    "border-box",
                }}
              />

              <label>
                Your Age
              </label>

              <input
                type="number"
                value={age}
                onChange={(e) =>
                  setAge(
                    e.target.value
                  )
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  marginTop: "6px",
                  border:
                    "1px solid #ccc",
                  borderRadius:
                    "10px",
                  boxSizing:
                    "border-box",
                }}
              />
            </>
          ) : (
            <>
              <h2
                style={{
                  marginBottom: "20px",
                }}
              >
                Family Assessment
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
                style={{
                  width: "100%",
                  padding: "12px",
                  marginTop: "6px",
                  marginBottom:
                    "18px",
                  border:
                    "1px solid #ccc",
                  borderRadius:
                    "10px",
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
                style={{
                  width: "100%",
                  padding: "12px",
                  marginTop: "6px",
                  marginBottom:
                    "18px",
                  border:
                    "1px solid #ccc",
                  borderRadius:
                    "10px",
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
                style={{
                  width: "100%",
                  padding: "12px",
                  marginTop: "6px",
                  marginBottom:
                    "18px",
                  border:
                    "1px solid #ccc",
                  borderRadius:
                    "10px",
                  boxSizing:
                    "border-box",
                }}
              />

              <label>
                Relationship To
                Patient
              </label>

              <select
                value={
                  observerRelationship
                }
                onChange={(e) =>
                  setObserverRelationship(
                    e.target.value
                  )
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  marginTop: "6px",
                  border:
                    "1px solid #ccc",
                  borderRadius:
                    "10px",
                }}
              >
                <option value="">
                  Select
                </option>

                <option>
                  Son
                </option>

                <option>
                  Daughter
                </option>

                <option>
                  Spouse
                </option>

                <option>
                  Brother
                </option>

                <option>
                  Sister
                </option>

                <option>
                  Parent
                </option>

                <option>
                  Caregiver
                </option>

                <option>
                  Friend
                </option>

                <option>
                  Neighbour
                </option>

                <option>
                  Other
                </option>
              </select>

              {observerRelationship ===
                "Other" && (
                <input
                  type="text"
                  placeholder="Specify relationship"
                  value={
                    observerRelationshipOther
                  }
                  onChange={(e) =>
                    setObserverRelationshipOther(
                      e.target.value
                    )
                  }
                  style={{
                    width:
                      "100%",
                    padding:
                      "12px",
                    marginTop:
                      "15px",
                    border:
                      "1px solid #ccc",
                    borderRadius:
                      "10px",
                    boxSizing:
                      "border-box",
                  }}
                />
              )}
            </>
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
