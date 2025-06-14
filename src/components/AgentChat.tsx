
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Send, Phone, User, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const AgentChat = () => {
  const { toast } = useToast();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [newNote, setNewNote] = useState('');

  const activeConversations = [
    {
      id: 1,
      customer: 'João Silva',
      agent: 'IA Assistant',
      status: 'active',
      unreadCount: 2,
      lastMessage: 'Gostaria de saber mais sobre seus produtos',
      lastMessageTime: '5 min atrás',
      avatar: 'J'
    },
    {
      id: 2,
      customer: 'Maria Santos',
      agent: 'Ana Costa',
      status: 'waiting',
      unreadCount: 0,
      lastMessage: 'Obrigada pela ajuda!',
      lastMessageTime: '10 min atrás',
      avatar: 'M'
    },
    {
      id: 3,
      customer: 'Carlos Oliveira',
      agent: 'IA Assistant',
      status: 'active',
      unreadCount: 1,
      lastMessage: 'Quando posso receber meu pedido?',
      lastMessageTime: '15 min atrás',
      avatar: 'C'
    }
  ];

  const chatMessages = [
    {
      id: 1,
      sender: 'customer',
      senderName: 'João Silva',
      message: 'Olá! Como posso ajudá-lo hoje?',
      timestamp: '20:20:41',
      type: 'text'
    },
    {
      id: 2,
      sender: 'agent',
      senderName: 'IA Assistant',
      message: 'Olá! Como posso ajudá-lo hoje?',
      timestamp: '20:20:41',
      type: 'text'
    },
    {
      id: 3,
      sender: 'customer',
      senderName: 'João Silva',
      message: 'Gostaria de saber mais sobre seus produtos',
      timestamp: '20:21:41',
      type: 'text'
    },
    {
      id: 4,
      sender: 'agent',
      senderName: 'IA Assistant',
      message: 'Caro! Temos uma variedade de produtos. Qual categoria te interessa mais?',
      timestamp: '20:22:41',
      type: 'text'
    }
  ];

  const customerInfo = {
    name: 'João Silva',
    status: 'Cliente Ativo',
    phone: '+55 11 99999-9999',
    email: 'joao@email.com',
    tags: ['VIP', 'Interessado'],
    history: [
      'Primeira interação: há 2 dias',
      'Total de mensagens: 15',
      'Último agente: IA Assistant'
    ],
    notes: 'Cliente muito interessado em nossos produtos premium.'
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    toast({
      title: "Mensagem enviada!",
      description: "Sua mensagem foi enviada ao cliente.",
    });
    setNewMessage('');
  };

  const handleSaveNote = () => {
    if (!newNote.trim()) return;

    toast({
      title: "Observação salva!",
      description: "A observação foi adicionada ao perfil do cliente.",
    });
    setNewNote('');
  };

  const handleTakeOver = () => {
    toast({
      title: "Conversa assumida!",
      description: "Você assumiu a conversa com o cliente.",
    });
  };

  const handleTransferToAI = () => {
    toast({
      title: "Transferido para IA!",
      description: "A conversa foi transferida para o assistente IA.",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-96">
      {/* Lista de Conversas */}
      <Card className="border-0 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">Conversas Ativas</CardTitle>
          <CardDescription>
            {activeConversations.length} conversas em andamento
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-1">
            {activeConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-3 cursor-pointer hover:bg-muted/50 transition-colors border-l-2 ${
                  selectedConversation?.id === conversation.id ? 'border-primary bg-muted/50' : 'border-transparent'
                }`}
                onClick={() => setSelectedConversation(conversation)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-sm">
                    {conversation.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm truncate">{conversation.customer}</h4>
                      {conversation.unreadCount > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {conversation.agent === 'IA Assistant' ? 
                        <Bot className="w-3 h-3" /> : 
                        <User className="w-3 h-3" />
                      }
                      <span>{conversation.agent}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-1">
                      {conversation.lastMessage}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {conversation.lastMessageTime}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat */}
      <Card className="border-0 bg-card/50 backdrop-blur-sm lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Chat com {selectedConversation?.customer || 'João Silva'}
              </CardTitle>
              <div className="flex gap-2 mt-2">
                <Button size="sm" onClick={handleTakeOver}>
                  Assumir Conversa
                </Button>
                <Button size="sm" variant="outline" onClick={handleTransferToAI}>
                  Passar para IA
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col h-80">
          {/* Mensagens */}
          <div className="flex-1 overflow-y-auto space-y-3 mb-4">
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'customer' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs px-3 py-2 rounded-lg ${
                  message.sender === 'customer' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-muted text-foreground'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    {message.sender === 'agent' && (
                      message.senderName === 'IA Assistant' ? 
                        <Bot className="w-3 h-3" /> : 
                        <User className="w-3 h-3" />
                    )}
                    <span className="text-xs font-medium">{message.senderName}</span>
                    <span className="text-xs opacity-75">{message.timestamp}</span>
                  </div>
                  <p className="text-sm">{message.message}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input de mensagem */}
          <div className="flex gap-2">
            <Input
              placeholder="Digite sua mensagem..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} size="icon">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Informações do Cliente */}
      <Card className="border-0 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">Informações do Cliente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-xl mx-auto mb-2">
              J
            </div>
            <h3 className="font-semibold">{customerInfo.name}</h3>
            <p className="text-sm text-muted-foreground">{customerInfo.status}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{customerInfo.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{customerInfo.email}</span>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Tags</h4>
            <div className="flex flex-wrap gap-1">
              {customerInfo.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Histórico</h4>
            <div className="space-y-1">
              {customerInfo.history.map((item, index) => (
                <p key={index} className="text-xs text-muted-foreground">
                  • {item}
                </p>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Observações</h4>
            <Textarea
              placeholder="Adicionar observação..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="mb-2"
              rows={3}
            />
            <Button size="sm" onClick={handleSaveNote} className="w-full">
              Salvar Observação
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
