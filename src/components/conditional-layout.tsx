"use client";

import { usePathname } from "next/navigation";
import { VerticalNavbar } from "@/components/vertical-navbar";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  
  // Páginas que não devem mostrar a navbar
  const authPages = ['/login', '/register'];
  const isAuthPage = authPages.includes(pathname);

  if (isAuthPage) {
    // Layout simples para páginas de autenticação
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        {children}
      </div>
    );
  }

  // Layout padrão com navbar vertical para outras páginas
  return (
    <div className="relative flex min-h-screen">
      <VerticalNavbar />
      <main className="flex-1 ml-[280px] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 min-h-screen">
        <div className="p-6 md:p-8 xl:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}