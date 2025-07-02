
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { createEvolutionApiService } from '@/services/evolutionApi';
import { useEvolutionApiStorage } from '@/hooks/useEvolutionApiStorage';

interface WhatsAppInstance {
  id: string;
  name: string;
  status: 'disconnected' | 'connecting' | 'connected' | 'qr_ready';
  phone?: string;
  qrCode?: string;
  webhook?: string;
  autoReply?: boolean;
  autoReplyMessage?: string;
  businessHours?: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export const useWhatsAppInstances = () => {
  const { toast } = useToast();
  const { config } = useEvolutionApiStorage();
  const [instances, setInstances] = useState<WhatsAppInstance[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const createInstance = async (instanceName: string) => {
    if (!instanceName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Digite um nome para a instância.",
        variant: "destructive",
      });
      return false;
    }

    if (!config.connected || !config.url || !config.key) {
      toast({
        title: "Evolution API não configurada",
        description: "Configure e conecte a Evolution API primeiro nas configurações.",
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);
    try {
      console.log('Criando instância com configurações:', {
        url: config.url,
        instanceName,
        webhook: config.webhookUrl
      });
      
      const evolutionService = createEvolutionApiService(config.url, config.key);
      const response = await evolutionService.createInstance(instanceName, config.webhookUrl);
      
      const newInstance: WhatsAppInstance = {
        id: instanceName,
        name: instanceName,
        status: 'disconnected',
        webhook: config.webhookUrl,
        autoReply: false,
        autoReplyMessage: 'Obrigado pela mensagem! Retornaremos em breve.',
        businessHours: {
          enabled: false,
          start: '09:00',
          end: '18:00'
        }
      };

      setInstances(prev => [...prev, newInstance]);

      toast({
        title: "Instância criada!",
        description: `A instância ${instanceName} foi criada com sucesso.`,
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao criar instância:', error);
      toast({
        title: "Erro ao criar instância",
        description: error instanceof Error ? error.message : "Erro desconhecido ao criar instância.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteInstance = async (instanceId: string) => {
    try {
      setIsLoading(true);
      const evolutionService = createEvolutionApiService(config.url, config.key);
      await evolutionService.deleteInstance(instanceId);
      
      setInstances(prev => prev.filter(instance => instance.id !== instanceId));
      toast({
        title: "Instância removida!",
        description: "A instância WhatsApp foi removida.",
      });
    } catch (error) {
      console.error('Erro ao deletar instância:', error);
      toast({
        title: "Erro ao deletar",
        description: error instanceof Error ? error.message : "Erro ao deletar instância.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const connectInstance = async (instanceId: string) => {
    setIsLoading(true);
    try {
      console.log('Conectando instância:', instanceId);
      
      const evolutionService = createEvolutionApiService(config.url, config.key);
      const connectResponse = await evolutionService.connectInstance(instanceId);
      const qrResponse = await evolutionService.getQRCode(instanceId);
      
      setInstances(prevInstances => {
        return prevInstances.map(instance => {
          if (instance.id === instanceId) {
            return { 
              ...instance, 
              status: 'qr_ready',
              qrCode: qrResponse.base64 || qrResponse.code
            };
          }
          return instance;
        });
      });

      toast({
        title: "QR Code gerado!",
        description: "Escaneie o QR Code com seu WhatsApp para conectar.",
      });

      const statusInterval = setInterval(async () => {
        try {
          const status = await evolutionService.getInstanceStatus(instanceId);
          if (status?.instance?.state === 'open') {
            setInstances(prev => prev.map(inst => 
              inst.id === instanceId 
                ? { ...inst, status: 'connected', phone: status.instance?.owner?.number || '+55 11 99999-9999' }
                : inst
            ));
            clearInterval(statusInterval);
            toast({
              title: "WhatsApp Conectado!",
              description: "Sua instância está pronta para enviar mensagens.",
            });
          }
        } catch (error) {
          console.error('Erro ao verificar status:', error);
        }
      }, 5000);

      setTimeout(() => clearInterval(statusInterval), 120000);

    } catch (error) {
      console.error('Erro ao conectar instância:', error);
      toast({
        title: "Erro ao conectar",
        description: error instanceof Error ? error.message : "Erro ao gerar QR Code.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectInstance = async (instanceId: string) => {
    setIsLoading(true);
    try {
      const evolutionService = createEvolutionApiService(config.url, config.key);
      await evolutionService.logoutInstance(instanceId);

      setInstances(prevInstances => {
        return prevInstances.map(instance => {
          if (instance.id === instanceId) {
            return { ...instance, status: 'disconnected', phone: undefined, qrCode: undefined };
          }
          return instance;
        });
      });

      toast({
        title: "Instância desconectada!",
        description: "A instância WhatsApp foi desconectada.",
      });
    } catch (error) {
      console.error('Erro ao desconectar instância:', error);
      toast({
        title: "Erro ao desconectar",
        description: error instanceof Error ? error.message : "Erro ao desconectar instância.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendTestMessage = async (instanceId: string, phone: string, message: string) => {
    if (!phone.trim() || !message.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o número e a mensagem.",
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);
    try {
      const evolutionService = createEvolutionApiService(config.url, config.key);
      await evolutionService.sendMessage(instanceId, phone, message);

      toast({
        title: "Mensagem enviada!",
        description: `Mensagem de teste enviada para ${phone}.`,
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast({
        title: "Erro ao enviar mensagem",
        description: error instanceof Error ? error.message : "Erro ao enviar mensagem de teste.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateInstance = (updatedInstance: WhatsAppInstance) => {
    setInstances(prevInstances => 
      prevInstances.map(instance => 
        instance.id === updatedInstance.id ? updatedInstance : instance
      )
    );
    
    toast({
      title: "Instância atualizada!",
      description: "Configurações da instância foram salvas.",
    });
  };

  const refreshInstances = async () => {
    if (!config.connected || !config.url || !config.key) {
      return;
    }

    setIsLoading(true);
    try {
      const evolutionService = createEvolutionApiService(config.url, config.key);
      const response = await evolutionService.fetchInstances();
      
      if (response && Array.isArray(response)) {
        const mappedInstances: WhatsAppInstance[] = response.map((inst: any) => ({
          id: inst.instance.instanceName || inst.instanceName,
          name: inst.instance.instanceName || inst.instanceName,
          status: inst.instance.state === 'open' ? 'connected' : 'disconnected',
          phone: inst.instance.owner?.number,
          webhook: inst.instance.webhook,
          autoReply: false,
          autoReplyMessage: 'Obrigado pela mensagem! Retornaremos em breve.',
          businessHours: {
            enabled: false,
            start: '09:00',
            end: '18:00'
          }
        }));
        
        setInstances(mappedInstances);
      }
    } catch (error) {
      console.error('Erro ao atualizar instâncias:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar a lista de instâncias.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    instances,
    isLoading,
    createInstance,
    deleteInstance,
    connectInstance,
    disconnectInstance,
    sendTestMessage,
    updateInstance,
    refreshInstances
  };
};
