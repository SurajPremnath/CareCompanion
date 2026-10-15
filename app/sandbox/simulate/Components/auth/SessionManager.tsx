"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { authService } from "@/lib/auth/authService";

const WARNING_TIMEOUT =
  14 * 60 * 1000;

const LOGOUT_AFTER_WARNING =
  60 * 1000;

export default function SessionManager() {
  const warningTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null
    );

  const logoutTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null
    );

const channelRef =
  useRef<BroadcastChannel | null>(null);

  const [showWarning, setShowWarning] =
    useState(false);

  const clearTimers = () => {
    if (warningTimerRef.current) {
      clearTimeout(
        warningTimerRef.current
      );

      warningTimerRef.current = null;
    }

    if (logoutTimerRef.current) {
      clearTimeout(
        logoutTimerRef.current
      );

      logoutTimerRef.current = null;
    }
  };

const resetTimer = () => {
  clearTimers();

  setShowWarning(false);

  warningTimerRef.current =
    setTimeout(() => {
      setShowWarning(true);

      logoutTimerRef.current =
        setTimeout(async () => {
          try {
            const authenticated =
              await authService.isAuthenticated();

            if (!authenticated) {
              return;
            }

            await authService.logout();

            window.location.replace(
              "/login"
            );
          } catch (error) {
            console.error(
              "Unable to automatically log out.",
              error
            );
          }
        }, LOGOUT_AFTER_WARNING);
    }, WARNING_TIMEOUT);
};

  const handleContinueSession =
    () => {
      resetTimer();
    };

useEffect(() => {
  let mounted = true;

  const channel =
    new BroadcastChannel(
      "carevr-session"
    );

  channelRef.current = channel;

  const handleTabMessage = (
    event: MessageEvent
  ) => {
    if (
      event.data?.type !==
      "SESSION_LOGOUT"
    ) {
      return;
    }

    clearTimers();

    setShowWarning(false);

    window.location.replace(
      "/login"
    );
  };

  channel.addEventListener(
    "message",
    handleTabMessage
  );

  const startSessionTimer =
    async () => {
        const authenticated =
          await authService.isAuthenticated();

        if (
          !mounted ||
          !authenticated
        ) {
          return;
        }

        resetTimer();
      };

    const handleActivity = () => {
      resetTimer();
    };

    const events = [
      "mousedown",
      "keydown",
      "touchstart",
      "scroll",
    ];

    events.forEach((event) => {
      window.addEventListener(
        event,
        handleActivity,
        { passive: true }
      );
    });

    startSessionTimer();

return () => {
  mounted = false;

  events.forEach((event) => {
    window.removeEventListener(
      event,
      handleActivity
    );
  });

  channel.removeEventListener(
    "message",
    handleTabMessage
  );

  channel.close();

  channelRef.current = null;

  clearTimers();
};
  }, []);

  if (!showWarning) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor:
          "rgba(0, 0, 0, 0.35)",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          padding: "28px",
          boxShadow:
            "0 20px 50px rgba(0, 0, 0, 0.20)",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            margin: "0 0 12px",
            fontSize: "22px",
            fontWeight: 600,
            color: "#111827",
          }}
        >
          Session Expiring
        </h2>

        <p
          style={{
            margin: "0 0 24px",
            fontSize: "16px",
            lineHeight: 1.6,
            color: "#4b5563",
          }}
        >
          You’ve been inactive for a
          while. For your security,
          you’ll be logged out in 1
          minute.
        </p>

        <button
          type="button"
          onClick={
            handleContinueSession
          }
          style={{
            width: "100%",
            border: "none",
            borderRadius: "10px",
            padding: "13px 18px",
            fontSize: "16px",
            fontWeight: 600,
            cursor: "pointer",
            backgroundColor: "#111827",
            color: "#ffffff",
          }}
        >
          Continue Session
        </button>
      </div>
    </div>
  );
}