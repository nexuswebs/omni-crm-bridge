
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Play, X } from 'lucide-react';

const Workflows = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const workflows = [
    {
      id: 1,
      name: 'Onboarding Automático',
      description: 'Processo completo de boas-vindas para novos clientes',
      status: 'running',
      executions: 156,
      successRate: 98.5,
      lastRun: '2 min atrás',
      trigger: 'Novo cliente cadastrado',
      actions: ['Envio WhatsApp', 'Email boas-vindas', 'Criação de ticket'],
      n8nId: 'wf_001'
    },
    {
      id: 2,
      name: 'Suporte Inteligente',
      description: 'IA que responde dúvidas comuns automaticamente',
      status: 'running',
      executions: 89,
      successRate: 94.2,
      lastRun: '5 min atrás',
      trigger: 'Nova mensagem WhatsApp',
      actions: ['Análise IA', 'Resposta automática', 'Escalação se necessário'],
      n8nId: 'wf_002'
    },
    {
      id: 3,
      name: 'Follow-up Vendas',
      description: 'Acompanhamento automático de prospects',
      status: 'paused',
      executions: 234,
      successRate: 91.8,
      lastRun: '1 hora atrás',
      trigger: 'Lead inativo por 24h',
      actions: ['Mensagem personalizada', 'Oferta especial', 'Reagendamento'],
      n8nId: 'wf_003'
    },
    {
      id: 4,
      name: 'Processamento Pagamentos',
      description: 'Automação completa para pagamentos PIX e cartão',
      status: 'running',
      executions: 67,
      successRate: 99.1,
      lastRun: '10 min atrás',
      trigger: 'Pagamento recebido',
      actions: ['Confirmação PIX', 'Liberação produto', 'NF automática'],
      n8nId: 'wf_004'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'running': return 'Rodando';
      case 'paused': return 'Pausado';
      case 'error': return 'Erro';
      default: return 'Inativo';
    }
  };

  const filteredWorkflows = workflows.filter(workflow =>
    workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workflow.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Workflows n8n</h1>
          <p className="text-muted-foreground">Gerencie suas automações inteligentes</p>
        </div>
        <Button className="bg-gradient-primary text-white">
          <Plus className="w-4 h-4 mr-2" />
          Criar Workflow
        </Button>
      </div>

      {/* Search and Actions */}
      <Card className="border-0 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar workflows..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">Conectar n8n</Button>
            <Button variant="outline">Logs</Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">4</p>
                <p className="text-sm text-muted-foreground">Workflows Ativos</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Play className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">546</p>
                <p className="text-sm text-muted-foreground">Execuções Hoje</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <span className="text-xl">⚡</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">95.9%</p>
                <p className="text-sm text-muted-foreground">Taxa de Sucesso</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <span className="text-xl">✓</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">2.3s</p>
                <p className="text-sm text-muted-foreground">Tempo Médio</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <span className="text-xl">⏱️</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workflow List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredWorkflows.map((workflow) => (
          <Card key={workflow.id} className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(workflow.status)}`} />
                    {workflow.name}
                  </CardTitle>
                  <CardDescription>{workflow.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Play className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant={workflow.status === 'running' ? 'default' : 'secondary'}>
                    {getStatusLabel(workflow.status)}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Execuções:</span>
                    <span className="ml-2 font-medium">{workflow.executions}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Taxa de Sucesso:</span>
                    <span className="ml-2 font-medium text-green-600">{workflow.successRate}%</span>
                  </div>
                </div>

                <div className="text-sm">
                  <span className="text-muted-foreground">Trigger:</span>
                  <p className="mt-1 p-2 bg-muted/50 rounded text-xs">{workflow.trigger}</p>
                </div>

                <div className="text-sm">
                  <span className="text-muted-foreground">Ações:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {workflow.actions.map((action, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {action}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                  <span>ID n8n: {workflow.n8nId}</span>
                  <span>Última execução: {workflow.lastRun}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Workflows;
