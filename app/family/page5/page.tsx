"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AssessmentLayout from "@/Components/AssessmentLayout";

export default function FamilyPage5() {
  const router = useRouter();

  const [discomfort, setDiscomfort] =
    useState("");

  const [
    discomfortAreas,
    setDiscomfortAreas,
  ] = useState<string[]>([]);

  const [otherDiscomfortArea, setOtherDiscomfortArea] =
    useState("");

  const [walking, setWalking] =
    useState("");

  const [walkingHelp, setWalkingHelp] =
    useState("");

  const [looseMotions, setLooseMotions] =
    useState("");

  const [
    looseMotionType,
    setLooseMotionType,
  ] = useState("");

  const [confusion, setConfusion] =
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

  const handleFinish = () => {
    if (
      !discomfort ||
      !walking ||
      !looseMotions ||
      !confusion
    ) {
      alert(
        "Please answer all questions."
      );
      return;
    }

    if (
      discomfort === "yes" &&
      discomfortAreas.length === 0
    ) {
      alert(
        "Please select where the patient felt discomfort."
      );
      return;
    }

    if (
      discomfortAreas.includes(
        "Other"
      ) &&
      !otherDiscomfortArea.trim()
    ) {
      alert(
        "Please specify the other discomfort area."
      );
      return;
    }

    if (
      (walking === "some" ||
        walking ===
          "difficult") &&
      !walkingHelp
    ) {
      alert(
        "Please indicate whether help was needed."
      );
      return;
    }

    if (
      looseMotions === "yes" &&
      !looseMotionType
    ) {
      alert(
        "Please select the loose motion type."
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
      "otherDiscomfortArea",
      otherDiscomfortArea
    );

    localStorage.setItem(
      "walking",
      walking
    );

    localStorage.setItem(
      "walkingHelp",
      walkingHelp
    );

    localStorage.setItem(
      "looseMotions",
      looseMotions
    );

    localStorage.setItem(
      "looseMotionType",
      looseMotionType
    );

    localStorage.setItem(
      "confusion",
      confusion
    );

    router.push("/report");
  };

  return (
    <AssessmentLayout currentPage={4}>
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

        <h3>
          🤕 Did the patient feel any
          discomfort today?
        </h3>

        <button
          style={optionStyle(
            discomfort === "no"
          )}
          onClick={() => {
            setDiscomfort("no");
            setDiscomfortAreas([]);
            setOtherDiscomfortArea(
              ""
            );
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
          😐 Yes
        </button>

        {discomfort === "yes" && (
          <>
            <div
              style={{
                height: "10px",
              }}
            />

            <h3>
              📍 Where did the patient
              feel discomfort?
            </h3>

            {[
              "Head",
              "Eyes",
              "Ears",
              "Stomach",
              "Back",
              "Chest",
              "Arms",
              "Legs",
              "Joints",
              "Other",
            ].map((area) => (
              <button
                key={area}
                onClick={() =>
                  toggleArea(area)
                }
                style={optionStyle(
                  discomfortAreas.includes(
                    area
                  )
                )}
              >
                {discomfortAreas.includes(
                  area
                )
                  ? "☑ "
                  : "☐ "}
                {area}
              </button>
            ))}

            {discomfortAreas.includes(
              "Other"
            ) && (
              <input
                type="text"
                value={
                  otherDiscomfortArea
                }
                onChange={(e) =>
                  setOtherDiscomfortArea(
                    e.target.value
                  )
                }
                placeholder="Please specify"
                style={{
                  width: "100%",
                  padding: "12px",
                  marginTop: "10px",
                  border:
                    "1px solid #ccc",
                  borderRadius:
                    "10px",
                  boxSizing:
                    "border-box",
                }}
              />
            )}
          </>
        )}

        <div
          style={{
            height: "12px",
          }}
        />

        <h3>
          🚶 How was the patient's
          walking today?
        </h3>

        <button
          style={optionStyle(
            walking === "easy"
          )}
          onClick={() =>
            setWalking("easy")
          }
        >
          😊 Walked Easily
        </button>

        <button
          style={optionStyle(
            walking === "some"
          )}
          onClick={() =>
            setWalking("some")
          }
        >
          😐 Some Difficulty
        </button>

        <button
          style={optionStyle(
            walking ===
              "difficult"
          )}
          onClick={() =>
            setWalking(
              "difficult"
            )
          }
        >
          😟 Very Difficult
        </button>

        {(walking === "some" ||
          walking ===
            "difficult") && (
          <>
            <div
              style={{
                height: "10px",
              }}
            />

            <h3>
              🧍 Did the patient need
              help walking?
            </h3>

            <button
              style={optionStyle(
                walkingHelp ===
                  "no"
              )}
              onClick={() =>
                setWalkingHelp(
                  "no"
                )
              }
            >
              😊 No
            </button>

            <button
              style={optionStyle(
                walkingHelp ===
                  "yes"
              )}
              onClick={() =>
                setWalkingHelp(
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
            height: "12px",
          }}
        />

        <h3>
          🚽 Were loose motions
          observed?
        </h3>

        <button
          style={optionStyle(
            looseMotions === "no"
          )}
          onClick={() => {
            setLooseMotions("no");
            setLooseMotionType("");
          }}
        >
          😊 No
        </button>

        <button
          style={optionStyle(
            looseMotions === "yes"
          )}
          onClick={() =>
            setLooseMotions("yes")
          }
        >
          😟 Yes
        </button>

        {looseMotions === "yes" && (
          <>
            <div
              style={{
                height: "10px",
              }}
            />

            <h3>
              🚽 What type of loose
              motions were observed?
            </h3>

            <button
              style={optionStyle(
                looseMotionType ===
                  "watery"
              )}
              onClick={() =>
                setLooseMotionType(
                  "watery"
                )
              }
            >
              💧 Watery
            </button>

            <button
              style={optionStyle(
                looseMotionType ===
                  "sticky"
              )}
              onClick={() =>
                setLooseMotionType(
                  "sticky"
                )
              }
            >
              😐 Sticky
            </button>

            <button
              style={optionStyle(
                looseMotionType ===
                  "notsure"
              )}
              onClick={() =>
                setLooseMotionType(
                  "notsure"
                )
              }
            >
              🤔 Not Sure
            </button>
          </>
        )}

        <div
          style={{
            height: "12px",
          }}
        />

        <h3>
          🧠 Did the patient seem
          unusually confused today?
        </h3>

        <button
          style={optionStyle(
            confusion === "no"
          )}
          onClick={() =>
            setConfusion("no")
          }
        >
          😊 No
        </button>

        <button
          style={optionStyle(
            confusion === "yes"
          )}
          onClick={() =>
            setConfusion("yes")
          }
        >
          😟 Yes
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
                "/family/page4"
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
              handleFinish
            }
            style={{
              flex: 1,
              padding: "12px",
              backgroundColor:
                "#16a34a",
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
            Finish Assessment ✓
          </button>
        </div>
      </div>
    </AssessmentLayout>
  );
}