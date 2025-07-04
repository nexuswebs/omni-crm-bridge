
import { useSystemConfig } from './useSystemConfig';

interface N8nConfig {
  n8nUrl: string;
  apiKey: string;
  webhookUrl: string;
  connected: boolean;
  workflowsSync: boolean;
}

export const useN8nConfig = () => {
  const { config, isLoading, isSaving, updateConfig } = useSystemConfig('n8n');

  const defaultConfig: N8nConfig = {
    n8nUrl: 'https://app.n8n.cloud',
    apiKey: '',
    webhookUrl: '',
    connected: false,
    workflowsSync: false
  };

  const finalConfig = { ...defaultConfig, ...config };

  return {
    config: finalConfig,
    isLoading,
    isSaving,
    updateConfig
  };
};
