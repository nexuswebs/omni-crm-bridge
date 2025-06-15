
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Smartphone, Server, Wifi, QrCode, MessageCircle, Settings } from 'lucide-react';

interface EvolutionApiIntegrationProps {
  onClose: () => void;
}

export const EvolutionApiIntegration = ({ onClose }: EvolutionApiIntegrationProps) => {
  const { toast } = useToast();
  
  const [config, setConfig] = useState({
    serverUrl: '',
    apiKey: '',
    instanceName: 'crm-instance',
    webhookUrl: '',
    connected: false
  });

  const [instances, setInstances] = useState([
    {
      id: 1,
      name: 'crm-instance',
      status: 'disconnected',
      qrCode: null,
      phone: null
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('config');

  const handleTestConnection = async () => {
    if (!config.serverUrl || !config.apiKey) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha a URL do servidor e a API Key.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log('Testando conexão Evolution API:', { serverUrl: config.serverUrl, apiKey: '***' });

    try {
      // Simular teste de conexão com Evolution API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const success = Math.random() > 0.3; // 70% chance de sucesso
      
      if (success) {
        setConfig({ ...config, connected: true });
        
        toast({
          title: "Conexão estabelecida!",
          description: "Evolution API conectada com sucesso.",
        });
      } else {
        toast({
          title: "Erro na conexão",
          description: "Verifique a URL do servidor e API Key.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao conectar com Evolution API.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateInstance = async () => {
    if (!config.connected) {
      toast({
        title: "Conexão necessária",
        description: "Conecte-se à Evolution API primeiro.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log('Criando instância WhatsApp:', config.instanceName);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newInstance = {
        id: Date.now(),
        name: config.instanceName,
        status: 'created',
        qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        phone: null
      };
      
      setInstances([...instances, newInstance]);
      setActiveTab('instances');
      
      toast({
        title: "Instância criada!",
        description: `Instância ${config.instanceName} criada com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao criar instância.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectInstance = async (instanceId: number) => {
    setIsLoading(true);
    console.log('Conectando instância:', instanceId);

    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setInstances(instances.map(instance => 
        instance.id === instanceId 
          ? { ...instance, status: 'connected', phone: '+55 11 99999-9999' }
          : instance
      ));
      
      toast({
        title: "Instância conectada!",
        description: "WhatsApp conectado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao conectar instância.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteInstance = async (instanceId: number) => {
    console.log('Deletando instância:', instanceId);
    
    setInstances(instances.filter(instance => instance.id !== instanceId));
    
    toast({
      title: "Instância removida",
      description: "Instância deletada com sucesso.",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-500">Conectado</Badge>;
      case 'created':
        return <Badge variant="secondary">Aguardando QR Code</Badge>;
      default:
        return <Badge variant="outline">Desconectado</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Smartphone className="w-6 h-6" />
            Evolution API Integration
          </h2>
          <p className="text-muted-foreground">Configure WhatsApp via Evolution API</p>
        </div>
        <Button variant="outline" onClick={onClose}>
          Fechar
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="config">Configuração</TabsTrigger>
          <TabsTrigger value="instances">Instâncias</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5" />
                Configuração do Servidor
              </CardTitle>
              <CardDescription>
                Configure a conexão com seu servidor Evolution API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="server-url">URL do Servidor</Label>
                <Input
                  id="server-url"
                  value={config.serverUrl}
                  onChange={(e) => setConfig({ ...config, serverUrl: e.target.value })}
                  placeholder="http://seu-servidor:8080"
                />
              </div>

              <div>
                <Label htmlFor="api-key">API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  value={config.apiKey}
                  onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                  placeholder="Sua API Key da Evolution API"
                />
              </div>

              <div>
                <Label htmlFor="instance-name">Nome da Instância</Label>
                <Input
                  id="instance-name"
                  value={config.instanceName}
                  onChange={(e) => setConfig({ ...config, instanceName: e.target.value })}
                  placeholder="crm-instance"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleTestConnection} disabled={isLoading}>
                  <Wifi className="w-4 h-4 mr-2" />
                  {isLoading ? 'Testando...' : 'Testar Conexão'}
                </Button>
                
                <Button 
                  onClick={handleCreateInstance} 
                  disabled={!config.connected || isLoading}
                  className="bg-gradient-primary"
                >
                  <Smartphone className="w-4 h-4 mr-2" />
                  Criar Instância
                </Button>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <div className={`w-3 h-3 rounded-full ${config.connected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm">
                  {config.connected ? 'Conectado à Evolution API' : 'Desconectado'}
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="instances" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Instâncias WhatsApp
              </CardTitle>
              <CardDescription>
                Gerencie suas instâncias do WhatsApp
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {instances.map((instance) => (
                  <div key={instance.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium">{instance.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {instance.phone || 'Não conectado'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(instance.status)}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteInstance(instance.id)}
                        >
                          Deletar
                        </Button>
                      </div>
                    </div>

                    {instance.status === 'created' && instance.qrCode && (
                      <div className="text-center space-y-2">
                        <div className="bg-white p-4 rounded-lg inline-block">
                          <QrCode className="w-32 h-32 mx-auto" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Escaneie o QR Code com seu WhatsApp
                        </p>
                        <Button 
                          size="sm" 
                          onClick={() => handleConnectInstance(instance.id)}
                          disabled={isLoading}
                        >
                          {isLoading ? 'Conectando...' : 'Simular Conexão'}
                        </Button>
                      </div>
                    )}

                    {instance.status === 'connected' && (
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm text-green-700">
                          ✅ WhatsApp conectado e pronto para uso!
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configuração de Webhooks
              </CardTitle>
              <CardDescription>
                Configure webhooks para receber mensagens
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="webhook-url">URL do Webhook</Label>
                <Input
                  id="webhook-url"
                  value={config.webhookUrl}
                  onChange={(e) => setConfig({ ...config, webhookUrl: e.target.value })}
                  placeholder="https://seu-crm.com/api/webhook/whatsapp"
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Eventos de Webhook</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• message.receive - Nova mensagem recebida</li>
                  <li>• message.send - Mensagem enviada</li>
                  <li>• instance.connect - Instância conectada</li>
                  <li>• instance.disconnect - Instância desconectada</li>
                </ul>
              </div>

              <Button className="w-full">
                Salvar Configurações de Webhook
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
