"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthGuard } from "@/components/auth-guard";

export default function DashboardPage() {
  const me = useQuery({ queryKey: ["me"], queryFn: async () => (await api.get("/users/me")).data });

  return (
    <AuthGuard>
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="text-sm opacity-70">API: {process.env.NEXT_PUBLIC_API_URL}</div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Visão geral</TabsTrigger>
          <TabsTrigger value="account">Conta</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle>Bem-vindo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm">{me.isLoading ? "Carregando..." : me.data?.email || "Usuário"}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Posts pendentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl">—</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Publicados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl">—</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Erros</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl">—</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Minha conta</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-black/5 p-3 rounded-md overflow-auto">{JSON.stringify(me.data || {}, null, 2)}</pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    </AuthGuard>
  );
}
