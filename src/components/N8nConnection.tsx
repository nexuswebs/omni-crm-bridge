
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Zap, Settings, Code, TestTube } from 'lucide-react';

interface N8nConnectionProps {
  onClose: () => void;
}

export const N8nConnection = ({ onClose }: N8nConnectionProps) => {
  const { toast } = useToast();
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [config, setConfig] = useState({
    apiUrl: '',
    apiKey: '',
    webhookUrl: '',
    instanceName: 'CRM Instance'
  });

  const [testPayload, setTestPayload] = useState(`{
  "event": "test_connection",
  "customer": {
    "id": 123,
    "name": "Cliente Teste",
    "phone": "+5511999999999"
  },
  "timestamp": "${new Date().toISOString()}"
}`);

  const handleConnect = async () => {
    if (!config.apiUrl || !config.apiKey) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha URL da API e API Key",
        variant: "destructive",
      });
      return;
    }

    setConnectionStatus('connecting');

    try {
      // Simular conexão com n8n
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setConnectionStatus('connected');
      toast({
        title: "Conectado com sucesso!",
        description: "n8n está conectado e pronto para usar.",
      });
    } catch (error) {
      setConnectionStatus('error');
      toast({
        title: "Erro na conexão",
        description: "Não foi possível conectar com o n8n. Verifique as configurações.",
        variant: "destructive",
      });
    }
  };

  const handleTestWebhook = async () => {
    if (!config.webhookUrl) {
      toast({
        title: "URL do Webhook necessária",
        description: "Configure a URL do webhook antes de testar.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(config.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: testPayload,
      });

      if (response.ok) {
        toast({
          title: "Webhook testado com sucesso!",
          description: "O webhook foi executado corretamente.",
        });
      } else {
        throw new Error('Webhook failed');
      }
    } catch (error) {
      toast({
        title: "Erro no teste do webhook",
        description: "Não foi possível executar o webhook. Verifique a URL.",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = () => {
    setConnectionStatus('disconnected');
    setConfig({
      apiUrl: '',
      apiKey: '',
      webhookUrl: '',
      instanceName: 'CRM Instance'
    });
    toast({
      title: "Desconectado",
      description: "n8n foi desconectado com sucesso.",
    });
  };

  const getStatusBadge = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Badge className="bg-green-500 text-white"><CheckCircle className="w-3 h-3 mr-1" />Conectado</Badge>;
      case 'connecting':
        return <Badge className="bg-yellow-500 text-white">Conectando...</Badge>;
      case 'error':
        return <Badge className="bg-red-500 text-white"><XCircle className="w-3 h-3 mr-1" />Erro</Badge>;
      default:
        return <Badge variant="outline">Desconectado</Badge>;
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5" />
            <CardTitle>Conexão n8n</CardTitle>
            {getStatusBadge()}
          </div>
          <Button variant="outline" onClick={onClose}>Fechar</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="config" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="config">
              <Settings className="w-4 h-4 mr-2" />
              Configuração
            </TabsTrigger>
            <TabsTrigger value="webhooks">
              <Code className="w-4 h-4 mr-2" />
              Webhooks
            </TabsTrigger>
            <TabsTrigger value="test">
              <TestTube className="w-4 h-4 mr-2" />
              Teste
            </TabsTrigger>
          </TabsList>

          <TabsContent value="config" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="apiUrl">URL da API n8n</Label>
                <Input
                  id="apiUrl"
                  value={config.apiUrl}
                  onChange={(e) => setConfig({...config, apiUrl: e.target.value})}
                  placeholder="https://sua-instancia.n8n.io/api/v1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={config.apiKey}
                  onChange={(e) => setConfig({...config, apiKey: e.target.value})}
                  placeholder="n8n_api_key_aqui"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instanceName">Nome da Instância</Label>
              <Input
                id="instanceName"
                value={config.instanceName}
                onChange={(e) => setConfig({...config, instanceName: e.target.value})}
                placeholder="CRM Instance"
              />
            </div>

            <div className="flex gap-2">
              {connectionStatus === 'connected' ? (
                <Button onClick={handleDisconnect} variant="destructive">
                  Desconectar
                </Button>
              ) : (
                <Button 
                  onClick={handleConnect} 
                  disabled={connectionStatus === 'connecting'}
                >
                  {connectionStatus === 'connecting' ? 'Conectando...' : 'Conectar'}
                </Button>
              )}
            </div>
          </TabsContent>

          <TabsContent value="webhooks" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="webhookUrl">URL do Webhook</Label>
              <Input
                id="webhookUrl"
                value={config.webhookUrl}
                onChange={(e) => setConfig({...config, webhookUrl: e.target.value})}
                placeholder="https://sua-instancia.n8n.io/webhook/crm"
              />
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Como configurar o webhook no n8n:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>Acesse seu n8n e crie um novo workflow</li>
                <li>Adicione um nó "Webhook" como trigger</li>
                <li>Configure o método como "POST"</li>
                <li>Copie a URL gerada e cole no campo acima</li>
                <li>Ative o workflow</li>
              </ol>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2 text-blue-800">Eventos disponíveis:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-blue-700">
                <li>customer_created - Novo cliente cadastrado</li>
                <li>message_received - Nova mensagem recebida</li>
                <li>payment_received - Pagamento recebido</li>
                <li>ticket_created - Novo ticket criado</li>
                <li>workflow_executed - Workflow executado</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="test" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="testPayload">Payload de Teste</Label>
              <Textarea
                id="testPayload"
                value={testPayload}
                onChange={(e) => setTestPayload(e.target.value)}
                rows={10}
                className="font-mono text-sm"
              />
            </div>

            <Button onClick={handleTestWebhook} disabled={!config.webhookUrl}>
              Testar Webhook
            </Button>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2 text-yellow-800">Dicas para teste:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700">
                <li>Certifique-se de que o workflow n8n está ativo</li>
                <li>Verifique se a URL do webhook está correta</li>
                <li>Monitore os logs do n8n para ver se o webhook foi recebido</li>
                <li>Use o payload personalizado para testar cenários específicos</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
