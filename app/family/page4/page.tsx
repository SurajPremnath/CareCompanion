"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AssessmentLayout from "@/Components/AssessmentLayout";

export default function FamilyPage4() {
  const router = useRouter();

  const [appetite, setAppetite] =
    useState("");

  const [water, setWater] =
    useState("");

  const [
    waterGlasses,
    setWaterGlasses,
  ] = useState("");

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
    if (!appetite || !water) {
      alert(
        "Please answer all questions."
      );
      return;
    }

    if (
      water === "yes" &&
      !waterGlasses
    ) {
      alert(
        "Please select approximately how many glasses of water were consumed."
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

    router.push("/family/page5");
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
          🍽️ How was the patient's
          eating today?
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
            appetite === "hardly"
          )}
          onClick={() =>
            setAppetite("hardly")
          }
        >
          😟 Hardly Eating
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
          💧 Did the patient drink
          enough water today?
        </h3>

        <button
          style={optionStyle(
            water === "yes"
          )}
          onClick={() => {
            setWater("yes");
          }}
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
              🥤 Approximately how
              many glasses of water
              did the patient drink?
            </h3>

            <button
              style={optionStyle(
                waterGlasses === "1"
              )}
              onClick={() =>
                setWaterGlasses("1")
              }
            >
              1 Glass
            </button>

            <button
              style={optionStyle(
                waterGlasses === "2"
              )}
              onClick={() =>
                setWaterGlasses("2")
              }
            >
              2 Glasses
            </button>

            <button
              style={optionStyle(
                waterGlasses === "3"
              )}
              onClick={() =>
                setWaterGlasses("3")
              }
            >
              3 Glasses
            </button>

            <button
              style={optionStyle(
                waterGlasses === "4"
              )}
              onClick={() =>
                setWaterGlasses("4")
              }
            >
              4 Glasses
            </button>

            <button
              style={optionStyle(
                waterGlasses === "5+"
              )}
              onClick={() =>
                setWaterGlasses("5+")
              }
            >
              5+ Glasses
            </button>
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
                "/family/page3"
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
    </AssessmentLayout>
  );
}
