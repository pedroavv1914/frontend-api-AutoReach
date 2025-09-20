"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers";
import { Eye, EyeOff, UserPlus, Shield, Zap, Users, TrendingUp, Star, Award } from 'lucide-react';
import { toast } from "sonner";
import Link from "next/link";
import styles from './register.module.css';

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, isLoading } = useAuth();
  const router = useRouter();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      toast.error("Preencha todos os campos");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    try {
      await register(name, email, password);
      toast.success("Conta criada com sucesso!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar conta");
    }
  }

  return (
    <div className={styles.container}>
      {/* Left Panel - Brand Section */}
      <div className={styles.leftPanel}>
        <div className={styles.brandSection}>
          <h1 className={styles.logo}>AithosReach</h1>
          <p className={styles.tagline}>
            Plataforma de Gestão Avançada • Conecte-se ao futuro da automação empresarial e transforme seus processos com nossa infraestrutura tecnológica de próxima geração
          </p>

          <div className={styles.features}>
            <div className={styles.feature}>
              <Zap className={styles.featureIcon} />
              <span className={styles.featureText}>Performance Ultra-Rápida</span>
            </div>
            <div className={styles.feature}>
              <Shield className={styles.featureIcon} />
              <span className={styles.featureText}>Segurança Enterprise</span>
            </div>
            <div className={styles.feature}>
              <Users className={styles.featureIcon} />
              <span className={styles.featureText}>Colaboração em Tempo Real</span>
            </div>
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <div className={styles.statNumber}>50K+</div>
              <div className={styles.statLabel}>Usuários Ativos</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statNumber}>99.9%</div>
              <div className={styles.statLabel}>Uptime</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statNumber}>24/7</div>
              <div className={styles.statLabel}>Suporte</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className={styles.rightPanel}>
        <div className={styles.formContainer}>
          <h2 className={styles.title}>Criar Conta</h2>
          <p className={styles.subtitle}>
            Registre-se no sistema de gestão mais avançado do mercado
          </p>

          <form onSubmit={handleRegister} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="name" className={styles.label}>
                Nome Completo
              </label>
              <div className={styles.inputContainer}>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={styles.input}
                  placeholder="Digite seu nome completo"
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <div className={styles.inputContainer}>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                Senha
              </label>
              <div className={styles.inputContainer}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${styles.input} ${styles.passwordInput}`}
                  placeholder="Digite sua senha"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.togglePassword}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>
                Confirmar Senha
              </label>
              <div className={styles.inputContainer}>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`${styles.input} ${styles.passwordInput}`}
                  placeholder="Confirme sua senha"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={styles.togglePassword}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button type="submit" className={styles.registerButton} disabled={isLoading}>
              <UserPlus size={20} />
              {isLoading ? "Criando conta..." : "Criar Conta"}
            </button>
          </form>

          <div className={styles.divider}>
            <span>ou</span>
          </div>

          <p className={styles.loginText}>
            Já tem uma conta?{' '}
            <Link href="/login" className={styles.loginLink}>
              Fazer login
            </Link>
          </p>

          <div className={styles.securityBadges}>
            <div className={styles.securityBadge}>
              <Shield className={styles.securityIcon} />
              <span>SSL Seguro</span>
            </div>
            <div className={styles.securityBadge}>
              <Award className={styles.securityIcon} />
              <span>ISO 27001</span>
            </div>
            <div className={styles.securityBadge}>
              <Star className={styles.securityIcon} />
              <span>GDPR</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
