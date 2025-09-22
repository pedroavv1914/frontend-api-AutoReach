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
import './animations.css';
import './dashboard-improvements.css';

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
  { name: "Instagram", value: 45, color: "#E4405F" },
  { name: "LinkedIn", value: 30, color: "#0077B5" },
  { name: "Twitter", value: 25, color: "#1DA1F2" },
];

const bestTimes = [
  { time: "09:00", engagement: 85, posts: 12 },
  { time: "12:00", engagement: 92, posts: 18 },
  { time: "15:00", engagement: 78, posts: 15 },
  { time: "18:00", engagement: 95, posts: 22 },
  { time: "21:00", engagement: 88, posts: 16 },
];

const metricCfg = {
  published: { label: "Posts Publicados", color: "#3b82f6" },
  engagements: { label: "Engajamentos", color: "#10b981" },
  views: { label: "Visualizações", color: "#f59e0b" },
  clicks: { label: "Cliques", color: "#ef4444" },
  shares: { label: "Compartilhamentos", color: "#8b5cf6" },
  comments: { label: "Comentários", color: "#06b6d4" },
};

export default function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showComposer, setShowComposer] = useState(false);
  const [metric, setMetric] = useState<keyof typeof metricCfg>('published');

  // Dados expandidos para analytics
  const audienceData = [
    { age: "18-24", value: 25, male: 12, female: 13 },
    { age: "25-34", value: 35, male: 18, female: 17 },
    { age: "35-44", value: 22, male: 11, female: 11 },
    { age: "45-54", value: 12, male: 6, female: 6 },
    { age: "55+", value: 6, male: 3, female: 3 },
  ];

  const performanceMetrics = [
    { metric: "CTR", value: 3.2, change: 0.5, trend: "up" },
    { metric: "CPM", value: 12.50, change: -2.1, trend: "down" },
    { metric: "CPC", value: 0.85, change: 0.15, trend: "up" },
    { metric: "ROAS", value: 4.2, change: 0.8, trend: "up" },
  ];

  const topContent = [
    { title: "Como aumentar engajamento no Instagram", views: 15420, engagement: 8.5, shares: 245 },
    { title: "Estratégias de LinkedIn para B2B", views: 12380, engagement: 12.3, shares: 189 },
    { title: "Tendências do Twitter em 2024", views: 9850, engagement: 6.8, shares: 156 },
    { title: "Marketing de conteúdo eficaz", views: 8920, engagement: 9.2, shares: 134 },
    { title: "ROI em redes sociais", views: 7650, engagement: 11.1, shares: 98 },
  ];

  const competitorData = [
    { name: "Concorrente A", followers: 45000, engagement: 4.2, growth: 12 },
    { name: "Concorrente B", followers: 38000, engagement: 5.8, growth: 8 },
    { name: "Concorrente C", followers: 52000, engagement: 3.1, growth: 15 },
    { name: "Sua Marca", followers: 41000, engagement: 6.5, growth: 18 },
  ];

  const conversionFunnel = [
    { stage: "Impressões", value: 100000, percentage: 100 },
    { stage: "Cliques", value: 3200, percentage: 3.2 },
    { stage: "Visitas", value: 2800, percentage: 2.8 },
    { stage: "Leads", value: 420, percentage: 0.42 },
    { stage: "Conversões", value: 85, percentage: 0.085 },
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const handleRetryPost = async (postId: string) => {
    try {
      await postsApi.retry(postId);
      toast.success("Post reenviado com sucesso!");
      loadPosts();
    } catch (error) {
      console.error('Erro ao reenviar post:', error);
      toast.error("Erro ao reenviar post");
    }
  };

  const handleCancelPost = async (postId: string) => {
    try {
      await postsApi.cancel(postId);
      toast.success("Post cancelado com sucesso!");
      loadPosts();
    } catch (error) {
      console.error('Erro ao cancelar post:', error);
      toast.error("Erro ao cancelar post");
    }
  };

  const loadPosts = async () => {
    try {
      setLoading(true);
      const filters: PostFilters = { pageSize: 10 };
      const response = await postsApi.list(filters);
      setPosts(response.items);
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
      toast.error("Erro ao carregar posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const recentPosts = useMemo(() => {
    return posts.slice(0, 5);
  }, [posts]);

  return (
    <div className={`${styles.dashboardContainer} animate-fade-in`}>
      <div className={`${styles.dashboardHeader} animate-slide-in-left`}>
        <div className={styles.headerContent}>
          <div className={styles.headerTitle}>
            <div className={styles.titleSection}>
              <h1 className={styles.title}>
                <span className={styles.titlePrimary}>Dashboard</span>
                <span className={styles.titleSecondary}>Analytics</span>
              </h1>
              <p className={styles.subtitle}>
                Insights inteligentes para impulsionar seu crescimento digital
              </p>
            </div>
          </div>
          <div className={styles.headerActions}>
            <Button variant="outline" className={`${styles.outlineButton} hover-scale`}>
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
            <Button variant="outline" className={`${styles.outlineButton} hover-scale`}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button 
              className={`${styles.primaryButton} hover-scale micro-bounce`}
              onClick={() => setShowComposer(true)}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Novo Post
            </Button>
          </div>
        </div>
      </div>

      <div className={`${styles.kpiSection} animate-slide-in-right animate-stagger-1`}>
        <div className={styles.kpiGrid}>
          <div className={`${styles.kpiCard} card-entrance animate-stagger-1 hover-lift`}>
            <div className={styles.kpiCardHeader}>
              <h3 className={styles.kpiCardTitle}>Posts Publicados</h3>
              <div className={styles.kpiIconContainer}>
                <FileText className={styles.kpiIcon} />
              </div>
            </div>
            <div className={styles.kpiCardContent}>
              <div className={styles.kpiValue}>78</div>
              <div className={styles.kpiFooter}>
                <div className={`${styles.kpiGrowth} ${styles.kpiGrowthPositive}`}>
                  <ArrowUpRight className="h-4 w-4" />
                  <span>+12%</span>
                </div>
                <div className={styles.kpiDescription}>vs. mês anterior</div>
              </div>
            </div>
          </div>

          <div className={`${styles.kpiCard} card-entrance animate-stagger-2 hover-lift`}>
            <div className={styles.kpiCardHeader}>
              <h3 className={styles.kpiCardTitle}>Engajamentos</h3>
              <div className={styles.kpiIconContainer}>
                <Heart className={styles.kpiIcon} />
              </div>
            </div>
            <div className={styles.kpiCardContent}>
              <div className={styles.kpiValue}>2.4K</div>
              <div className={styles.kpiFooter}>
                <div className={`${styles.kpiGrowth} ${styles.kpiGrowthPositive}`}>
                  <ArrowUpRight className="h-4 w-4" />
                  <span>+18%</span>
                </div>
                <div className={styles.kpiDescription}>vs. mês anterior</div>
              </div>
            </div>
          </div>

          <div className={`${styles.kpiCard} card-entrance animate-stagger-3 hover-lift`}>
            <div className={styles.kpiCardHeader}>
              <h3 className={styles.kpiCardTitle}>Visualizações</h3>
              <div className={styles.kpiIconContainer}>
                <Eye className={styles.kpiIcon} />
              </div>
            </div>
            <div className={styles.kpiCardContent}>
              <div className={styles.kpiValue}>24.8K</div>
              <div className={styles.kpiFooter}>
                <div className={`${styles.kpiGrowth} ${styles.kpiGrowthPositive}`}>
                  <ArrowUpRight className="h-4 w-4" />
                  <span>+25%</span>
                </div>
                <div className={styles.kpiDescription}>vs. mês anterior</div>
              </div>
            </div>
          </div>

          <div className={`${styles.kpiCard} card-entrance animate-stagger-4 hover-lift`}>
            <div className={styles.kpiCardHeader}>
              <h3 className={styles.kpiCardTitle}>Taxa de Crescimento</h3>
              <div className={styles.kpiIconContainer}>
                <TrendingUp className={styles.kpiIcon} />
              </div>
            </div>
            <div className={styles.kpiCardContent}>
              <div className={styles.kpiValue}>94%</div>
              <div className={styles.kpiFooter}>
                <div className={`${styles.kpiGrowth} ${styles.kpiGrowthPositive}`}>
                  <ArrowUpRight className="h-4 w-4" />
                  <span>+8%</span>
                </div>
                <div className={styles.kpiDescription}>vs. mês anterior</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles.analyticsSection} animate-fade-in animate-stagger-2`}>
        <div className={styles.analyticsGrid}>
          <Card className={`${styles.mainAnalyticsCard} chart-entrance animate-stagger-1`}>
            <CardHeader className={styles.analyticsHeader}>
              <CardTitle className={styles.analyticsTitle}>
                <Activity className="h-5 w-5" />
                Performance Overview
              </CardTitle>
              <div className={styles.metricSelector}>
                {Object.entries(metricCfg).map(([key, config]) => (
                  <Button
                    key={key}
                    variant={metric === key ? "default" : "outline"}
                    size="sm"
                    className={`${styles.metricButton} metric-entrance animate-stagger-1 hover-scale micro-bounce`}
                    onClick={() => setMetric(key as keyof typeof metricCfg)}
                  >
                    <span style={{ 
                      color: metric === key ? '#ffffff' : '#1f2937',
                      fontWeight: '600',
                      display: 'block'
                    }}>
                      {config.label}
                    </span>
                  </Button>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className={`${styles.chartContainer} chart-entrance animate-stagger-2`}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={metricCfg[metric].color} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={metricCfg[metric].color} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#1f2937' }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#1f2937' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey={metric}
                      stroke={metricCfg[metric].color}
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorMetric)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className={styles.sideAnalytics}>
            <Card className={`${styles.networkCard} animate-slide-in-right card-entrance animate-stagger-2 hover-lift`}>
              <CardHeader className={styles.networkHeader}>
                <CardTitle className={styles.networkTitle}>
                  <Target className="h-5 w-5" />
                  Distribuição por Rede
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={styles.networkLegend}>
                  {networkData.map((network) => (
                    <div key={network.name} className={styles.networkLegendItem}>
                      <div 
                        className={styles.networkLegendColor}
                        style={{ backgroundColor: network.color }}
                      ></div>
                      <span className={styles.networkLegendLabel}>{network.name}</span>
                      <span className={styles.networkLegendValue}>{network.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className={`${styles.timesCard} card-entrance animate-stagger-3 hover-lift`}>
              <CardHeader className={styles.timesHeader}>
                <CardTitle className={styles.timesTitle}>
                  <Clock className="h-5 w-5" />
                  Melhores Horários
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={styles.timesList}>
                  {bestTimes.map((time) => (
                    <div key={time.time} className={styles.timeSlot}>
                      <div className={styles.timeInfo}>
                        <span className={styles.timeValue}>{time.time}</span>
                        <span className={styles.timeEngagement}>{time.engagement}% engajamento</span>
                      </div>
                      <div className={styles.timeStats}>
                        <span className={styles.timePosts}>{time.posts} posts</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Nova seção de Analytics Detalhados */}
        <div className={`${styles.detailedAnalyticsSection} animate-fade-in animate-stagger-3`}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <BarChart3 className="h-6 w-6" />
              Analytics Detalhados
            </h2>
          </div>
          
          <div className={styles.analyticsDetailGrid}>
            {/* Audiência */}
            <Card className={`${styles.audienceCard} card-entrance animate-stagger-1 hover-lift`}>
              <CardHeader>
                <CardTitle className={styles.cardTitle}>
                  <Users className="h-5 w-5" />
                  Demografia da Audiência
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={styles.audienceChart}>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={audienceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="age" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="male" stackId="a" fill="#3b82f6" />
                      <Bar dataKey="female" stackId="a" fill="#ec4899" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className={styles.audienceLegend}>
                  <div className={styles.legendItem}>
                    <div className={styles.legendColor} style={{ backgroundColor: '#3b82f6' }}></div>
                    <span>Masculino</span>
                  </div>
                  <div className={styles.legendItem}>
                    <div className={styles.legendColor} style={{ backgroundColor: '#ec4899' }}></div>
                    <span>Feminino</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Content */}
            <Card className={`${styles.topContentCard} card-entrance animate-stagger-2 hover-lift`}>
              <CardHeader>
                <CardTitle className={styles.cardTitle}>
                  <TrendingUp className="h-5 w-5" />
                  Conteúdo com Melhor Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={styles.topContentList}>
                  {topContent.map((content, index) => (
                    <div key={index} className={styles.topContentItem}>
                      <div className={styles.contentRank}>{index + 1}</div>
                      <div className={styles.contentInfo}>
                        <h4 className={styles.contentTitle}>{content.title}</h4>
                        <div className={styles.contentStats}>
                          <span className={styles.contentStat}>
                            <Eye className="h-4 w-4" />
                            {formatNumber(content.views)}
                          </span>
                          <span className={styles.contentStat}>
                            <Heart className="h-4 w-4" />
                            {content.engagement}%
                          </span>
                          <span className={styles.contentStat}>
                            <Share2 className="h-4 w-4" />
                            {content.shares}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Análise Competitiva */}
            <Card className={`${styles.competitorCard} card-entrance animate-stagger-3 hover-lift`}>
              <CardHeader>
                <CardTitle className={styles.cardTitle}>
                  <Target className="h-5 w-5" />
                  Análise Competitiva
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={styles.competitorList}>
                  {competitorData.map((competitor, index) => (
                    <div key={index} className={`${styles.competitorItem} ${competitor.name === 'Sua Marca' ? styles.yourBrand : ''}`}>
                      <div className={styles.competitorName}>{competitor.name}</div>
                      <div className={styles.competitorStats}>
                        <div className={styles.competitorStat}>
                          <span className={styles.statLabel}>Seguidores</span>
                          <span className={styles.statValue}>{formatNumber(competitor.followers)}</span>
                        </div>
                        <div className={styles.competitorStat}>
                          <span className={styles.statLabel}>Engajamento</span>
                          <span className={styles.statValue}>{competitor.engagement}%</span>
                        </div>
                        <div className={styles.competitorStat}>
                          <span className={styles.statLabel}>Crescimento</span>
                          <span className={`${styles.statValue} ${styles.growthValue}`}>
                            <ArrowUpRight className="h-4 w-4" />
                            {competitor.growth}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Nova seção de Performance Metrics */}
        <div className={`${styles.performanceSection} animate-fade-in animate-stagger-4`}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <Zap className="h-6 w-6" />
              Métricas de Performance
            </h2>
          </div>
          
          <div className={styles.performanceGrid}>
            {/* KPIs de Performance */}
            <div className={styles.performanceKpis}>
              {performanceMetrics.map((metric, index) => (
                <Card key={index} className={`${styles.performanceKpiCard} card-entrance animate-stagger-${index + 1} hover-lift`}>
                  <CardContent className={styles.performanceKpiContent}>
                    <div className={styles.kpiHeader}>
                      <span className={styles.kpiMetricName}>{metric.metric}</span>
                      <div className={`${styles.kpiTrend} ${metric.trend === 'up' ? styles.trendUp : styles.trendDown}`}>
                        {metric.trend === 'up' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                        {Math.abs(metric.change)}
                      </div>
                    </div>
                    <div className={styles.kpiValue}>
                      {metric.metric === 'CPM' || metric.metric === 'CPC' ? '$' : ''}{metric.value}
                      {metric.metric === 'CTR' ? '%' : ''}
                      {metric.metric === 'ROAS' ? 'x' : ''}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Funil de Conversão */}
            <Card className={`${styles.conversionFunnelCard} card-entrance animate-stagger-5 hover-lift`}>
              <CardHeader>
                <CardTitle className={styles.cardTitle}>
                  <Activity className="h-5 w-5" />
                  Funil de Conversão
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={styles.funnelContainer}>
                  {conversionFunnel.map((stage, index) => (
                    <div key={index} className={styles.funnelStage}>
                      <div className={styles.funnelStageInfo}>
                        <span className={styles.funnelStageName}>{stage.stage}</span>
                        <span className={styles.funnelStageValue}>{formatNumber(stage.value)}</span>
                      </div>
                      <div className={styles.funnelBar}>
                        <div 
                          className={styles.funnelBarFill}
                          style={{ width: `${stage.percentage * 10}%` }}
                        ></div>
                      </div>
                      <span className={styles.funnelStagePercentage}>{stage.percentage}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className={`${styles.quickActionsSection} animate-fade-in animate-stagger-3`}>
          <div className={styles.quickActionsHeader}>
            <h3 className={styles.quickActionsTitle}>Ações Rápidas</h3>
          </div>
          <div className={styles.quickActionsGrid}>
            <Button className={`${styles.actionCard} card-entrance animate-stagger-1 hover-lift micro-bounce`}>
              <PlusCircle className="h-6 w-6 mb-2" />
              <span>Criar Post</span>
            </Button>
            <Button className={`${styles.actionCard} card-entrance animate-stagger-2 hover-lift micro-bounce`}>
              <Calendar className="h-6 w-6 mb-2" />
              <span>Agendar Posts</span>
            </Button>
            <Button className={`${styles.actionCard} card-entrance animate-stagger-3 hover-lift micro-bounce`}>
              <BarChart3 className="h-6 w-6 mb-2" />
              <span>Ver Relatórios</span>
            </Button>
            <Button className={`${styles.actionCard} card-entrance animate-stagger-4 hover-lift micro-bounce`}>
              <Settings className="h-6 w-6 mb-2" />
              <span>Configurações</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-4 2xl:gap-8">
        <div className="lg:col-span-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: metricCfg[metric].color }}></div>
                  <span className="text-sm font-medium">{metricCfg[metric].label}</span>
                  <div className="text-sm text-muted-foreground">
                    Total: {formatNumber(chartData.reduce((acc, curr) => acc + curr[metric], 0))}
                  </div>
                </div>
                <Button variant="outline" size="sm" className={`${styles.outlineButton} ${styles.buttonSm}`}>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>

      <Card className={styles.recentPostsCard}>
        <CardHeader className={styles.recentPostsHeader}>
          <CardTitle className={styles.recentPostsTitle}>
            <FileText className="h-5 w-5" />
            Posts Recentes
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            className={`${styles.outlineButton} ${styles.buttonSm}`}
            onClick={() => setShowComposer(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Post
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className={styles.loadingState}>
              <div className={styles.loadingSpinner}></div>
              <p>Carregando posts...</p>
            </div>
          ) : (
            <>
              <div className={styles.recentPostsList}>
                {recentPosts.length > 0 ? (
                  recentPosts.map((post) => (
                    <div key={post.id} className={styles.recentPostItem}>
                      <div className={styles.recentPostContent}>
                        <div className={styles.recentPostHeader}>
                          <h4 className={styles.recentPostTitle}>{post.content.substring(0, 50)}...</h4>
                          <div className={styles.recentPostMeta}>
                            <Badge 
                              className={`${
                                post.status === 'published' ? styles.publishedBadge :
                                post.status === 'pending' ? styles.pendingBadge :
                                post.status === 'error' ? styles.errorBadge :
                                styles.canceledBadge
                              } ${styles.recentPostBadge}`}
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
                      <div className={styles.recentPostActions}>
                        <Button variant="ghost" size="sm" className={`${styles.ghostButton} ${styles.buttonSm} ${styles.recentPostAction}`}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className={`${styles.ghostButton} ${styles.buttonSm} ${styles.recentPostAction}`}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        {post.status === 'pending' && post.scheduledAt && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={`${styles.ghostButton} ${styles.buttonSm} ${styles.recentPostAction} ${styles.recentPostActionCancel}`}
                            onClick={() => handleCancelPost(post.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                        {post.status === 'error' && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={`${styles.ghostButton} ${styles.buttonSm} ${styles.recentPostAction} ${styles.recentPostActionRetry}`}
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
                  <Button variant="outline" size="sm" className={`${styles.outlineButton} ${styles.buttonSm}`}>
                    Ver todos
                  </Button>
                  <Button variant="outline" size="sm" className={`${styles.outlineButton} ${styles.buttonSm}`}>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {showComposer && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Novo Post</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`${styles.ghostButton} ${styles.buttonSm}`}
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