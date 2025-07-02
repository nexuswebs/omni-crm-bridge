
export const productionConfig = {
  // URLs de produção
  domain: process.env.PRODUCTION_DOMAIN || 'https://crm.seudominio.com',
  apiUrl: process.env.PRODUCTION_API_URL || 'https://api.seudominio.com',
  
  // Configurações do Supabase
  supabase: {
    url: process.env.SUPABASE_URL || 'https://eirvcmzqbtkmoxquovsy.supabase.co',
    anonKey: process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpcnZjbXpxYnRrbW94cXVvdnN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5OTIzNzEsImV4cCI6MjA2NTU2ODM3MX0.pFTNDBbigWzm0pdWvuzQU9giujRVVSXU-tm8eXpl2ts'
  },
  
  // Configurações de segurança
  security: {
    ssl: true,
    hsts: true,
    contentSecurityPolicy: true,
    cors: {
      origin: ['https://crm.seudominio.com'],
      credentials: true
    }
  },
  
  // Configurações de performance
  performance: {
    compression: true,
    caching: true,
    minification: true,
    bundleAnalyzer: false
  },
  
  // Configurações de monitoramento
  monitoring: {
    enabled: true,
    errorTracking: true,
    performanceTracking: true,
    analytics: true
  },
  
  // Configurações de backup
  backup: {
    enabled: true,
    frequency: 'daily',
    retention: 30 // dias
  }
};

export const validateProductionConfig = () => {
  const errors: string[] = [];
  
  // Validar URLs
  if (!productionConfig.domain || !productionConfig.domain.startsWith('https://')) {
    errors.push('Domínio de produção deve usar HTTPS');
  }
  
  if (!productionConfig.apiUrl || !productionConfig.apiUrl.startsWith('https://')) {
    errors.push('URL da API deve usar HTTPS');
  }
  
  // Validar configurações do Supabase
  if (!productionConfig.supabase.url || !productionConfig.supabase.url.includes('supabase.co')) {
    errors.push('URL do Supabase inválida');
  }
  
  if (!productionConfig.supabase.anonKey || productionConfig.supabase.anonKey.length < 100) {
    errors.push('Chave anônima do Supabase inválida');
  }
  
  if (errors.length > 0) {
    throw new Error(`Configuração de produção inválida:\n${errors.join('\n')}`);
  }
  
  return true;
};

export const getEnvironmentConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  
  const configs = {
    development: {
      ...productionConfig,
      domain: 'http://localhost:3000',
      apiUrl: 'http://localhost:3000/api',
      security: {
        ...productionConfig.security,
        ssl: false,
        cors: {
          origin: ['http://localhost:3000'],
          credentials: true
        }
      }
    },
    staging: {
      ...productionConfig,
      domain: 'https://staging.seudominio.com',
      apiUrl: 'https://staging-api.seudominio.com',
      monitoring: {
        ...productionConfig.monitoring,
        errorTracking: false
      }
    },
    production: productionConfig
  };
  
  return configs[env as keyof typeof configs] || configs.development;
};
