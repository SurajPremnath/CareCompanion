"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/Components/Header";

export default function SelfAssessmentPage() {
  const router = useRouter();

  const [breathing, setBreathing] =
    useState("");

  const [cough, setCough] =
    useState("");

  const [bloodInCough, setBloodInCough] =
    useState("");

  useEffect(() => {
    setBreathing(
      localStorage.getItem("breathing") ||
        ""
    );

    setCough(
      localStorage.getItem("cough") || ""
    );

    setBloodInCough(
      localStorage.getItem(
        "bloodInCough"
      ) || ""
    );
  }, []);

  const optionStyle = (
    selected: boolean
  ) => ({
    width: "100%",
    padding: "10px 14px",
    marginBottom: "6px",
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

    const needsBloodQuestion =
      cough === "sometimes" ||
      cough === "frequent";

    if (
      needsBloodQuestion &&
      !bloodInCough
    ) {
      alert(
        "Please answer the blood in cough question."
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

    router.push("/self/page2");
  };

  const showBloodQuestion =
    cough === "sometimes" ||
    cough === "frequent";

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        padding: "15px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
        }}
      >
        <Header currentPage={1} />

        <div
          style={{
            backgroundColor: "white",
            borderRadius: "14px",
            padding: "18px",
            border: "1px solid #ddd",
          }}
        >
          <h2
            style={{
              fontSize: "20px",
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
            🫁 How is your breathing
            today?
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
            🤧 Are you coughing
            today?
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
              cough ===
                "sometimes"
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

          {showBloodQuestion && (
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
                🩸 Have you coughed
                up blood?
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

          <button
            onClick={
              handleNext
            }
            style={{
              width: "100%",
              marginTop: "16px",
              padding: "12px",
              backgroundColor:
                "#2563eb",
              color: "white",
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
    </main>
  );
}

