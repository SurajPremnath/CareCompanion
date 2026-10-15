"use client";

import AppHeader from "@/app/components/AppHeader";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { authService } from "@/lib/auth/authService";

import { selfProfileStorage } from "@/lib/storage/SelfProfileStorage";
import { AppAlert } from "@/lib/utils/appAlert";

export default function SelfProfilePage() {

const router = useRouter();

const [loading, setLoading] =
  useState(true);

const [currentUserName, setCurrentUserName] =
  useState("");

const [currentUserEmail, setCurrentUserEmail] =
  useState("");

const [dateOfBirth, setDateOfBirth] =
  useState("");

const [saving, setSaving] =
  useState(false);

//------------------------------------------------------
// Save Profile
//------------------------------------------------------

const handleSaveProfile =
  async () => {

    if (saving) {

      return;

    }

    if (!dateOfBirth) {

      AppAlert.warning(
        "Please select your Date of Birth."
      );

      return;

    }

    setSaving(true);

    try {

      const result =
        await selfProfileStorage.saveProfile({

          dateOfBirth,

          isCompleted: true

        });

        if (!result.success) {

          AppAlert.error(

            result.error ??

            "Unable to save your profile."

          );

          return;

        }

        AppAlert.success(

          "Personal Health Profile created successfully."

        );

router.push("/daily-care?mode=self");

    }
    catch {

      AppAlert.error(

        "Something went wrong while saving your profile."

      );

    }
    finally {

      setSaving(false);

    }

};

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

        "User"

      );

      setCurrentUserEmail(

        user.email ??

        ""

      );

//------------------------------------------------------
// Load Existing Self Profile
//------------------------------------------------------

const profileResult =
  await selfProfileStorage.getProfile();

if (profileResult.success && profileResult.data) {

  setDateOfBirth(
    profileResult.data.dateOfBirth ?? ""
  );

}

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

if (loading) {

  return (

    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f8fafc"
      }}
    >

      <h2>Loading...</h2>

    </main>

  );

}

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
          maxWidth: "760px",
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: "16px",
          padding: "32px",
          border: "1px solid #d1d5db",
          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
        }}
      >

<AppHeader
  pageTitle="My Health Profile"
  pageIcon="🧍"
  currentUserName={currentUserName}
/>

<p
  style={{
    color: "#6b7280",
    lineHeight: 1.7,
    fontSize: "16px",
    marginBottom: "28px",
  }}
>
  This is a one-time setup.

  <br />
  <br />

  Your Name and Email are taken from your CareVR account.

  <br />

  Please provide your Date of Birth to complete
  your Personal Health Profile.
</p>

<label style={labelStyle}>
  Name
</label>

<input
  type="text"
  value={currentUserName}
  readOnly
  style={{
    ...inputStyle,
    background: "#f9fafb",
    color: "#6b7280",
  }}
/>

<label style={labelStyle}>
  Email
</label>

<input
  type="email"
  value={currentUserEmail}
  readOnly
  style={{
    ...inputStyle,
    background: "#f9fafb",
    color: "#6b7280",
  }}
/>

<label style={labelStyle}>
  Date of Birth *
</label>

<input
  type="date"
  value={dateOfBirth}
  onChange={(e) =>
    setDateOfBirth(e.target.value)
  }
  style={inputStyle}
/>

<button
  onClick={handleSaveProfile}
  disabled={saving}
  style={{
    ...primaryButton,
    opacity: saving ? 0.7 : 1,
    cursor: saving ? "not-allowed" : "pointer",
  }}
>
  {saving
    ? "Saving..."
    : "💾 Complete Setup"}
</button>

<button
  onClick={() =>
    router.push("/dashboard")
  }
  disabled={saving}
  style={secondaryButton}
>
  ← Back to Dashboard
</button>

      </div>

    </main>

  );

}

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "8px",
  marginTop: "18px",
  fontWeight: 600,
  color: "#111827",
  fontSize: "15px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px",
  border: "1px solid #d1d5db",
  borderRadius: "10px",
  fontSize: "16px",
  boxSizing: "border-box",
  marginBottom: "8px",
  background: "#ffffff",
};

const primaryButton: React.CSSProperties = {
  width: "100%",
  padding: "14px",
  marginTop: "30px",
  background: "#2563eb",
  color: "#ffffff",
  border: "none",
  borderRadius: "10px",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer",
};

const secondaryButton: React.CSSProperties = {
  width: "100%",
  padding: "14px",
  marginTop: "12px",
  background: "#ffffff",
  color: "#111827",
  border: "1px solid #d1d5db",
  borderRadius: "10px",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer",
};