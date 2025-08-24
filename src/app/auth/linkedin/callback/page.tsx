"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

export default function LinkedInCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      setStatus('error');
      setMessage('Autorização negada pelo usuário');
      return;
    }

    if (!code) {
      setStatus('error');
      setMessage('Código de autorização não encontrado');
      return;
    }

    // Aqui você faria a chamada para o backend para trocar o code por access_token
    handleLinkedInAuth(code, state);
  }, [searchParams]);

  const handleLinkedInAuth = async (code: string, state: string | null) => {
    try {
      // Simulação da integração - substitua pela chamada real ao backend
      const response = await fetch('/api/auth/linkedin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, state }),
      });

      if (response.ok) {
        setStatus('success');
        setMessage('LinkedIn conectado com sucesso!');
        
        // Redirecionar após 2 segundos
        setTimeout(() => {
          router.push('/accounts');
        }, 2000);
      } else {
        throw new Error('Falha na autenticação');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Erro ao conectar com LinkedIn. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            {status === 'loading' && <Loader2 className="h-5 w-5 animate-spin" />}
            {status === 'success' && <CheckCircle className="h-5 w-5 text-green-600" />}
            {status === 'error' && <XCircle className="h-5 w-5 text-red-600" />}
            {status === 'loading' && 'Conectando...'}
            {status === 'success' && 'Sucesso!'}
            {status === 'error' && 'Erro'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">{message}</p>
          
          {status === 'error' && (
            <Button onClick={() => router.push('/accounts')} className="w-full">
              Voltar para Contas
            </Button>
          )}
          
          {status === 'success' && (
            <p className="text-sm text-muted-foreground">
              Redirecionando automaticamente...
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
