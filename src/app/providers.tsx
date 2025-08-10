"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

let queryClient: QueryClient | null = null;

export function Providers({ children }: { children: React.ReactNode }) {
  // Evita recriar o client em hot reload
  if (!queryClient) queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
