
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Smartphone, CheckCircle, AlertTriangle, Copy, ExternalLink, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEvolutionApiStorage } from '@/hooks/useEvolutionApiStorage';

interface EvolutionApiIntegrationProps {
  onClose: () => void;
}

export const EvolutionApiIntegration = ({ onClose }: EvolutionApiIntegrationProps) => {
  const { toast } = useToast();
  const { config, updateConfig } = useEvolutionApiStorage();
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'success' | 'error' | 'idle'>('idle');

  const handleTestConnection = async () => {
    if (!config.url || !config.key) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha a URL e a chave da API.",
        variant: "destructive",
      });
      return;
    }

    setConnectionStatus('testing');
    setIsLoading(true);

    try {
      const response = await fetch(`${config.url}/instance/fetchInstances`, {
        method: 'GET',
        headers: {
          'apikey': config.key,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setConnectionStatus('success');
        updateConfig({ connected: true, status: 'connected' });
        toast({
          title: "Conexão estabelecida!",
          description: "Evolution API conectada com sucesso.",
        });
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Erro na conexão Evolution API:', error);
      setConnectionStatus('error');
      updateConfig({ connected: false, status: 'disconnected' });
      toast({
        title: "Erro na conexão",
        description: error instanceof Error ? error.message : "Verifique a URL e a chave da API.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    console.log('Salvando configurações Evolution API:', {
      url: config.url,
      key: '***',
      instanceName: config.instanceName,
      webhookUrl: config.webhookUrl,
      autoConnect: config.autoConnect
    });

    toast({
      title: "Configurações salvas!",
      description: "Evolution API configurada com sucesso.",
    });

    onClose();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Texto copiado para a área de transferência.",
    });
  };

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'testing':
        return <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <div className={`w-3 h-3 rounded-full ${config.connected ? 'bg-green-500' : 'bg-red-500'}`} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Smartphone className="w-6 h-6" />
            Evolution API
          </h2>
          <p className="text-muted-foreground">Configure a integração com Evolution API para WhatsApp</p>
        </div>
        <Button variant="outline" onClick={onClose}>
          Voltar
        </Button>
      </div>

      <Tabs defaultValue="connection" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="connection">Conexão</TabsTrigger>
          <TabsTrigger value="instances">Instâncias</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>

        <TabsContent value="connection" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Configurações de Conexão
              </CardTitle>
              <CardDescription>
                Configure as credenciais para conectar à Evolution API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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

              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-connect"
                  checked={config.autoConnect}
                  onCheckedChange={(checked) => updateConfig({ autoConnect: checked })}
                />
                <Label htmlFor="auto-connect">Conectar automaticamente</Label>
              </div>

              <div className="flex items-center gap-2">
                {getConnectionStatusIcon()}
                <span className="text-sm">
                  {connectionStatus === 'testing' 
                    ? 'Testando conexão...' 
                    : config.connected 
                      ? 'Conectado' 
                      : 'Desconectado'
                  }
                </span>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleTestConnection} disabled={isLoading} variant="outline">
                  {isLoading ? 'Testando...' : 'Testar Conexão'}
                </Button>
                <Button onClick={handleSave} disabled={isLoading}>
                  Salvar Configurações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="instances" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Instâncias</CardTitle>
              <CardDescription>
                Configure suas instâncias WhatsApp através da Evolution API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="instance-name">Nome da Instância Padrão</Label>
                <Input
                  id="instance-name"
                  value={config.instanceName}
                  onChange={(e) => updateConfig({ instanceName: e.target.value })}
                  placeholder="crm-instance"
                />
              </div>

              {!config.connected && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Você precisa conectar à Evolution API primeiro para gerenciar instâncias.
                  </AlertDescription>
                </Alert>
              )}

              {config.connected && (
                <div className="space-y-3">
                  <h4 className="font-medium">Instâncias Disponíveis</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 rounded border">
                      <div>
                        <p className="font-medium">crm-instance</p>
                        <p className="text-sm text-muted-foreground">+55 11 99999-9999</p>
                      </div>
                      <Badge className="bg-green-500">Conectado</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded border">
                      <div>
                        <p className="font-medium">suporte-instance</p>
                        <p className="text-sm text-muted-foreground">Não conectado</p>
                      </div>
                      <Badge variant="outline">Desconectado</Badge>
                    </div>
                  </div>
                </div>
              )}

              <Button disabled={!config.connected} className="w-full">
                Ir para Gerenciador WhatsApp
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Webhook</CardTitle>
              <CardDescription>
                Configure webhooks para receber eventos do WhatsApp
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="webhook-url">URL do Webhook</Label>
                <div className="flex gap-2">
                  <Input
                    id="webhook-url"
                    value={config.webhookUrl}
                    onChange={(e) => updateConfig({ webhookUrl: e.target.value })}
                    placeholder="https://webhook.site/unique-id"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(config.webhookUrl)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Configure esta URL nas suas instâncias Evolution API para receber eventos em tempo real.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <h4 className="font-medium">Eventos Suportados</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded border text-sm">Mensagem Recebida</div>
                  <div className="p-2 rounded border text-sm">Mensagem Enviada</div>
                  <div className="p-2 rounded border text-sm">Status da Mensagem</div>
                  <div className="p-2 rounded border text-sm">Presença Online</div>
                  <div className="p-2 rounded border text-sm">Conexão/Desconexão</div>
                  <div className="p-2 rounded border text-sm">QR Code</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Documentação e Recursos</CardTitle>
          <CardDescription>
            Links úteis para configurar a Evolution API
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border">
              <h4 className="font-medium mb-2">Documentação</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Guia completo da Evolution API
              </p>
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                Ver Docs
              </Button>
            </div>
            
            <div className="p-4 rounded-lg border">
              <h4 className="font-medium mb-2">Postman Collection</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Teste as APIs facilmente
              </p>
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
            
            <div className="p-4 rounded-lg border">
              <h4 className="font-medium mb-2">Discord Oficial</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Comunidade e suporte
              </p>
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                Entrar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
