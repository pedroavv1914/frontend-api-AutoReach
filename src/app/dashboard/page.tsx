"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle2, Clock, TrendingUp, AlertTriangle, PlusCircle, Users } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useEffect, useState } from "react";

const chartData = [
  { name: "Dom", published: 6, engagements: 120 },
  { name: "Seg", published: 12, engagements: 280 },
  { name: "Ter", published: 8, engagements: 210 },
  { name: "Qua", published: 15, engagements: 340 },
  { name: "Qui", published: 10, engagements: 260 },
  { name: "Sex", published: 18, engagements: 420 },
  { name: "Sáb", published: 9, engagements: 200 },
];

const upcoming = [
  { id: "1", text: "Lançamento do blog", when: "Hoje • 17:00", networks: ["twitter", "linkedin"] },
  { id: "2", text: "Vídeo: novidades do produto", when: "Amanhã • 09:00", networks: ["instagram"] },
];

const accounts = [
  { id: "tw", label: "@autorreach", provider: "Twitter/X", status: "Conectada" },
  { id: "ln", label: "AutoReach", provider: "LinkedIn", status: "Conectada" },
  { id: "ig", label: "@autorreach_ig", provider: "Instagram", status: "Conectar" },
];

function useCountUp(to: number, durationMs = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf = 0; const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      setValue(Math.floor(to * (0.5 - Math.cos(Math.PI * t) / 2))); // easeInOut
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, durationMs]);
  return value;
}

function Sparkline({ dataKey, color }: { dataKey: string; color: string }) {
  return (
    <div className="h-10 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={`fill-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.35}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey={dataKey} stroke={color} fill={`url(#fill-${dataKey})`} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function DashboardPage() {
  const pending = useCountUp(8);
  const published = useCountUp(78);
  const engagements = useCountUp(1600);
  const errors = useCountUp(3);
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
        <div className="w-full px-8 lg:px-12 py-10 relative">
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

      <div className="w-full px-8 lg:px-12 py-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border border-blue-200/40 transition hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold tabular-nums">{pending}</div>
              <p className="text-xs text-muted-foreground">na fila para publicar</p>
              <Sparkline dataKey="published" color="#3b82f6" />
            </CardContent>
          </Card>
          <Card className="border border-emerald-200/40 transition hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Publicados (7d)</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold tabular-nums">{published}</div>
              <p className="text-xs text-muted-foreground">+12% vs semana anterior</p>
              <Sparkline dataKey="published" color="#10b981" />
            </CardContent>
          </Card>
          <Card className="border border-fuchsia-200/40 transition hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Engajamentos (7d)</CardTitle>
              <TrendingUp className="h-4 w-4 text-fuchsia-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold tabular-nums">{(engagements/1_000).toFixed(1)}k</div>
              <p className="text-xs text-muted-foreground">méd. 230/dia</p>
              <Sparkline dataKey="engagements" color="#a855f7" />
            </CardContent>
          </Card>
          <Card className="border border-amber-200/40 transition hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Erros</CardTitle>
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold tabular-nums">{errors}</div>
              <p className="text-xs text-muted-foreground">precisam de atenção</p>
              <Sparkline dataKey="published" color="#f59e0b" />
            </CardContent>
          </Card>
        </div>

        {/* Content Grid */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          {/* Chart */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle>Performance (7 dias)</CardTitle>
            </CardHeader>
            <CardContent className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 12, right: 12, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fillEng" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-black/5" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ fontSize: 12 }} />
                  <Area type="monotone" dataKey="engagements" stroke="#7c3aed" fillOpacity={1} fill="url(#fillEng)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Upcoming */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Agendados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcoming.map((u) => (
                <div key={u.id} className="flex items-start gap-3 border rounded-md p-3 transition hover:bg-accent/30">
                  <Calendar className="h-4 w-4 mt-0.5 text-blue-500" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{u.text}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
                      <span>{u.when}</span>
                      <span className="inline-flex items-center gap-1">
                        {u.networks.map(n => (
                          <span key={n} className="px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground text-[10px] uppercase tracking-wide">{n}</span>
                        ))}
                      </span>
                    </div>
                  </div>
                  <Button asChild size="sm" variant="outline"><a href="/posts">Ver</a></Button>
                </div>
              ))}
              <div className="pt-1"><Button asChild variant="ghost" className="px-0 h-auto"><a href="/posts">Ver todos</a></Button></div>
            </CardContent>
          </Card>
        </div>

        {/* Accounts + Activity */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Contas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {accounts.map((a) => (
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

          <Card className="lg:col-span-2">
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
            <CardHeader className="pb-2">
              <CardTitle>Insights</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-md border p-3">
                <div className="text-xs text-muted-foreground">Melhor horário</div>
                <div className="text-sm font-medium">09:00–11:00 (BR)</div>
              </div>
              <div className="rounded-md border p-3">
                <div className="text-xs text-muted-foreground">Hashtags de maior alcance</div>
                <div className="text-sm font-medium">#productivity #devtools #growth</div>
              </div>
              <div className="rounded-md border p-3">
                <div className="text-xs text-muted-foreground">Rede com maior engajamento</div>
                <div className="text-sm font-medium">Twitter/X</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
