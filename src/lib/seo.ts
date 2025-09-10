import { Metadata } from 'next';

// SEO Configuration and utilities

export const defaultSEO: Metadata = {
  title: {
    default: 'Aithos Reach - Gestão Inteligente de Redes Sociais',
    template: '%s | Aithos Reach'
  },
  description: 'Plataforma completa para agendamento, publicação e análise de conteúdo em redes sociais. Gerencie múltiplas contas, agende posts e acompanhe métricas de engajamento.',
  keywords: [
    'gestão redes sociais',
    'agendamento posts',
    'marketing digital',
    'automação social media',
    'analytics redes sociais',
    'LinkedIn automation',
    'Instagram scheduler',
    'Twitter management',
    'Facebook posts'
  ],
  authors: [{ name: 'Aithos Reach Team' }],
  creator: 'Aithos Reach',
  publisher: 'Aithos Reach',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://aithosreach.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: '/',
    title: 'Aithos Reach - Gestão Inteligente de Redes Sociais',
    description: 'Plataforma completa para agendamento, publicação e análise de conteúdo em redes sociais.',
    siteName: 'Aithos Reach',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Aithos Reach - Social Media Management Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aithos Reach - Gestão Inteligente de Redes Sociais',
    description: 'Plataforma completa para agendamento, publicação e análise de conteúdo em redes sociais.',
    images: ['/twitter-image.png'],
    creator: '@aithosreach',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_VERIFICATION,
  },
};

// Page-specific SEO configurations
export const pageSEO = {
  dashboard: {
    title: 'Dashboard - Visão Geral',
    description: 'Acompanhe métricas de performance, posts agendados e atividade das suas redes sociais em tempo real.',
    keywords: ['dashboard', 'métricas', 'analytics', 'performance social media'],
  },
  posts: {
    title: 'Gerenciar Posts',
    description: 'Crie, edite e agende posts para múltiplas redes sociais. Gerencie seu conteúdo de forma eficiente.',
    keywords: ['criar posts', 'agendar publicações', 'gerenciar conteúdo', 'social media posts'],
  },
  analytics: {
    title: 'Analytics e Relatórios',
    description: 'Análise detalhada de performance, engajamento e crescimento das suas redes sociais.',
    keywords: ['analytics', 'relatórios', 'métricas engajamento', 'performance social media'],
  },
  accounts: {
    title: 'Contas Conectadas',
    description: 'Gerencie suas contas de redes sociais conectadas. Adicione ou remova plataformas.',
    keywords: ['contas sociais', 'conectar redes sociais', 'gerenciar contas'],
  },
  settings: {
    title: 'Configurações',
    description: 'Personalize suas preferências, configurações de conta e opções de privacidade.',
    keywords: ['configurações', 'preferências', 'conta usuário'],
  },
};

// Generate structured data for SEO
export const generateStructuredData = (type: 'WebApplication' | 'Organization' | 'BreadcrumbList', data?: Record<string, unknown>) => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://aithosreach.com';
  
  switch (type) {
    case 'WebApplication':
      return {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Aithos Reach',
        description: 'Plataforma completa para gestão de redes sociais',
        url: baseUrl,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web Browser',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'BRL',
        },
        featureList: [
          'Agendamento de posts',
          'Análise de métricas',
          'Gestão múltiplas contas',
          'Relatórios de performance'
        ],
      };
      
    case 'Organization':
      return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Aithos Reach',
        url: baseUrl,
        logo: `${baseUrl}/logo.png`,
        description: 'Empresa especializada em soluções de gestão de redes sociais',
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          email: 'contato@aithosreach.com',
        },
      };
      
    case 'BreadcrumbList':
      return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: Array.isArray(data?.breadcrumbs) ? data.breadcrumbs.map((item: { name: string; url: string }, index: number) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: `${baseUrl}${item.url}`,
        })) : [],
      };
      
    default:
      return null;
  }
};

// SEO utility functions
export const generatePageMetadata = (
  page: keyof typeof pageSEO,
  customData?: Partial<Metadata>
): Metadata => {
  const pageData = pageSEO[page];
  
  return {
    ...defaultSEO,
    title: pageData.title,
    description: pageData.description,
    keywords: [...(defaultSEO.keywords || []), ...pageData.keywords],
    openGraph: {
      ...defaultSEO.openGraph,
      title: pageData.title,
      description: pageData.description,
    },
    twitter: {
      ...defaultSEO.twitter,
      title: pageData.title,
      description: pageData.description,
    },
    ...customData,
  };
};

// Generate canonical URL
export const generateCanonicalUrl = (path: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://aithosreach.com';
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
};

// Generate sitemap data
export const sitemapPages = [
  { url: '/', priority: 1.0, changeFreq: 'daily' },
  { url: '/dashboard', priority: 0.9, changeFreq: 'daily' },
  { url: '/posts', priority: 0.8, changeFreq: 'daily' },
  { url: '/analytics', priority: 0.8, changeFreq: 'weekly' },
  { url: '/accounts', priority: 0.7, changeFreq: 'monthly' },
  { url: '/settings', priority: 0.6, changeFreq: 'monthly' },
  { url: '/login', priority: 0.5, changeFreq: 'yearly' },
  { url: '/register', priority: 0.5, changeFreq: 'yearly' },
];

// Performance and Core Web Vitals optimization
export const webVitalsConfig = {
  // Largest Contentful Paint (LCP) - should be < 2.5s
  lcpThreshold: 2500,
  // First Input Delay (FID) - should be < 100ms
  fidThreshold: 100,
  // Cumulative Layout Shift (CLS) - should be < 0.1
  clsThreshold: 0.1,
  // First Contentful Paint (FCP) - should be < 1.8s
  fcpThreshold: 1800,
};

// Analytics and tracking configuration
export const trackingConfig = {
  googleAnalytics: process.env.NEXT_PUBLIC_GA_ID,
  facebookPixel: process.env.NEXT_PUBLIC_FB_PIXEL_ID,
  hotjar: process.env.NEXT_PUBLIC_HOTJAR_ID,
  clarity: process.env.NEXT_PUBLIC_CLARITY_ID,
};