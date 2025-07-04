
import { useSystemConfig } from './useSystemConfig';

interface EvolutionApiConfig {
  name: string;
  status: string;
  url: string;
  key: string;
  connected: boolean;
  instanceName: string;
  webhookUrl: string;
  autoConnect: boolean;
}

export const useEvolutionApiDatabase = () => {
  const { config, isLoading, isSaving, updateConfig } = useSystemConfig('evolution_api');

  // Configuração padrão se não existir no banco
  const defaultConfig: EvolutionApiConfig = {
    name: 'Evolution API',
    status: 'disconnected',
    url: 'https://api.redenexus.top',
    key: 'e5fe045f841bddf5406357ebea55ea2b',
    connected: false,
    instanceName: 'crm-instance',
    webhookUrl: 'https://webhook.site/unique-id',
    autoConnect: false
  };

  const finalConfig = { ...defaultConfig, ...config };

  return {
    config: finalConfig,
    isLoading,
    isSaving,
    updateConfig
  };
};
