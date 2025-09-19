"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/providers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Shield, 
  Zap, 
  Star,
  Globe,
  TrendingUp,
  Users,
  CheckCircle2,
  Rocket
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const features = [
    { icon: TrendingUp, title: "Análises Avançadas", desc: "Insights poderosos para seu negócio" },
    { icon: Users, title: "Gestão de Equipes", desc: "Colaboração eficiente e produtiva" },
    { icon: Shield, title: "Segurança Total", desc: "Proteção de dados de nível empresarial" },
    { icon: Rocket, title: "Performance", desc: "Velocidade e confiabilidade excepcionais" }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Preencha todos os campos");
      return;
    }

    try {
      await login(email, password);
      toast.success("Login realizado com sucesso!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Erro ao fazer login");
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-l from-purple-500/10 to-pink-500/10 animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-bounce" style={{animationDuration: '6s'}}></div>
      <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-bounce" style={{animationDuration: '8s', animationDelay: '2s'}}></div>

      <div className="relative min-h-screen flex">
        {/* Left panel - Features and branding */}
        <div className={`hidden lg:flex lg:w-1/2 flex-col justify-center p-12 transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
          <div className="max-w-lg">
            {/* Main logo */}
            <div className="flex items-center mb-8">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Sparkles className="w-8 h-8 text-white animate-pulse" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center">
                  <Star className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                  AithosReach
                </h1>
                <p className="text-blue-200/80 text-sm font-medium">Plataforma Empresarial</p>
              </div>
            </div>

            {/* Main title */}
            <div className="mb-12">
              <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
                Transforme seu
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Negócio Digital
                </span>
              </h2>
              <p className="text-xl text-blue-100/80 leading-relaxed">
                A plataforma mais avançada para gestão empresarial, 
                com inteligência artificial e análises em tempo real.
              </p>
            </div>

            {/* Rotating features */}
            <div className="space-y-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                const isActive = index === currentFeature;
                return (
                  <div 
                    key={index}
                    className={`flex items-center space-x-4 p-4 rounded-2xl transition-all duration-500 ${
                      isActive 
                        ? 'bg-white/10 backdrop-blur-sm border border-white/20 scale-105' 
                        : 'opacity-60 hover:opacity-80'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      isActive 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg' 
                        : 'bg-white/10'
                    }`}>
                      <Icon className={`w-6 h-6 text-white ${isActive ? 'animate-pulse' : ''}`} />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">{feature.title}</h3>
                      <p className="text-blue-100/70">{feature.desc}</p>
                    </div>
                    {isActive && (
                      <div className="ml-auto">
                        <CheckCircle2 className="w-6 h-6 text-green-400 animate-bounce" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">99.9%</div>
                <div className="text-blue-200/70 text-sm">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">10k+</div>
                <div className="text-blue-200/70 text-sm">Empresas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">24/7</div>
                <div className="text-blue-200/70 text-sm">Suporte</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel - Login form */}
        <div className={`w-full lg:w-1/2 flex items-center justify-center p-8 transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`} style={{transitionDelay: '300ms'}}>
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-2xl">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">AithosReach</h1>
              <p className="text-blue-200/80">Bem-vindo de volta</p>
            </div>

            {/* Premium login card */}
            <Card className="backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl overflow-hidden">
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-6 border-b border-white/10">
                <CardHeader className="p-0">
                  <CardTitle className="text-2xl font-bold text-white text-center flex items-center justify-center gap-2">
                    <Shield className="w-6 h-6 text-blue-400" />
                    Acesso Seguro
                  </CardTitle>
                  <CardDescription className="text-center text-blue-100/80 mt-2">
                    Entre na sua conta para acessar o painel empresarial
                  </CardDescription>
                </CardHeader>
              </div>

              <CardContent className="p-8">
                <form onSubmit={handleLogin} className="space-y-6">
                  {/* Premium email field */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-white flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-400" />
                      E-mail Corporativo
                    </label>
                    <div className="relative group">
                      <Input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        className="h-14 bg-white/5 border-white/20 text-white placeholder:text-white/50 rounded-xl pl-12 pr-4 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 group-hover:bg-white/10"
                        placeholder="seu.email@empresa.com"
                        required 
                      />
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
                    </div>
                  </div>

                  {/* Premium password field */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-white flex items-center gap-2">
                      <Lock className="w-4 h-4 text-purple-400" />
                      Senha de Acesso
                    </label>
                    <div className="relative group">
                      <Input 
                        type={showPassword ? "text" : "password"}
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        className="h-14 bg-white/5 border-white/20 text-white placeholder:text-white/50 rounded-xl pl-12 pr-14 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 group-hover:bg-white/10"
                        placeholder="••••••••••••"
                        required 
                      />
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Forgot password link */}
                  <div className="text-right">
                    <Link 
                      href="/forgot-password" 
                      className="text-sm text-blue-300 hover:text-blue-200 transition-colors font-medium hover:underline"
                    >
                      Esqueceu sua senha?
                    </Link>
                  </div>

                  {/* Premium login button */}
                  <Button 
                    type="submit" 
                    className="w-full h-14 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-3">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Autenticando...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-3">
                        <Zap className="w-5 h-5" />
                        <span>Entrar no Sistema</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    )}
                  </Button>
                </form>
                
                {/* Elegant divider */}
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/20" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-gradient-to-r from-slate-900 to-purple-900 px-4 text-white/60 font-medium">
                      Primeira vez aqui?
                    </span>
                  </div>
                </div>

                {/* Premium registration link */}
                <div className="text-center">
                  <p className="text-white/80 mb-4">
                    Descubra o poder da nossa plataforma
                  </p>
                  <Link 
                    href="/register" 
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl border border-white/20 hover:border-white/30 transition-all duration-300 group"
                  >
                    <Rocket className="w-4 h-4 group-hover:animate-bounce" />
                    Criar Conta Empresarial
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>

                {/* Security indicators */}
                <div className="mt-8 flex items-center justify-center space-x-6 text-xs text-white/60">
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3 text-green-400" />
                    <span>SSL Seguro</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-blue-400" />
                    <span>LGPD Compliant</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Globe className="w-3 h-3 text-purple-400" />
                    <span>ISO 27001</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
