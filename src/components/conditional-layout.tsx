"use client";

import { usePathname } from "next/navigation";
import { AppHeader } from "@/components/app-header";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  
  // Páginas que não devem mostrar o header
  const authPages = ['/login', '/register'];
  const isAuthPage = authPages.includes(pathname);

  if (isAuthPage) {
    // Layout simples para páginas de autenticação
    return (
      <div className="min-h-screen bg-background">
        {children}
      </div>
    );
  }

  // Layout padrão com header para outras páginas
  return (
    <div className="relative flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1 w-full px-6 md:px-8 xl:px-16 2xl:px-24 py-4">
        {children}
      </main>
    </div>
  );
}