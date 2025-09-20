'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Lock, Mail, Shield, Zap, Users, TrendingUp, Star, Award } from 'lucide-react';
import styles from './login.module.css';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password });
  };

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

      {/* Right Panel - Login Form */}
      <div className={styles.rightPanel}>
        <div className={styles.formContainer}>
          <h2 className={styles.title}>Acesso à Plataforma</h2>
          <p className={styles.subtitle}>
            Autentique-se no sistema de gestão mais avançado do mercado
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
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
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className={styles.forgotPassword}>
                <a href="#" className={styles.forgotPasswordLink}>
                  Esqueceu sua senha?
                </a>
              </div>
            </div>

            <button type="submit" className={styles.loginButton}>
              <Lock size={20} />
              Entrar na Plataforma
            </button>
          </form>

          <div className={styles.divider}>
            <span>ou</span>
          </div>

          <p className={styles.signupText}>
            Novo na plataforma?{' '}
            <Link href="/register" className={styles.signupLink}>
              Criar conta gratuita
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
