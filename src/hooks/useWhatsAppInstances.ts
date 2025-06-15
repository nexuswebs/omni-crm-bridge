
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { evolutionApi } from '@/services/evolutionApi';

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

    setIsLoading(true);
    try {
      console.log('Criando instância:', instanceName);
      
      const response = await evolutionApi.createInstance(instanceName);
      
      const newInstance: WhatsAppInstance = {
        id: instanceName,
        name: instanceName,
        status: 'disconnected',
        webhook: 'https://webhook.site/unique-id',
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
      await evolutionApi.deleteInstance(instanceId);
      
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
      
      const connectResponse = await evolutionApi.connectInstance(instanceId);
      const qrResponse = await evolutionApi.getQRCode(instanceId);
      
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
          const status = await evolutionApi.getInstanceStatus(instanceId);
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
      await evolutionApi.logoutInstance(instanceId);

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
      await evolutionApi.sendMessage(instanceId, phone, message);

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
    setInstances(prev => prev.map(inst => 
      inst.id === updatedInstance.id ? updatedInstance : inst
    ));
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
  };
};

export type { WhatsAppInstance };
