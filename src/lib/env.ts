import { z } from 'zod';

// Schema de validação para variáveis de ambiente
const envSchema = z.object({
  // API Configuration
  NEXT_PUBLIC_API_BASE_URL: z.string().url().default('http://localhost:3001'),
  NEXT_PUBLIC_API_TIMEOUT: z.string().transform(Number).default('10000'),
  
  // Multi-tenant Configuration
  NEXT_PUBLIC_TENANT_HOST: z.string().default('dev.aithosreach.com'),
  NEXT_PUBLIC_DOMAIN: z.string().default('aithosreach.com'),
  
  // OAuth Configuration (opcionais)
  NEXT_PUBLIC_LINKEDIN_CLIENT_ID: z.string().optional(),
  NEXT_PUBLIC_INSTAGRAM_CLIENT_ID: z.string().optional(),
  NEXT_PUBLIC_TWITTER_CLIENT_ID: z.string().optional(),
  
  // Media Upload
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().optional(),
  NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: z.string().optional(),
  
  // Analytics & Monitoring
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),
  
  // Environment
  NEXT_PUBLIC_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  
  // Feature Flags
  NEXT_PUBLIC_ENABLE_ANALYTICS: z.string().transform(val => val === 'true').default('true'),
  NEXT_PUBLIC_ENABLE_NOTIFICATIONS: z.string().transform(val => val === 'true').default('true'),
  NEXT_PUBLIC_ENABLE_DARK_MODE: z.string().transform(val => val === 'true').default('true'),
});

// Função para validar e obter variáveis de ambiente
function getEnvVars() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(err => err.path.join('.')).join(', ');
      throw new Error(`Variáveis de ambiente inválidas ou ausentes: ${missingVars}`);
    }
    throw error;
  }
}

// Exportar variáveis validadas
export const env = getEnvVars();

// Helpers para verificar ambiente
export const isDevelopment = env.NEXT_PUBLIC_ENV === 'development';
export const isProduction = env.NEXT_PUBLIC_ENV === 'production';
export const isStaging = env.NEXT_PUBLIC_ENV === 'staging';

// Helper para verificar se features estão habilitadas
export const features = {
  analytics: env.NEXT_PUBLIC_ENABLE_ANALYTICS,
  notifications: env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS,
  darkMode: env.NEXT_PUBLIC_ENABLE_DARK_MODE,
} as const;

// Configurações derivadas
export const config = {
  api: {
    baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
    timeout: env.NEXT_PUBLIC_API_TIMEOUT,
  },
  tenant: {
    host: env.NEXT_PUBLIC_TENANT_HOST,
    domain: env.NEXT_PUBLIC_DOMAIN,
  },
  oauth: {
    linkedin: env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID,
    instagram: env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID,
    twitter: env.NEXT_PUBLIC_TWITTER_CLIENT_ID,
  },
  media: {
    cloudinary: {
      cloudName: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      uploadPreset: env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
    },
  },
  monitoring: {
    sentry: env.NEXT_PUBLIC_SENTRY_DSN,
    analytics: env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  },
} as const;

// Validação em tempo de build
if (typeof window === 'undefined') {
  console.log('✅ Variáveis de ambiente validadas com sucesso');
}