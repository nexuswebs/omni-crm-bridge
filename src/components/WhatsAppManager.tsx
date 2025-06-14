
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Smartphone, Settings, QrCode } from 'lucide-react';

export const WhatsAppManager = () => {
  const [instances, setInstances] = useState([
    {
      id: 1,
      name: 'Instância Principal',
      phone: '+55 11 99999-9999',
      status: 'connected',
      qrCode: '',
      apiKey: 'wa_123456789'
    },
    {
      id: 2,
      name: 'Suporte',
      phone: '+55 11 88888-8888',
      status: 'disconnected',
      qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      apiKey: 'wa_987654321'
    }
  ]);

  const [newInstance, setNewInstance] = useState({
    name: '',
    phone: ''
  });

  const [evolutionConfig, setEvolutionConfig] = useState({
    baseUrl: 'https://api.evolution.com',
    globalApiKey: '',
    webhookUrl: 'https://seu-webhook.com/whatsapp'
  });

  const handleCreateInstance = () => {
    if (newInstance.name && newInstance.phone) {
      const instance = {
        id: Date.now(),
        name: newInstance.name,
        phone: newInstance.phone,
        status: 'disconnected',
        qrCode: '',
        apiKey: `wa_${Math.random().toString(36).substr(2, 9)}`
      };
      setInstances([...instances, instance]);
      setNewInstance({ name: '', phone: '' });
    }
  };

  const handleConnectInstance = (id: number) => {
    setInstances(instances.map(instance => 
      instance.id === id 
        ? { ...instance, status: 'connecting' }
        : instance
    ));
    
    // Simular conexão
    setTimeout(() => {
      setInstances(instances.map(instance => 
        instance.id === id 
          ? { ...instance, status: 'connected', qrCode: '' }
          : instance
      ));
    }, 2000);
  };

  const handleDisconnectInstance = (id: number) => {
    setInstances(instances.map(instance => 
      instance.id === id 
        ? { ...instance, status: 'disconnected' }
        : instance
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'connecting': return 'bg-yellow-500';
      case 'disconnected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'connected': return 'Conectado';
      case 'connecting': return 'Conectando...';
      case 'disconnected': return 'Desconectado';
      default: return 'Desconhecido';
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="instances" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="instances" className="flex items-center gap-2">
            <Smartphone className="w-4 h-4" />
            Instâncias
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Mensagens
          </TabsTrigger>
          <TabsTrigger value="config" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Configurações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="instances">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Nova Instância</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="instance-name">Nome da Instância</Label>
                    <Input
                      id="instance-name"
                      value={newInstance.name}
                      onChange={(e) => setNewInstance({ ...newInstance, name: e.target.value })}
                      placeholder="Ex: Vendas, Suporte..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="instance-phone">Número do WhatsApp</Label>
                    <Input
                      id="instance-phone"
                      value={newInstance.phone}
                      onChange={(e) => setNewInstance({ ...newInstance, phone: e.target.value })}
                      placeholder="+55 11 99999-9999"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleCreateInstance} className="bg-gradient-primary text-white w-full">
                      Criar Instância
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {instances.map((instance) => (
                <Card key={instance.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(instance.status)}`} />
                        {instance.name}
                      </CardTitle>
                      <Badge variant={instance.status === 'connected' ? 'default' : 'secondary'}>
                        {getStatusLabel(instance.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Número:</p>
                      <p className="font-medium">{instance.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">API Key:</p>
                      <p className="font-mono text-xs bg-muted p-2 rounded">{instance.apiKey}</p>
                    </div>

                    {instance.status === 'disconnected' && instance.qrCode && (
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-2">Escaneie o QR Code:</p>
                        <div className="bg-white p-4 rounded-lg inline-block">
                          <QrCode className="w-32 h-32 mx-auto text-gray-400" />
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {instance.status === 'connected' ? (
                        <Button
                          variant="outline"
                          onClick={() => handleDisconnectInstance(instance.id)}
                          className="flex-1"
                        >
                          Desconectar
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleConnectInstance(instance.id)}
                          className="bg-gradient-primary text-white flex-1"
                          disabled={instance.status === 'connecting'}
                        >
                          {instance.status === 'connecting' ? 'Conectando...' : 'Conectar'}
                        </Button>
                      )}
                      <Button variant="outline">Configurar</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Central de Mensagens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">1,247</p>
                      <p className="text-sm text-muted-foreground">Mensagens Enviadas</p>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">856</p>
                      <p className="text-sm text-muted-foreground">Mensagens Recebidas</p>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-yellow-600">23</p>
                      <p className="text-sm text-muted-foreground">Pendentes</p>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">5</p>
                      <p className="text-sm text-muted-foreground">Falhas</p>
                    </div>
                  </Card>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-4">Mensagens Recentes</h3>
                  <div className="space-y-2">
                    {[
                      { from: '+55 11 99999-9999', message: 'Olá, gostaria de saber mais sobre o produto...', time: '2 min atrás' },
                      { from: '+55 11 88888-8888', message: 'Qual o prazo de entrega?', time: '5 min atrás' },
                      { from: '+55 11 77777-7777', message: 'Obrigado pelo atendimento!', time: '10 min atrás' }
                    ].map((msg, index) => (
                      <div key={index} className="p-3 bg-muted/50 rounded flex justify-between">
                        <div>
                          <p className="font-medium text-sm">{msg.from}</p>
                          <p className="text-sm text-muted-foreground">{msg.message}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{msg.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Evolution API</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="base-url">URL Base da API</Label>
                <Input
                  id="base-url"
                  value={evolutionConfig.baseUrl}
                  onChange={(e) => setEvolutionConfig({ ...evolutionConfig, baseUrl: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="global-key">Chave Global da API</Label>
                <Input
                  id="global-key"
                  type="password"
                  value={evolutionConfig.globalApiKey}
                  onChange={(e) => setEvolutionConfig({ ...evolutionConfig, globalApiKey: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="webhook-url">URL do Webhook</Label>
                <Input
                  id="webhook-url"
                  value={evolutionConfig.webhookUrl}
                  onChange={(e) => setEvolutionConfig({ ...evolutionConfig, webhookUrl: e.target.value })}
                />
              </div>
              <Button className="bg-gradient-primary text-white">
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
