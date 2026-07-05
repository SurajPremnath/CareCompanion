"use client";

import {
  useRef,
  useState,
} from "react";

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

export default function FamilyPage5() {
  const router = useRouter();

  const { t } = useLanguage();

const finishProcessingRef =
  useRef(false);

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

  const handleFinish = async () => {
    if (
      !discomfort ||
      !walking ||
      !looseMotions ||
      !confusion
    ) {
      alert(
        t("assessment.alertAllQuestions")
      );
      return;
    }

    if (
      discomfort === "yes" &&
      discomfortAreas.length === 0
    ) {
      alert(
        t("assessment.alertPatientDiscomfortAreas")
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
        t("assessment.alertOtherDiscomfortArea")
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
        t("assessment.alertWalkingHelpNeeded")
      );
      return;
    }

    if (
      looseMotions === "yes" &&
      !looseMotionType
    ) {
      alert(
        t("assessment.alertLooseMotionType")
      );
      return;
    }

if (finishProcessingRef.current) {
  return;
}

finishProcessingRef.current = true;

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

await analyticsService.track({

  module:
    ANALYTICS_MODULES.ASSESSMENT,

  eventName:
    ANALYTICS_EVENTS.PAGE_REACHED,

  context:
    ANALYTICS_CONTEXTS.FAMILY,

  pagePath:
    "/report",

  metadata: {
    page: "REPORT",
  },

});

    router.push("/report");
  };

  return (
    <AssessmentLayout currentPage={5} assessmentType="family">
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

        <h3>
          🤕 {t(
  "assessment.patientDiscomfortToday"
)}
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
          😊 {t("common.no")}
        </button>

        <button
          style={optionStyle(
            discomfort === "yes"
          )}
          onClick={() =>
            setDiscomfort("yes")
          }
        >
          😐 {t("common.yes")}
        </button>

        {discomfort === "yes" && (
          <>
            <div
              style={{
                height: "10px",
              }}
            />

            <h3>
              📍 {t(
  "assessment.patientDiscomfortWhere"
)}
            </h3>

{[
  {
    value: "Head",
    label: t("assessment.areaHead"),
  },
  {
    value: "Eyes",
    label: t("assessment.areaEyes"),
  },
  {
    value: "Ears",
    label: t("assessment.areaEars"),
  },
  {
    value: "Stomach",
    label: t("assessment.areaStomach"),
  },
  {
    value: "Back",
    label: t("assessment.areaBack"),
  },
  {
    value: "Chest",
    label: t("assessment.areaChest"),
  },
  {
    value: "Arms",
    label: t("assessment.areaArms"),
  },
  {
    value: "Legs",
    label: t("assessment.areaLegs"),
  },
  {
    value: "Joints",
    label: t("assessment.areaJoints"),
  },
  {
    value: "Other",
    label: t("assessment.areaOther"),
  },
].map((area) => (
  <button
    key={area.value}
    onClick={() =>
      toggleArea(area.value)
    }
    style={optionStyle(
      discomfortAreas.includes(
        area.value
      )
    )}
  >
    {discomfortAreas.includes(
      area.value
    )
      ? "☑ "
      : "☐ "}
    {area.label}
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
                placeholder={t(
  "dailyCare.pleaseSpecify"
)}
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
          🚶 {t(
  "assessment.patientWalkingToday"
)}
        </h3>

        <button
          style={optionStyle(
            walking === "easy"
          )}
          onClick={() =>
            setWalking("easy")
          }
        >
          😊 {t("assessment.walkedEasily")}
        </button>

        <button
          style={optionStyle(
            walking === "some"
          )}
          onClick={() =>
            setWalking("some")
          }
        >
          😐 {t(
  "assessment.walkingSomeDifficulty"
)}
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
          😟 {t(
  "assessment.walkingVeryDifficult"
)}
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
              🧍 {t(
  "assessment.patientNeedHelpWalking"
)}
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
              😊 {t("common.no")}
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
              😟 {t("common.yes")}
            </button>
          </>
        )}

        <div
          style={{
            height: "12px",
          }}
        />

        <h3>
          🚽 {t(
  "assessment.looseMotionsObserved"
)}
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
          😊 {t("common.no")}
        </button>

        <button
          style={optionStyle(
            looseMotions === "yes"
          )}
          onClick={() =>
            setLooseMotions("yes")
          }
        >
          😟 {t("common.yes")}
        </button>

        {looseMotions === "yes" && (
          <>
            <div
              style={{
                height: "10px",
              }}
            />

            <h3>
              🚽 {t(
  "assessment.looseMotionTypeObserved"
)}
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
              💧 {t(
  "assessment.looseMotionWatery"
)}
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
              😐 {t(
  "assessment.looseMotionSticky"
)}
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
              🤔 {t("assessment.notSure")}
            </button>
          </>
        )}

        <div
          style={{
            height: "12px",
          }}
        />

        <h3>
          🧠 {t(
  "assessment.patientConfusedToday"
)}
        </h3>

        <button
          style={optionStyle(
            confusion === "no"
          )}
          onClick={() =>
            setConfusion("no")
          }
        >
          😊 {t("common.no")}
        </button>

        <button
          style={optionStyle(
            confusion === "yes"
          )}
          onClick={() =>
            setConfusion("yes")
          }
        >
          😟 {t("common.yes")}
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
            ← {t("assessment.previous")}
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
            {t("assessment.finishAssessment")} ✓
          </button>
        </div>
      </div>
    </AssessmentLayout>
  );
}
