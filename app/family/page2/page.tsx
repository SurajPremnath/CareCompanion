"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AssessmentLayout from "@/Components/AssessmentLayout";

export default function FamilyPage2() {
  const router = useRouter();

  const [breathing, setBreathing] =
    useState("");

  const [cough, setCough] =
    useState("");

  const [bloodInCough, setBloodInCough] =
    useState("");

  const optionStyle = (
    selected: boolean
  ) => ({
    width: "100%",
    padding: "10px 14px",
    marginBottom: "8px",
    borderRadius: "10px",
    border: selected
      ? "2px solid #2563eb"
      : "1px solid #d1d5db",
    backgroundColor: selected
      ? "#eff6ff"
      : "white",
    cursor: "pointer",
    textAlign: "left" as const,
    fontSize: "15px",
  });

  const handleNext = () => {
    if (!breathing || !cough) {
      alert(
        "Please answer all questions."
      );
      return;
    }

    if (
      cough !== "no" &&
      !bloodInCough
    ) {
      alert(
        "Please answer whether blood was seen while coughing."
      );
      return;
    }

    localStorage.setItem(
      "breathing",
      breathing
    );

    localStorage.setItem(
      "cough",
      cough
    );

    localStorage.setItem(
      "bloodInCough",
      bloodInCough
    );

    router.push("/family/page3");
  };

  return (
    <AssessmentLayout currentPage={1}>
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "14px",
          padding: "20px",
          border: "1px solid #ddd",
        }}
      >
        <h2
          style={{
            fontSize: "22px",
            marginBottom: "12px",
          }}
        >
          Health Check For Today
        </h2>

        <hr />

        <h3
          style={{
            fontSize: "18px",
            marginBottom: "6px",
          }}
        >
          🫁 How was the patient's
          breathing today?
        </h3>

        <button
          style={optionStyle(
            breathing === "normal"
          )}
          onClick={() =>
            setBreathing("normal")
          }
        >
          😊 Normal
        </button>

        <button
          style={optionStyle(
            breathing === "slightly"
          )}
          onClick={() =>
            setBreathing(
              "slightly"
            )
          }
        >
          😐 Slightly Difficult
        </button>

        <button
          style={optionStyle(
            breathing ===
              "difficult"
          )}
          onClick={() =>
            setBreathing(
              "difficult"
            )
          }
        >
          😟 Very Difficult
        </button>

        <div
          style={{
            height: "12px",
          }}
        />

        <h3
          style={{
            fontSize: "18px",
            marginBottom: "6px",
          }}
        >
          🤧 Was the patient
          coughing today?
        </h3>

        <button
          style={optionStyle(
            cough === "no"
          )}
          onClick={() => {
            setCough("no");
            setBloodInCough("");
          }}
        >
          😊 No
        </button>

        <button
          style={optionStyle(
            cough === "sometimes"
          )}
          onClick={() =>
            setCough(
              "sometimes"
            )
          }
        >
          😐 Sometimes
        </button>

        <button
          style={optionStyle(
            cough ===
              "frequent"
          )}
          onClick={() =>
            setCough(
              "frequent"
            )
          }
        >
          😟 Frequently
        </button>

        {cough !== "no" &&
          cough !== "" && (
            <>
              <div
                style={{
                  height: "12px",
                }}
              />

              <h3
                style={{
                  fontSize:
                    "18px",
                  marginBottom:
                    "6px",
                }}
              >
                🩸 Was blood seen
                while coughing?
              </h3>

              <button
                style={optionStyle(
                  bloodInCough ===
                    "no"
                )}
                onClick={() =>
                  setBloodInCough(
                    "no"
                  )
                }
              >
                😊 No
              </button>

              <button
                style={optionStyle(
                  bloodInCough ===
                    "yes"
                )}
                onClick={() =>
                  setBloodInCough(
                    "yes"
                  )
                }
              >
                😟 Yes
              </button>
            </>
          )}

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "18px",
          }}
        >
          <button
            onClick={() =>
              router.push(
                "/family"
              )
            }
            style={{
              flex: 1,
              padding: "12px",
              backgroundColor:
                "#e5e7eb",
              border: "none",
              borderRadius:
                "10px",
              fontSize: "18px",
              fontWeight:
                "bold",
              cursor:
                "pointer",
            }}
          >
            ← Previous
          </button>

          <button
            onClick={
              handleNext
            }
            style={{
              flex: 1,
              padding: "12px",
              backgroundColor:
                "#2563eb",
              color:
                "white",
              border: "none",
              borderRadius:
                "10px",
              fontSize: "18px",
              fontWeight:
                "bold",
              cursor:
                "pointer",
            }}
          >
            Next →
          </button>
        </div>
      </div>
    </AssessmentLayout>
  );
}