"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Instagram, Linkedin, ExternalLink } from "lucide-react";
import { useState } from "react";

export default function AccountsPage() {
  const [accounts, setAccounts] = useState([
    { 
      id: "ln-1", 
      provider: "linkedin", 
      label: "Aithos Reach", 
      status: "connected",
      followers: "1.2K",
      lastPost: "2 dias atrás"
    },
    { 
      id: "ig-1", 
      provider: "instagram", 
      label: "@aithosreach", 
      status: "disconnected",
      followers: "—",
      lastPost: "—"
    },
  ]);

  const handleConnect = (accountId: string) => {
    const account = accounts.find(a => a.id === accountId);
    if (!account) return;

    if (account.provider === "linkedin") {
      // LinkedIn OAuth URL
      const clientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID || "your-linkedin-client-id";
      const redirectUri = encodeURIComponent(`${window.location.origin}/auth/linkedin/callback`);
      const scope = encodeURIComponent("r_liteprofile r_emailaddress w_member_social");
      const state = encodeURIComponent(accountId);
      
      window.location.href = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
    } else if (account.provider === "instagram") {
      // Instagram Basic Display API OAuth URL
      const clientId = process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID || "your-instagram-client-id";
      const redirectUri = encodeURIComponent(`${window.location.origin}/auth/instagram/callback`);
      const scope = encodeURIComponent("user_profile,user_media");
      const state = encodeURIComponent(accountId);
      
      window.location.href = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&state=${state}`;
    }
  };

  const handleDisconnect = (accountId: string) => {
    setAccounts(prev => prev.map(account => 
      account.id === accountId 
        ? { ...account, status: "disconnected", followers: "—", lastPost: "—" }
        : account
    ));
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case "linkedin":
        return <Linkedin className="h-5 w-5 text-blue-600" />;
      case "instagram":
        return <Instagram className="h-5 w-5 text-pink-600" />;
      default:
        return <ExternalLink className="h-5 w-5" />;
    }
  };

  const getProviderName = (provider: string) => {
    switch (provider) {
      case "linkedin":
        return "LinkedIn";
      case "instagram":
        return "Instagram";
      default:
        return provider;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Contas conectadas</h1>
          <p className="text-muted-foreground mt-1">Gerencie suas conexões com redes sociais</p>
        </div>
      </div>

      <div className="grid gap-4">
        {accounts.map((account) => (
          <Card key={account.id} className="transition-all hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getProviderIcon(account.provider)}
                  <div>
                    <CardTitle className="text-lg">{getProviderName(account.provider)}</CardTitle>
                    <p className="text-sm text-muted-foreground">{account.label}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    account.status === "connected" 
                      ? "bg-green-100 text-green-700" 
                      : "bg-gray-100 text-gray-700"
                  }`}>
                    {account.status === "connected" ? "Conectada" : "Desconectada"}
                  </div>
                  {account.status === "connected" ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDisconnect(account.id)}
                    >
                      Desconectar
                    </Button>
                  ) : (
                    <Button 
                      size="sm"
                      onClick={() => handleConnect(account.id)}
                    >
                      Conectar
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            {account.status === "connected" && (
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Seguidores</p>
                    <p className="font-medium">{account.followers}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Último post</p>
                    <p className="font-medium">{account.lastPost}</p>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <ExternalLink className="h-8 w-8 text-muted-foreground mb-2" />
          <h3 className="font-medium mb-1">Adicionar nova conta</h3>
          <p className="text-sm text-muted-foreground mb-4">Conecte mais redes sociais para ampliar seu alcance</p>
          <Button variant="outline" disabled>
            Em breve: Facebook, TikTok, YouTube
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
