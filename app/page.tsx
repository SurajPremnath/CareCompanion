"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const today = new Date();

  const formattedDate = today.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  const resetAssessment = () => {
    localStorage.clear();
  };

  const startSelf = () => {
    resetAssessment();

    localStorage.setItem(
      "assessmentType",
      "self"
    );

    router.push("/checkin");
  };

  const startFamily = () => {
    resetAssessment();

    localStorage.setItem(
      "assessmentType",
      "family"
    );

    router.push("/checkin");
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f8fafc",
        padding: "20px",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "700px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "46px",
            marginBottom: "10px",
          }}
        >
          ❤️ CareCompanion
        </h1>

        <p
          style={{
            color: "#666",
            marginBottom: "10px",
          }}
        >
          A simple daily health companion
          for the people you love.
        </p>

        <p
          style={{
            fontSize: "18px",
            marginBottom: "20px",
          }}
        >
          Let's spend one minute checking
          your health.
        </p>

        <div
          style={{
            marginBottom: "30px",
            fontSize: "18px",
          }}
        >
          📅 {formattedDate}
        </div>

        <div
          style={{
            background: "white",
            borderRadius: "16px",
            border: "1px solid #ddd",
            padding: "30px",
          }}
        >
          <h2
            style={{
              marginBottom: "25px",
            }}
          >
            Who is completing today's health
            check?
          </h2>

          <button
            onClick={startSelf}
            style={{
              width: "100%",
              padding: "20px",
              marginBottom: "15px",
              borderRadius: "12px",
              border: "1px solid #ddd",
              background: "white",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <div
              style={{
                fontSize: "28px",
                fontWeight: "bold",
              }}
            >
              👤 Myself
            </div>

            <div
              style={{
                color: "#666",
                marginTop: "5px",
              }}
            >
              Answer questions about how I
              feel today.
            </div>
          </button>

          <button
            onClick={startFamily}
            style={{
              width: "100%",
              padding: "20px",
              borderRadius: "12px",
              border: "1px solid #ddd",
              background: "white",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <div
              style={{
                fontSize: "28px",
                fontWeight: "bold",
              }}
            >
              👨‍👩‍👧‍👦 Family Member
            </div>

            <div
              style={{
                color: "#666",
                marginTop: "5px",
              }}
            >
              Answer questions based on what
              I observed today.
            </div>
          </button>
        </div>
      </div>
    </main>
  );
}
