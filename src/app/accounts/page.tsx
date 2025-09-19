"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Instagram, Linkedin, ExternalLink, Settings, Eye, EyeOff, Users, Sparkles, Shield, CheckCircle2, AlertCircle, Plus } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header com gradiente */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8 border border-primary/10">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Contas Conectadas
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Gerencie suas conexões com redes sociais e configure suas credenciais OAuth
            </p>
          </div>
        </div>

        <Tabs defaultValue="accounts" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-background/50 backdrop-blur-sm border border-border/50">
            <TabsTrigger value="accounts" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all">
              <Shield className="h-4 w-4 mr-2" />
              Contas
            </TabsTrigger>
            <TabsTrigger value="config" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all">
              <Settings className="h-4 w-4 mr-2" />
              Configuração
            </TabsTrigger>
          </TabsList>

          <TabsContent value="accounts" className="space-y-6 mt-6">
            {loading ? (
              <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                <CardContent className="py-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Carregando contas...</p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Contas Conectadas */}
                {connectedAccounts.length > 0 && (
                  <div className="grid gap-4">
                    <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      Suas Contas
                    </h2>
                    {connectedAccounts.map((account) => (
                      <Card key={account.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg bg-card/80 backdrop-blur-sm">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition-colors">
                                {getProviderIcon(account.provider)}
                              </div>
                              <div>
                                <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                                  {getProviderName(account.provider)}
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                  {account.name || account.username || account.providerAccountId}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-200/30">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Conectada
                              </Badge>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
                                onClick={() => handleDisconnect(account.id)}
                              >
                                Desconectar
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="grid grid-cols-2 gap-6 p-4 bg-gradient-to-r from-muted/50 to-primary/5 rounded-lg">
                            <div className="text-center">
                              <p className="text-sm text-muted-foreground mb-1">Seguidores</p>
                              <p className="text-lg font-semibold">{account.followers || '—'}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-muted-foreground mb-1">Conectado em</p>
                              <p className="text-lg font-semibold">
                                {new Date(account.connectedAt).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Seção para Conectar Novas Contas */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Plus className="h-5 w-5 text-primary" />
                    Conectar Nova Conta
                  </h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {/* LinkedIn */}
                    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg bg-card/80 backdrop-blur-sm">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100">
                              <Linkedin className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <CardTitle className="text-lg font-semibold">LinkedIn</CardTitle>
                              <p className="text-sm text-muted-foreground">Conecte sua conta profissional</p>
                            </div>
                          </div>
                          {connectedAccounts.some(acc => acc.provider === 'linkedin') ? (
                            <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-200/30">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Conectada
                            </Badge>
                          ) : (
                            <Button 
                              onClick={() => handleConnect('linkedin')}
                              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                              Conectar
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                    </Card>

                    {/* Instagram */}
                    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg bg-card/80 backdrop-blur-sm">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-pink-50 to-purple-100">
                              <Instagram className="h-6 w-6 text-pink-600" />
                            </div>
                            <div>
                              <CardTitle className="text-lg font-semibold">Instagram</CardTitle>
                              <p className="text-sm text-muted-foreground">Conecte sua conta pessoal</p>
                            </div>
                          </div>
                          {connectedAccounts.some(acc => acc.provider === 'instagram') ? (
                            <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-200/30">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Conectada
                            </Badge>
                          ) : (
                            <Button 
                              onClick={() => handleConnect('instagram')}
                              className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                              Conectar
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                    </Card>
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="config" className="space-y-6 mt-6">
            {/* Configuração LinkedIn */}
            <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
                    <Linkedin className="h-5 w-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl font-semibold">Configuração LinkedIn</CardTitle>
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
                    className="bg-background/80 backdrop-blur-sm"
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
                      className="bg-background/80 backdrop-blur-sm pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowSecrets(prev => ({ ...prev, linkedin: !prev.linkedin }))}
                    >
                      {showSecrets.linkedin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSaveConfig('linkedin')}
                  disabled={saving || !localConfig.linkedin?.clientId || !localConfig.linkedin?.clientSecret}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
                >
                  {saving ? 'Salvando...' : 'Salvar Configuração'}
                </Button>
              </CardContent>
            </Card>

            {/* Configuração Instagram */}
            <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-pink-50 to-purple-100">
                    <Instagram className="h-5 w-5 text-pink-600" />
                  </div>
                  <CardTitle className="text-xl font-semibold">Configuração Instagram</CardTitle>
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
                    className="bg-background/80 backdrop-blur-sm"
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
                      className="bg-background/80 backdrop-blur-sm pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowSecrets(prev => ({ ...prev, instagram: !prev.instagram }))}
                    >
                      {showSecrets.instagram ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSaveConfig('instagram')}
                  disabled={saving || !localConfig.instagram?.clientId || !localConfig.instagram?.clientSecret}
                  className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white shadow-lg"
                >
                  {saving ? 'Salvando...' : 'Salvar Configuração'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Card para futuras integrações */}
        <Card className="border-dashed border-2 border-muted-foreground/20 bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="p-3 rounded-full bg-muted/50 mb-4">
              <ExternalLink className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-1">Adicionar nova conta</h3>
            <p className="text-sm text-muted-foreground mb-4 text-center">Conecte mais redes sociais para ampliar seu alcance</p>
            <Button variant="outline" disabled className="bg-background/50">
              <Sparkles className="h-4 w-4 mr-2" />
              Em breve: Facebook, TikTok, YouTube
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
