import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, User, MessageSquare, Settings } from 'lucide-react';
import { AgentChat } from '@/components/AgentChat';

const Agents = () => {
  const aiAgents = [
    {
      id: 1,
      name: 'Assistant Principal',
      type: 'ai',
      status: 'active',
      description: 'Agente IA principal para suporte geral',
      conversations: 156,
      satisfaction: 94.5,
      specialties: ['Suporte Geral', 'FAQ', 'Direcionamento'],
      model: 'GPT-4',
      lastActive: 'Agora'
    },
    {
      id: 2,
      name: 'Vendas Bot',
      type: 'ai',
      status: 'active',
      description: 'Especializado em vendas e conversão',
      conversations: 89,
      satisfaction: 91.2,
      specialties: ['Vendas', 'Propostas', 'Qualificação'],
      model: 'Claude-3',
      lastActive: '2 min atrás'
    },
    {
      id: 3,
      name: 'Tech Support AI',
      type: 'ai',
      status: 'training',
      description: 'Suporte técnico especializado',
      conversations: 45,
      satisfaction: 88.7,
      specialties: ['Suporte Técnico', 'Troubleshooting', 'Integração'],
      model: 'GPT-4',
      lastActive: '5 min atrás'
    }
  ];

  const humanAgents = [
    {
      id: 4,
      name: 'Ana Costa',
      type: 'human',
      status: 'online',
      description: 'Especialista em atendimento premium',
      conversations: 23,
      satisfaction: 98.1,
      specialties: ['VIP', 'Escalação', 'Vendas Complexas'],
      department: 'Vendas',
      lastActive: 'Online'
    },
    {
      id: 5,
      name: 'Carlos Silva',
      type: 'human',
      status: 'busy',
      description: 'Suporte técnico sênior',
      conversations: 18,
      satisfaction: 96.3,
      specialties: ['Suporte Técnico', 'Integração', 'API'],
      department: 'Técnico',
      lastActive: 'Ocupado'
    },
    {
      id: 6,
      name: 'Maria Santos',
      type: 'human',
      status: 'offline',
      description: 'Gerente de relacionamento',
      conversations: 31,
      satisfaction: 97.8,
      specialties: ['Relacionamento', 'Retenção', 'Upselling'],
      department: 'CS',
      lastActive: '30 min atrás'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'training': return 'bg-blue-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'online': return 'Online';
      case 'busy': return 'Ocupado';
      case 'training': return 'Treinando';
      case 'offline': return 'Offline';
      default: return 'Inativo';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Agentes</h1>
          <p className="text-muted-foreground">Gerencie agentes IA e humanos</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Novo Agente IA
          </Button>
          <Button className="bg-gradient-primary text-white">
            <User className="w-4 h-4 mr-2" />
            Adicionar Humano
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="ai-agents">Agentes IA</TabsTrigger>
          <TabsTrigger value="human-agents">Agentes Humanos</TabsTrigger>
          <TabsTrigger value="chat">Chat ao Vivo</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">3</p>
                    <p className="text-sm text-muted-foreground">Agentes IA</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <span className="text-xl">🤖</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">3</p>
                    <p className="text-sm text-muted-foreground">Agentes Humanos</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                    <User className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">290</p>
                    <p className="text-sm text-muted-foreground">Conversas Hoje</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                    <span className="text-xl">💬</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-green-600">94.2%</p>
                    <p className="text-sm text-muted-foreground">Satisfação Média</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                    <span className="text-xl">⭐</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai-agents">
          {/* AI Agents */}
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🤖 Agentes de IA
              </CardTitle>
              <CardDescription>
                Agentes automatizados para atendimento inteligente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {aiAgents.map((agent) => (
                  <div key={agent.id} className="p-4 rounded-lg border border-border bg-background/50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(agent.status)}`} />
                        <h3 className="font-semibold">{agent.name}</h3>
                      </div>
                      <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
                        {getStatusLabel(agent.status)}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">{agent.description}</p>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Conversas:</span>
                        <span className="font-medium">{agent.conversations}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Satisfação:</span>
                        <span className="font-medium text-green-600">{agent.satisfaction}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Modelo:</span>
                        <span className="font-medium">{agent.model}</span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground mb-1">Especialidades:</p>
                      <div className="flex flex-wrap gap-1">
                        {agent.specialties.map((specialty, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Última atividade: {agent.lastActive}</span>
                        <Button size="sm" variant="outline">Configurar</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="human-agents">
          {/* Human Agents */}
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                👥 Agentes Humanos
              </CardTitle>
              <CardDescription>
                Equipe de atendimento especializado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {humanAgents.map((agent) => (
                  <div key={agent.id} className="p-4 rounded-lg border border-border bg-background/50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-sm">
                          {agent.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold">{agent.name}</h3>
                          <p className="text-xs text-muted-foreground">{agent.department}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`} />
                        <Badge variant={agent.status === 'online' ? 'default' : 'secondary'} className="text-xs">
                          {getStatusLabel(agent.status)}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">{agent.description}</p>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Conversas:</span>
                        <span className="font-medium">{agent.conversations}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Satisfação:</span>
                        <span className="font-medium text-green-600">{agent.satisfaction}%</span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground mb-1">Especialidades:</p>
                      <div className="flex flex-wrap gap-1">
                        {agent.specialties.map((specialty, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Status: {agent.lastActive}</span>
                        <Button size="sm" variant="outline">Conversar</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat">
          <AgentChat />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Agents;
