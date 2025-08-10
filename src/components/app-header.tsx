"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function AppHeader() {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAuthed(!!localStorage.getItem("auth_token"));
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("auth_token");
    window.location.href = "/login";
  }

  return (
    <header className="w-full border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link href="/" className="font-semibold">AutoReach</Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          <Link href="/posts" className="hover:underline">Posts</Link>
          <Link href="/posts/new" className="hover:underline">Novo Post</Link>
          <Link href="/accounts" className="hover:underline">Contas</Link>
          <Link href="/diagnostics/twitter" className="hover:underline">Diagnostics</Link>
        </nav>
        <div className="ml-auto">
          {authed ? (
            <Button variant="outline" size="sm" onClick={handleLogout}>Sair</Button>
          ) : (
            <Link href="/login"><Button size="sm">Entrar</Button></Link>
          )}
        </div>
      </div>
    </header>
  );
}
