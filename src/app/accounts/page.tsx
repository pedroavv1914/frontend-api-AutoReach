"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function AccountsPage() {
  // Placeholder: lista estática para UI
  const accounts = [
    { id: "tw-1", provider: "twitter", label: "@meu_usuario", status: "connected" },
    { id: "ln-1", provider: "linkedin", label: "Pedro Dev", status: "disconnected" },
  ];

  return (
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Contas conectadas</h1>

        <div className="grid gap-3">
          {accounts.map((a) => (
            <Card key={a.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8"><AvatarFallback>{a.provider.at(0)?.toUpperCase()}</AvatarFallback></Avatar>
                  <CardTitle className="text-base">{a.provider} — {a.label}</CardTitle>
                </div>
                {a.status === "connected" ? (
                  <Button variant="outline">Desconectar</Button>
                ) : (
                  <Button>Conectar</Button>
                )}
              </CardHeader>
              <CardContent className="text-sm opacity-70">
                Status: {a.status}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
  );
}
