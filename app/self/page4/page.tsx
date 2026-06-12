"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function Page4() {
  const router = useRouter();

  const [pain, setPain] = useState(
    localStorage.getItem("pain") || ""
  );

  const [otherPain, setOtherPain] =
    useState(
      localStorage.getItem("otherPain") || ""
    );

  const [painAreas, setPainAreas] =
    useState<string[]>(
      JSON.parse(
        localStorage.getItem("painAreas") ||
          "[]"
      )
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

  const toggleArea = (
    area: string
  ) => {
    if (painAreas.includes(area)) {
      setPainAreas(
        painAreas.filter(
          (item) => item !== area
        )
      );
    } else {
      setPainAreas([
        ...painAreas,
        area,
      ]);
    }
  };

  const showPainAreas =
    pain === "mild" ||
    pain === "significant";

  const handleNext = () => {
    if (!pain) {
      alert(
        "Please answer the pain question."
      );
      return;
    }

    if (
      showPainAreas &&
      painAreas.length === 0
    ) {
      alert(
        "Please select where the pain is."
      );
      return;
    }

    if (
      painAreas.includes("Other") &&
      !otherPain.trim()
    ) {
      alert(
        "Please specify the other pain location."
      );
      return;
    }

    localStorage.setItem(
      "pain",
      pain
    );

    localStorage.setItem(
      "painAreas",
      JSON.stringify(painAreas)
    );

    localStorage.setItem(
      "otherPain",
      otherPain
    );

    router.push("/self/page5");
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
        <Header currentPage={4} />

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
            🤕 Are you experiencing any body pain today?
          </h3>

          <button
            style={optionStyle(
              pain === "none"
            )}
            onClick={() => {
              setPain("none");
              setPainAreas([]);
              setOtherPain("");
            }}
          >
            😊 No Pain
          </button>

          <button
            style={optionStyle(
              pain === "mild"
            )}
            onClick={() =>
              setPain("mild")
            }
          >
            😐 Mild Pain
          </button>

          <button
            style={optionStyle(
              pain === "significant"
            )}
            onClick={() =>
              setPain(
                "significant"
              )
            }
          >
            😟 Significant Pain
          </button>

          {showPainAreas && (
            <>
              <div
                style={{
                  height: "12px",
                }}
              />

              <h3>
                📍 Where is the pain?
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
                    checked={painAreas.includes(
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

              {painAreas.includes(
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
                    value={otherPain}
                    onChange={(e) =>
                      setOtherPain(
                        e.target.value
                      )
                    }
                    placeholder="Describe pain location"
                    style={{
                      width: "100%",
                      padding: "12px",
                      marginTop: "6px",
                      borderRadius: "10px",
                      border: "1px solid #ccc",
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
              marginTop: "16px",
            }}
          >
            <button
              onClick={() =>
                router.push("/self/page3")
              }
              style={{
                flex: 1,
                padding: "12px",
                backgroundColor:
                  "#e5e7eb",
                border: "none",
                borderRadius: "10px",
                fontWeight: "bold",
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
                borderRadius: "10px",
                fontWeight: "bold",
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