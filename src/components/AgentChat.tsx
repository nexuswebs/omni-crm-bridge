
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, Send, Bot, User, Phone, Video, MoreVertical } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  sender: 'user' | 'agent' | 'ai';
  content: string;
  timestamp: Date;
  senderName?: string;
}

interface ChatSession {
  id: string;
  customerName: string;
  customerPhone: string;
  agent: string;
  status: 'active' | 'waiting' | 'closed';
  lastMessage: string;
  unreadCount: number;
  timestamp: Date;
}

export const AgentChat = () => {
  const { toast } = useToast();
  const [activeSessions, setActiveSessions] = useState<ChatSession[]>([
    {
      id: '1',
      customerName: 'João Silva',
      customerPhone: '+55 11 99999-1234',
      agent: 'Ana Costa',
      status: 'active',
      lastMessage: 'Preciso de ajuda com meu pedido',
      unreadCount: 2,
      timestamp: new Date(Date.now() - 5 * 60 * 1000)
    },
    {
      id: '2',
      customerName: 'Maria Santos',
      customerPhone: '+55 11 99999-5678',
      agent: 'IA Assistant',
      status: 'waiting',
      lastMessage: 'Transferindo para agente humano...',
      unreadCount: 1,
      timestamp: new Date(Date.now() - 10 * 60 * 1000)
    },
    {
      id: '3',
      customerName: 'Carlos Oliveira',
      customerPhone: '+55 11 99999-9012',
      agent: 'Carlos Silva',
      status: 'active',
      lastMessage: 'Obrigado pela ajuda!',
      unreadCount: 0,
      timestamp: new Date(Date.now() - 15 * 60 * 1000)
    }
  ]);

  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(activeSessions[0]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'user',
      content: 'Olá, preciso de ajuda com meu pedido #12345',
      timestamp: new Date(Date.now() - 20 * 60 * 1000),
      senderName: 'João Silva'
    },
    {
      id: '2',
      sender: 'agent',
      content: 'Olá João! Vou verificar seu pedido agora mesmo. Um momento por favor.',
      timestamp: new Date(Date.now() - 18 * 60 * 1000),
      senderName: 'Ana Costa'
    },
    {
      id: '3',
      sender: 'user',
      content: 'Preciso de ajuda com meu pedido',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      senderName: 'João Silva'
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedSession) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: 'agent',
      content: newMessage,
      timestamp: new Date(),
      senderName: 'Você'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simular resposta automática
    setTimeout(() => {
      const autoReply: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'user',
        content: 'Obrigado pela resposta!',
        timestamp: new Date(),
        senderName: selectedSession.customerName
      };
      setMessages(prev => [...prev, autoReply]);
    }, 2000);

    toast({
      title: "Mensagem enviada!",
      description: "Sua mensagem foi enviada para o cliente.",
    });
  };

  const handleSessionSelect = (session: ChatSession) => {
    setSelectedSession(session);
    // Marcar como lida
    setActiveSessions(prev => 
      prev.map(s => 
        s.id === session.id 
          ? { ...s, unreadCount: 0 }
          : s
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'waiting': return 'bg-yellow-500';
      case 'closed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'waiting': return 'Aguardando';
      case 'closed': return 'Fechado';
      default: return 'Inativo';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="h-[calc(100vh-200px)] flex gap-4">
      {/* Lista de Sessões */}
      <Card className="w-80 flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Conversas Ativas
          </CardTitle>
          <CardDescription>
            {activeSessions.length} conversas em andamento
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-full">
            <div className="space-y-2 p-4">
              {activeSessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => handleSessionSelect(session)}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedSession?.id === session.id 
                      ? 'bg-primary/10 border-primary' 
                      : 'hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs">
                          {session.customerName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{session.customerName}</p>
                        <p className="text-xs text-muted-foreground">{session.customerPhone}</p>
                      </div>
                    </div>
                    {session.unreadCount > 0 && (
                      <Badge variant="destructive" className="w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs">
                        {session.unreadCount}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(session.status)}`} />
                      <span className="text-xs text-muted-foreground">
                        {session.agent}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(session.timestamp)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-1 truncate">
                    {session.lastMessage}
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col">
        {selectedSession ? (
          <>
            {/* Header do Chat */}
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {selectedSession.customerName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{selectedSession.customerName}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      {selectedSession.customerPhone}
                      <Badge variant="outline" className="text-xs">
                        {getStatusLabel(selectedSession.status)}
                      </Badge>
                    </CardDescription>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Mensagens */}
            <CardContent className="flex-1 flex flex-col p-0">
              <ScrollArea className="flex-1 px-4">
                <div className="space-y-4 py-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'agent' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex gap-2 max-w-[70%] ${message.sender === 'agent' ? 'flex-row-reverse' : ''}`}>
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs">
                            {message.sender === 'agent' ? (
                              <User className="w-4 h-4" />
                            ) : message.sender === 'ai' ? (
                              <Bot className="w-4 h-4" />
                            ) : (
                              message.senderName?.split(' ').map(n => n[0]).join('') || 'U'
                            )}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className={`rounded-lg p-3 ${
                          message.sender === 'agent' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender === 'agent' 
                              ? 'text-primary-foreground/70' 
                              : 'text-muted-foreground'
                          }`}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input de Mensagem */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </>
        ) : (
          <CardContent className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Selecione uma conversa para começar</p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};
