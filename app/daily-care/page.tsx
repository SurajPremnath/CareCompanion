"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { authService } from "@/lib/auth/authService";

import DailyCareForm from "./components/DailyCareForm";

export default function DailyCarePage() {

  const router = useRouter();

  //------------------------------------------------------------
  // Page State
  //------------------------------------------------------------

  const [loading, setLoading] =
    useState(true);

  const [currentUserName, setCurrentUserName] =
    useState("");

  //------------------------------------------------------------
  // Authentication
  //------------------------------------------------------------

  useEffect(() => {

    const loadUser = async () => {

      try {

        const user =
          await authService.getCurrentUser();

        if (!user) {

          router.replace("/login");

          return;

        }

        setCurrentUserName(

          user.user_metadata?.full_name ??

          user.email ??

          "User"

        );

      }
      catch {

        router.replace("/login");

        return;

      }
      finally {

        setLoading(false);

      }

    };

    loadUser();

  }, [router]);

  //------------------------------------------------------------
  // Loading Screen
  //------------------------------------------------------------

  if (loading) {

    return (

      <main style={loadingContainer}>

        <h2>

          Loading...

        </h2>

      </main>

    );

  }

  //------------------------------------------------------------
  // Page
  //------------------------------------------------------------

  return (

    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "24px",
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >

      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: "16px",
          padding: "32px",
          border: "1px solid #d1d5db",
          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
        }}
      >

        <h1
          style={{
            fontSize: "40px",
            marginBottom: "8px",
          }}
        >
          ❤️ CareCompanion
        </h1>

        <h2
          style={{
            marginBottom: "10px",
          }}
        >
          Daily Care
        </h2>

        <p
          style={{
            color: "#6b7280",
            marginBottom: "28px",
          }}
        >
          Welcome <strong>{currentUserName}</strong>
        </p>

        <hr
          style={{
            marginBottom: "30px",
          }}
        />

        <DailyCareForm />

      </div>

    </main>

  );

}

const loadingContainer: React.CSSProperties = {

  minHeight: "100vh",

  display: "flex",

  justifyContent: "center",

  alignItems: "center",

  background: "#f8fafc",

  fontFamily: "Inter, Arial, sans-serif",

};