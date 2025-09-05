"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Instagram, Linkedin, ExternalLink, Settings, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { oauthApi, ConnectedAccount, OAuthAppConfig } from "@/lib/oauth-api";
import { OAuthConfig, OAuthUrls } from "@/lib/types";

export default function AccountsPage() {
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([]);
  const [oauthConfig, setOauthConfig] = useState<OAuthConfig>({});
  const [authUrls, setAuthUrls] = useState<OAuthUrls>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSecrets, setShowSecrets] = useState({ linkedin: false, instagram: false });
  
  // Configuração local para edição
  const [localConfig, setLocalConfig] = useState<OAuthAppConfig>({
    linkedin: { clientId: '', clientSecret: '' },
    instagram: { clientId: '', clientSecret: '' }
  });

  // Carregar dados iniciais
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [config, urls, accounts] = await Promise.all([
        oauthApi.getConfig(),
        oauthApi.getAuthorizationUrls(),
        oauthApi.getConnectedAccounts()
      ]);
      
      setOauthConfig(config);
      setAuthUrls(urls);
      setConnectedAccounts(accounts);
      
      // Preencher configuração local
      setLocalConfig({
        linkedin: {
          clientId: config.linkedin?.clientId || '',
          clientSecret: ''
        },
        instagram: {
          clientId: config.instagram?.clientId || '',
          clientSecret: ''
        }
      });
    } catch (error: any) {
      toast.error('Erro ao carregar configurações');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = (provider: 'linkedin' | 'instagram') => {
    const url = authUrls[provider];
    if (url) {
      window.location.href = url;
    } else {
      toast.error(`Configure as credenciais do ${provider === 'linkedin' ? 'LinkedIn' : 'Instagram'} primeiro`);
    }
  };

  const handleDisconnect = async (accountId: string) => {
    try {
      await oauthApi.disconnectAccount(accountId);
      toast.success('Conta desconectada com sucesso');
      loadData(); // Recarregar dados
    } catch (error: any) {
      toast.error('Erro ao desconectar conta');
      console.error(error);
    }
  };

  const handleSaveConfig = async (provider: 'linkedin' | 'instagram') => {
    try {
      setSaving(true);
      const config = {
        [provider]: localConfig[provider]
      };
      
      await oauthApi.saveConfig(config);
      toast.success(`Configuração do ${provider === 'linkedin' ? 'LinkedIn' : 'Instagram'} salva com sucesso`);
      loadData(); // Recarregar para obter novas URLs
    } catch (error: any) {
      toast.error('Erro ao salvar configuração');
      console.error(error);
    } finally {
      setSaving(false);
    }
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

      <Tabs defaultValue="accounts" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="accounts">Contas Conectadas</TabsTrigger>
          <TabsTrigger value="config">Configurações OAuth</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <>
              {/* Contas Conectadas */}
              {connectedAccounts.length > 0 && (
                <div className="grid gap-4">
                  {connectedAccounts.map((account) => (
                    <Card key={account.id} className="transition-all hover:shadow-md">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getProviderIcon(account.provider)}
                            <div>
                              <CardTitle className="text-lg">{getProviderName(account.provider)}</CardTitle>
                              <p className="text-sm text-muted-foreground">
                                {account.name || account.username || account.providerAccountId}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                              Conectada
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDisconnect(account.id)}
                            >
                              Desconectar
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Seguidores</p>
                            <p className="font-medium">{account.followers || '—'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Conectado em</p>
                            <p className="font-medium">
                              {new Date(account.connectedAt).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Botões para Conectar */}
              <div className="grid gap-4">
                <Card className="transition-all hover:shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Linkedin className="h-5 w-5 text-blue-600" />
                        <div>
                          <CardTitle className="text-lg">LinkedIn</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {oauthConfig.linkedin?.configured ? 'Configurado' : 'Não configurado'}
                          </p>
                        </div>
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => handleConnect('linkedin')}
                        disabled={!oauthConfig.linkedin?.configured}
                      >
                        Conectar
                      </Button>
                    </div>
                  </CardHeader>
                </Card>

                <Card className="transition-all hover:shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Instagram className="h-5 w-5 text-pink-600" />
                        <div>
                          <CardTitle className="text-lg">Instagram</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {oauthConfig.instagram?.configured ? 'Configurado' : 'Não configurado'}
                          </p>
                        </div>
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => handleConnect('instagram')}
                        disabled={!oauthConfig.instagram?.configured}
                      >
                        Conectar
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="config" className="space-y-6">
          {/* Configuração LinkedIn */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Linkedin className="h-5 w-5 text-blue-600" />
                <CardTitle>Configuração LinkedIn</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Client ID</label>
                <Input
                  value={localConfig.linkedin?.clientId || ''}
                  onChange={(e) => setLocalConfig(prev => ({
                    ...prev,
                    linkedin: { ...prev.linkedin!, clientId: e.target.value }
                  }))}
                  placeholder="Seu LinkedIn Client ID"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Client Secret</label>
                <div className="relative">
                  <Input
                    type={showSecrets.linkedin ? 'text' : 'password'}
                    value={localConfig.linkedin?.clientSecret || ''}
                    onChange={(e) => setLocalConfig(prev => ({
                      ...prev,
                      linkedin: { ...prev.linkedin!, clientSecret: e.target.value }
                    }))}
                    placeholder="Seu LinkedIn Client Secret"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowSecrets(prev => ({ ...prev, linkedin: !prev.linkedin }))}
                  >
                    {showSecrets.linkedin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Button 
                onClick={() => handleSaveConfig('linkedin')}
                disabled={saving || !localConfig.linkedin?.clientId || !localConfig.linkedin?.clientSecret}
              >
                {saving ? 'Salvando...' : 'Salvar Configuração'}
              </Button>
            </CardContent>
          </Card>

          {/* Configuração Instagram */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Instagram className="h-5 w-5 text-pink-600" />
                <CardTitle>Configuração Instagram</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Client ID</label>
                <Input
                  value={localConfig.instagram?.clientId || ''}
                  onChange={(e) => setLocalConfig(prev => ({
                    ...prev,
                    instagram: { ...prev.instagram!, clientId: e.target.value }
                  }))}
                  placeholder="Seu Instagram Client ID"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Client Secret</label>
                <div className="relative">
                  <Input
                    type={showSecrets.instagram ? 'text' : 'password'}
                    value={localConfig.instagram?.clientSecret || ''}
                    onChange={(e) => setLocalConfig(prev => ({
                      ...prev,
                      instagram: { ...prev.instagram!, clientSecret: e.target.value }
                    }))}
                    placeholder="Seu Instagram Client Secret"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowSecrets(prev => ({ ...prev, instagram: !prev.instagram }))}
                  >
                    {showSecrets.instagram ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Button 
                onClick={() => handleSaveConfig('instagram')}
                disabled={saving || !localConfig.instagram?.clientId || !localConfig.instagram?.clientSecret}
              >
                {saving ? 'Salvando...' : 'Salvar Configuração'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
