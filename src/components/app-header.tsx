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

  const crumbs = (() => {
    const segs = (pathname || "/").split("/").filter(Boolean);
    const nice = (s: string) => s.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
    const paths: { href: string; label: string }[] = [];
    let acc = "";
    for (const s of segs) {
      acc += "/" + s;
      paths.push({ href: acc, label: nice(s) });
    }
    return paths;
  })();

  return (
    <header className={`sticky top-0 z-40 w-full border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-shadow ${scrolled ? "shadow-sm" : ""}`}>
      <div className="w-full px-6 py-3 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Abrir menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <Link href="/" className="font-semibold tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">AutoReach</span>
          </Link>
        </div>

        {/* Primary nav as pill group */}
        <nav className="hidden md:flex items-center gap-1 text-sm rounded-full border bg-background/60 p-1 shadow-sm">
          {nav.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3 py-1.5 rounded-full transition-colors ${active ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                <span className="inline-flex items-center gap-2">
                  {item.label === "Dashboard" && <Gauge className="h-3.5 w-3.5" />}
                  {item.label === "Posts" && <FileText className="h-3.5 w-3.5" />}
                  {item.label === "Novo Post" && <PlusCircle className="h-3.5 w-3.5" />}
                  {item.label === "Contas" && <Users className="h-3.5 w-3.5" />}
                  {item.label === "Diagnostics" && <LayoutGrid className="h-3.5 w-3.5" />}
                  <span>{item.label}</span>
                </span>
                {active && (
                  <span className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-blue-600/10 via-violet-600/10 to-fuchsia-600/10 ring-1 ring-border" />
                )}
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

      {/* Sub-header: breadcrumbs and quick actions (desktop) */}
      <div className="hidden md:block border-t bg-background/60">
        <div className="w-full px-6 py-2 flex items-center justify-between">
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            {crumbs.length > 0 && <span>/</span>}
            {crumbs.map((c, i) => (
              <span key={c.href} className="flex items-center gap-2">
                <Link href={c.href} className={`hover:text-foreground transition-colors ${i === crumbs.length - 1 ? "text-foreground" : ""}`}>{c.label}</Link>
                {i < crumbs.length - 1 && <span>/</span>}
              </span>
            ))}
          </div>
          {pathname !== "/dashboard" && (
            <div className="flex items-center gap-2">
              <Button asChild size="sm" variant="outline"><Link href="/accounts">Gerenciar contas</Link></Button>
              <Button asChild size="sm"><Link href="/posts/new">Novo Post</Link></Button>
            </div>
          )}
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
