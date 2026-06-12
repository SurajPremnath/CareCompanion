"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/Components/Header";

export default function Page5() {
  const router = useRouter();

  const [walking, setWalking] =
    useState("");

  const [walkingHelp, setWalkingHelp] =
    useState("");

  const [looseMotions, setLooseMotions] =
    useState("");

  const [looseMotionType, setLooseMotionType] =
    useState("");

  useEffect(() => {
    setWalking(
      localStorage.getItem("walking") || ""
    );

    setWalkingHelp(
      localStorage.getItem(
        "walkingHelp"
      ) || ""
    );

    setLooseMotions(
      localStorage.getItem(
        "looseMotions"
      ) || ""
    );

    setLooseMotionType(
      localStorage.getItem(
        "looseMotionType"
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

  const showWalkingHelp =
    walking === "some" ||
    walking === "difficult";

  const showLooseMotionType =
    looseMotions === "yes";

  const handleFinish = () => {
    if (!walking || !looseMotions) {
      alert(
        "Please answer all questions."
      );
      return;
    }

    if (
      showWalkingHelp &&
      !walkingHelp
    ) {
      alert(
        "Please answer whether you needed help walking."
      );
      return;
    }

    if (
      showLooseMotionType &&
      !looseMotionType
    ) {
      alert(
        "Please select the type of loose motions."
      );
      return;
    }

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

    router.push("/report");
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
        <Header currentPage={5} />

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
            🚶 Are you able to walk
            today?
          </h3>

          <button
            style={optionStyle(
              walking === "easy"
            )}
            onClick={() => {
              setWalking("easy");
              setWalkingHelp("");
            }}
          >
            😊 Easily
          </button>

          <button
            style={optionStyle(
              walking === "some"
            )}
            onClick={() =>
              setWalking("some")
            }
          >
            😐 With Some Difficulty
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

          {showWalkingHelp && (
            <>
              <div
                style={{
                  height: "12px",
                }}
              />

              <h3>
                🧍 Did you need help
                walking today?
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
            🚽 Have you had loose
            motions today?
          </h3>

          <button
            style={optionStyle(
              looseMotions ===
                "no"
            )}
            onClick={() => {
              setLooseMotions(
                "no"
              );
              setLooseMotionType(
                ""
              );
            }}
          >
            😊 No
          </button>

          <button
            style={optionStyle(
              looseMotions ===
                "yes"
            )}
            onClick={() =>
              setLooseMotions(
                "yes"
              )
            }
          >
            😟 Yes
          </button>

          {showLooseMotionType && (
            <>
              <div
                style={{
                  height: "12px",
                }}
              />

              <h3>
                🚽 What type of loose
                motions?
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
              display: "flex",
              gap: "10px",
              marginTop: "16px",
            }}
          >
            <button
              onClick={() =>
                router.push(
                  "/self/page4"
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
                cursor: "pointer",
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
      </div>
    </main>
  );
}