"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/Components/Header";

export default function SelfPage2() {
  const router = useRouter();

  const [fever, setFever] = useState("");
  const [temperatureChecked, setTemperatureChecked] = useState("");
  const [temperatureReading, setTemperatureReading] = useState("");
  const [temperatureUnit, setTemperatureUnit] = useState("F");
  const [energy, setEnergy] = useState("");
  const [appetite, setAppetite] = useState("");
  const [water, setWater] = useState("");
  const [waterGlasses, setWaterGlasses] = useState("");

  // Load from localStorage only in browser
  useEffect(() => {
    setFever(localStorage.getItem("fever") || "");
    setTemperatureChecked(
      localStorage.getItem("temperatureChecked") || ""
    );
    setTemperatureReading(
      localStorage.getItem("temperatureReading") || ""
    );
    setTemperatureUnit(
      localStorage.getItem("temperatureUnit") || "F"
    );
    setEnergy(localStorage.getItem("energy") || "");
    setAppetite(localStorage.getItem("appetite") || "");
    setWater(localStorage.getItem("water") || "");
    setWaterGlasses(localStorage.getItem("waterGlasses") || "");
  }, []);

  const optionStyle = (selected: boolean) => ({
    width: "100%",
    padding: "10px 14px",
    marginBottom: "6px",
    borderRadius: "10px",
    border: selected ? "2px solid #2563eb" : "1px solid #d1d5db",
    backgroundColor: selected ? "#eff6ff" : "white",
    cursor: "pointer",
    textAlign: "left" as const,
    fontSize: "15px",
  });

  const handleNext = () => {
    if (!fever || !energy || !appetite || !water) {
      alert("Please answer all questions.");
      return;
    }

    localStorage.setItem("fever", fever);
    localStorage.setItem("temperatureChecked", temperatureChecked);
    localStorage.setItem("temperatureReading", temperatureReading);
    localStorage.setItem("temperatureUnit", temperatureUnit);
    localStorage.setItem("energy", energy);
    localStorage.setItem("appetite", appetite);
    localStorage.setItem("water", water);
    localStorage.setItem("waterGlasses", waterGlasses);

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
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <Header currentPage={2} />

        <div
          style={{
            backgroundColor: "white",
            borderRadius: "14px",
            padding: "18px",
            border: "1px solid #ddd",
          }}
        >
          <h2 style={{ fontSize: "20px", marginBottom: "12px" }}>
            Health Check – Part 2
          </h2>

          <hr />

          <h3 style={{ fontSize: "18px", marginBottom: "6px" }}>
            🤒 Do you feel feverish?
          </h3>
          <button
            style={optionStyle(fever === "no")}
            onClick={() => setFever("no")}
          >
            😊 No
          </button>
          <button
            style={optionStyle(fever === "yes")}
            onClick={() => setFever("yes")}
          >
            😟 Yes
          </button>

          {fever === "yes" && (
            <>
              <div style={{ marginTop: "10px" }}>
                <label style={{ fontSize: "16px" }}>
                  Was temperature taken?
                </label>
                <input
                  type="text"
                  value={temperatureChecked}
                  onChange={(e) =>
                    setTemperatureChecked(e.target.value)
                  }
                  placeholder="Yes / No"
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    marginTop: "6px",
                  }}
                />
                <label style={{ fontSize: "16px", marginTop: "8px" }}>
                  Latest temperature reading
                </label>
                <input
                  type="text"
                  value={temperatureReading}
                  onChange={(e) =>
                    setTemperatureReading(e.target.value)
                  }
                  placeholder="e.g. 101.4"
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    marginTop: "6px",
                  }}
                />
                <select
                  value={temperatureUnit}
                  onChange={(e) =>
                    setTemperatureUnit(e.target.value)
                  }
                  style={{
                    width: "100%",
                    padding: "10px",
                    marginTop: "6px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                  }}
                >
                  <option value="F">°F</option>
                  <option value="C">°C</option>
                </select>
              </div>
            </>
          )}

          <div style={{ marginTop: "12px" }}>
            <h3 style={{ fontSize: "18px", marginBottom: "6px" }}>
              ⚡ How is your energy today?
            </h3>
            <button
              style={optionStyle(energy === "good")}
              onClick={() => setEnergy("good")}
            >
              😊 Good
            </button>
            <button
              style={optionStyle(energy === "tired")}
              onClick={() => setEnergy("tired")}
            >
              😐 Tired
            </button>
            <button
              style={optionStyle(energy === "veryTired")}
              onClick={() => setEnergy("veryTired")}
            >
              😟 Very Tired
            </button>
          </div>

          <div style={{ marginTop: "12px" }}>
            <h3 style={{ fontSize: "18px", marginBottom: "6px" }}>
              🍽 How is your appetite today?
            </h3>
            <button
              style={optionStyle(appetite === "normal")}
              onClick={() => setAppetite("normal")}
            >
              😊 Normal
            </button>
            <button
              style={optionStyle(appetite === "less")}
              onClick={() => setAppetite("less")}
            >
              😐 Less than usual
            </button>
            <button
              style={optionStyle(appetite === "hardly")}
              onClick={() => setAppetite("hardly")}
            >
              😟 Hardly Eating
            </button>
          </div>

          <div style={{ marginTop: "12px" }}>
            <h3 style={{ fontSize: "18px", marginBottom: "6px" }}>
              💧 Did you drink enough water?
            </h3>
            <button
              style={optionStyle(water === "yes")}
              onClick={() => setWater("yes")}
            >
              😊 Yes
            </button>
            <button
              style={optionStyle(water === "no")}
              onClick={() => setWater("no")}
            >
              😟 No
            </button>
            <button
              style={optionStyle(water === "notsure")}
              onClick={() => setWater("notsure")}
            >
              😐 Not Sure
            </button>

            {water === "yes" && (
              <input
                type="number"
                min={1}
                max={10}
                value={waterGlasses}
                onChange={(e) =>
                  setWaterGlasses(e.target.value)
                }
                placeholder="How many glasses?"
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "6px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />
            )}
          </div>

          <button
            onClick={handleNext}
            style={{
              width: "100%",
              marginTop: "16px",
              padding: "12px",
              backgroundColor: "#2563eb",
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