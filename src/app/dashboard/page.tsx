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
import styles from './dashboard.module.css';

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

  // Adicionar estado para posts futuros
  const [upcomingPosts, setUpcomingPosts] = useState<Post[]>([]);

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
      
      // Filtrar posts futuros (agendados)
      const upcoming = items.filter(p => p.status === 'pending' && new Date(p.scheduledAt || '') > new Date());
      setUpcomingPosts(upcoming);
      
      // Calcular estatísticas
      const total = response.total || 0;
      const pending = items.filter(p => p.status === 'pending').length;
      const published = items.filter(p => p.status === 'published').length;
      const errors = items.filter(p => p.status === 'error').length;
      
      setStats({ total, pending, published, errors });
    } catch (error: unknown) {
      toast.error('Erro ao carregar posts');
      console.error(error);
      // Definir valores padrão em caso de erro
      setPosts([]);
      setUpcomingPosts([]);
      setStats({ total: 0, pending: 0, published: 0, errors: 0 });
    } finally {
      setLoading(false);
    }
  };

  // Adicionar funções específicas para cancelar e reenviar posts
  const handleCancelPost = async (postId: string) => {
    await handlePostAction(postId, 'cancel');
  };

  const handleRetryPost = async (postId: string) => {
    await handlePostAction(postId, 'retry');
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
    } catch (error: unknown) {
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
    const [hasAnimated, setHasAnimated] = useState(false);
    
    useEffect(() => {
      if (to === 0) {
        setValue(0);
        return;
      }
      
      // Evitar re-animação se já animou para este valor
      if (hasAnimated && value === to) {
        return;
      }
      
      let raf = 0; 
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / durationMs);
        const newValue = Math.floor(to * (0.5 - Math.cos(Math.PI * t) / 2)); // easeInOut
        setValue(newValue);
        
        if (t < 1) {
          raf = requestAnimationFrame(step);
        } else {
          setHasAnimated(true);
        }
      };
      raf = requestAnimationFrame(step);
      return () => cancelAnimationFrame(raf);
    }, [to, durationMs]); // Removido hasAnimated e value das dependências
    
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
    <div className={styles.dashboard}>
      {/* Hero Section com Gradiente */}
      <div className={styles.heroSection}>
        {/* Elementos decorativos animados */}
        <div className={styles.blob1}></div>
        <div className={styles.blob2}></div>
        <div className={styles.blob3}></div>
        
        <div className={styles.heroContent}>
          <div className={styles.heroGrid}>
            <div className={styles.heroText}>
              <div className={styles.heroHeader}>
                <div className={styles.iconContainer}>
                  <BarChart3 className={styles.heroIcon} />
                </div>
                <Badge variant="secondary" className={styles.heroBadge}>
                  <Sparkles className="h-3 w-3 mr-1" />
                  Dashboard
                </Badge>
              </div>
              <h1 className={styles.heroTitle}>
                Bem-vindo de volta!
              </h1>
              <p className={styles.heroDescription}>
                Acompanhe sua performance, publique com confiança e gerencie suas contas sociais em um só lugar.
              </p>
            </div>
            <div className={styles.heroActions}>
              <Button 
                asChild 
                size="lg"
                className={styles.primaryButton}
              >
                <a href="/posts/new">
                  <PlusCircle className="h-5 w-5 mr-2" />
                  Novo Post
                </a>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                size="lg"
                className={styles.secondaryButton}
              >
                <a href="/accounts">
                  <Users className="h-5 w-5 mr-2" />
                  Contas
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.mainContent}>
        {/* KPI Cards Modernos */}
        <div className={styles.kpiGrid}>
          {kpiData.map((kpi, index) => {
            const IconComponent = kpi.icon;
            
            return (
              <Card 
                key={index} 
                className={`${styles.kpiCard} ${styles[`kpiCard${kpi.color.charAt(0).toUpperCase() + kpi.color.slice(1)}`]}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Efeito de brilho no hover */}
                <div className={styles.kpiCardShine}></div>
                
                <CardHeader className={styles.kpiCardHeader}>
                  <CardTitle className={styles.kpiCardTitle}>
                    {kpi.title}
                  </CardTitle>
                  <div className={`${styles.kpiIconContainer} ${styles[`kpiIcon${kpi.color.charAt(0).toUpperCase() + kpi.color.slice(1)}`]}`}>
                    <IconComponent className={styles.kpiIcon} />
                  </div>
                </CardHeader>
                <CardContent className={styles.kpiCardContent}>
                  <div className={styles.kpiValue}>
                    {kpi.isPercentage ? `${kpi.value}%` : formatNumber(kpi.value)}
                  </div>
                  <div className={styles.kpiFooter}>
                    <div className={`${styles.kpiGrowth} ${getGrowthColor(kpi.growth)}`}>
                      {getGrowthIcon(kpi.growth)}
                      {Math.abs(kpi.growth)}%
                    </div>
                    <div className={styles.kpiDescription}>
                      {kpi.description}
                    </div>
                  </div>
                  <div className={styles.kpiSparkline}>
                    <Sparkline 
                      dataKey={index < 2 ? "published" : "engagements"} 
                      color={{
                        blue: "#3b82f6",
                        emerald: "#10b981",
                        violet: "#8b5cf6",
                        amber: "#f59e0b",
                        red: "#ef4444"
                      }[kpi.color as 'blue' | 'emerald' | 'violet' | 'amber' | 'red']} 
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
                  <div className="inline-flex items-center gap-1 rounded-lg border p-1 bg-white/60 dark:bg-slate-800/60">
                    <Button variant={timeRange === '7d' ? 'default' : 'ghost'} size="sm" onClick={() => setTimeRange('7d')}>7d</Button>
                    <Button variant={timeRange === '30d' ? 'default' : 'ghost'} size="sm" onClick={() => setTimeRange('30d')}>30d</Button>
                    <Button variant={timeRange === '90d' ? 'default' : 'ghost'} size="sm" onClick={() => setTimeRange('90d')}>90d</Button>
                  </div>
                  <Separator orientation="vertical" className="h-6" />
                  <div className="inline-flex items-center gap-1 rounded-lg border p-1 bg-white/60 dark:bg-slate-800/60">
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
                      tickFormatter={(value: number) => formatNumber(value)}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: 12, 
                        border: 'none',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        backgroundColor: 'hsl(var(--background))',
                        color: 'hsl(var(--foreground))'
                      }} 
                      formatter={(value: number, name: string) => [
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
          <Card className={styles.networkCard}>
            <CardHeader className={styles.networkHeader}>
              <CardTitle className={styles.networkTitle}>
                <Target className="h-5 w-5" />
                Distribuição por Rede
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.pieChartContainer}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={networkData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {networkData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className={styles.networkList}>
                {networkData.map((network, index) => (
                  <div key={index} className={styles.networkItem}>
                    <div className={styles.networkInfo}>
                      <div 
                        className={styles.networkColor}
                        style={{ backgroundColor: network.color }}
                      ></div>
                      <span className={styles.networkName}>{network.name}</span>
                    </div>
                    <div className={styles.networkProgress}>
                      <Progress value={network.value} className="w-16" />
                      <span className={styles.networkPercentage}>{network.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Cards */}
        <div className={styles.performanceGrid}>
          {/* Best Times */}
          <Card className={styles.bestTimesCard}>
            <CardHeader className={styles.bestTimesHeader}>
              <CardTitle className={styles.bestTimesTitle}>
                <Clock className="h-5 w-5" />
                Melhores Horários
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.timeSlotsList}>
                {timeSlots.map((slot, index) => (
                  <div key={index} className={styles.timeSlotItem}>
                    <div className={styles.timeSlotInfo}>
                      <span className={styles.timeSlotHour}>{slot.hour}</span>
                      <span className={styles.timeSlotPosts}>{slot.posts} posts</span>
                    </div>
                    <div className={styles.timeSlotProgress}>
                      <Progress value={slot.engagement} className="w-16" />
                      <span className={styles.timeSlotEngagement}>{slot.engagement}%</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.optimizeButton}>
                <Button variant="outline" size="sm" className="w-full">
                  <Zap className="h-4 w-4 mr-2" />
                  Otimizar Horários
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Posts */}
          <Card className={styles.upcomingPostsCard}>
            <CardHeader className={styles.upcomingPostsHeader}>
              <CardTitle className={styles.upcomingPostsTitle}>
                <Calendar className="h-5 w-5" />
                Próximos Posts
              </CardTitle>
            </CardHeader>
            <CardContent className={styles.upcomingPostsContent}>
              <div className={styles.upcomingPostsList}>
                {upcomingPosts.length > 0 ? (
                  upcomingPosts.map((post) => (
                    <div key={post.id} className={styles.upcomingPostItem}>
                      <div className={styles.upcomingPostContent}>
                        <div className={styles.upcomingPostText}>
                          <span className={styles.upcomingPostTitle}>{post.content}</span>
                        </div>
                        <div className={styles.upcomingPostMeta}>
                          <Badge variant="outline" className={styles.upcomingPostTime}>
                            {new Date(post.scheduledAt).toLocaleString()}
                          </Badge>
                          <div className={styles.upcomingPostNetworks}>
                            {post.networks.slice(0, 2).map((network) => (
                              <Badge key={network} variant="secondary" className={styles.networkBadge}>
                                {network}
                              </Badge>
                            ))}
                            {post.networks.length > 2 && (
                              <span className={styles.networkMore}>+{post.networks.length - 2}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={styles.upcomingPostCancel}
                        onClick={() => handleCancelPost(post.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className={styles.emptyUpcomingPosts}>
                    <Calendar className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p>Nenhum post agendado</p>
                  </div>
                )}
              </div>
              <div className={styles.upcomingPostsFooter}>
                <Button variant="outline" size="sm" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Agendar Post
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className={styles.quickActionsCard}>
            <CardHeader className={styles.quickActionsHeader}>
              <CardTitle className={styles.quickActionsTitle}>
                <Zap className="h-5 w-5" />
                Ações Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent className={styles.quickActionsContent}>
              <div className={styles.quickActionsList}>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Novo Post
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Agendar
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Relatórios
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Configurações
                </Button>
              </div>
              <Separator className="my-4" />
              <div className={styles.quickActionsStats}>
                <div className={styles.quickActionsStat}>
                  <span className={styles.quickActionsStatLabel}>Posts hoje</span>
                  <div className={styles.quickActionsStatProgress}>
                    <Progress value={75} className="w-12" />
                    <span className={styles.quickActionsStatValue}>3/4</span>
                  </div>
                </div>
                <div className={styles.quickActionsStat}>
                  <span className={styles.quickActionsStatLabel}>Meta semanal</span>
                  <div className={styles.quickActionsStatProgress}>
                    <Progress value={60} className="w-12" />
                    <span className={styles.quickActionsStatValue}>12/20</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Feed */}
        <div className={styles.activitySection}>
          <Card className={styles.activityCard}>
            <CardHeader className={styles.activityHeader}>
              <CardTitle className={styles.activityTitle}>
                <Activity className="h-5 w-5" />
                Atividade Recente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.activityList}>
                <div className={styles.activityItem}>
                  <div className={`${styles.activityIcon} bg-green-100 text-green-600`}>
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className={styles.activityContent}>
                    <p className={styles.activityText}>Post publicado com sucesso no LinkedIn</p>
                    <div className={styles.activityMeta}>
                      <span className={styles.activityTime}>há 2 minutos</span>
                      <Badge variant="secondary" className={styles.activityNetwork}>LinkedIn</Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className={styles.activityAction}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
                <div className={styles.activityItem}>
                  <div className={`${styles.activityIcon} bg-blue-100 text-blue-600`}>
                    <Heart className="h-4 w-4" />
                  </div>
                  <div className={styles.activityContent}>
                    <p className={styles.activityText}>Novo engajamento no Twitter</p>
                    <div className={styles.activityMeta}>
                      <span className={styles.activityTime}>há 5 minutos</span>
                      <Badge variant="secondary" className={styles.activityNetwork}>Twitter</Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className={styles.activityAction}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
                <div className={styles.activityItem}>
                  <div className={`${styles.activityIcon} bg-purple-100 text-purple-600`}>
                    <Share2 className="h-4 w-4" />
                  </div>
                  <div className={styles.activityContent}>
                    <p className={styles.activityText}>Post compartilhado no Instagram</p>
                    <div className={styles.activityMeta}>
                      <span className={styles.activityTime}>há 10 minutos</span>
                      <Badge variant="secondary" className={styles.activityNetwork}>Instagram</Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className={styles.activityAction}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className={styles.activityFooter}>
                <p className={styles.activityFooterText}>Mostrando últimas 3 atividades</p>
                <Button variant="outline" size="sm">
                  Ver todas
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Posts */}
        <div className={styles.recentPostsSection}>
          <Card className={styles.recentPostsCard}>
            <CardHeader className={styles.recentPostsHeader}>
              <div className={styles.recentPostsHeaderTitle}>
                <div className={styles.recentPostsHeaderLeft}>
                  <FileText className="h-5 w-5" />
                  <CardTitle>Posts Recentes</CardTitle>
                </div>
                <div className={styles.recentPostsHeaderActions}>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtrar
                  </Button>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Atualizar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className={styles.loadingContainer}>
                  <div className={styles.loadingSpinner}></div>
                </div>
              ) : (
                <>
                  <div className={styles.recentPostsList}>
                    {posts.length > 0 ? (
                      posts.slice(0, 5).map((post) => (
                        <div key={post.id} className={styles.recentPostItem}>
                          <div className={styles.recentPostContent}>
                            <div className={styles.recentPostStatus}>
                              <div 
                                className={`${styles.recentPostStatusDot} ${
                                  post.status === 'published' ? 'bg-green-500' :
                                  post.status === 'pending' ? 'bg-blue-500' :
                                  post.status === 'canceled' ? 'bg-gray-400' :
                                  'bg-red-500'
                                }`}
                              ></div>
                            </div>
                            <div className={styles.recentPostDetails}>
                              <div className={styles.recentPostMain}>
                                <div className={styles.recentPostTextContainer}>
                                  <p className={styles.recentPostText}>
                                    {post.content}
                                  </p>
                                  <div className={styles.recentPostMeta}>
                                    <span className={styles.recentPostDate}>
                                      {new Date(post.createdAt).toLocaleDateString()}
                                    </span>
                                    <div className={styles.recentPostNetworks}>
                                      {post.networks.map((network) => (
                                        <Badge key={network} variant="outline" className={styles.recentPostNetwork}>
                                          {network}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                <div className={styles.recentPostStatusBadge}>
                                  <Badge 
                                    variant={
                                      post.status === 'published' ? 'default' :
                                      post.status === 'pending' ? 'secondary' :
                                      post.status === 'canceled' ? 'outline' :
                                      'destructive'
                                    }
                                    className={styles.recentPostBadge}
                                  >
                                    {post.status === 'published' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                                    {post.status === 'pending' && post.scheduledAt && (
                                      <Clock className="h-3 w-3 mr-1" />
                                    )}
                                    {post.status === 'error' && <AlertTriangle className="h-3 w-3 mr-1" />}
                                    {post.status === 'published' ? 'Publicado' :
                                     post.status === 'pending' ? 'Agendado' :
                                     post.status === 'canceled' ? 'Cancelado' :
                                     'Erro'}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className={styles.recentPostActions}>
                            <Button variant="ghost" size="sm" className={styles.recentPostAction}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className={styles.recentPostAction}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            {post.status === 'pending' && post.scheduledAt && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className={`${styles.recentPostAction} ${styles.recentPostActionCancel}`}
                                onClick={() => handleCancelPost(post.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                            {post.status === 'error' && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className={`${styles.recentPostAction} ${styles.recentPostActionRetry}`}
                                onClick={() => handleRetryPost(post.id)}
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className={styles.emptyRecentPosts}>
                        <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p>Nenhum post encontrado</p>
                      </div>
                    )}
                  </div>
                  <div className={styles.recentPostsFooter}>
                    <p className={styles.recentPostsFooterText}>
                      Mostrando {Math.min(posts.length, 5)} de {posts.length} posts
                    </p>
                    <div className={styles.recentPostsFooterActions}>
                      <Button variant="outline" size="sm">
                        Ver todos
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Exportar
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Post Composer Modal */}
      {showComposer && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Novo Post</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowComposer(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className={styles.modalBody}>
              <PostComposer onClose={() => setShowComposer(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}