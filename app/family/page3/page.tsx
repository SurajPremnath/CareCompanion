"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AssessmentLayout from "@/Components/AssessmentLayout";

import {
  useLanguage,
} from "@/Components/language/LanguageProvider";

import {
  analyticsService,
} from "@/lib/analytics/analyticsService";

import {
  ANALYTICS_MODULES,
  ANALYTICS_EVENTS,
  ANALYTICS_CONTEXTS,
} from "@/lib/analytics/analyticsEvents";

export default function FamilyPage3() {
  const router = useRouter();

const {
  t,
} = useLanguage();

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
        t("assessment.alertAllQuestions")
      );
      return;
    }

    if (
      fever === "yes" &&
      !temperatureChecked
    ) {
      alert(
        t("assessment.alertTemperatureMeasured")
      );
      return;
    }

    if (
      fever === "yes" &&
      temperatureChecked === "yes" &&
      !temperatureReading
    ) {
      alert(
        t("assessment.alertTemperatureReading")
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

void analyticsService
  .track({

    module:
      ANALYTICS_MODULES.ASSESSMENT,

    eventName:
      ANALYTICS_EVENTS.PAGE_REACHED,

    context:
      ANALYTICS_CONTEXTS.FAMILY,

    pagePath:
      "/family/page4",

    metadata: {
      page: 4,
    },

  })
  .catch(() => {
    // Analytics must not block assessment navigation
  });

router.push(
  "/family/page4"
);
  };

  return (
    <AssessmentLayout currentPage={3} assessmentType="family">
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
          {t("assessment.healthCheckToday")}
        </h2>

        <hr />

        <h3
          style={{
            fontSize: "18px",
            marginBottom: "6px",
          }}
        >
          🌡️ {t(
  "assessment.patientFeverishToday"
)}
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
          😊 {t("common.no")}
        </button>

        <button
          style={optionStyle(
            fever === "yes"
          )}
          onClick={() =>
            setFever("yes")
          }
        >
          😟 {t("common.yes")}
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
              🌡️ {t(
  "assessment.temperatureMeasured"
)}
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
              😊 {t("common.yes")}
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
              😐 {t("common.no")}
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
                    placeholder={t(
  "assessment.enterLatestTemperature"
)}
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
          ⚡ {t(
  "assessment.patientEnergyToday"
)}
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
            😊 {t(
  "assessment.energyActive"
)}
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
          😐 {t(
  "assessment.energyLessActive"
)}
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
          😟 {t(
  "assessment.energyVeryWeak"
)}
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
            ← {t("assessment.previous")}
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
            {t("assessment.next")} →
          </button>
        </div>
      </div>
    </AssessmentLayout>
  );
}
