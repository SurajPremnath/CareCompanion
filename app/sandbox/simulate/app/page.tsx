"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const loggedInUser =
      localStorage.getItem("loggedInUser");

    if (loggedInUser) {
      router.replace("sandbox/simulate/app/dashboard");
    } else {
      router.replace("sandbox/simulate/app/dashboard");
    }
  }, [router]);

  return null;
}