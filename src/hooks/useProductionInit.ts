
import { useEffect } from 'react';
import { useSystemConfig } from './useSystemConfig';
import { productionConfig } from '@/config/production';

export const useProductionInit = () => {
  const evolutionConfig = useSystemConfig('evolution_api');
  const n8nConfig = useSystemConfig('n8n');

  useEffect(() => {
    const initializeProductionConfigs = async () => {
      // Verificar se estamos em produção
      const isProduction = !window.location.origin.includes('localhost');
      
      if (!isProduction) {
        console.log('Ambiente de desenvolvimento detectado, não inicializando configurações de produção');
        return;
      }

      console.log('Inicializando configurações de produção...');

      // Inicializar Evolution API se não existir
      if (!evolutionConfig.config.url && productionConfig.evolutionApi.url) {
        console.log('Inicializando configuração Evolution API...');
        await evolutionConfig.updateConfig({
          name: 'Evolution API',
          url: productionConfig.evolutionApi.url,
          key: productionConfig.evolutionApi.key,
          instanceName: productionConfig.evolutionApi.instanceName,
          webhookUrl: productionConfig.evolutionApi.webhookUrl,
          autoConnect: true,
          connected: false,
          status: 'disconnected'
        });
      }

      // Inicializar n8n se não existir
      if (!n8nConfig.config.n8nUrl && productionConfig.n8n.url) {
        console.log('Inicializando configuração n8n...');
        await n8nConfig.updateConfig({
          n8nUrl: productionConfig.n8n.url,
          apiKey: productionConfig.n8n.apiKey,
          webhookUrl: productionConfig.n8n.webhookUrl,
          connected: false,
          workflowsSync: false
        });
      }

      console.log('Configurações de produção inicializadas!');
    };

    // Aguardar um pouco para os hooks carregarem
    const timer = setTimeout(initializeProductionConfigs, 1000);
    
    return () => clearTimeout(timer);
  }, [evolutionConfig, n8nConfig]);

  return {
    isInitialized: true
  };
};
