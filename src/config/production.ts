
export const productionConfig = {
  // Configurações de API
  api: {
    timeout: 30000,
    retries: 3,
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.seudominio.com'
  },

  // Configurações de Supabase
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
    maxRetries: 3,
    timeout: 30000
  },

  // Configurações de segurança
  security: {
    enableCSP: true,
    enableHSTS: true,
    enableCORS: true,
    sessionTimeout: 30 * 60 * 1000, // 30 minutos
    maxLoginAttempts: 5
  },

  // Configurações de performance
  performance: {
    enableGzip: true,
    enableCaching: true,
    cacheMaxAge: 3600, // 1 hora
    compressionLevel: 6
  },

  // Configurações de monitoramento
  monitoring: {
    enableAnalytics: false,
    enableErrorTracking: true,
    enablePerformanceTracking: true,
    logLevel: 'error'
  },

  // Configurações de backup
  backup: {
    enabled: true,
    frequency: 'daily',
    retention: 30, // dias
    encryption: true
  },

  // Configurações de email
  email: {
    provider: 'supabase',
    fromEmail: 'noreply@seudominio.com',
    fromName: 'CRM System'
  },

  // Configurações de domínio
  domain: {
    production: 'https://crm.seudominio.com',
    staging: 'https://staging-crm.seudominio.com',
    development: 'http://localhost:5173'
  }
};

// Validação de configurações críticas
export const validateProductionConfig = () => {
  const errors: string[] = [];

  if (!productionConfig.supabase.url) {
    errors.push('VITE_SUPABASE_URL é obrigatório');
  }

  if (!productionConfig.supabase.anonKey) {
    errors.push('VITE_SUPABASE_ANON_KEY é obrigatório');
  }

  if (errors.length > 0) {
    throw new Error(`Configuração inválida: ${errors.join(', ')}`);
  }

  return true;
};

// Configurações específicas por ambiente
export const getEnvironmentConfig = () => {
  const env = import.meta.env.MODE || 'development';
  
  const configs = {
    development: {
      ...productionConfig,
      monitoring: {
        ...productionConfig.monitoring,
        logLevel: 'debug'
      }
    },
    staging: {
      ...productionConfig,
      monitoring: {
        ...productionConfig.monitoring,
        logLevel: 'info'
      }
    },
    production: {
      ...productionConfig,
      monitoring: {
        ...productionConfig.monitoring,
        logLevel: 'error'
      }
    }
  };

  return configs[env as keyof typeof configs] || configs.development;
};
