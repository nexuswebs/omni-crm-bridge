
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Phone } from 'lucide-react';

const WhatsApp = () => {
  const [apiUrl, setApiUrl] = useState('');
  const [apiKey, setApiKey] = useState('');

  const instances = [
    {
      id: 1,
      name: 'Principal',
      phone: '+55 11 99999-9999',
      status: 'connected',
      qrcode: true,
      messages: 156,
      lastActivity: '2 min atrás'
    },
    {
      id: 2,
      name: 'Suporte',
      phone: '+55 11 88888-8888',
      status: 'connected',
      qrcode: false,
      messages: 89,
      lastActivity: '5 min atrás'
    },
    {
      id: 3,
      name: 'Vendas',
      phone: '+55 11 77777-7777',
      status: 'disconnected',
      qrcode: false,
      messages: 0,
      lastActivity: '2 horas atrás'
    }
  ];

  const recentMessages = [
    {
      id: 1,
      customer: 'João Silva',
      phone: '+55 11 99999-9999',
      message: 'Olá, gostaria de saber sobre os preços',
      time: '14:30',
      status: 'unread',
      instance: 'Principal'
    },
    {
      id: 2,
      customer: 'Maria Santos',
      phone: '+55 11 88888-8888',
      message: 'Obrigada pelo atendimento!',
      time: '14:25',
      status: 'read',
      instance: 'Suporte'
    },
    {
      id: 3,
      customer: 'Carlos Oliveira',
      phone: '+55 11 77777-7777',
      message: 'Quando vocês podem entregar?',
      time: '14:20',
      status: 'replied',
      instance: 'Principal'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'disconnected': return 'bg-red-500';
      case 'connecting': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'connected': return 'Conectado';
      case 'disconnected': return 'Desconectado';
      case 'connecting': return 'Conectando';
      default: return 'Desconhecido';
    }
  };

  const getMessageStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'bg-red-500';
      case 'read': return 'bg-yellow-500';
      case 'replied': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">WhatsApp Business</h1>
          <p className="text-muted-foreground">Gerencie suas instâncias e conversas</p>
        </div>
        <Button className="bg-gradient-primary text-white">
          <Plus className="w-4 h-4 mr-2" />
          Nova Instância
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Instâncias</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Phone className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">245</p>
                <p className="text-sm text-muted-foreground">Mensagens Hoje</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <span className="text-xl">💬</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">67</p>
                <p className="text-sm text-muted-foreground">Conversas Ativas</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <span className="text-xl">👥</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">92%</p>
                <p className="text-sm text-muted-foreground">Taxa de Resposta</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <span className="text-xl">⚡</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="instances" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="instances">Instâncias</TabsTrigger>
          <TabsTrigger value="messages">Mensagens</TabsTrigger>
          <TabsTrigger value="config">Configuração</TabsTrigger>
        </TabsList>

        <TabsContent value="instances" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {instances.map((instance) => (
              <Card key={instance.id} className="border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-lg">📱</span>
                      </div>
                      {instance.name}
                    </CardTitle>
                    <Badge variant={instance.status === 'connected' ? 'default' : 'secondary'}>
                      {getStatusLabel(instance.status)}
                    </Badge>
                  </div>
                  <CardDescription>{instance.phone}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(instance.status)}`} />
                      <span className="text-sm">
                        {instance.status === 'connected' ? 'Online' : 'Offline'}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Mensagens hoje:</span>
                        <span className="font-medium">{instance.messages}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Última atividade:</span>
                        <span className="font-medium">{instance.lastActivity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">QR Code:</span>
                        <span className="font-medium">
                          {instance.qrcode ? '✅ Disponível' : '❌ N/A'}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button size="sm" className="flex-1" variant="outline">
                        QR Code
                      </Button>
                      <Button size="sm" className="flex-1" variant="outline">
                        Restart
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="messages" className="space-y-6">
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Mensagens Recentes</CardTitle>
              <CardDescription>
                Últimas conversas em todas as instâncias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentMessages.map((message) => (
                  <div key={message.id} className="flex items-center gap-4 p-4 rounded-lg border border-border bg-background/50">
                    <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
                      {message.customer.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{message.customer}</h4>
                        <Badge variant="outline" className="text-xs">
                          {message.instance}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{message.phone}</p>
                      <p className="text-sm">{message.message}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground mb-2">{message.time}</p>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getMessageStatusColor(message.status)}`} />
                        <span className="text-xs capitalize">{message.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Evolution API</CardTitle>
                <CardDescription>
                  Configure a conexão com a Evolution API
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">URL da API</label>
                  <Input
                    placeholder="https://api.evolution.com"
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">API Key</label>
                  <Input
                    type="password"
                    placeholder="Sua chave da API"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                </div>
                <Button className="w-full">Testar Conexão</Button>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Configurações Gerais</CardTitle>
                <CardDescription>
                  Ajustes globais do WhatsApp
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tempo limite de resposta</label>
                  <select className="w-full p-2 rounded-md border border-input bg-background">
                    <option>30 segundos</option>
                    <option>1 minuto</option>
                    <option>5 minutos</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mensagem automática</label>
                  <select className="w-full p-2 rounded-md border border-input bg-background">
                    <option>Ativada</option>
                    <option>Desativada</option>
                  </select>
                </div>
                <Button className="w-full">Salvar Configurações</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WhatsApp;
