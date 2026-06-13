"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AssessmentLayout from "@/Components/AssessmentLayout";

export default function FamilyPage3() {
  const router = useRouter();

  const [fever, setFever] =
    useState("");

  const [
    temperatureChecked,
    setTemperatureChecked,
  ] = useState("");

  const [
    temperatureReading,
    setTemperatureReading,
  ] = useState("");

  const [
    temperatureUnit,
    setTemperatureUnit,
  ] = useState("F");

  const [energy, setEnergy] =
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
    if (!fever || !energy) {
      alert(
        "Please answer all questions."
      );
      return;
    }

    if (
      fever === "yes" &&
      !temperatureChecked
    ) {
      alert(
        "Please indicate whether temperature was measured."
      );
      return;
    }

    if (
      fever === "yes" &&
      temperatureChecked === "yes" &&
      !temperatureReading
    ) {
      alert(
        "Please enter the temperature reading."
      );
      return;
    }

    localStorage.setItem(
      "fever",
      fever
    );

    localStorage.setItem(
      "temperatureChecked",
      temperatureChecked
    );

    localStorage.setItem(
      "temperatureReading",
      temperatureReading
    );

    localStorage.setItem(
      "temperatureUnit",
      temperatureUnit
    );

    localStorage.setItem(
      "energy",
      energy
    );

    router.push("/family/page4");
  };

  return (
    <AssessmentLayout currentPage={2} assessmentType="family">
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
          🌡️ Did the patient seem
          feverish today?
        </h3>

        <button
          style={optionStyle(
            fever === "no"
          )}
          onClick={() => {
            setFever("no");
            setTemperatureChecked("");
            setTemperatureReading("");
          }}
        >
          😊 No
        </button>

        <button
          style={optionStyle(
            fever === "yes"
          )}
          onClick={() =>
            setFever("yes")
          }
        >
          😟 Yes
        </button>

        {fever === "yes" && (
          <>
            <div
              style={{
                height: "10px",
              }}
            />

            <h3
              style={{
                fontSize: "18px",
                marginBottom: "6px",
              }}
            >
              🌡️ Was temperature
              measured?
            </h3>

            <button
              style={optionStyle(
                temperatureChecked ===
                  "yes"
              )}
              onClick={() =>
                setTemperatureChecked(
                  "yes"
                )
              }
            >
              😊 Yes
            </button>

            <button
              style={optionStyle(
                temperatureChecked ===
                  "no"
              )}
              onClick={() =>
                setTemperatureChecked(
                  "no"
                )
              }
            >
              😐 No
            </button>

            {temperatureChecked ===
              "yes" && (
              <>
                <div
                  style={{
                    marginTop:
                      "10px",
                  }}
                >
                  <input
                    type="number"
                    value={
                      temperatureReading
                    }
                    onChange={(
                      e
                    ) =>
                      setTemperatureReading(
                        e.target
                          .value
                      )
                    }
                    placeholder="Enter latest temperature"
                    style={{
                      width:
                        "100%",
                      padding:
                        "12px",
                      border:
                        "1px solid #ccc",
                      borderRadius:
                        "10px",
                      boxSizing:
                        "border-box",
                    }}
                  />

                  <div
                    style={{
                      display:
                        "flex",
                      gap: "10px",
                      marginTop:
                        "10px",
                    }}
                  >
                    <button
                      style={{
                        flex: 1,
                        padding:
                          "10px",
                        border:
                          temperatureUnit ===
                          "F"
                            ? "2px solid #2563eb"
                            : "1px solid #ccc",
                        borderRadius:
                          "10px",
                        background:
                          temperatureUnit ===
                          "F"
                            ? "#eff6ff"
                            : "white",
                      }}
                      onClick={() =>
                        setTemperatureUnit(
                          "F"
                        )
                      }
                    >
                      °F
                    </button>

                    <button
                      style={{
                        flex: 1,
                        padding:
                          "10px",
                        border:
                          temperatureUnit ===
                          "C"
                            ? "2px solid #2563eb"
                            : "1px solid #ccc",
                        borderRadius:
                          "10px",
                        background:
                          temperatureUnit ===
                          "C"
                            ? "#eff6ff"
                            : "white",
                      }}
                      onClick={() =>
                        setTemperatureUnit(
                          "C"
                        )
                      }
                    >
                      °C
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        )}

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
          ⚡ How energetic did the
          patient seem today?
        </h3>

        {fever === "no" && (
          <button
            style={optionStyle(
              energy === "good"
            )}
            onClick={() =>
              setEnergy("good")
            }
          >
            😊 Active
          </button>
        )}

        <button
          style={optionStyle(
            energy === "tired"
          )}
          onClick={() =>
            setEnergy("tired")
          }
        >
          😐 Less Active
        </button>

        <button
          style={optionStyle(
            energy ===
              "verytired"
          )}
          onClick={() =>
            setEnergy(
              "verytired"
            )
          }
        >
          😟 Very Weak
        </button>

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "20px",
          }}
        >
          <button
            onClick={() =>
              router.push(
                "/family/page2"
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
