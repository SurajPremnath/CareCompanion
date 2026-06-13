"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/Components/Header";

export default function Page4() {
  const router = useRouter();

  const [discomfort, setDiscomfort] =
    useState("");

  const [discomfortAreas, setDiscomfortAreas] =
    useState<string[]>([]);

  const [otherDiscomfort, setOtherDiscomfort] =
    useState("");

  useEffect(() => {
    setDiscomfort(
      localStorage.getItem("discomfort") ||
        ""
    );

    setDiscomfortAreas(
      JSON.parse(
        localStorage.getItem(
          "discomfortAreas"
        ) || "[]"
      )
    );

    setOtherDiscomfort(
      localStorage.getItem(
        "otherDiscomfort"
      ) || ""
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

  const toggleArea = (
    area: string
  ) => {
    if (
      discomfortAreas.includes(area)
    ) {
      setDiscomfortAreas(
        discomfortAreas.filter(
          (item) => item !== area
        )
      );
    } else {
      setDiscomfortAreas([
        ...discomfortAreas,
        area,
      ]);
    }
  };

  const handleNext = () => {
    if (!discomfort) {
      alert(
        "Please answer the question."
      );
      return;
    }

    if (
      discomfort === "yes" &&
      discomfortAreas.length === 0
    ) {
      alert(
        "Please select where you felt discomfort."
      );
      return;
    }

    if (
      discomfortAreas.includes(
        "Other"
      ) &&
      !otherDiscomfort.trim()
    ) {
      alert(
        "Please specify the discomfort location."
      );
      return;
    }

    localStorage.setItem(
      "discomfort",
      discomfort
    );

    localStorage.setItem(
      "discomfortAreas",
      JSON.stringify(
        discomfortAreas
      )
    );

    localStorage.setItem(
      "otherDiscomfort",
      otherDiscomfort
    );

    router.push("/self/page5");
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
          <h2>
            Health Check For Today
          </h2>

          <hr />

          <h3>
            🤕 Did you feel any
            discomfort today?
          </h3>

          <button
            style={optionStyle(
              discomfort === "no"
            )}
            onClick={() => {
              setDiscomfort("no");
              setDiscomfortAreas([]);
              setOtherDiscomfort("");
            }}
          >
            😊 No
          </button>

          <button
            style={optionStyle(
              discomfort === "yes"
            )}
            onClick={() =>
              setDiscomfort("yes")
            }
          >
            😟 Yes
          </button>

          {discomfort === "yes" && (
            <>
              <div
                style={{
                  height: "12px",
                }}
              />

              <h3>
                📍 Where did you feel
                discomfort?
              </h3>

              {[
                "Head",
                "Eyes",
                "Ears",
                "Neck",
                "Chest",
                "Back",
                "Stomach",
                "Arms / Hands",
                "Legs / Feet",
                "Joints",
                "Other",
              ].map((area) => (
                <label
                  key={area}
                  style={{
                    display: "block",
                    marginBottom: "10px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={discomfortAreas.includes(
                      area
                    )}
                    onChange={() =>
                      toggleArea(area)
                    }
                    style={{
                      marginRight: "10px",
                    }}
                  />
                  {area}
                </label>
              ))}

              {discomfortAreas.includes(
                "Other"
              ) && (
                <div
                  style={{
                    marginTop: "10px",
                  }}
                >
                  <label>
                    Please specify:
                  </label>

                  <input
                    type="text"
                    value={
                      otherDiscomfort
                    }
                    onChange={(e) =>
                      setOtherDiscomfort(
                        e.target.value
                      )
                    }
                    placeholder="Describe the location"
                    style={{
                      width: "100%",
                      padding: "12px",
                      marginTop: "6px",
                      borderRadius: "10px",
                      border:
                        "1px solid #ccc",
                      boxSizing:
                        "border-box",
                    }}
                  />
                </div>
              )}
            </>
          )}

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
                  "/self/page3"
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
                fontWeight:
                  "bold",
                cursor:
                  "pointer",
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
                cursor:
                  "pointer",
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