
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Phone, Mail } from 'lucide-react';

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'agent' | 'ai';
  timestamp: Date;
  customerInfo?: {
    name: string;
    phone: string;
    email: string;
  };
}

export const AgentChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: 'Olá! Como posso ajudá-lo hoje?',
      sender: 'ai',
      timestamp: new Date(Date.now() - 300000),
      customerInfo: {
        name: 'João Silva',
        phone: '+55 11 99999-9999',
        email: 'joao@email.com'
      }
    },
    {
      id: 2,
      content: 'Gostaria de saber mais sobre seus produtos',
      sender: 'user',
      timestamp: new Date(Date.now() - 240000)
    },
    {
      id: 3,
      content: 'Claro! Temos uma variedade de produtos. Qual categoria te interessa mais?',
      sender: 'ai',
      timestamp: new Date(Date.now() - 180000)
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [activeConversations] = useState([
    { id: 1, customer: 'João Silva', status: 'ai', lastMessage: '5 min atrás', unread: 2 },
    { id: 2, customer: 'Maria Santos', status: 'human', lastMessage: '10 min atrás', unread: 0 },
    { id: 3, customer: 'Carlos Oliveira', status: 'waiting', lastMessage: '15 min atrás', unread: 1 }
  ]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now(),
        content: newMessage,
        sender: 'agent',
        timestamp: new Date()
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const handleTakeOver = () => {
    console.log('Agente assumindo conversa');
  };

  const handleHandoffToAI = () => {
    console.log('Passando conversa para IA');
  };

  const customerInfo = messages.find(m => m.customerInfo)?.customerInfo;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[800px]">
      {/* Lista de Conversas */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg">Conversas Ativas</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[700px]">
            <div className="space-y-2 p-4">
              {activeConversations.map((conv) => (
                <div
                  key={conv.id}
                  className="p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{conv.customer}</span>
                    {conv.unread > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {conv.unread}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={conv.status === 'human' ? 'default' : conv.status === 'ai' ? 'secondary' : 'outline'}
                      className="text-xs"
                    >
                      {conv.status === 'human' ? 'Humano' : conv.status === 'ai' ? 'IA' : 'Aguardando'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{conv.lastMessage}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Principal */}
      <Card className="lg:col-span-2">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Chat com João Silva</CardTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleTakeOver}>
                Assumir Conversa
              </Button>
              <Button size="sm" variant="outline" onClick={handleHandoffToAI}>
                Passar para IA
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px] p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : message.sender === 'ai'
                        ? 'bg-blue-100 text-blue-900'
                        : 'bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {message.sender === 'ai' && <Bot className="w-4 h-4" />}
                      {message.sender === 'user' && <User className="w-4 h-4" />}
                      <span className="text-xs opacity-70">
                        {message.sender === 'ai' ? 'IA Assistant' : message.sender === 'user' ? 'Cliente' : 'Agente'}
                      </span>
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="border-t p-4">
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
        </CardContent>
      </Card>

      {/* Informações do Cliente */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg">Informações do Cliente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {customerInfo && (
            <>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-xl mx-auto mb-2">
                  {customerInfo.name.charAt(0)}
                </div>
                <h3 className="font-semibold">{customerInfo.name}</h3>
                <Badge variant="outline">Cliente Ativo</Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{customerInfo.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{customerInfo.email}</span>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Tags</h4>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary">VIP</Badge>
                  <Badge variant="secondary">Interessado</Badge>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Histórico</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• Primeira interação: há 2 dias</p>
                  <p>• Total de mensagens: 15</p>
                  <p>• Último agente: IA Assistant</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Observações</h4>
                <textarea
                  className="w-full p-2 text-sm border rounded-md resize-none"
                  rows={3}
                  placeholder="Adicionar observação..."
                />
                <Button size="sm" className="mt-2 w-full">
                  Salvar Observação
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
