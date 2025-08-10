"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    window.location.replace(token ? "/dashboard" : "/login");
  }, []);

  return null;
}
