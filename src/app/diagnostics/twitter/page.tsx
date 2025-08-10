"use client";

import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
 

export default function TwitterDiagnosticsPage() {
  const [text, setText] = useState("debug signature");

  const verify = useMutation({
    mutationFn: async () => (await api.get("/providers/twitter/verify")).data,
    onError(error: any) {
      toast.error(error?.response?.data?.message || error?.message || "Erro ao verificar");
    },
  });

  const testSig = useMutation({
    mutationFn: async () => (await api.post("/providers/twitter/test-signature", { text })).data,
    onError(error: any) {
      toast.error(error?.response?.data?.message || error?.message || "Erro na assinatura");
    },
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Diagnóstico Twitter</h1>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Verify Credentials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={() => verify.mutate()} disabled={verify.isPending}>
              {verify.isPending ? "Verificando..." : "Verificar"}
            </Button>
            <pre className="text-xs bg-black/5 p-3 rounded-md overflow-auto min-h-[160px]">
              {verify.isPending ? "..." : JSON.stringify(verify.data || {}, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Signature (v1.1)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-sm">Texto (status)</label>
              <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} />
            </div>
            <Button onClick={() => testSig.mutate()} disabled={testSig.isPending}>
              {testSig.isPending ? "Gerando..." : "Gerar Assinatura"}
            </Button>
            <pre className="text-xs bg-black/5 p-3 rounded-md overflow-auto min-h-[160px]">
              {testSig.isPending ? "..." : JSON.stringify(testSig.data || {}, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
