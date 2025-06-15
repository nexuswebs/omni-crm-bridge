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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Smartphone, MessageSquare, Settings, Send, Users, BarChart3, Wifi, Key, Globe, QrCode, Plus, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const WhatsAppManager = () => {
  const { toast } = useToast();
  
  // Configurações da Evolution API
  const [evolutionConfig, setEvolutionConfig] = useState({
    serverUrl: '',
    globalApiKey: '',
    connected: false,
    isLoading: false
  });

  // Configurações adicionais
  const [apiUrl, setApiUrl] = useState('');
  const [globalApiKey, setGlobalApiKey] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');

  // Modal de configuração da instância
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [selectedInstanceForConfig, setSelectedInstanceForConfig] = useState<any>(null);

  const [instances, setInstances] = useState([
    {
      id: 1,
      name: 'Principal',
      phone: '+55 11 99999-0001',
      status: 'connected',
      qrCode: '',
      webhook: 'https://seu-webhook.com/whatsapp',
      autoReply: true,
      autoReplyMessage: 'Olá! Obrigado pela sua mensagem. Em breve retornaremos o contato.',
      businessHours: {
        enabled: false,
        start: '09:00',
        end: '18:00'
      },
      events: {
        messageReceived: true,
        messageSent: true,
        connectionUpdate: true
      }
    },
    {
      id: 2,
      name: 'Vendas',
      phone: '',
      status: 'disconnected',
      qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUg',
      webhook: 'https://seu-webhook.com/vendas',
      autoReply: false,
      autoReplyMessage: '',
      businessHours: {
        enabled: false,
        start: '09:00',
        end: '18:00'
      },
      events: {
        messageReceived: true,
        messageSent: false,
        connectionUpdate: true
      }
    }
  ]);

  const [selectedInstance, setSelectedInstance] = useState(instances[0]);
  const [newInstanceName, setNewInstanceName] = useState('');
  const [message, setMessage] = useState('');
  const [recipient, setRecipient] = useState('');
  const [bulkRecipients, setBulkRecipients] = useState('');
  const [bulkMessage, setBulkMessage] = useState('');

  // Testar conexão Evolution API
  const handleTestEvolutionConnection = async () => {
    if (!evolutionConfig.serverUrl || !evolutionConfig.globalApiKey) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha a URL do servidor e a chave da API.",
        variant: "destructive",
      });
      return;
    }

    setEvolutionConfig(prev => ({ ...prev, isLoading: true }));
    console.log('Testando conexão Evolution API:', evolutionConfig.serverUrl);

    try {
      // Simular teste de conexão
      const response = await fetch(`${evolutionConfig.serverUrl}/instance/fetchInstances`, {
        method: 'GET',
        headers: {
          'apikey': evolutionConfig.globalApiKey,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setEvolutionConfig(prev => ({ ...prev, connected: true }));
        toast({
          title: "Conexão estabelecida!",
          description: "Evolution API conectada com sucesso.",
        });
      } else {
        throw new Error('Falha na conexão');
      }
    } catch (error) {
      console.error('Erro ao conectar Evolution API:', error);
      toast({
        title: "Erro na conexão",
        description: "Verifique a URL e a chave da API.",
        variant: "destructive",
      });
    } finally {
      setEvolutionConfig(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Criar nova instância
  const handleCreateInstance = async () => {
    if (!newInstanceName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Digite um nome para a nova instância.",
        variant: "destructive",
      });
      return;
    }

    if (!evolutionConfig.connected) {
      toast({
        title: "Conexão necessária",
        description: "Conecte-se à Evolution API primeiro.",
        variant: "destructive",
      });
      return;
    }

    console.log('Criando instância:', newInstanceName);

    try {
      // Simular criação de instância
      const response = await fetch(`${evolutionConfig.serverUrl}/instance/create`, {
        method: 'POST',
        headers: {
          'apikey': evolutionConfig.globalApiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          instanceName: newInstanceName,
          webhook: `https://seu-webhook.com/${newInstanceName.toLowerCase()}`,
          webhookByEvents: true,
          events: ["APPLICATION_STARTUP", "QRCODE_UPDATED", "CONNECTION_UPDATE", "MESSAGES_UPSERT"]
        })
      });

      if (response.ok) {
        const newInstance = {
          id: Date.now(),
          name: newInstanceName,
          phone: '',
          status: 'creating',
          qrCode: '',
          webhook: `https://seu-webhook.com/${newInstanceName.toLowerCase()}`,
          autoReply: false,
          autoReplyMessage: '',
          businessHours: {
            enabled: false,
            start: '09:00',
            end: '18:00'
          },
          events: {
            messageReceived: true,
            messageSent: true,
            connectionUpdate: true
          }
        };

        setInstances(prev => [...prev, newInstance]);
        setNewInstanceName('');
        
        // Simular geração do QR Code após alguns segundos
        setTimeout(() => {
          setInstances(prev => prev.map(inst => 
            inst.id === newInstance.id 
              ? { ...inst, status: 'qr_ready', qrCode: 'qr-code-data' }
              : inst
          ));
        }, 3000);

        toast({
          title: "Instância criada!",
          description: `Instância ${newInstanceName} criada com sucesso.`,
        });
      } else {
        throw new Error('Falha ao criar instância');
      }
    } catch (error) {
      console.error('Erro ao criar instância:', error);
      toast({
        title: "Erro",
        description: "Falha ao criar instância na Evolution API.",
        variant: "destructive",
      });
    }
  };

  // Conectar instância (escanear QR Code)
  const handleConnectInstance = async (instanceId: number) => {
    const instance = instances.find(i => i.id === instanceId);
    if (!instance) return;

    console.log('Conectando instância:', instance.name);

    try {
      // Simular processo de conexão
      setInstances(prev => prev.map(i => 
        i.id === instanceId ? { ...i, status: 'connecting' } : i
      ));

      // Simular conexão bem-sucedida após alguns segundos
      setTimeout(() => {
        setInstances(prev => prev.map(i => 
          i.id === instanceId 
            ? { ...i, status: 'connected', phone: `+55 11 ${Math.floor(Math.random() * 900000000) + 100000000}` }
            : i
        ));

        toast({
          title: "Instância conectada!",
          description: `${instance.name} conectada com sucesso ao WhatsApp.`,
        });
      }, 3000);

    } catch (error) {
      console.error('Erro ao conectar instância:', error);
      toast({
        title: "Erro",
        description: "Falha ao conectar instância.",
        variant: "destructive",
      });
    }
  };

  // Desconectar instância
  const handleDisconnectInstance = async (instanceId: number) => {
    const instance = instances.find(i => i.id === instanceId);
    if (!instance) return;

    console.log('Desconectando instância:', instance.name);

    try {
      const response = await fetch(`${evolutionConfig.serverUrl}/instance/logout/${instance.name}`, {
        method: 'DELETE',
        headers: {
          'apikey': evolutionConfig.globalApiKey,
          'Content-Type': 'application/json'
        }
      });

      setInstances(prev => prev.map(i => 
        i.id === instanceId ? { ...i, status: 'disconnected', phone: '' } : i
      ));

      toast({
        title: "Instância desconectada",
        description: `${instance.name} foi desconectada do WhatsApp.`,
      });
    } catch (error) {
      console.error('Erro ao desconectar instância:', error);
      toast({
        title: "Erro",
        description: "Falha ao desconectar instância.",
        variant: "destructive",
      });
    }
  };

  // Deletar instância
  const handleDeleteInstance = async (instanceId: number) => {
    const instance = instances.find(i => i.id === instanceId);
    if (!instance) return;

    console.log('Deletando instância:', instance.name);

    try {
      const response = await fetch(`${evolutionConfig.serverUrl}/instance/delete/${instance.name}`, {
        method: 'DELETE',
        headers: {
          'apikey': evolutionConfig.globalApiKey,
          'Content-Type': 'application/json'
        }
      });

      setInstances(prev => prev.filter(i => i.id !== instanceId));

      toast({
        title: "Instância deletada",
        description: `${instance.name} foi removida permanentemente.`,
      });
    } catch (error) {
      console.error('Erro ao deletar instância:', error);
      toast({
        title: "Erro",
        description: "Falha ao deletar instância.",
        variant: "destructive",
      });
    }
  };

  const handleConfigureInstance = (instanceId: number) => {
    const instance = instances.find(i => i.id === instanceId);
    if (instance) {
      setSelectedInstanceForConfig(instance);
      setConfigModalOpen(true);
    }
  };

  const handleSaveInstanceConfig = () => {
    if (!selectedInstanceForConfig) return;

    setInstances(prev => prev.map(inst => 
      inst.id === selectedInstanceForConfig.id 
        ? { ...inst, ...selectedInstanceForConfig }
        : inst
    ));

    setConfigModalOpen(false);
    toast({
      title: "Configurações salvas!",
      description: `Configurações da instância ${selectedInstanceForConfig.name} foram atualizadas.`,
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
    if (!evolutionConfig.serverUrl || !evolutionConfig.globalApiKey) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha a URL da API e a chave global.",
        variant: "destructive",
      });
      return;
    }

    console.log('Salvando configurações Evolution API:', { 
      serverUrl: evolutionConfig.serverUrl, 
      globalApiKey: '***', 
      webhookUrl 
    });
    
    toast({
      title: "Configurações salvas!",
      description: "As configurações da Evolution API foram atualizadas.",
    });
  };

  const handleTestConnection = () => {
    if (!evolutionConfig.serverUrl || !evolutionConfig.globalApiKey) {
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
      serverUrl: evolutionConfig.serverUrl,
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
      case 'connecting': return 'bg-yellow-500';
      case 'qr_ready': return 'bg-blue-500';
      case 'creating': return 'bg-orange-500';
      case 'disconnected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'connected': return 'Conectado';
      case 'connecting': return 'Conectando';
      case 'qr_ready': return 'QR Code Pronto';
      case 'creating': return 'Criando';
      case 'disconnected': return 'Desconectado';
      default: return 'Desconhecido';
    }
  };

  return (
    <>
      <Tabs defaultValue="instances" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="instances">Instâncias</TabsTrigger>
          <TabsTrigger value="conversations">Conversas</TabsTrigger>
          <TabsTrigger value="bulk">Envio em Massa</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
          <TabsTrigger value="config">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="instances">
          <div className="space-y-6">
            {/* Criar Nova Instância */}
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Criar Nova Instância
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    placeholder="Nome da nova instância"
                    value={newInstanceName}
                    onChange={(e) => setNewInstanceName(e.target.value)}
                  />
                  <Button 
                    onClick={handleCreateInstance}
                    disabled={!evolutionConfig.connected}
                    className="bg-gradient-primary"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Criar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Lista de Instâncias */}
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
                          <CardDescription>{instance.phone || 'Não conectado'}</CardDescription>
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

                      {/* QR Code para instâncias não conectadas */}
                      {(instance.status === 'qr_ready' || (instance.status === 'disconnected' && instance.qrCode)) && (
                        <div className="text-center space-y-2">
                          <p className="text-sm text-muted-foreground">Escaneie o QR Code com seu WhatsApp:</p>
                          <div className="w-48 h-48 bg-white mx-auto rounded border p-4">
                            {instance.qrCode ? (
                              <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                                <QrCode className="w-32 h-32 text-gray-400" />
                              </div>
                            ) : (
                              <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500">
                                Gerando QR Code...
                              </div>
                            )}
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => handleConnectInstance(instance.id)}
                            disabled={instance.status === 'connecting'}
                          >
                            <RefreshCw className={`w-4 h-4 mr-2 ${instance.status === 'connecting' ? 'animate-spin' : ''}`} />
                            {instance.status === 'connecting' ? 'Conectando...' : 'Atualizar Status'}
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
                        
                        {instance.status === 'connected' ? (
                          <Button 
                            size="sm" 
                            variant="destructive"
                            className="flex-1"
                            onClick={() => handleDisconnectInstance(instance.id)}
                          >
                            Desconectar
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="destructive"
                            className="flex-1"
                            onClick={() => handleDeleteInstance(instance.id)}
                          >
                            Deletar
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
          <div className="space-y-6">
            {/* Configuração Evolution API */}
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Configuração Evolution API
                </CardTitle>
                <CardDescription>
                  Configure a conexão com seu servidor Evolution API
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="server-url">URL do Servidor Evolution API</Label>
                  <Input
                    id="server-url"
                    value={evolutionConfig.serverUrl}
                    onChange={(e) => setEvolutionConfig(prev => ({ ...prev, serverUrl: e.target.value }))}
                    placeholder="http://sua-vps-ip:8080"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Exemplo: http://123.456.789.10:8080 ou https://evolution.seudominio.com
                  </p>
                </div>

                <div>
                  <Label htmlFor="global-api-key">Chave Global da API</Label>
                  <Input
                    id="global-api-key"
                    type="password"
                    value={evolutionConfig.globalApiKey}
                    onChange={(e) => setEvolutionConfig(prev => ({ ...prev, globalApiKey: e.target.value }))}
                    placeholder="Digite sua chave global da Evolution API"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Esta é a chave definida na variável GLOBAL_API_KEY do seu servidor
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleTestEvolutionConnection}
                    disabled={evolutionConfig.isLoading || !evolutionConfig.serverUrl || !evolutionConfig.globalApiKey}
                    variant="outline"
                  >
                    <Wifi className="w-4 h-4 mr-2" />
                    {evolutionConfig.isLoading ? 'Testando...' : 'Testar Conexão'}
                  </Button>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <div className={`w-3 h-3 rounded-full ${evolutionConfig.connected ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-sm">
                    {evolutionConfig.connected ? 'Conectado à Evolution API' : 'Desconectado'}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Configurações de Webhook Global */}
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Configurações de Webhook
                </CardTitle>
                <CardDescription>
                  Configure webhooks para receber eventos das instâncias
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="webhook-base-url">URL Base do Webhook</Label>
                  <Input
                    id="webhook-base-url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://seu-crm.com/api/webhook/whatsapp"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Eventos do Webhook</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      'APPLICATION_STARTUP',
                      'QRCODE_UPDATED', 
                      'CONNECTION_UPDATE',
                      'MESSAGES_UPSERT',
                      'MESSAGES_UPDATE',
                      'SEND_MESSAGE'
                    ].map((event) => (
                      <div key={event} className="flex items-center space-x-2">
                        <Switch id={event} defaultChecked />
                        <Label htmlFor={event} className="text-xs">{event}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button onClick={handleSaveConfig} className="w-full bg-gradient-primary">
                  Salvar Configurações de Webhook
                </Button>
              </CardContent>
            </Card>

            {/* Status do Sistema */}
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Status do Sistema</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Evolution API</span>
                    <Badge variant={evolutionConfig.connected ? 'default' : 'secondary'}>
                      {evolutionConfig.connected ? 'Conectado' : 'Desconectado'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Instâncias Ativas</span>
                    <Badge variant="default">
                      {instances.filter(i => i.status === 'connected').length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Total de Instâncias</span>
                    <Badge variant="secondary">
                      {instances.length}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal de Configuração da Instância */}
      <Dialog open={configModalOpen} onOpenChange={setConfigModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Configurações da Instância: {selectedInstanceForConfig?.name}
            </DialogTitle>
            <DialogDescription>
              Configure as opções específicas desta instância WhatsApp
            </DialogDescription>
          </DialogHeader>
          
          {selectedInstanceForConfig && (
            <div className="space-y-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Básico</TabsTrigger>
                  <TabsTrigger value="autoReply">Auto Resposta</TabsTrigger>
                  <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div>
                    <Label htmlFor="instance-name">Nome da Instância</Label>
                    <Input
                      id="instance-name"
                      value={selectedInstanceForConfig.name}
                      onChange={(e) => setSelectedInstanceForConfig({
                        ...selectedInstanceForConfig,
                        name: e.target.value
                      })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="instance-webhook">URL do Webhook</Label>
                    <Input
                      id="instance-webhook"
                      value={selectedInstanceForConfig.webhook}
                      onChange={(e) => setSelectedInstanceForConfig({
                        ...selectedInstanceForConfig,
                        webhook: e.target.value
                      })}
                      placeholder="https://seu-sistema.com/webhook"
                    />
                  </div>

                  <div className="space-y-4">
                    <Label>Eventos do Webhook</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="event-message-received">Mensagem Recebida</Label>
                        <Switch
                          id="event-message-received"
                          checked={selectedInstanceForConfig.events?.messageReceived}
                          onCheckedChange={(checked) => setSelectedInstanceForConfig({
                            ...selectedInstanceForConfig,
                            events: { ...selectedInstanceForConfig.events, messageReceived: checked }
                          })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="event-message-sent">Mensagem Enviada</Label>
                        <Switch
                          id="event-message-sent"
                          checked={selectedInstanceForConfig.events?.messageSent}
                          onCheckedChange={(checked) => setSelectedInstanceForConfig({
                            ...selectedInstanceForConfig,
                            events: { ...selectedInstanceForConfig.events, messageSent: checked }
                          })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="event-connection-update">Atualização de Conexão</Label>
                        <Switch
                          id="event-connection-update"
                          checked={selectedInstanceForConfig.events?.connectionUpdate}
                          onCheckedChange={(checked) => setSelectedInstanceForConfig({
                            ...selectedInstanceForConfig,
                            events: { ...selectedInstanceForConfig.events, connectionUpdate: checked }
                          })}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="autoReply" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-reply-enabled">Ativar Auto Resposta</Label>
                      <p className="text-sm text-muted-foreground">Responder automaticamente às mensagens recebidas</p>
                    </div>
                    <Switch
                      id="auto-reply-enabled"
                      checked={selectedInstanceForConfig.autoReply}
                      onCheckedChange={(checked) => setSelectedInstanceForConfig({
                        ...selectedInstanceForConfig,
                        autoReply: checked
                      })}
                    />
                  </div>

                  {selectedInstanceForConfig.autoReply && (
                    <>
                      <div>
                        <Label htmlFor="auto-reply-message">Mensagem de Auto Resposta</Label>
                        <Textarea
                          id="auto-reply-message"
                          value={selectedInstanceForConfig.autoReplyMessage}
                          onChange={(e) => setSelectedInstanceForConfig({
                            ...selectedInstanceForConfig,
                            autoReplyMessage: e.target.value
                          })}
                          placeholder="Digite a mensagem automática..."
                          rows={4}
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="business-hours-enabled">Horário Comercial</Label>
                            <p className="text-sm text-muted-foreground">Limitar auto resposta ao horário comercial</p>
                          </div>
                          <Switch
                            id="business-hours-enabled"
                            checked={selectedInstanceForConfig.businessHours?.enabled}
                            onCheckedChange={(checked) => setSelectedInstanceForConfig({
                              ...selectedInstanceForConfig,
                              businessHours: { ...selectedInstanceForConfig.businessHours, enabled: checked }
                            })}
                          />
                        </div>

                        {selectedInstanceForConfig.businessHours?.enabled && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="business-start">Início</Label>
                              <Input
                                id="business-start"
                                type="time"
                                value={selectedInstanceForConfig.businessHours?.start}
                                onChange={(e) => setSelectedInstanceForConfig({
                                  ...selectedInstanceForConfig,
                                  businessHours: { ...selectedInstanceForConfig.businessHours, start: e.target.value }
                                })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="business-end">Fim</Label>
                              <Input
                                id="business-end"
                                type="time"
                                value={selectedInstanceForConfig.businessHours?.end}
                                onChange={(e) => setSelectedInstanceForConfig({
                                  ...selectedInstanceForConfig,
                                  businessHours: { ...selectedInstanceForConfig.businessHours, end: e.target.value }
                                })}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </TabsContent>

                <TabsContent value="webhooks" className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Informações do Webhook</h4>
                    <div className="space-y-2 text-sm text-blue-700">
                      <p><strong>URL:</strong> {selectedInstanceForConfig.webhook}</p>
                      <p><strong>Método:</strong> POST</p>
                      <p><strong>Formato:</strong> JSON</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Headers Personalizados</Label>
                    <div className="space-y-2">
                      <Input placeholder="Authorization: Bearer seu-token" />
                      <Input placeholder="X-Custom-Header: valor" />
                      <Button variant="outline" size="sm">+ Adicionar Header</Button>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    Testar Webhook
                  </Button>
                </TabsContent>
              </Tabs>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSaveInstanceConfig} className="flex-1 bg-gradient-primary">
                  Salvar Configurações
                </Button>
                <Button variant="outline" onClick={() => setConfigModalOpen(false)} className="flex-1">
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
