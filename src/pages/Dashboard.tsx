
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const stats = [
    {
      title: 'Clientes Ativos',
      value: '1,247',
      change: '+12%',
      trend: 'up',
      icon: '👥'
    },
    {
      title: 'Workflows Rodando',
      value: '23',
      change: '+5',
      trend: 'up',
      icon: '⚡'
    },
    {
      title: 'Mensagens Hoje',
      value: '856',
      change: '+18%',
      trend: 'up',
      icon: '💬'
    },
    {
      title: 'Revenue Mensal',
      value: 'R$ 45.2k',
      change: '+22%',
      trend: 'up',
      icon: '💰'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'customer',
      message: 'Novo cliente cadastrado: João Silva',
      time: '2 min atrás',
      status: 'success'
    },
    {
      id: 2,
      type: 'workflow',
      message: 'Workflow "Boas-vindas" executado com sucesso',
      time: '5 min atrás',
      status: 'success'
    },
    {
      id: 3,
      type: 'payment',
      message: 'Pagamento PIX recebido - R$ 299,00',
      time: '8 min atrás',
      status: 'success'
    },
    {
      id: 4,
      type: 'agent',
      message: 'Agente IA respondeu 15 tickets automaticamente',
      time: '12 min atrás',
      status: 'info'
    }
  ];

  const activeWorkflows = [
    {
      id: 1,
      name: 'Onboarding Automático',
      status: 'running',
      executions: 156,
      success_rate: 98.5
    },
    {
      id: 2,
      name: 'Suporte Inteligente',
      status: 'running',
      executions: 89,
      success_rate: 94.2
    },
    {
      id: 3,
      name: 'Follow-up Vendas',
      status: 'paused',
      executions: 234,
      success_rate: 91.8
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral do seu CRM inteligente</p>
        </div>
        <Button className="bg-gradient-primary text-white">
          Novo Workflow
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden border-0 bg-card/50 backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-primary opacity-10 rounded-bl-full" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <span className="text-2xl">{stat.icon}</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <span>↗</span> {stat.change} do mês passado
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card className="border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📈 Atividades Recentes
            </CardTitle>
            <CardDescription>
              Últimas ações no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Workflows */}
        <Card className="border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ⚡ Workflows Ativos
            </CardTitle>
            <CardDescription>
              Status dos workflows n8n
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeWorkflows.map((workflow) => (
                <div key={workflow.id} className="p-4 rounded-lg border border-border bg-background/50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{workflow.name}</h4>
                    <Badge variant={workflow.status === 'running' ? 'default' : 'secondary'}>
                      {workflow.status === 'running' ? 'Rodando' : 'Pausado'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Execuções:</span>
                      <span className="ml-2 font-medium">{workflow.executions}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Taxa de Sucesso:</span>
                      <span className="ml-2 font-medium text-green-600">{workflow.success_rate}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
