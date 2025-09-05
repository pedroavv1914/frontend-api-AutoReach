"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle2, Clock, TrendingUp, AlertTriangle, PlusCircle, Users, FileText, RefreshCw } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useEffect, useState } from "react";
import { PostComposer } from "@/components/post-composer";
import { postsApi, PostFilters } from "@/lib/posts-api";
import { Post } from "@/lib/types";
import { toast } from "sonner";

const chartData = [
  { name: "Dom", published: 6, engagements: 120 },
  { name: "Seg", published: 12, engagements: 280 },
  { name: "Ter", published: 8, engagements: 210 },
  { name: "Qua", published: 15, engagements: 340 },
  { name: "Qui", published: 10, engagements: 260 },
  { name: "Sex", published: 18, engagements: 420 },
  { name: "Sáb", published: 9, engagements: 200 },
];

export default function DashboardPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showComposer, setShowComposer] = useState(false);
  const [filters, setFilters] = useState<PostFilters>({ page: 1, pageSize: 10 });
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    published: 0,
    errors: 0
  });

  // Carregar posts
  useEffect(() => {
    loadPosts();
  }, [filters]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await postsApi.list(filters);
      const items = response.items || [];
      setPosts(items);
      
      // Calcular estatísticas
      const total = response.total || 0;
      const pending = items.filter(p => p.status === 'pending').length;
      const published = items.filter(p => p.status === 'published').length;
      const errors = items.filter(p => p.status === 'error').length;
      
      setStats({ total, pending, published, errors });
    } catch (error: any) {
      toast.error('Erro ao carregar posts');
      console.error(error);
      // Definir valores padrão em caso de erro
      setPosts([]);
      setStats({ total: 0, pending: 0, published: 0, errors: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handlePostAction = async (postId: string, action: 'cancel' | 'retry' | 'delete') => {
    try {
      switch (action) {
        case 'cancel':
          await postsApi.cancel(postId);
          toast.success('Post cancelado');
          break;
        case 'retry':
          await postsApi.retry(postId);
          toast.success('Post reenviado');
          break;
        case 'delete':
          await postsApi.delete(postId);
          toast.success('Post excluído');
          break;
      }
      loadPosts(); // Recarregar lista
    } catch (error: any) {
      toast.error(`Erro ao ${action === 'delete' ? 'excluir' : action === 'cancel' ? 'cancelar' : 'reenviar'} post`);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-blue-100 text-blue-700';
      case 'error': return 'bg-red-100 text-red-700';
      case 'canceled': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published': return 'Publicado';
      case 'pending': return 'Agendado';
      case 'error': return 'Erro';
      case 'canceled': return 'Cancelado';
      default: return status;
    }
  };

  const useCountUp = (to: number, durationMs = 900) => {
    const [value, setValue] = useState(0);
    useEffect(() => {
      if (to === 0) {
        setValue(0);
        return;
      }
      
      let raf = 0; 
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / durationMs);
        setValue(Math.floor(to * (0.5 - Math.cos(Math.PI * t) / 2))); // easeInOut
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
      return () => cancelAnimationFrame(raf);
    }, [to, durationMs]);
    return value;
  };

  const Sparkline = ({ dataKey, color }: { dataKey: string; color: string }) => {
    const [isAnimating, setIsAnimating] = useState(false);
    
    return (
      <div className="h-10 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
            data={chartData} 
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          >
            <defs>
              <linearGradient id={`fill-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.35} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color} 
              fill={`url(#fill-${dataKey})`} 
              strokeWidth={1.5}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const pendingCount = useCountUp(stats.pending);
  const publishedCount = useCountUp(stats.published);
  const engagementsCount = useCountUp(1600);
  const errorsCount = useCountUp(stats.errors);
  const [metric, setMetric] = useState<'engagements' | 'published'>('engagements');
  const metricCfg: Record<typeof metric, { label: string; color: string }> = {
    engagements: { label: 'Engajamentos', color: '#8b5cf6' }, // violet-500
    published:   { label: 'Publicados',   color: '#10b981' }, // emerald-500
  };
  return (
    <div className="p-0">
      {/* Hero */}
      <div className="relative overflow-hidden border-b">
        <div className="absolute -top-32 -left-32 h-72 w-72 rounded-full bg-gradient-to-tr from-blue-600/30 via-violet-600/30 to-fuchsia-600/30 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-tr from-fuchsia-600/20 via-violet-600/20 to-blue-600/20 blur-3xl" />
        <svg className="absolute inset-0 h-full w-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M24 0H0V24" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <div className="w-full px-8 lg:px-12 xl:px-16 2xl:px-24 py-10 relative">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Dashboard</h1>
              <p className="text-sm md:text-base text-muted-foreground mt-1">Acompanhe performance, publique com confiança e gerencie suas contas.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild variant="default"><a href="/posts/new"><PlusCircle className="h-4 w-4 mr-2" />Novo Post</a></Button>
              <Button asChild variant="outline"><a href="/accounts"><Users className="h-4 w-4 mr-2" />Contas</a></Button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-8 lg:px-12 xl:px-16 2xl:px-24 py-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:gap-5">
          <Card className="border border-blue-200/40 transition hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingCount}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-100/60 px-1.5 py-0.5 rounded">↗ 5%</span>
                <span>na fila para publicar</span>
              </div>
              <div className="mt-3"><Sparkline dataKey="published" color="#3b82f6" /></div>
            </CardContent>
          </Card>

          <Card className="border border-emerald-200/40 transition hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Publicados (7d)</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{publishedCount}</div>
              <div className="text-xs text-emerald-600 inline-flex items-center gap-1 bg-emerald-100/60 px-1.5 py-0.5 rounded">▲ 12% vs semana anterior</div>
              <div className="mt-3"><Sparkline dataKey="published" color="#10b981" /></div>
            </CardContent>
          </Card>

          <Card className="border border-violet-200/40 transition hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Engajamentos (7d)</CardTitle>
              <TrendingUp className="h-4 w-4 text-violet-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{engagementsCount.toLocaleString()}</div>
              <div className="text-xs text-violet-600 inline-flex items-center gap-1 bg-violet-100/60 px-1.5 py-0.5 rounded">▲ 7% esta semana</div>
              <div className="mt-3"><Sparkline dataKey="engagements" color="#8b5cf6" /></div>
            </CardContent>
          </Card>

          <Card className="border border-amber-200/60 transition hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Erros</CardTitle>
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{errorsCount}</div>
              <div className="text-xs text-amber-600 inline-flex items-center gap-1 bg-amber-100/60 px-1.5 py-0.5 rounded">▼ 2% vs 7d</div>
              <div className="mt-3"><Sparkline dataKey="published" color="#f59e0b" /></div>
            </CardContent>
          </Card>
        </div>

        {/* Content Grid */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 2xl:gap-8">
          {/* Chart */}
          <Card className="lg:col-span-2 xl:col-span-3">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <CardTitle>Performance (7 dias)</CardTitle>
                <div className="inline-flex items-center gap-1 rounded-full border p-1 bg-background/60">
                  <Button variant={metric === 'engagements' ? 'default' : 'ghost'} size="sm" onClick={() => setMetric('engagements')}>Engajamentos</Button>
                  <Button variant={metric === 'published' ? 'default' : 'ghost'} size="sm" onClick={() => setMetric('published')}>Publicados</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                    <defs>
                      <linearGradient id="fillMetric" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={metricCfg[metric].color} stopOpacity={0.35} />
                        <stop offset="95%" stopColor={metricCfg[metric].color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-40" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 8 }} formatter={(v: any) => [v, metricCfg[metric].label]} />
                    <Area type="monotone" dataKey={metric} stroke={metricCfg[metric].color} fill="url(#fillMetric)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Agendados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-3 max-h-56 overflow-auto pr-1">
                {posts && posts.length > 0 ? posts.filter(p => p.status === 'pending').slice(0, 3).map((post) => (
                  <div key={post.id} className="flex items-start justify-between border rounded-md p-3 transition hover:bg-accent/30">
                    <div className="pr-2">
                      <div className="text-sm font-medium flex items-center gap-2">
                        <FileText className="h-4 w-4 text-violet-500" />
                        <span>{post.content.substring(0, 40)}...</span>
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
                        <span>{formatDate(post.scheduledAt || post.createdAt)}</span>
                        <span className="inline-flex items-center gap-1">
                          {post.networks.map((network: string) => (
                            <span key={network} className="px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground text-[10px] uppercase tracking-wide">{network}</span>
                          ))}
                        </span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePostAction(post.id, 'cancel')}
                    >
                      Cancelar
                    </Button>
                  </div>
                )) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <p className="text-sm">Nenhum post agendado</p>
                  </div>
                )}
              </div>
              <div className="pt-1"><Button asChild variant="ghost" className="px-0 h-auto"><a href="/posts">Ver todos</a></Button></div>
            </CardContent>
          </Card>
        </div>

        {/* Accounts + Activity */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 2xl:gap-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Contas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { id: "ln", label: "Aithos Reach", provider: "LinkedIn", status: "Conectada" },
                { id: "ig", label: "@aithosreach", provider: "Instagram", status: "Conectar" },
              ].map((a) => (
                <div key={a.id} className="flex items-center justify-between border rounded-md p-3">
                  <div>
                    <div className="text-sm font-medium">{a.provider}</div>
                    <div className="text-xs text-muted-foreground">{a.label}</div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${a.status === 'Conectada' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{a.status}</span>
                </div>
              ))}
              <div className="pt-1"><Button asChild variant="ghost" className="px-0 h-auto"><a href="/accounts">Gerenciar</a></Button></div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 xl:col-span-3">
            <CardHeader className="pb-2">
              <CardTitle>Atividade recente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { id: 1, text: "Post publicado no Twitter", meta: "há 5min" },
                { id: 2, text: "Falha no LinkedIn — token expirado", meta: "há 20min" },
                { id: 3, text: "Post reprogramado para amanhã", meta: "há 1h" },
              ].map((i) => (
                <div key={i.id} className="flex items-start gap-3 border rounded-md p-3 transition hover:bg-accent/30">
                  <div className="h-2 w-2 rounded-full bg-violet-500 mt-2" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{i.text}</div>
                    <div className="text-xs text-muted-foreground">{i.meta}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Insights */}
        <div className="grid gap-6 grid-cols-1">
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle>Posts Recentes</CardTitle>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={loadPosts}
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
                <Button
                  size="sm"
                  onClick={() => setShowComposer(!showComposer)}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Novo Post
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : posts.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-auto">
                  {posts.slice(0, 5).map((post) => (
                    <div key={post.id} className="flex items-start justify-between border rounded-md p-3 transition hover:bg-accent/30">
                      <div className="pr-2 flex-1">
                        <div className="text-sm font-medium flex items-center gap-2">
                          <FileText className="h-4 w-4 text-violet-500" />
                          <span className="truncate">{post.content.substring(0, 60)}...</span>
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                            {getStatusText(post.status)}
                          </span>
                          <span>{formatDate(post.scheduledAt || post.createdAt)}</span>
                          <span className="inline-flex items-center gap-1">
                            {post.networks.map((network) => (
                              <span key={network} className="px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground text-[10px] uppercase tracking-wide">
                                {network}
                              </span>
                            ))}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {post.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePostAction(post.id, 'cancel')}
                          >
                            Cancelar
                          </Button>
                        )}
                        {post.status === 'error' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePostAction(post.id, 'retry')}
                          >
                            Tentar novamente
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum post encontrado</p>
                  <p className="text-sm">Crie seu primeiro post clicando em "Novo Post"</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Post Composer Modal */}
      {showComposer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold">Criar Novo Post</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowComposer(false)}
              >
                ✕
              </Button>
            </div>
            <div className="p-4">
              <PostComposer />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

