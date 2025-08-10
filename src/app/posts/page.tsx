"use client";

import { AuthGuard } from "@/components/auth-guard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PostsPage() {
  // Placeholder estático; depois conectaremos à API
  const items = [
    { id: "1", text: "Post agendado para amanhã", status: "pending", scheduledAt: "2025-08-12 10:00" },
    { id: "2", text: "Post publicado com sucesso", status: "published", scheduledAt: null },
    { id: "3", text: "Falha ao publicar", status: "error", scheduledAt: null },
  ];

  return (
    <AuthGuard>
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Posts</h1>
          <Link href="/posts/new"><Button>Novo Post</Button></Link>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="pending">Pendentes</TabsTrigger>
            <TabsTrigger value="published">Publicados</TabsTrigger>
            <TabsTrigger value="error">Erros</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <div className="grid gap-3">
              {items.map((p) => (
                <Card key={p.id}>
                  <CardHeader>
                    <CardTitle className="text-base">{p.text}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm opacity-80">
                    <div>Status: {p.status}</div>
                    {p.scheduledAt && <div>Agendado: {p.scheduledAt}</div>}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="pending">Em breve: filtro por pendentes</TabsContent>
          <TabsContent value="published">Em breve: filtro por publicados</TabsContent>
          <TabsContent value="error">Em breve: filtro por erros</TabsContent>
        </Tabs>
      </div>
    </AuthGuard>
  );
}
