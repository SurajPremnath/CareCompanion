"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/Components/Header";

export default function SelfPage2() {
  const router = useRouter();

  const [fever, setFever] = useState("");
  const [temperatureChecked, setTemperatureChecked] =
    useState("");

  const [temperatureReading, setTemperatureReading] =
    useState("");

  const [temperatureUnit, setTemperatureUnit] =
    useState("F");

  const [energy, setEnergy] = useState("");

  useEffect(() => {
    setFever(
      localStorage.getItem("fever") || ""
    );

    setTemperatureChecked(
      localStorage.getItem(
        "temperatureChecked"
      ) || ""
    );

    setTemperatureReading(
      localStorage.getItem(
        "temperatureReading"
      ) || ""
    );

    setTemperatureUnit(
      localStorage.getItem(
        "temperatureUnit"
      ) || "F"
    );

    setEnergy(
      localStorage.getItem("energy") || ""
    );
  }, []);

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
    if (!fever) {
      alert(
        "Please answer whether you feel feverish."
      );
      return;
    }

    if (
      fever === "yes" &&
      !temperatureChecked
    ) {
      alert(
        "Please answer whether temperature was taken."
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

    if (!energy) {
      alert(
        "Please select your energy level."
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
        <Header/>

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
            Health Check for today
          </h2>

          <hr />

          <h3>
            🤒 Do you feel feverish
            today?
          </h3>

          <button
            style={optionStyle(
              fever === "no"
            )}
            onClick={() => {
              setFever("no");
              setTemperatureChecked(
                ""
              );
              setTemperatureReading(
                ""
              );
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
                  height: "12px",
                }}
              />

              <h3>
                🌡 Was your
                temperature taken?
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
                onClick={() => {
                  setTemperatureChecked(
                    "no"
                  );
                  setTemperatureReading(
                    ""
                  );
                }}
              >
                😐 No
              </button>

              {temperatureChecked ===
                "yes" && (
                <>
                  <div
                    style={{
                      marginTop:
                        "12px",
                    }}
                  >
                    <label>
                      Latest
                      temperature
                      reading
                    </label>

                    <input
                      type="number"
                      step="0.1"
                      value={
                        temperatureReading
                      }
                      onChange={(e) =>
                        setTemperatureReading(
                          e.target
                            .value
                        )
                      }
                      placeholder="e.g. 101.4"
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

                    <select
                      value={
                        temperatureUnit
                      }
                      onChange={(e) =>
                        setTemperatureUnit(
                          e.target
                            .value
                        )
                      }
                      style={{
                        width:
                          "100%",
                        padding:
                          "12px",
                        marginTop:
                          "8px",
                        borderRadius:
                          "10px",
                        border:
                          "1px solid #ccc",
                      }}
                    >
                      <option value="F">
                        °F
                      </option>
                      <option value="C">
                        °C
                      </option>
                    </select>
                  </div>
                </>
              )}
            </>
          )}

          <div
            style={{
              marginTop: "20px",
            }}
          >
            <h3>
              ⚡ How is your
              energy today?
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
                energy ===
                  "veryTired"
              )}
              onClick={() =>
                setEnergy(
                  "veryTired"
                )
              }
            >
              😟 Very Tired
            </button>
          </div>

          <button
            onClick={handleNext}
            style={{
              width: "100%",
              marginTop: "20px",
              padding: "12px",
              backgroundColor:
                "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Next →
          </button>
        </div>
      </div>
    </main>
  );
}