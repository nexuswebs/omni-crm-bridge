
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Smartphone, MessageSquare, Settings, Send, Users, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const WhatsAppManager = () => {
  const { toast } = useToast();
  const [instances, setInstances] = useState([
    {
      id: 1,
      name: 'Principal',
      phone: '+55 11 99999-0001',
      status: 'connected',
      qrCode: '',
      webhook: 'https://seu-webhook.com/whatsapp',
      autoReply: true
    },
    {
      id: 2,
      name: 'Vendas',
      phone: '+55 11 99999-0002',
      status: 'disconnected',
      qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...',
      webhook: 'https://seu-webhook.com/vendas',
      autoReply: false
    }
  ]);

  const [selectedInstance, setSelectedInstance] = useState(instances[0]);
  const [apiUrl, setApiUrl] = useState('https://api.evolution.com');
  const [globalApiKey, setGlobalApiKey] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('https://seu-webhook.com/whatsapp');
  const [message, setMessage] = useState('');
  const [recipient, setRecipient] = useState('');
  const [bulkRecipients, setBulkRecipients] = useState('');
  const [bulkMessage, setBulkMessage] = useState('');

  const handleConfigureInstance = (instanceId: number) => {
    const instance = instances.find(i => i.id === instanceId);
    console.log('Configurando instância:', instance?.name);
    toast({
      title: "Configuração de Instância",
      description: `Abrindo configurações para ${instance?.name}`,
    });
  };

  const handleToggleConnection = (instanceId: number) => {
    const instance = instances.find(i => i.id === instanceId);
    if (!instance) return;

    const newStatus = instance.status === 'connected' ? 'disconnected' : 'connected';
    
    setInstances(prev => prev.map(i => 
      i.id === instanceId ? { ...i, status: newStatus } : i
    ));

    console.log(`${newStatus === 'connected' ? 'Conectando' : 'Desconectando'} instância:`, instance.name);
    
    toast({
      title: newStatus === 'connected' ? "Instância Conectada" : "Instância Desconectada",
      description: `${instance.name} foi ${newStatus === 'connected' ? 'conectada' : 'desconectada'} com sucesso.`,
    });
  };

  const handleSaveConfig = () => {
    if (!apiUrl || !globalApiKey) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha a URL da API e a chave global.",
        variant: "destructive",
      });
      return;
    }

    console.log('Salvando configurações Evolution API:', { apiUrl, globalApiKey: '***', webhookUrl });
    
    toast({
      title: "Configurações salvas!",
      description: "As configurações da Evolution API foram atualizadas.",
    });
  };

  const handleTestConnection = () => {
    if (!apiUrl || !globalApiKey) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha a URL da API e a chave global antes de testar.",
        variant: "destructive",
      });
      return;
    }

    console.log('Testando conexão Evolution API');
    
    toast({
      title: "Testando conexão...",
      description: "Verificando conectividade com Evolution API.",
    });

    // Simular teste
    setTimeout(() => {
      toast({
        title: "Conexão testada",
        description: "Conectado com sucesso à Evolution API.",
      });
    }, 2000);
  };

  const handleExportConfig = () => {
    const config = {
      apiUrl,
      webhookUrl,
      instances: instances.map(i => ({
        name: i.name,
        webhook: i.webhook,
        autoReply: i.autoReply
      }))
    };

    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'whatsapp-config.json';
    link.click();
    
    console.log('Exportando configurações:', config);
    
    toast({
      title: "Configurações exportadas!",
      description: "Arquivo de configuração foi baixado.",
    });
  };

  const handleSendMessage = () => {
    if (!message || !recipient) {
      toast({
        title: "Erro",
        description: "Preencha o destinatário e a mensagem.",
        variant: "destructive",
      });
      return;
    }

    console.log('Enviando mensagem:', { recipient, message });
    
    toast({
      title: "Mensagem enviada!",
      description: `Mensagem enviada para ${recipient}`,
    });
    setMessage('');
    setRecipient('');
  };

  const handleBulkSend = () => {
    if (!bulkMessage || !bulkRecipients) {
      toast({
        title: "Erro",
        description: "Preencha os destinatários e a mensagem.",
        variant: "destructive",
      });
      return;
    }

    const recipients = bulkRecipients.split('\n').filter(r => r.trim());
    console.log('Enviando mensagem em massa para:', recipients.length, 'destinatários');
    
    toast({
      title: "Envio em massa iniciado!",
      description: `Enviando mensagem para ${recipients.length} destinatários.`,
    });
    
    setBulkMessage('');
    setBulkRecipients('');
  };

  const handleImportList = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.csv';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setBulkRecipients(content);
          console.log('Lista importada:', content);
          toast({
            title: "Lista importada!",
            description: "Contatos foram carregados com sucesso.",
          });
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

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

  return (
    <Tabs defaultValue="instances" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="instances">Instâncias</TabsTrigger>
        <TabsTrigger value="conversations">Conversas</TabsTrigger>
        <TabsTrigger value="bulk">Envio em Massa</TabsTrigger>
        <TabsTrigger value="reports">Relatórios</TabsTrigger>
        <TabsTrigger value="config">Configurações</TabsTrigger>
      </TabsList>

      <TabsContent value="instances">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {instances.map((instance) => (
            <Card key={instance.id} className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center text-white">
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle>{instance.name}</CardTitle>
                      <CardDescription>{instance.phone}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(instance.status)}`} />
                    <Badge variant={instance.status === 'connected' ? 'default' : 'secondary'}>
                      {getStatusLabel(instance.status)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Webhook:</span>
                      <p className="font-medium truncate">{instance.webhook}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Auto Reply:</span>
                      <p className="font-medium">{instance.autoReply ? 'Ativo' : 'Inativo'}</p>
                    </div>
                  </div>

                  {instance.status === 'disconnected' && instance.qrCode && (
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">Escaneie o QR Code:</p>
                      <div className="w-32 h-32 bg-white mx-auto rounded border p-2">
                        <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center text-xs">
                          QR Code
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleConfigureInstance(instance.id)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Configurar
                    </Button>
                    <Button 
                      size="sm" 
                      variant={instance.status === 'connected' ? 'destructive' : 'default'}
                      className="flex-1"
                      onClick={() => handleToggleConnection(instance.id)}
                    >
                      {instance.status === 'connected' ? 'Desconectar' : 'Conectar'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="conversations">
        <Card className="border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Conversas Ativas
            </CardTitle>
            <CardDescription>
              Gerencie conversas em andamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <Select value={selectedInstance.name} onValueChange={(value) => {
                  const instance = instances.find(i => i.name === value);
                  if (instance) setSelectedInstance(instance);
                }}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Selecionar instância" />
                  </SelectTrigger>
                  <SelectContent>
                    {instances.map((instance) => (
                      <SelectItem key={instance.id} value={instance.name}>
                        {instance.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Input
                  placeholder="Número do destinatário"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="flex-1"
                />
              </div>
              
              <Textarea
                placeholder="Digite sua mensagem..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
              />
              
              <Button onClick={handleSendMessage} className="bg-gradient-primary">
                <Send className="w-4 h-4 mr-2" />
                Enviar Mensagem
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="bulk">
        <Card className="border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="w-5 h-5" />
              Envio em Massa
            </CardTitle>
            <CardDescription>
              Envie mensagens para múltiplos contatos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="recipients">Destinatários (um por linha)</Label>
              <Textarea
                id="recipients"
                placeholder="5511999999999&#10;5511888888888&#10;5511777777777"
                rows={6}
                value={bulkRecipients}
                onChange={(e) => setBulkRecipients(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="bulk-message">Mensagem</Label>
              <Textarea
                id="bulk-message"
                placeholder="Digite sua mensagem aqui..."
                rows={4}
                value={bulkMessage}
                onChange={(e) => setBulkMessage(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button className="bg-gradient-primary" onClick={handleBulkSend}>
                <Send className="w-4 h-4 mr-2" />
                Enviar para Todos
              </Button>
              <Button variant="outline" onClick={handleImportList}>
                <Users className="w-4 h-4 mr-2" />
                Importar Lista
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="reports">
        <Card className="border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Relatórios
            </CardTitle>
            <CardDescription>
              Analytics e métricas das suas instâncias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Relatórios em desenvolvimento...</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="config">
        <Card className="border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Configurações Evolution API</CardTitle>
            <CardDescription>
              Configure a conexão com a Evolution API
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="api-url">URL Base da API</Label>
              <Input
                id="api-url"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="https://api.evolution.com"
              />
            </div>

            <div>
              <Label htmlFor="global-api-key">Chave Global da API</Label>
              <Input
                id="global-api-key"
                type="password"
                value={globalApiKey}
                onChange={(e) => setGlobalApiKey(e.target.value)}
                placeholder="••••••••••••••••••••"
              />
            </div>

            <div>
              <Label htmlFor="webhook-url">URL do Webhook Global</Label>
              <Input
                id="webhook-url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://seu-webhook.com/whatsapp"
              />
            </div>

            <div className="space-y-2">
              <Label>Eventos do Webhook</Label>
              <div className="flex flex-wrap gap-2">
                {['messages', 'status', 'qrcode', 'connection', 'call'].map((event) => (
                  <Badge key={event} variant="secondary" className="cursor-pointer">
                    {event}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="auto-reply" />
              <Label htmlFor="auto-reply">Resposta Automática</Label>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSaveConfig} className="bg-gradient-primary">
                Salvar Configurações
              </Button>
              <Button variant="outline" onClick={handleTestConnection}>
                Testar Conexão
              </Button>
              <Button variant="outline" onClick={handleExportConfig}>
                Exportar Configurações
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
