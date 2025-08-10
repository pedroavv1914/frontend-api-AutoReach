"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PlusCircle, Users, Bell, Menu, X, LayoutGrid, FileText, Gauge } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

export function AppHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const nav = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/posts", label: "Posts" },
    { href: "/posts/new", label: "Novo Post" },
    { href: "/accounts", label: "Contas" },
    { href: "/diagnostics/twitter", label: "Diagnostics" },
  ];

  return (
    <header className={`sticky top-0 z-40 w-full border-b bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/50 transition-shadow ${scrolled ? "shadow-sm" : ""}`}>
      <div className="w-full px-6 py-3 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Abrir menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <Link href="/" className="font-semibold tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">AutoReach</span>
          </Link>
        </div>
      <div className="h-[2px] w-full bg-gradient-to-r from-blue-600/60 via-violet-600/60 to-fuchsia-600/60" />

        <nav className="hidden md:flex items-center gap-1 text-sm">
          {nav.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3 py-1.5 rounded-md transition-colors hover:bg-accent/40 ${active ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                <span className="inline-flex items-center gap-2">
                  {item.label === "Dashboard" && <Gauge className="h-3.5 w-3.5" />}
                  {item.label === "Posts" && <FileText className="h-3.5 w-3.5" />}
                  {item.label === "Novo Post" && <PlusCircle className="h-3.5 w-3.5" />}
                  {item.label === "Contas" && <Users className="h-3.5 w-3.5" />}
                  {item.label === "Diagnostics" && <LayoutGrid className="h-3.5 w-3.5" />}
                  <span>{item.label}</span>
                </span>
                <span className={`pointer-events-none absolute left-3 right-3 -bottom-0.5 h-[2px] rounded-full transition-opacity ${active ? "opacity-100 bg-gradient-to-r from-blue-600 via-violet-600 to-fuchsia-600" : "opacity-0"}`} />
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden lg:flex items-center mr-2">
            <div className="relative">
              <Input placeholder="Buscar..." className="h-9 w-56 pr-10" />
              <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">/</kbd>
            </div>
          </div>
          <Button variant="ghost" size="icon" aria-label="Notificações" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-fuchsia-600" />
          </Button>
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href="/accounts"><Users className="h-4 w-4 mr-2" />Contas</Link>
          </Button>
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-fuchsia-600 opacity-90" />
          <Button asChild>
            <Link href="/posts/new"><PlusCircle className="h-4 w-4 mr-2" />Novo Post</Link>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="w-full px-6 py-3 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Input placeholder="Buscar..." className="h-9 pr-10" />
                <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">/</kbd>
              </div>
              <Button asChild variant="outline" className="ml-auto">
                <Link href="/posts/new"><PlusCircle className="h-4 w-4 mr-2" />Novo Post</Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {nav.map((item) => {
                const active = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
                return (
                  <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                    className={`px-3 py-2 rounded-md text-sm border flex items-center gap-2 ${active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                    {item.label === "Dashboard" && <Gauge className="h-3.5 w-3.5" />}
                    {item.label === "Posts" && <FileText className="h-3.5 w-3.5" />}
                    {item.label === "Novo Post" && <PlusCircle className="h-3.5 w-3.5" />}
                    {item.label === "Contas" && <Users className="h-3.5 w-3.5" />}
                    {item.label === "Diagnostics" && <LayoutGrid className="h-3.5 w-3.5" />}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
