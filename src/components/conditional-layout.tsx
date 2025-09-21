"use client";

import { usePathname } from "next/navigation";
import { VerticalNavbar } from "@/components/vertical-navbar";
import { useNavbar } from "@/contexts/navbar-context";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const { isCollapsed } = useNavbar();
  
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

  // Layout padrão com navbar vertical responsiva para outras páginas
  return (
    <div className="relative flex min-h-screen">
      <VerticalNavbar />
      <main 
        className={`flex-1 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 min-h-screen transition-all duration-300 ease-in-out ${
          isCollapsed ? 'ml-[80px]' : 'ml-[280px]'
        }`}
      >
        <div className="p-6 md:p-8 xl:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}