"use client";

import { useEffect } from "react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        window.location.href = "/login";
      }
    }
  }, []);

  return <>{children}</>;
}
