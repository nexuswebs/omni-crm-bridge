
import { useState, useEffect } from 'react';

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

export const useEvolutionApiStorage = () => {
  const [config, setConfig] = useState<EvolutionApiConfig>(() => {
    const saved = localStorage.getItem('evolution-api-config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Erro ao carregar dados salvos da Evolution API:', error);
      }
    }
    return {
      name: 'Evolution API',
      status: 'disconnected',
      url: 'https://api.redenexus.top',
      key: 'e5fe045f841bddf5406357ebea55ea2b',
      connected: false,
      instanceName: 'crm-instance',
      webhookUrl: 'https://webhook.site/unique-id',
      autoConnect: false
    };
  });

  // Salvar dados no localStorage sempre que config mudar
  useEffect(() => {
    localStorage.setItem('evolution-api-config', JSON.stringify(config));
  }, [config]);

  const updateConfig = (updates: Partial<EvolutionApiConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  return { config, updateConfig };
};
