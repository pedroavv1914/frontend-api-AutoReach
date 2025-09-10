"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, CheckCircle2, Clock, TrendingUp, AlertTriangle, PlusCircle, 
  Users, FileText, RefreshCw, BarChart3, Eye, Heart, MessageCircle, 
  Share2, Target, Zap, Activity, ArrowUpRight, ArrowDownRight,
  Filter, Download, Settings, Bell, Sparkles, X, Edit, Trash2, Plus
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { useEffect, useState, useMemo } from "react";
import { PostComposer } from "@/components/post-composer";
import { postsApi, PostFilters } from "@/lib/posts-api";
import { Post } from "@/lib/types";
import { toast } from "sonner";

const chartData = [
  { name: "Dom", published: 6, engagements: 120, views: 1200, clicks: 45, shares: 12, comments: 8 },
  { name: "Seg", published: 12, engagements: 280, views: 2800, clicks: 95, shares: 28, comments: 15 },
  { name: "Ter", published: 8, engagements: 210, views: 2100, clicks: 72, shares: 21, comments: 12 },
  { name: "Qua", published: 15, engagements: 340, views: 3400, clicks: 125, shares: 34, comments: 22 },
  { name: "Qui", published: 10, engagements: 260, views: 2600, clicks: 88, shares: 26, comments: 18 },
  { name: "Sex", published: 18, engagements: 420, views: 4200, clicks: 155, shares: 42, comments: 28 },
  { name: "Sáb", published: 9, engagements: 200, views: 2000, clicks: 68, shares: 20, comments: 10 },
];

const networkData = [
  { name: "LinkedIn", value: 45, color: "#0077B5" },
  { name: "Twitter", value: 30, color: "#1DA1F2" },
  { name: "Instagram", value: 20, color: "#E4405F" },
  { name: "Facebook", value: 5, color: "#1877F2" },
];

const timeSlots = [
  { hour: "06:00", posts: 2, engagement: 85 },
  { hour: "09:00", posts: 8, engagement: 92 },
  { hour: "12:00", posts: 12, engagement: 88 },
  { hour: "15:00", posts: 15, engagement: 95 },
  { hour: "18:00", posts: 18, engagement: 98 },
  { hour: "21:00", posts: 10, engagement: 90 },
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

  const useCountUp = (to: number, durationMs = 1200) => {
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

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <ArrowUpRight className="h-3 w-3" />;
    if (growth < 0) return <ArrowDownRight className="h-3 w-3" />;
    return null;
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-emerald-600 bg-emerald-100/60';
    if (growth < 0) return 'text-red-600 bg-red-100/60';
    return 'text-gray-600 bg-gray-100/60';
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
  const engagementsCount = useCountUp(1847);
  const errorsCount = useCountUp(stats.errors);
  const viewsCount = useCountUp(18470);
  const clicksCount = useCountUp(653);
  
  const [metric, setMetric] = useState<'engagements' | 'published' | 'views' | 'clicks'>('engagements');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  
  const metricCfg: Record<typeof metric, { label: string; color: string; icon: any }> = {
    engagements: { label: 'Engajamentos', color: '#8b5cf6', icon: Heart },
    published: { label: 'Publicados', color: '#10b981', icon: CheckCircle2 },
    views: { label: 'Visualizações', color: '#3b82f6', icon: Eye },
    clicks: { label: 'Cliques', color: '#f59e0b', icon: Target },
  };

  const kpiData = useMemo(() => [
    {
      title: 'Posts Pendentes',
      value: pendingCount,
      growth: 5,
      icon: Clock,
      color: 'blue',
      description: 'na fila para publicar'
    },
    {
      title: 'Publicados (7d)',
      value: publishedCount,
      growth: 12,
      icon: CheckCircle2,
      color: 'emerald',
      description: 'vs semana anterior'
    },
    {
      title: 'Engajamentos (7d)',
      value: engagementsCount,
      growth: 7,
      icon: Heart,
      color: 'violet',
      description: 'esta semana'
    },
    {
      title: 'Visualizações (7d)',
      value: viewsCount,
      growth: 15,
      icon: Eye,
      color: 'blue',
      description: 'alcance total'
    },
    {
      title: 'Taxa de Cliques',
      value: 3.54,
      growth: -2,
      icon: Target,
      color: 'amber',
      description: 'CTR médio',
      isPercentage: true
    },
    {
      title: 'Erros',
      value: errorsCount,
      growth: -25,
      icon: AlertTriangle,
      color: 'red',
      description: 'vs período anterior'
    }
  ], [pendingCount, publishedCount, engagementsCount, viewsCount, errorsCount]);
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
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 2xl:gap-5">
          {kpiData.map((kpi, index) => {
            const IconComponent = kpi.icon;
            const colorClasses = {
              blue: 'border-blue-200/40 hover:border-blue-300/60',
              emerald: 'border-emerald-200/40 hover:border-emerald-300/60',
              violet: 'border-violet-200/40 hover:border-violet-300/60',
              amber: 'border-amber-200/40 hover:border-amber-300/60',
              red: 'border-red-200/40 hover:border-red-300/60'
            };
            const iconColors = {
              blue: 'text-blue-500',
              emerald: 'text-emerald-500',
              violet: 'text-violet-500',
              amber: 'text-amber-500',
              red: 'text-red-500'
            };
            
            return (
              <Card key={index} className={`${colorClasses[kpi.color as keyof typeof colorClasses]} transition-all duration-200 hover:shadow-lg hover:scale-[1.02] group`}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {kpi.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg bg-background/60 group-hover:bg-background transition-colors`}>
                    <IconComponent className={`h-4 w-4 ${iconColors[kpi.color as keyof typeof iconColors]}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold tracking-tight">
                    {kpi.isPercentage ? `${kpi.value}%` : formatNumber(kpi.value)}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className={`text-xs inline-flex items-center gap-1 px-2 py-1 rounded-full font-medium ${getGrowthColor(kpi.growth)}`}>
                      {getGrowthIcon(kpi.growth)}
                      {Math.abs(kpi.growth)}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {kpi.description}
                    </div>
                  </div>
                  <div className="mt-3">
                    <Sparkline 
                      dataKey={index < 2 ? "published" : "engagements"} 
                      color={{
                        blue: "#3b82f6",
                        emerald: "#10b981",
                        violet: "#8b5cf6",
                        amber: "#f59e0b",
                        red: "#ef4444"
                      }[kpi.color as keyof typeof colorClasses]} 
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Content Grid */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-4 2xl:gap-8">
          {/* Main Chart */}
          <Card className="lg:col-span-3">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-3">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-violet-500" />
                    Performance Analytics
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {timeRange === '7d' ? 'Últimos 7 dias' : timeRange === '30d' ? 'Últimos 30 dias' : 'Últimos 90 dias'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center gap-1 rounded-lg border p-1 bg-background/60">
                    <Button variant={timeRange === '7d' ? 'default' : 'ghost'} size="sm" onClick={() => setTimeRange('7d')}>7d</Button>
                    <Button variant={timeRange === '30d' ? 'default' : 'ghost'} size="sm" onClick={() => setTimeRange('30d')}>30d</Button>
                    <Button variant={timeRange === '90d' ? 'default' : 'ghost'} size="sm" onClick={() => setTimeRange('90d')}>90d</Button>
                  </div>
                  <Separator orientation="vertical" className="h-6" />
                  <div className="inline-flex items-center gap-1 rounded-lg border p-1 bg-background/60">
                    <Button variant={metric === 'engagements' ? 'default' : 'ghost'} size="sm" onClick={() => setMetric('engagements')}>
                      <Heart className="h-3 w-3 mr-1" />Engajamentos
                    </Button>
                    <Button variant={metric === 'published' ? 'default' : 'ghost'} size="sm" onClick={() => setMetric('published')}>
                      <CheckCircle2 className="h-3 w-3 mr-1" />Publicados
                    </Button>
                    <Button variant={metric === 'views' ? 'default' : 'ghost'} size="sm" onClick={() => setMetric('views')}>
                      <Eye className="h-3 w-3 mr-1" />Views
                    </Button>
                    <Button variant={metric === 'clicks' ? 'default' : 'ghost'} size="sm" onClick={() => setMetric('clicks')}>
                      <Target className="h-3 w-3 mr-1" />Cliques
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 30, bottom: 0, left: 0 }}>
                    <defs>
                      <linearGradient id="fillMetric" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={metricCfg[metric].color} stopOpacity={0.4} />
                        <stop offset="95%" stopColor={metricCfg[metric].color} stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="name" 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      tickFormatter={(value) => formatNumber(value)}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: 12, 
                        border: 'none',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        backgroundColor: 'hsl(var(--background))',
                        color: 'hsl(var(--foreground))'
                      }} 
                      formatter={(value: any, name: string) => [
                        formatNumber(value), 
                        metricCfg[metric].label
                      ]}
                      labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey={metric} 
                      stroke={metricCfg[metric].color} 
                      fill="url(#fillMetric)" 
                      strokeWidth={3}
                      dot={{ fill: metricCfg[metric].color, strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: metricCfg[metric].color, strokeWidth: 2, fill: 'white' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: metricCfg[metric].color }}></div>
                    <span className="text-sm font-medium">{metricCfg[metric].label}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total: {formatNumber(chartData.reduce((acc, curr) => acc + curr[metric], 0))}
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Network Distribution */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-4 w-4 text-blue-500" />
                Distribuição por Rede
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={networkData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {networkData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: any) => [`${value}%`, 'Participação']}
                      contentStyle={{
                        borderRadius: 8,
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        backgroundColor: 'hsl(var(--background))'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-2">
                {networkData.map((network, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: network.color }}></div>
                      <span className="text-sm font-medium">{network.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={network.value} className="w-16 h-2" />
                      <span className="text-sm text-muted-foreground w-8">{network.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Insights */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3 2xl:gap-8">
          {/* Best Times */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-emerald-500" />
                Melhores Horários
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {timeSlots.map((slot, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-gradient-to-r from-background to-accent/20">
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-mono font-medium">{slot.hour}</div>
                      <div className="text-xs text-muted-foreground">{slot.posts} posts</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={slot.engagement} className="w-12 h-2" />
                      <span className="text-sm font-medium text-emerald-600">{slot.engagement}%</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t">
                <Button variant="outline" size="sm" className="w-full">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Otimizar Agendamentos
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Posts */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-violet-500" />
                Próximos Posts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-3 max-h-64 overflow-auto pr-1">
                {posts && posts.length > 0 ? posts.filter(p => p.status === 'pending').slice(0, 4).map((post) => (
                  <div key={post.id} className="flex items-start justify-between border rounded-lg p-3 transition hover:bg-accent/30 group">
                    <div className="pr-2 flex-1">
                      <div className="text-sm font-medium flex items-center gap-2 mb-1">
                        <FileText className="h-3 w-3 text-violet-500" />
                        <span className="truncate">{post.content.substring(0, 35)}...</span>
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-[10px] px-1 py-0">
                          {formatDate(post.scheduledAt || post.createdAt).split(' ')[1]}
                        </Badge>
                        <div className="inline-flex items-center gap-1">
                          {post.networks.slice(0, 2).map((network: string) => (
                            <span key={network} className="px-1 py-0.5 rounded bg-secondary text-secondary-foreground text-[9px] uppercase tracking-wide">{network}</span>
                          ))}
                          {post.networks.length > 2 && (
                            <span className="text-[9px] text-muted-foreground">+{post.networks.length - 2}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handlePostAction(post.id, 'cancel')}
                    >
                      ✕
                    </Button>
                  </div>
                )) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Nenhum post agendado</p>
                  </div>
                )}
              </div>
              <div className="pt-2 border-t">
                <Button asChild variant="outline" size="sm" className="w-full">
                  <a href="/posts">
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Todos os Posts
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500" />
                Ações Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-2">
                <Button className="w-full justify-start" onClick={() => setShowComposer(true)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Criar Post
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/analytics">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Ver Analytics
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/accounts">
                    <Users className="h-4 w-4 mr-2" />
                    Gerenciar Contas
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/settings">
                    <Settings className="h-4 w-4 mr-2" />
                    Configurações
                  </a>
                </Button>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Próxima publicação</span>
                  <span className="font-medium">em 2h 15m</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Quota mensal</span>
                  <div className="flex items-center gap-2">
                    <Progress value={67} className="w-12 h-2" />
                    <span className="font-medium">67%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Feed */}
        <div className="grid gap-6 grid-cols-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-500" />
                Atividade Recente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { 
                    id: 1, 
                    text: "Post publicado com sucesso no LinkedIn", 
                    meta: "há 5 minutos", 
                    type: "success",
                    icon: CheckCircle2,
                    network: "LinkedIn"
                  },
                  { 
                    id: 2, 
                    text: "Falha na publicação no Twitter — token expirado", 
                    meta: "há 20 minutos", 
                    type: "error",
                    icon: AlertTriangle,
                    network: "Twitter"
                  },
                  { 
                    id: 3, 
                    text: "Post reagendado para amanhã às 09:00", 
                    meta: "há 1 hora", 
                    type: "info",
                    icon: Clock,
                    network: "Instagram"
                  },
                  { 
                    id: 4, 
                    text: "Nova conta conectada: Facebook Business", 
                    meta: "há 2 horas", 
                    type: "success",
                    icon: Users,
                    network: "Facebook"
                  },
                  { 
                    id: 5, 
                    text: "Engajamento aumentou 15% esta semana", 
                    meta: "há 3 horas", 
                    type: "info",
                    icon: TrendingUp,
                    network: null
                  }
                ].map((activity) => {
                  const IconComponent = activity.icon;
                  const typeColors = {
                    success: 'text-emerald-500 bg-emerald-100/60',
                    error: 'text-red-500 bg-red-100/60',
                    info: 'text-blue-500 bg-blue-100/60'
                  };
                  
                  return (
                    <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg border bg-gradient-to-r from-background to-accent/10 transition hover:bg-accent/20 group">
                      <div className={`p-2 rounded-lg ${typeColors[activity.type as keyof typeof typeColors]}`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium group-hover:text-foreground transition-colors">
                          {activity.text}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">{activity.meta}</span>
                          {activity.network && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                              {activity.network}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Mostrando as 5 atividades mais recentes
                </div>
                <Button variant="outline" size="sm">
                  <Activity className="h-4 w-4 mr-2" />
                  Ver Histórico Completo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Posts */}
        <div className="grid gap-6 grid-cols-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-500" />
                  Posts Recentes
                </div>
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
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : posts.length > 0 ? (
                <div className="space-y-4">
                  {posts.slice(0, 4).map((post, index) => {
                    const statusConfig = {
                      published: { color: 'bg-emerald-500', label: 'Publicado', textColor: 'text-emerald-700' },
                      pending: { color: 'bg-blue-500', label: 'Agendado', textColor: 'text-blue-700' },
                      error: { color: 'bg-red-500', label: 'Erro', textColor: 'text-red-700' },
                      canceled: { color: 'bg-gray-400', label: 'Cancelado', textColor: 'text-gray-700' }
                    };
                    
                    const config = statusConfig[post.status as keyof typeof statusConfig] || statusConfig.pending;
                    
                    return (
                      <div key={post.id} className="group relative p-4 rounded-lg border bg-gradient-to-r from-background to-accent/5 hover:to-accent/10 transition-all duration-200">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className={`h-3 w-3 rounded-full ${config.color} shadow-sm`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <p className="text-sm font-medium line-clamp-2 group-hover:text-foreground transition-colors">
                                  {post.content.substring(0, 80)}...
                                </p>
                                <div className="flex items-center gap-3 mt-2">
                                  <span className="text-xs text-muted-foreground">
                                    {formatDate(post.scheduledAt || post.createdAt)}
                                  </span>
                                  <div className="flex items-center gap-1">
                                    {post.networks.slice(0, 3).map((network, i) => (
                                      <Badge key={i} variant="secondary" className="text-[10px] px-1.5 py-0">
                                        {network}
                                      </Badge>
                                    ))}
                                    {post.networks.length > 3 && (
                                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                        +{post.networks.length - 3}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <Badge variant="outline" className={`text-[10px] px-2 py-1 ${config.textColor} border-current/20`}>
                                  {config.label}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Action buttons - show on hover */}
                        <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-blue-100 hover:text-blue-600">
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          {post.status === 'pending' && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 w-7 p-0 hover:bg-red-100 hover:text-red-600"
                              onClick={() => handlePostAction(post.id, 'cancel')}
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          {post.status === 'error' && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 w-7 p-0 hover:bg-green-100 hover:text-green-600"
                              onClick={() => handlePostAction(post.id, 'retry')}
                            >
                              <RefreshCw className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum post encontrado</p>
                  <p className="text-sm">Crie seu primeiro post clicando em "Novo Post"</p>
                </div>
              )}
              
              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  {posts.length} posts no total
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href="/posts">
                      <FileText className="h-4 w-4 mr-2" />
                      Ver Todos
                    </a>
                  </Button>
                  <Button size="sm" asChild>
                    <a href="/posts/new">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Criar Post
                    </a>
                  </Button>
                </div>
              </div>
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

