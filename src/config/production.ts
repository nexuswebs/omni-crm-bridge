
// Configuração de produção - incluída no build
export const productionConfig = {
  // URLs de produção - configuradas durante o build
  domain: 'https://crm.seudominio.com',
  apiUrl: 'https://api.seudominio.com',
  
  // Configurações do Supabase - serão substituídas durante o build
  supabase: {
    url: 'https://eirvcmzqbtkmoxquovsy.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpcnZjbXpxYnRrbW94cXVvdnN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5OTIzNzEsImV4cCI6MjA2NTU2ODM3MX0.pFTNDBbigWzm0pdWvuzQU9giujRVVSXU-tm8eXpl2ts'
  },
  
  // Configurações pré-definidas para Evolution API
  evolutionApi: {
    url: 'https://api.redenexus.top',
    key: 'e5fe045f841bddf5406357ebea55ea2b',
    instanceName: 'crm-instance',
    webhookUrl: 'https://webhook.site/unique-id'
  },
  
  // Configurações pré-definidas para n8n
  n8n: {
    url: 'https://app.n8n.cloud',
    apiKey: '',
    webhookUrl: ''
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
  // Detectar ambiente baseado na URL atual
  const currentUrl = typeof window !== 'undefined' ? window.location.origin : '';
  
  if (currentUrl.includes('localhost') || currentUrl.includes('127.0.0.1')) {
    return {
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
    };
  }
  
  if (currentUrl.includes('staging') || currentUrl.includes('preview')) {
    return {
      ...productionConfig,
      domain: currentUrl,
      apiUrl: `${currentUrl}/api`,
      monitoring: {
        ...productionConfig.monitoring,
        errorTracking: false
      }
    };
  }
  
  return productionConfig;
};
