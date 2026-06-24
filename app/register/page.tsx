"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  name: string;
  age: number;
  username: string;
  password: string;
  createdAt: string;
};

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const handleRegister = () => {
    const trimmedName = name.trim();
    const trimmedUsername =
      username.trim().toLowerCase();

    // Required fields

    if (
      !trimmedName ||
      !age ||
      !trimmedUsername ||
      !password ||
      !confirmPassword
    ) {
      alert("Please complete all fields.");
      return;
    }

    // Age validation

    const ageNumber = Number(age);

    if (
      Number.isNaN(ageNumber) ||
      ageNumber < 1 ||
      ageNumber > 120
    ) {
      alert(
        "Please enter a valid age between 1 and 120."
      );
      return;
    }

    // Username validation

    if (trimmedUsername.length < 4) {
      alert(
        "Username must be at least 4 characters long."
      );
      return;
    }

    // Password validation

    if (password.length < 6) {
      alert(
        "Password must be at least 6 characters long."
      );
      return;
    }

    // Confirm password validation

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // Existing users

    const users: User[] = JSON.parse(
      localStorage.getItem("users") || "[]"
    );

    // Duplicate username check

    const existingUser = users.find(
      (user) =>
        user.username.toLowerCase() ===
        trimmedUsername
    );

    if (existingUser) {
      alert(
        "Username already exists. Please choose another username."
      );
      return;
    }

    // Create user

    const newUser: User = {
      id: `U${Date.now()}`,
      name: trimmedName,
      age: ageNumber,
      username: trimmedUsername,
      password,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);

    localStorage.setItem(
      "users",
      JSON.stringify(users)
    );

    alert(
      "Account created successfully. Please login."
    );

    router.push("/login");
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "20px",
        fontFamily:
          "Inter, Arial, sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "650px",
          background: "#ffffff",
          padding: "32px",
          borderRadius: "16px",
          border: "1px solid #d1d5db",
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <h1
          style={{
            fontSize: "42px",
            marginBottom: "10px",
          }}
        >
          ❤️ CareCompanion
        </h1>

        <h2
          style={{
            marginBottom: "24px",
          }}
        >
          Create Account
        </h2>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          style={inputStyle}
        />

        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) =>
            setAge(e.target.value)
          }
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <button
          onClick={handleRegister}
          style={buttonStyle}
        >
          Create Account
        </button>

        <button
          onClick={() =>
            router.push("/login")
          }
          style={secondaryButtonStyle}
        >
          Already have an account? Login
        </button>

        <div
          style={{
            marginTop: "24px",
            textAlign: "center",
            fontSize: "12px",
            color: "#6b7280",
          }}
        >
          Created by Suraj Premnath
        </div>
      </div>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px",
  marginBottom: "14px",
  border: "1px solid #d1d5db",
  borderRadius: "10px",
  fontSize: "16px",
};

const buttonStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "10px",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "16px",
};

const secondaryButtonStyle: React.CSSProperties =
{
  width: "100%",
  padding: "14px",
  marginTop: "12px",
  background: "#ffffff",
  color: "#2563eb",
  border: "1px solid #2563eb",
  borderRadius: "10px",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "16px",
};