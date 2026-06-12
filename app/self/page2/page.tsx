"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function Page2() {
  const router = useRouter();

  const [fever, setFever] = useState(
    localStorage.getItem("fever") || ""
  );

  const [temperatureChecked, setTemperatureChecked] =
    useState(
      localStorage.getItem(
        "temperatureChecked"
      ) || ""
    );

  const [temperatureReading, setTemperatureReading] =
    useState(
      localStorage.getItem(
        "temperatureReading"
      ) || ""
    );

  const [temperatureUnit, setTemperatureUnit] =
    useState(
      localStorage.getItem(
        "temperatureUnit"
      ) || "F"
    );

  const [energy, setEnergy] = useState(
    localStorage.getItem("energy") || ""
  );

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
        "Please answer whether temperature was checked."
      );
      return;
    }

    if (
      fever === "yes" &&
      temperatureChecked === "yes" &&
      !temperatureReading.trim()
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

    router.push("/self/page3");
  };

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
        <Header currentPage={2} />

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

          <h3>
            🌡 Do you feel feverish today?
          </h3>

          <button
            style={optionStyle(
              fever === "no"
            )}
            onClick={() => {
              setFever("no");
              setTemperatureChecked("");
              setTemperatureReading("");
              setEnergy("");
            }}
          >
            😊 No
          </button>

          <button
            style={optionStyle(
              fever === "yes"
            )}
            onClick={() => {
              setFever("yes");

              if (energy === "good") {
                setEnergy("");
              }
            }}
          >
            😟 Yes
          </button>

          {fever === "yes" && (
            <>
              <div
                style={{
                  height: "12px",
                }}
              />

              <h3>
                🌡 Was your temperature
                checked today?
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
                      height:
                        "10px",
                    }}
                  />

                  <label>
                    🌡 Latest
                    Temperature
                    Reading
                  </label>

                  <input
                    type="number"
                    step="0.1"
                    value={
                      temperatureReading
                    }
                    onChange={(e) =>
                      setTemperatureReading(
                        e.target.value
                      )
                    }
                    placeholder="Enter reading"
                    style={{
                      width:
                        "100%",
                      padding:
                        "12px",
                      marginTop:
                        "6px",
                      borderRadius:
                        "10px",
                      border:
                        "1px solid #ccc",
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
                        borderRadius:
                          "10px",
                        border:
                          temperatureUnit ===
                          "F"
                            ? "2px solid #2563eb"
                            : "1px solid #d1d5db",
                        backgroundColor:
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
                        borderRadius:
                          "10px",
                        border:
                          temperatureUnit ===
                          "C"
                            ? "2px solid #2563eb"
                            : "1px solid #d1d5db",
                        backgroundColor:
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
                </>
              )}
            </>
          )}

          <div style={{ height: "12px" }} />

          <h3>
            ⚡ How is your energy today?
          </h3>

          {fever !== "yes" && (
            <button
              style={optionStyle(
                energy === "good"
              )}
              onClick={() =>
                setEnergy("good")
              }
            >
              😊 Good
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
            😐 Tired
          </button>

          <button
            style={optionStyle(
              energy === "verytired"
            )}
            onClick={() =>
              setEnergy(
                "verytired"
              )
            }
          >
            😟 Very Tired
          </button>

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "16px",
            }}
          >
            <button
              onClick={() =>
                router.push("/self")
              }
              style={{
                flex: 1,
                padding: "12px",
                backgroundColor:
                  "#e5e7eb",
                border: "none",
                borderRadius:
                  "10px",
                fontWeight:
                  "bold",
                cursor: "pointer",
              }}
            >
              ← Previous
            </button>

            <button
              onClick={handleNext}
              style={{
                flex: 1,
                padding: "12px",
                backgroundColor:
                  "#2563eb",
                color: "white",
                border: "none",
                borderRadius:
                  "10px",
                fontWeight:
                  "bold",
                cursor: "pointer",
              }}
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}