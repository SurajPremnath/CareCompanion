"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  name: string;
  age: number;
  username: string;
  password: string;
  createdAt: string;
};

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const loggedInUser =
      localStorage.getItem("loggedInUser");

    if (loggedInUser) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleLogin = () => {
    const trimmedUsername =
      username.trim().toLowerCase();

    if (!trimmedUsername || !password) {
      alert("Please enter username and password.");
      return;
    }

    const users: User[] = JSON.parse(
      localStorage.getItem("users") || "[]"
    );

    const matchedUser = users.find(
      (user) =>
        user.username.toLowerCase() ===
          trimmedUsername &&
        user.password === password
    );

    if (!matchedUser) {
      alert("Invalid username or password.");
      return;
    }

    const loggedInUser = {
      id: matchedUser.id,
      name: matchedUser.name,
      age: matchedUser.age,
      username: matchedUser.username,
      createdAt: matchedUser.createdAt,
    };

    localStorage.setItem(
      "loggedInUser",
      JSON.stringify(loggedInUser)
    );

    router.push("/dashboard");
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily:
          "Inter, Arial, sans-serif",
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
          Login
        </h2>

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

        <button
          onClick={handleLogin}
          style={buttonStyle}
        >
          Login
        </button>

        <button
          onClick={() =>
            router.push("/register")
          }
          style={secondaryButtonStyle}
        >
          Create New Account
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