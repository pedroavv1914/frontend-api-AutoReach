"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  PlusCircle, 
  Calendar,
  Sparkles,
  Filter,
  Search,
  MoreHorizontal,
  TrendingUp,
  Users,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  BarChart3,
  Settings,
  Download,
  RefreshCw,
  Zap,
  Target,
  Globe,
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
  Youtube,
  ArrowUpRight,
  ChevronDown,
  SortAsc,
  SortDesc,
  Grid3X3,
  List,
  Bookmark,
  Edit3,
  Trash2,
  Copy,
  ExternalLink,
  RotateCcw,
  AlertTriangle
} from "lucide-react";

export default function PostsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedNetwork, setSelectedNetwork] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [selectedAuthor, setSelectedAuthor] = useState("all");

  // Dados mais ricos e realistas
  const items = [
    { 
      id: "1", 
      text: "🚀 Lançamento da nova funcionalidade de IA para análise de sentimentos! Revolucione sua estratégia de conteúdo com insights em tempo real.", 
      status: "pending", 
      scheduledAt: "2025-01-25 14:30", 
      network: "LinkedIn",
      author: "Pedro Silva",
      avatar: "/avatars/pedro.jpg",
      engagement: { likes: 0, comments: 0, shares: 0, views: 0 },
      performance: 0,
      tags: ["IA", "Análise", "Inovação"],
      priority: "high"
    },
    { 
      id: "2", 
      text: "✨ Dicas essenciais para criar conteúdo que engaja! Descubra os segredos por trás dos posts virais.", 
      status: "published", 
      scheduledAt: null, 
      network: "Instagram",
      author: "Maria Santos",
      avatar: "/avatars/maria.jpg",
      engagement: { likes: 1247, comments: 89, shares: 156, views: 8934 },
      performance: 87,
      tags: ["Marketing", "Engajamento", "Dicas"],
      priority: "medium",
      publishedAt: "2025-01-24 09:15"
    },
    { 
      id: "3", 
      text: "🔥 Thread sobre as tendências de marketing digital para 2025. Prepare-se para o futuro!", 
      status: "error", 
      scheduledAt: null, 
      network: "Twitter",
      author: "João Costa",
      avatar: "/avatars/joao.jpg",
      engagement: { likes: 0, comments: 0, shares: 0, views: 0 },
      performance: 0,
      tags: ["Tendências", "Marketing", "2025"],
      priority: "high",
      errorMessage: "Falha na autenticação da API do Twitter"
    },
    { 
      id: "4", 
      text: "📊 Relatório completo: Como aumentamos o ROI em 300% com estratégias de conteúdo data-driven.", 
      status: "published", 
      scheduledAt: null, 
      network: "LinkedIn",
      author: "Ana Oliveira",
      avatar: "/avatars/ana.jpg",
      engagement: { likes: 892, comments: 67, shares: 234, views: 5621 },
      performance: 92,
      tags: ["ROI", "Dados", "Estratégia"],
      priority: "high",
      publishedAt: "2025-01-23 16:45"
    },
    { 
      id: "5", 
      text: "🎯 Webinar gratuito: Automação de Marketing para Pequenas Empresas. Inscreva-se já!", 
      status: "pending", 
      scheduledAt: "2025-01-26 10:00", 
      network: "Facebook",
      author: "Carlos Mendes",
      avatar: "/avatars/carlos.jpg",
      engagement: { likes: 0, comments: 0, shares: 0, views: 0 },
      performance: 0,
      tags: ["Webinar", "Automação", "PME"],
      priority: "medium"
    },
    { 
      id: "6", 
      text: "🌟 Case study: Como uma startup conseguiu 1M de seguidores em 6 meses usando nossa plataforma.", 
      status: "published", 
      scheduledAt: null, 
      network: "Instagram",
      author: "Lucia Ferreira",
      avatar: "/avatars/lucia.jpg",
      engagement: { likes: 2156, comments: 143, shares: 298, views: 12847 },
      performance: 95,
      tags: ["Case Study", "Crescimento", "Startup"],
      priority: "high",
      publishedAt: "2025-01-22 11:30"
    }
  ];

  // Configurações de status mais sofisticadas
  const statusConfig = {
    pending: { 
      color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-800', 
      icon: Clock, 
      label: 'Agendado',
      gradient: 'from-amber-500 to-orange-500'
    },
    published: { 
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800', 
      icon: CheckCircle2, 
      label: 'Publicado',
      gradient: 'from-emerald-500 to-teal-500'
    },
    error: { 
      color: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-800', 
      icon: XCircle, 
      label: 'Erro',
      gradient: 'from-red-500 to-pink-500'
    }
  };

  // Ícones das redes sociais
  const networkIcons = {
    LinkedIn: Linkedin,
    Instagram: Instagram,
    Twitter: Twitter,
    Facebook: Facebook,
    YouTube: Youtube
  };

  // Lógica de filtros avançados
  const filteredItems = items.filter(item => {
    const matchesSearch = item.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesNetwork = selectedNetwork === "all" || item.network === selectedNetwork;
    const matchesTab = activeTab === "all" || item.status === activeTab;
    const matchesPriority = selectedPriority === "all" || item.priority === selectedPriority;
    const matchesAuthor = selectedAuthor === "all" || item.author === selectedAuthor;
    
    // Filtro por data
    let matchesDate = true;
    if (dateRange !== "all") {
      const now = new Date();
      const itemDate = new Date(item.scheduledAt || item.publishedAt || now);
      
      switch (dateRange) {
        case "today":
          matchesDate = itemDate.toDateString() === now.toDateString();
          break;
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = itemDate >= weekAgo;
          break;
        case "month":
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = itemDate >= monthAgo;
          break;
      }
    }
    
    return matchesSearch && matchesNetwork && matchesTab && matchesPriority && matchesAuthor && matchesDate;
  }).sort((a, b) => {
    switch (sortBy) {
      case "date":
        return new Date(b.scheduledAt || b.publishedAt || 0).getTime() - 
               new Date(a.scheduledAt || a.publishedAt || 0).getTime();
      case "performance":
        return (b.performance || 0) - (a.performance || 0);
      case "engagement":
        return (b.engagement?.likes || 0) - (a.engagement?.likes || 0);
      case "priority":
        const priorityOrder = { "high": 3, "medium": 2, "low": 1 };
        return (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) - 
               (priorityOrder[a.priority as keyof typeof priorityOrder] || 0);
      case "author":
        return a.author.localeCompare(b.author);
      default:
        return 0;
    }
  });

  // Lista de autores únicos para filtro
  const uniqueAuthors = [...new Set(items.map(item => item.author))];

  // Função para resetar filtros
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedNetwork("all");
    setSelectedPriority("all");
    setDateRange("all");
    setSelectedAuthor("all");
    setSortBy("date");
  };

  // Estatísticas do dashboard
  const stats = {
    total: items.length,
    pending: items.filter(item => item.status === 'pending').length,
    published: items.filter(item => item.status === 'published').length,
    errors: items.filter(item => item.status === 'error').length,
    totalEngagement: items.reduce((acc, item) => acc + (item.engagement?.likes || 0) + (item.engagement?.comments || 0) + (item.engagement?.shares || 0), 0),
    avgPerformance: Math.round(items.filter(item => item.performance > 0).reduce((acc, item) => acc + item.performance, 0) / items.filter(item => item.performance > 0).length) || 0
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-950 dark:via-blue-950/30 dark:to-purple-950/20">
      {/* Header Profissional com Dashboard */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-800 dark:via-purple-800 dark:to-pink-800">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1)_0%,transparent_50%)] bg-[length:80px_80px]"></div>
        
        <div className="relative w-full px-6 lg:px-12 xl:px-16 2xl:px-24 py-8">
          {/* Header Principal */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8 mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg">
                  <BarChart3 className="h-7 w-7 text-white" />
                </div>
                <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm border-0 shadow-sm text-white px-4 py-2">
                  <Zap className="h-4 w-4 mr-2" />
                  Dashboard de Posts
                </Badge>
              </div>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 leading-tight">
                Gestão Inteligente
                <span className="block text-3xl lg:text-4xl xl:text-5xl bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  de Conteúdo
                </span>
              </h1>
              <p className="text-lg lg:text-xl text-blue-100 max-w-3xl leading-relaxed">
                Monitore, analise e otimize sua presença digital com insights em tempo real e automação inteligente.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Button 
                asChild 
                size="lg"
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 px-8 py-3"
              >
                <Link href="/posts/new">
                  <PlusCircle className="h-5 w-5 mr-2" />
                  Criar Post
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="bg-transparent border-white/30 text-white hover:bg-white/10 backdrop-blur-sm shadow-lg px-6 py-3"
              >
                <Settings className="h-5 w-5 mr-2" />
                Configurações
              </Button>
            </div>
          </div>

          {/* Dashboard de Estatísticas */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm font-medium">Total de Posts</p>
                    <p className="text-3xl font-bold text-white">{stats.total}</p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm font-medium">Engajamento Total</p>
                    <p className="text-3xl font-bold text-white">{stats.totalEngagement.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm font-medium">Performance Média</p>
                    <p className="text-3xl font-bold text-white">{stats.avgPerformance}%</p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm font-medium">Agendados</p>
                    <p className="text-3xl font-bold text-white">{stats.pending}</p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Área de Controles e Filtros Avançados */}
      <div className="w-full px-6 lg:px-12 xl:px-16 2xl:px-24 py-8 space-y-8">
        {/* Barra de Controles Superior */}
        <div className="flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Busca Avançada */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por conteúdo, autor ou tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg focus:shadow-xl transition-all duration-300"
              />
            </div>

            {/* Filtro por Rede Social */}
            <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
              <SelectTrigger className="w-48 bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg">
                <Globe className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Todas as redes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as redes</SelectItem>
                <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                <SelectItem value="Instagram">Instagram</SelectItem>
                <SelectItem value="Twitter">Twitter</SelectItem>
                <SelectItem value="Facebook">Facebook</SelectItem>
                <SelectItem value="YouTube">YouTube</SelectItem>
              </SelectContent>
            </Select>

            {/* Ordenação */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48 bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg">
                <SortDesc className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Data</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
                <SelectItem value="engagement">Engajamento</SelectItem>
                <SelectItem value="priority">Prioridade</SelectItem>
                <SelectItem value="author">Autor</SelectItem>
              </SelectContent>
            </Select>

            {/* Botão de Filtros Avançados */}
            <Button
              variant={showFilters ? "default" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
              className="bg-white/80 backdrop-blur-sm shadow-lg"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>

          {/* Controles de Visualização */}
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-lg p-1 shadow-lg">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-8 w-8 p-0"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="h-8 w-8 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            
            <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm shadow-lg">
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            
            <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm shadow-lg">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Filtros Avançados (Expansível) */}
        {showFilters && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                <SelectTrigger className="border-gray-200 focus:border-blue-500">
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Prioridades</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="low">Baixa</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="border-gray-200 focus:border-blue-500">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Períodos</SelectItem>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="week">Última Semana</SelectItem>
                  <SelectItem value="month">Último Mês</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedAuthor} onValueChange={setSelectedAuthor}>
                <SelectTrigger className="border-gray-200 focus:border-blue-500">
                  <SelectValue placeholder="Autor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Autores</SelectItem>
                  {uniqueAuthors.map((author) => (
                    <SelectItem key={author} value={author}>{author}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={resetFilters}
                className="border-gray-200 hover:bg-gray-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Limpar Filtros
              </Button>
            </div>
          </div>
        )}

        {/* Tabs Melhoradas */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-white/90 backdrop-blur-sm shadow-xl border-0 p-1 rounded-xl">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg px-6 py-3 rounded-lg font-medium transition-all duration-300"
            >
              <FileText className="h-4 w-4 mr-2" />
              Todos ({stats.total})
            </TabsTrigger>
            <TabsTrigger 
              value="pending" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-lg px-6 py-3 rounded-lg font-medium transition-all duration-300"
            >
              <Clock className="h-4 w-4 mr-2" />
              Agendados ({stats.pending})
            </TabsTrigger>
            <TabsTrigger 
              value="published" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-lg px-6 py-3 rounded-lg font-medium transition-all duration-300"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Publicados ({stats.published})
            </TabsTrigger>
            <TabsTrigger 
              value="error" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg px-6 py-3 rounded-lg font-medium transition-all duration-300"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Erros ({stats.errors})
            </TabsTrigger>
          </TabsList>
            
          <TabsContent value="all" className="mt-8">
            <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
              {filteredItems.map((post, index) => {
                const config = statusConfig[post.status as keyof typeof statusConfig];
                const IconComponent = config.icon;
                const NetworkIcon = networkIcons[post.network as keyof typeof networkIcons];
                
                return (
                  <Card 
                    key={post.id} 
                    className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg bg-white/90 backdrop-blur-sm overflow-hidden relative"
                  >
                    {/* Indicador de Prioridade */}
                    {post.priority === "high" && (
                      <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-red-500">
                        <div className="absolute -top-4 -right-1 text-white text-xs font-bold transform rotate-45">
                          !
                        </div>
                      </div>
                    )}

                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 ring-2 ring-gray-100">
                            <AvatarImage src={post.avatar} alt={post.author} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                              {post.author.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-gray-900">{post.author}</p>
                            <p className="text-sm text-gray-500">
                              {post.publishedAt ? `Publicado em ${post.publishedAt}` : 
                               post.scheduledAt ? `Agendado para ${post.scheduledAt}` : 
                               'Rascunho'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge className={`${config.color} border font-medium`}>
                            <IconComponent className="h-3 w-3 mr-1" />
                            {config.label}
                          </Badge>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors leading-relaxed">
                        {post.text}
                      </CardTitle>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {post.tags.map((tag, tagIndex) => (
                          <Badge 
                            key={tagIndex} 
                            variant="secondary" 
                            className="bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-xs"
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0 space-y-4">
                      {/* Rede Social */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
                            <NetworkIcon className="h-4 w-4 text-gray-600" />
                          </div>
                          <span className="font-medium text-gray-700">{post.network}</span>
                        </div>
                        
                        {post.performance > 0 && (
                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <p className="text-sm font-semibold text-gray-900">{post.performance}%</p>
                              <p className="text-xs text-gray-500">Performance</p>
                            </div>
                            <div className="w-12">
                              <Progress value={post.performance} className="h-2" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Métricas de Engajamento */}
                      {post.status === 'published' && (
                        <div className="grid grid-cols-4 gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-1">
                              <Eye className="h-4 w-4 text-blue-500" />
                            </div>
                            <p className="text-sm font-semibold text-gray-900">{post.engagement.views.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">Visualizações</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-1">
                              <Heart className="h-4 w-4 text-red-500" />
                            </div>
                            <p className="text-sm font-semibold text-gray-900">{post.engagement.likes.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">Curtidas</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-1">
                              <MessageCircle className="h-4 w-4 text-green-500" />
                            </div>
                            <p className="text-sm font-semibold text-gray-900">{post.engagement.comments}</p>
                            <p className="text-xs text-gray-500">Comentários</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-1">
                              <Share2 className="h-4 w-4 text-purple-500" />
                            </div>
                            <p className="text-sm font-semibold text-gray-900">{post.engagement.shares}</p>
                            <p className="text-xs text-gray-500">Compartilhamentos</p>
                          </div>
                        </div>
                      )}

                      {/* Erro */}
                      {post.status === 'error' && post.errorMessage && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <XCircle className="h-4 w-4 text-red-500" />
                            <p className="text-sm font-semibold text-red-700">Erro na Publicação</p>
                          </div>
                          <p className="text-sm text-red-600">{post.errorMessage}</p>
                        </div>
                      )}

                      {/* Ações */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="h-8 px-3 text-gray-600 hover:text-indigo-600">
                            <Edit3 className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 px-3 text-gray-600 hover:text-blue-600">
                            <Copy className="h-4 w-4 mr-1" />
                            Duplicar
                          </Button>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-600 hover:text-yellow-600">
                            <Bookmark className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-600 hover:text-blue-600">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-600 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Estado Vazio */}
            {filteredItems.length === 0 && (
              <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                <CardContent className="py-16 text-center">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                    <Search className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Nenhum post encontrado</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Não encontramos posts que correspondam aos seus critérios de busca. Tente ajustar os filtros ou criar um novo post.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button asChild className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600">
                      <Link href="/posts/new">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Criar Primeiro Post
                      </Link>
                    </Button>
                    <Button variant="outline" onClick={() => {
                      setSearchTerm("");
                      setSelectedNetwork("all");
                      setActiveTab("all");
                    }}>
                      Limpar Filtros
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          {/* Outras abas com conteúdo otimizado */}
          <TabsContent value="pending" className="mt-8">
            <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
              {filteredItems.filter(item => item.status === 'pending').map((post, index) => {
                const config = statusConfig[post.status as keyof typeof statusConfig];
                const IconComponent = config.icon;
                const NetworkIcon = networkIcons[post.network as keyof typeof networkIcons];
                
                return (
                  <Card 
                    key={post.id} 
                    className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50 backdrop-blur-sm overflow-hidden relative"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-500"></div>
                    
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 ring-2 ring-amber-200">
                            <AvatarImage src={post.avatar} alt={post.author} />
                            <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-500 text-white font-semibold">
                              {post.author.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-gray-900">{post.author}</p>
                            <p className="text-sm text-amber-600 font-medium">
                              Agendado para {post.scheduledAt}
                            </p>
                          </div>
                        </div>
                        
                        <Badge className="bg-amber-100 text-amber-700 border-amber-200 font-medium">
                          <Clock className="h-3 w-3 mr-1" />
                          Pendente
                        </Badge>
                      </div>

                      <CardTitle className="text-lg font-semibold text-gray-900 leading-relaxed">
                        {post.text}
                      </CardTitle>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {post.tags.map((tag, tagIndex) => (
                          <Badge 
                            key={tagIndex} 
                            variant="secondary" 
                            className="bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors text-xs"
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0 space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg">
                          <NetworkIcon className="h-4 w-4 text-amber-600" />
                        </div>
                        <span className="font-medium text-gray-700">{post.network}</span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-amber-100">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="h-8 px-3 text-amber-600 hover:text-amber-700 hover:bg-amber-100">
                            <Edit3 className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 px-3 text-amber-600 hover:text-amber-700 hover:bg-amber-100">
                            <Calendar className="h-4 w-4 mr-1" />
                            Reagendar
                          </Button>
                        </div>
                        
                        <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
                          Publicar Agora
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="published" className="mt-8">
            <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
              {filteredItems.filter(item => item.status === 'published').map((post, index) => {
                const NetworkIcon = networkIcons[post.network as keyof typeof networkIcons];
                
                return (
                  <Card 
                    key={post.id} 
                    className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-teal-50 backdrop-blur-sm overflow-hidden relative"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                    
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 ring-2 ring-emerald-200">
                            <AvatarImage src={post.avatar} alt={post.author} />
                            <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white font-semibold">
                              {post.author.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-gray-900">{post.author}</p>
                            <p className="text-sm text-emerald-600 font-medium">
                              Publicado em {post.publishedAt}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 font-medium">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Publicado
                          </Badge>
                          <div className="text-right">
                            <p className="text-sm font-bold text-emerald-600">{post.performance}%</p>
                          </div>
                        </div>
                      </div>

                      <CardTitle className="text-lg font-semibold text-gray-900 leading-relaxed">
                        {post.text}
                      </CardTitle>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {post.tags.map((tag, tagIndex) => (
                          <Badge 
                            key={tagIndex} 
                            variant="secondary" 
                            className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors text-xs"
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0 space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg">
                          <NetworkIcon className="h-4 w-4 text-emerald-600" />
                        </div>
                        <span className="font-medium text-gray-700">{post.network}</span>
                      </div>

                      <div className="grid grid-cols-4 gap-3 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg">
                        <div className="text-center">
                          <Eye className="h-4 w-4 text-emerald-500 mx-auto mb-1" />
                          <p className="text-xs font-semibold text-gray-900">{post.engagement.views.toLocaleString()}</p>
                        </div>
                        <div className="text-center">
                          <Heart className="h-4 w-4 text-red-500 mx-auto mb-1" />
                          <p className="text-xs font-semibold text-gray-900">{post.engagement.likes.toLocaleString()}</p>
                        </div>
                        <div className="text-center">
                          <MessageCircle className="h-4 w-4 text-green-500 mx-auto mb-1" />
                          <p className="text-xs font-semibold text-gray-900">{post.engagement.comments}</p>
                        </div>
                        <div className="text-center">
                          <Share2 className="h-4 w-4 text-purple-500 mx-auto mb-1" />
                          <p className="text-xs font-semibold text-gray-900">{post.engagement.shares}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-emerald-100">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="h-8 px-3 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100">
                            <BarChart3 className="h-4 w-4 mr-1" />
                            Análise
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 px-3 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100">
                            <Copy className="h-4 w-4 mr-1" />
                            Duplicar
                          </Button>
                        </div>
                        
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="error" className="mt-8">
            <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
              {filteredItems.filter(item => item.status === 'error').map((post, index) => {
                const NetworkIcon = networkIcons[post.network as keyof typeof networkIcons];
                
                return (
                  <Card 
                    key={post.id} 
                    className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg bg-gradient-to-br from-red-50 to-pink-50 backdrop-blur-sm overflow-hidden relative"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-pink-500"></div>
                    
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 ring-2 ring-red-200">
                            <AvatarImage src={post.avatar} alt={post.author} />
                            <AvatarFallback className="bg-gradient-to-br from-red-500 to-pink-500 text-white font-semibold">
                              {post.author.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-gray-900">{post.author}</p>
                            <p className="text-sm text-red-600 font-medium">
                              Falha na publicação
                            </p>
                          </div>
                        </div>
                        
                        <Badge className="bg-red-100 text-red-700 border-red-200 font-medium">
                          <XCircle className="h-3 w-3 mr-1" />
                          Erro
                        </Badge>
                      </div>

                      <CardTitle className="text-lg font-semibold text-gray-900 leading-relaxed">
                        {post.text}
                      </CardTitle>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {post.tags.map((tag, tagIndex) => (
                          <Badge 
                            key={tagIndex} 
                            variant="secondary" 
                            className="bg-red-100 text-red-700 hover:bg-red-200 transition-colors text-xs"
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0 space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-gradient-to-br from-red-100 to-pink-100 rounded-lg">
                          <NetworkIcon className="h-4 w-4 text-red-600" />
                        </div>
                        <span className="font-medium text-gray-700">{post.network}</span>
                      </div>

                      {post.errorMessage && (
                        <div className="p-3 bg-red-100 border border-red-200 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <XCircle className="h-4 w-4 text-red-500" />
                            <p className="text-sm font-semibold text-red-700">Detalhes do Erro</p>
                          </div>
                          <p className="text-sm text-red-600">{post.errorMessage}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-red-100">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="h-8 px-3 text-red-600 hover:text-red-700 hover:bg-red-100">
                            <Edit3 className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 px-3 text-red-600 hover:text-red-700 hover:bg-red-100">
                            <Settings className="h-4 w-4 mr-1" />
                            Configurar
                          </Button>
                        </div>
                        
                        <Button size="sm" className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Tentar Novamente
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
