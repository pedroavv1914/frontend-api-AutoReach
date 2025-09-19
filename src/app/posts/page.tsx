"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  MoreHorizontal
} from "lucide-react";

export default function PostsPage() {
  // Placeholder estático; depois conectaremos à API
  const items = [
    { id: "1", text: "Post agendado para amanhã", status: "pending", scheduledAt: "2025-08-12 10:00", network: "LinkedIn" },
    { id: "2", text: "Post publicado com sucesso", status: "published", scheduledAt: null, network: "Instagram" },
    { id: "3", text: "Falha ao publicar", status: "error", scheduledAt: null, network: "Twitter" },
  ];

  const statusConfig = {
    pending: { 
      color: 'bg-blue-500/10 text-blue-700 border-blue-200/30', 
      icon: Clock, 
      label: 'Agendado' 
    },
    published: { 
      color: 'bg-emerald-500/10 text-emerald-700 border-emerald-200/30', 
      icon: CheckCircle2, 
      label: 'Publicado' 
    },
    error: { 
      color: 'bg-red-500/10 text-red-700 border-red-200/30', 
      icon: XCircle, 
      label: 'Erro' 
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-950 dark:via-blue-950/30 dark:to-purple-950/20">
      {/* Header com gradiente */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 dark:from-blue-800 dark:via-purple-800 dark:to-indigo-900">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05)_0%,transparent_50%)] bg-[length:60px_60px]"></div>
        
        <div className="relative w-full px-8 lg:px-12 xl:px-16 2xl:px-24 py-12">
          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
            <div className="flex-1 animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-white/20 to-white/10 rounded-xl shadow-lg backdrop-blur-sm">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm border-0 shadow-sm text-white">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Posts
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                Gerenciar Posts
              </h1>
              <p className="text-lg text-blue-100 max-w-2xl">
                Crie, agende e monitore seus posts em todas as redes sociais.
              </p>
            </div>
            <div className="flex items-center gap-3 animate-slide-up">
              <Button 
                asChild 
                size="lg"
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Link href="/posts/new">
                  <PlusCircle className="h-5 w-5 mr-2" />
                  Novo Post
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-8 lg:px-12 xl:px-16 2xl:px-24 py-8 space-y-6">
        {/* Filtros e Tabs */}
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <Tabs defaultValue="all" className="flex-1">
            <TabsList className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
              <TabsTrigger value="all" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
                Todos
              </TabsTrigger>
              <TabsTrigger value="pending" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
                Pendentes
              </TabsTrigger>
              <TabsTrigger value="published" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
                Publicados
              </TabsTrigger>
              <TabsTrigger value="error" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
                Erros
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <div className="grid gap-4">
                {items.map((post, index) => {
                  const config = statusConfig[post.status as keyof typeof statusConfig];
                  const IconComponent = config.icon;
                  
                  return (
                    <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Badge className={`${config.color} border`}>
                                <IconComponent className="h-3 w-3 mr-1" />
                                {config.label}
                              </Badge>
                              <Badge variant="outline" className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
                                {post.network}
                              </Badge>
                            </div>
                            <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {post.text}
                            </CardTitle>
                          </div>
                          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          {post.scheduledAt && (
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-blue-500" />
                              <span>Agendado para {post.scheduledAt}</span>
                            </div>
                          )}
                          {!post.scheduledAt && post.status === 'published' && (
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                              <span>Publicado com sucesso</span>
                            </div>
                          )}
                          {!post.scheduledAt && post.status === 'error' && (
                            <div className="flex items-center gap-2">
                              <XCircle className="h-4 w-4 text-red-500" />
                              <span>Falha na publicação</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="pending" className="mt-6">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="py-12 text-center">
                  <Clock className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Posts Pendentes</h3>
                  <p className="text-gray-600 mb-6">Em breve: filtro por posts pendentes</p>
                  <Button asChild>
                    <Link href="/posts/new">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Criar Primeiro Post
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="published" className="mt-6">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="py-12 text-center">
                  <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Posts Publicados</h3>
                  <p className="text-gray-600">Em breve: filtro por posts publicados</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="error" className="mt-6">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="py-12 text-center">
                  <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Posts com Erro</h3>
                  <p className="text-gray-600">Em breve: filtro por posts com erro</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
