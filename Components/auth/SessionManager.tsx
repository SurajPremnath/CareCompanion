"use client";

import { useEffect, useRef } from "react";

import { authService } from "@/lib/auth/authService";

const INACTIVITY_TIMEOUT =
  15 * 60 * 1000; // 15 minutes

export default function SessionManager() {
  const timerRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(
      async () => {
        try {
          const authenticated =
            await authService.isAuthenticated();

          if (!authenticated) {
            return;
          }

          await authService.logout();

          window.location.replace("/login");
        } catch (error) {
          console.error(
            "Unable to automatically log out.",
            error
          );
        }
      },
      INACTIVITY_TIMEOUT
    );
  };

  useEffect(() => {
    let mounted = true;

    const startSessionTimer =
      async () => {
        const authenticated =
          await authService.isAuthenticated();

        if (!mounted || !authenticated) {
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

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return null;
}