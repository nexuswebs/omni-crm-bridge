
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useEvolutionApiStorage } from '@/hooks/useEvolutionApiStorage';
import { EvolutionApiService } from '@/services/evolutionApi';

interface IntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  integration: any;
  onSave: (integrationData: any) => void;
}

export const IntegrationModal = ({ isOpen, onClose, integration, onSave }: IntegrationModalProps) => {
  const { toast } = useToast();
  const { config, updateConfig } = useEvolutionApiStorage();
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const handleTestConnection = async () => {
    if (!config.url || !config.key) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha a URL e a chave da API.",
        variant: "destructive",
      });
      return;
    }

    setIsTesting(true);
    console.log('Testando conexão Evolution API:', { url: config.url, key: '***' });

    try {
      // Criar uma instância do serviço com as configurações atuais
      const evolutionService = new EvolutionApiService({
        baseUrl: config.url,
        apiKey: config.key
      });

      // Testar com endpoint de instâncias
      const response = await fetch(`${config.url}/instance/fetchInstances`, {
        method: 'GET',
        headers: {
          'apikey': config.key,
          'Content-Type': 'application/json'
        }
      });

      console.log('Resposta da API:', response.status, response.statusText);

      if (response.ok) {
        const data = await response.json();
        console.log('Dados recebidos:', data);
        
        updateConfig({ 
          connected: true, 
          status: 'connected' 
        });
        
        toast({
          title: "Conexão estabelecida!",
          description: "Evolution API conectada com sucesso.",
        });
      } else {
        const errorText = await response.text();
        console.error('Erro HTTP:', response.status, errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Erro na conexão Evolution API:', error);
      
      updateConfig({ 
        connected: false, 
        status: 'disconnected' 
      });
      
      toast({
        title: "Erro na conexão",
        description: error instanceof Error ? error.message : "Verifique a URL e a chave da API.",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    if (!config.url || !config.key) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    console.log('Salvando configurações Evolution API:', {
      url: config.url,
      key: '***',
      instanceName: config.instanceName,
      webhookUrl: config.webhookUrl,
      autoConnect: config.autoConnect
    });

    // Atualizar a integração na lista
    const updatedIntegration = {
      name: 'Evolution API',
      status: config.connected ? 'connected' : 'disconnected',
      url: config.url,
      key: config.key
    };

    onSave(updatedIntegration);
    
    toast({
      title: "Configurações salvas!",
      description: "Evolution API configurada e salva com sucesso.",
    });

    onClose();
  };

  if (integration?.name !== 'Evolution API') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configurar {integration?.name}</DialogTitle>
            <DialogDescription>
              Configuração para {integration?.name} ainda não implementada.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={onClose}>Fechar</Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Configurar Evolution API</DialogTitle>
          <DialogDescription>
            Configure a conexão com sua Evolution API
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="api-url">URL da API</Label>
            <Input
              id="api-url"
              value={config.url}
              onChange={(e) => updateConfig({ url: e.target.value })}
              placeholder="https://api.evolution.com"
            />
          </div>

          <div>
            <Label htmlFor="api-key">Chave da API</Label>
            <Input
              id="api-key"
              type="password"
              value={config.key}
              onChange={(e) => updateConfig({ key: e.target.value })}
              placeholder="Sua chave da API"
            />
          </div>

          <div>
            <Label htmlFor="instance-name">Nome da Instância</Label>
            <Input
              id="instance-name"
              value={config.instanceName}
              onChange={(e) => updateConfig({ instanceName: e.target.value })}
              placeholder="crm-instance"
            />
          </div>

          <div>
            <Label htmlFor="webhook-url">URL do Webhook</Label>
            <Input
              id="webhook-url"
              value={config.webhookUrl}
              onChange={(e) => updateConfig({ webhookUrl: e.target.value })}
              placeholder="https://webhook.site/unique-id"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="auto-connect"
              checked={config.autoConnect}
              onCheckedChange={(checked) => updateConfig({ autoConnect: checked })}
            />
            <Label htmlFor="auto-connect">Conectar automaticamente</Label>
          </div>

          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${config.connected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm">
              {config.connected ? 'Conectado' : 'Desconectado'}
            </span>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleTestConnection} 
              disabled={isTesting}
              variant="outline"
            >
              {isTesting ? 'Testando...' : 'Testar Conexão'}
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Button>
            <Button onClick={onClose} variant="outline">
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
