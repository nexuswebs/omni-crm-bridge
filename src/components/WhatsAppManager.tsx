
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MessageSquare, Smartphone, Settings, QrCode, Send, Phone, User, Clock, CheckCircle, XCircle, AlertCircle, Download, Upload, Trash2, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const WhatsAppManager = () => {
  const { toast } = useToast();
  
  const [instances, setInstances] = useState([
    {
      id: 1,
      name: 'Instância Principal',
      phone: '+55 11 99999-9999',
      status: 'connected',
      qrCode: '',
      apiKey: 'wa_123456789',
      webhook: 'https://webhook.exemplo.com/whatsapp',
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      name: 'Suporte',
      phone: '+55 11 88888-8888',
      status: 'disconnected',
      qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      apiKey: 'wa_987654321',
      webhook: 'https://webhook.exemplo.com/suporte',
      createdAt: '2024-01-10'
    }
  ]);

  const [conversations, setConversations] = useState([
    {
      id: 1,
      contact: '+55 11 99999-1111',
      name: 'João Silva',
      lastMessage: 'Olá, gostaria de saber mais sobre o produto...',
      timestamp: '2 min atrás',
      unread: 3,
      instance: 'Instância Principal',
      status: 'active'
    },
    {
      id: 2,
      contact: '+55 11 99999-2222',
      name: 'Maria Santos',
      lastMessage: 'Qual o prazo de entrega?',
      timestamp: '5 min atrás',
      unread: 1,
      instance: 'Suporte',
      status: 'pending'
    },
    {
      id: 3,
      contact: '+55 11 99999-3333',
      name: 'Pedro Costa',
      lastMessage: 'Obrigado pelo atendimento!',
      timestamp: '10 min atrás',
      unread: 0,
      instance: 'Instância Principal',
      status: 'closed'
    }
  ]);

  const [messages, setMessages] = useState([
    {
      id: 1,
      conversationId: 1,
      sender: 'contact',
      content: 'Olá, gostaria de saber mais sobre o produto...',
      timestamp: '14:30',
      type: 'text',
      status: 'delivered'
    },
    {
      id: 2,
      conversationId: 1,
      sender: 'agent',
      content: 'Olá! Claro, posso te ajudar. Qual produto você tem interesse?',
      timestamp: '14:32',
      type: 'text',
      status: 'read'
    }
  ]);

  const [newInstance, setNewInstance] = useState({
    name: '',
    phone: '',
    webhook: ''
  });

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [messageType, setMessageType] = useState('text');

  const [evolutionConfig, setEvolutionConfig] = useState({
    baseUrl: 'https://api.evolution.com',
    globalApiKey: '',
    webhookUrl: 'https://seu-webhook.com/whatsapp',
    webhookEvents: ['messages', 'status', 'qrcode'],
    autoReply: false,
    autoReplyMessage: 'Obrigado pela mensagem! Em breve retornaremos o contato.'
  });

  const [bulkMessage, setBulkMessage] = useState({
    message: '',
    contacts: '',
    instance: '',
    scheduleDate: '',
    scheduleTime: ''
  });

  const handleCreateInstance = async () => {
    if (newInstance.name && newInstance.phone) {
      const instance = {
        id: Date.now(),
        name: newInstance.name,
        phone: newInstance.phone,
        status: 'disconnected',
        qrCode: '',
        apiKey: `wa_${Math.random().toString(36).substr(2, 9)}`,
        webhook: newInstance.webhook || 'https://webhook.exemplo.com/whatsapp',
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      setInstances([...instances, instance]);
      setNewInstance({ name: '', phone: '', webhook: '' });
      
      toast({
        title: "Instância criada",
        description: "Nova instância WhatsApp criada com sucesso!",
      });
    }
  };

  const handleConnectInstance = async (id: number) => {
    setInstances(instances.map(instance => 
      instance.id === id 
        ? { ...instance, status: 'connecting' }
        : instance
    ));
    
    // Simular conexão com Evolution API
    setTimeout(() => {
      setInstances(instances.map(instance => 
        instance.id === id 
          ? { ...instance, status: 'connected', qrCode: '' }
          : instance
      ));
      
      toast({
        title: "Instância conectada",
        description: "WhatsApp conectado com sucesso!",
      });
    }, 3000);
  };

  const handleDisconnectInstance = (id: number) => {
    setInstances(instances.map(instance => 
      instance.id === id 
        ? { ...instance, status: 'disconnected' }
        : instance
    ));
    
    toast({
      title: "Instância desconectada",
      description: "WhatsApp desconectado.",
    });
  };

  const handleDeleteInstance = (id: number) => {
    setInstances(instances.filter(instance => instance.id !== id));
    toast({
      title: "Instância removida",
      description: "Instância WhatsApp removida com sucesso!",
    });
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      const message = {
        id: Date.now(),
        conversationId: selectedConversation.id,
        sender: 'agent',
        content: newMessage,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        type: messageType,
        status: 'sent'
      };
      
      setMessages([...messages, message]);
      setNewMessage('');
      
      // Atualizar última mensagem da conversa
      setConversations(conversations.map(conv => 
        conv.id === selectedConversation.id 
          ? { ...conv, lastMessage: newMessage, timestamp: 'agora' }
          : conv
      ));
      
      toast({
        title: "Mensagem enviada",
        description: "Mensagem enviada com sucesso!",
      });
    }
  };

  const handleBulkMessage = () => {
    if (bulkMessage.message && bulkMessage.contacts && bulkMessage.instance) {
      const contactList = bulkMessage.contacts.split('\n').filter(c => c.trim());
      
      toast({
        title: "Envio em massa iniciado",
        description: `Enviando mensagem para ${contactList.length} contatos...`,
      });
      
      setBulkMessage({
        message: '',
        contacts: '',
        instance: '',
        scheduleDate: '',
        scheduleTime: ''
      });
    }
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

  const getConversationStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="instances" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="instances" className="flex items-center gap-2">
            <Smartphone className="w-4 h-4" />
            Instâncias
          </TabsTrigger>
          <TabsTrigger value="conversations" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Conversas
          </TabsTrigger>
          <TabsTrigger value="bulk" className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            Envio em Massa
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Relatórios
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
                <CardTitle>Nova Instância WhatsApp</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  <div>
                    <Label htmlFor="instance-webhook">URL do Webhook</Label>
                    <Input
                      id="instance-webhook"
                      value={newInstance.webhook}
                      onChange={(e) => setNewInstance({ ...newInstance, webhook: e.target.value })}
                      placeholder="https://webhook.exemplo.com"
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
                      <div className="flex items-center gap-2">
                        <Badge variant={instance.status === 'connected' ? 'default' : 'secondary'}>
                          {getStatusLabel(instance.status)}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteInstance(instance.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Número:</p>
                        <p className="font-medium">{instance.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Criado em:</p>
                        <p className="font-medium">{instance.createdAt}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">API Key:</p>
                      <p className="font-mono text-xs bg-muted p-2 rounded break-all">{instance.apiKey}</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Webhook:</p>
                      <p className="font-mono text-xs bg-muted p-2 rounded break-all">{instance.webhook}</p>
                    </div>

                    {instance.status === 'disconnected' && instance.qrCode && (
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-2">Escaneie o QR Code:</p>
                        <div className="bg-white p-4 rounded-lg inline-block border">
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
                      <Button variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="conversations">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[600px]">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Conversas Ativas</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`p-3 cursor-pointer hover:bg-muted/50 border-l-4 ${
                        selectedConversation?.id === conversation.id 
                          ? 'bg-muted border-l-primary' 
                          : 'border-l-transparent'
                      }`}
                      onClick={() => setSelectedConversation(conversation)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span className="font-medium">{conversation.name}</span>
                        </div>
                        <Badge className={getConversationStatusColor(conversation.status)}>
                          {conversation.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{conversation.contact}</p>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {conversation.lastMessage}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                        {conversation.unread > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {conversation.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {selectedConversation ? (
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      <div>
                        <p className="font-medium">{selectedConversation.name}</p>
                        <p className="text-sm text-muted-foreground">{selectedConversation.contact}</p>
                      </div>
                    </div>
                  ) : (
                    'Selecione uma conversa'
                  )}
                  
                  {selectedConversation && (
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <User className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              
              {selectedConversation ? (
                <>
                  <CardContent className="flex-1 max-h-[350px] overflow-y-auto">
                    <div className="space-y-4">
                      {messages
                        .filter(msg => msg.conversationId === selectedConversation.id)
                        .map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.sender === 'agent' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[70%] p-3 rounded-lg ${
                                message.sender === 'agent'
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-xs opacity-70">{message.timestamp}</span>
                                {message.sender === 'agent' && (
                                  <CheckCircle className="w-3 h-3 opacity-70" />
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                  
                  <div className="p-4 border-t">
                    <div className="flex items-center gap-2 mb-2">
                      <Select value={messageType} onValueChange={setMessageType}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Texto</SelectItem>
                          <SelectItem value="image">Imagem</SelectItem>
                          <SelectItem value="document">Documento</SelectItem>
                          <SelectItem value="audio">Áudio</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex gap-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Digite sua mensagem..."
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      <Button onClick={handleSendMessage} className="bg-gradient-primary text-white">
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <CardContent className="flex items-center justify-center h-[400px]">
                  <div className="text-center text-muted-foreground">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Selecione uma conversa para começar</p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bulk">
          <Card>
            <CardHeader>
              <CardTitle>Envio de Mensagens em Massa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bulk-instance">Instância</Label>
                  <Select value={bulkMessage.instance} onValueChange={(value) => setBulkMessage({...bulkMessage, instance: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma instância" />
                    </SelectTrigger>
                    <SelectContent>
                      {instances.filter(i => i.status === 'connected').map(instance => (
                        <SelectItem key={instance.id} value={instance.name}>
                          {instance.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="schedule-date">Data de Agendamento</Label>
                    <Input
                      id="schedule-date"
                      type="date"
                      value={bulkMessage.scheduleDate}
                      onChange={(e) => setBulkMessage({...bulkMessage, scheduleDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="schedule-time">Horário</Label>
                    <Input
                      id="schedule-time"
                      type="time"
                      value={bulkMessage.scheduleTime}
                      onChange={(e) => setBulkMessage({...bulkMessage, scheduleTime: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="bulk-message">Mensagem</Label>
                <Textarea
                  id="bulk-message"
                  value={bulkMessage.message}
                  onChange={(e) => setBulkMessage({...bulkMessage, message: e.target.value})}
                  placeholder="Digite a mensagem que será enviada para todos os contatos..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="bulk-contacts">Lista de Contatos</Label>
                <Textarea
                  id="bulk-contacts"
                  value={bulkMessage.contacts}
                  onChange={(e) => setBulkMessage({...bulkMessage, contacts: e.target.value})}
                  placeholder={`Digite um número por linha:\n+55 11 99999-1111\n+55 11 99999-2222\n+55 11 99999-3333`}
                  rows={6}
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleBulkMessage} 
                  className="bg-gradient-primary text-white"
                >
                  {bulkMessage.scheduleDate ? 'Agendar Envio' : 'Enviar Agora'}
                </Button>
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Importar CSV
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">1,247</p>
                  <p className="text-sm text-muted-foreground">Mensagens Enviadas</p>
                  <p className="text-xs text-muted-foreground">Hoje</p>
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">856</p>
                  <p className="text-sm text-muted-foreground">Mensagens Recebidas</p>
                  <p className="text-xs text-muted-foreground">Hoje</p>
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">23</p>
                  <p className="text-sm text-muted-foreground">Conversas Ativas</p>
                  <p className="text-xs text-muted-foreground">Agora</p>
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">98.5%</p>
                  <p className="text-sm text-muted-foreground">Taxa de Entrega</p>
                  <p className="text-xs text-muted-foreground">Esta semana</p>
                </div>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Atividade por Instância</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {instances.map(instance => (
                    <div key={instance.id} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(instance.status)}`} />
                        <div>
                          <p className="font-medium">{instance.name}</p>
                          <p className="text-sm text-muted-foreground">{instance.phone}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-lg font-bold text-green-600">324</p>
                          <p className="text-xs text-muted-foreground">Enviadas</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-blue-600">189</p>
                          <p className="text-xs text-muted-foreground">Recebidas</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-orange-600">5</p>
                          <p className="text-xs text-muted-foreground">Ativas</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="config">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Evolution API</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>

              <div>
                <Label htmlFor="webhook-url">URL do Webhook Global</Label>
                <Input
                  id="webhook-url"
                  value={evolutionConfig.webhookUrl}
                  onChange={(e) => setEvolutionConfig({ ...evolutionConfig, webhookUrl: e.target.value })}
                />
              </div>

              <div>
                <Label>Eventos do Webhook</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['messages', 'status', 'qrcode', 'connection', 'call'].map(event => (
                    <Badge 
                      key={event}
                      variant={evolutionConfig.webhookEvents.includes(event) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => {
                        const events = evolutionConfig.webhookEvents.includes(event)
                          ? evolutionConfig.webhookEvents.filter(e => e !== event)
                          : [...evolutionConfig.webhookEvents, event];
                        setEvolutionConfig({ ...evolutionConfig, webhookEvents: events });
                      }}
                    >
                      {event}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="auto-reply"
                  checked={evolutionConfig.autoReply}
                  onChange={(e) => setEvolutionConfig({ ...evolutionConfig, autoReply: e.target.checked })}
                />
                <Label htmlFor="auto-reply">Resposta Automática</Label>
              </div>

              {evolutionConfig.autoReply && (
                <div>
                  <Label htmlFor="auto-reply-message">Mensagem de Resposta Automática</Label>
                  <Textarea
                    id="auto-reply-message"
                    value={evolutionConfig.autoReplyMessage}
                    onChange={(e) => setEvolutionConfig({ ...evolutionConfig, autoReplyMessage: e.target.value })}
                    rows={3}
                  />
                </div>
              )}

              <div className="flex gap-2">
                <Button className="bg-gradient-primary text-white">
                  Salvar Configurações
                </Button>
                <Button variant="outline">
                  Testar Conexão
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Configurações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
