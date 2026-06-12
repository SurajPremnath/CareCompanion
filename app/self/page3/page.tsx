"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/Components/Header";

export default function Page3() {
  const router = useRouter();

  const [appetite, setAppetite] =
    useState("");

  const [water, setWater] =
    useState("");

  const [waterGlasses, setWaterGlasses] =
    useState("");

  useEffect(() => {
    setAppetite(
      localStorage.getItem("appetite") ||
        ""
    );

    setWater(
      localStorage.getItem("water") || ""
    );

    setWaterGlasses(
      localStorage.getItem(
        "waterGlasses"
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
    if (!appetite || !water) {
      alert("Please answer all questions.");
      return;
    }

    if (
      water === "yes" &&
      !waterGlasses
    ) {
      alert(
        "Please select the number of glasses."
      );
      return;
    }

    localStorage.setItem(
      "appetite",
      appetite
    );

    localStorage.setItem(
      "water",
      water
    );

    localStorage.setItem(
      "waterGlasses",
      waterGlasses
    );

    router.push("/self/page4");
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
        <Header currentPage={3} />

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
            🍽 How is your appetite today?
          </h3>

          <button
            style={optionStyle(
              appetite === "normal"
            )}
            onClick={() =>
              setAppetite("normal")
            }
          >
            😊 Normal
          </button>

          <button
            style={optionStyle(
              appetite === "less"
            )}
            onClick={() =>
              setAppetite("less")
            }
          >
            😐 Eating Less
          </button>

          <button
            style={optionStyle(
              appetite === "poor"
            )}
            onClick={() =>
              setAppetite("poor")
            }
          >
            😟 Hardly Eating
          </button>

          <div style={{ height: "12px" }} />

          <h3>
            💧 Have you been drinking enough water today?
          </h3>

          <button
            style={optionStyle(
              water === "yes"
            )}
            onClick={() =>
              setWater("yes")
            }
          >
            😊 Yes
          </button>

          <button
            style={optionStyle(
              water === "notsure"
            )}
            onClick={() => {
              setWater("notsure");
              setWaterGlasses("");
            }}
          >
            😐 Not Sure
          </button>

          <button
            style={optionStyle(
              water === "no"
            )}
            onClick={() => {
              setWater("no");
              setWaterGlasses("");
            }}
          >
            😟 No
          </button>

          {water === "yes" && (
            <>
              <div style={{ height: "12px" }} />

              <h3>
                🥛 Approximately how many glasses of water did you drink today?
              </h3>

              {[
                "1",
                "2",
                "3",
                "4",
                "5+",
                "Not Sure",
              ].map((glass) => (
                <button
                  key={glass}
                  style={optionStyle(
                    waterGlasses === glass
                  )}
                  onClick={() =>
                    setWaterGlasses(glass)
                  }
                >
                  {glass}
                </button>
              ))}
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
                router.push("/self/page2")
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
