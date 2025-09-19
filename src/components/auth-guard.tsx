"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers";
import { Spinner } from "@/components/ui/spinner";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Mostra loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-muted/20">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="xl" variant="gradient" />
          <p className="text-sm text-muted-foreground animate-pulse">
            Verificando autenticação...
          </p>
        </div>
      </div>
    );
  }

  // Só renderiza children se estiver autenticado
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
