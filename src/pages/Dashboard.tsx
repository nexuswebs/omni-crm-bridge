
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  MessageSquare, 
  CreditCard, 
  Zap, 
  TrendingUp, 
  Activity,
  Bot,
  Settings,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardStats {
  totalCustomers: number;
  todayMessages: number;
  activeWorkflows: number;
  totalRevenue: number;
  connectedInstances: number;
  activePaymentMethods: number;
}

interface IntegrationStatus {
  evolution: 'connected' | 'disconnected' | 'pending';
  n8n: 'connected' | 'disconnected' | 'pending';
  payments: 'configured' | 'not_configured' | 'partial';
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    todayMessages: 0,
    activeWorkflows: 0,
    totalRevenue: 0,
    connectedInstances: 0,
    activePaymentMethods: 0
  });

  const [integrationStatus, setIntegrationStatus] = useState<IntegrationStatus>({
    evolution: 'disconnected',
    n8n: 'disconnected',
    payments: 'not_configured'
  });

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: 'customer',
      message: 'Novo cliente cadastrado: João Silva',
      time: '2 min atrás',
      icon: Users
    },
    {
      id: 2,
      type: 'message',
      message: 'Mensagem recebida via WhatsApp',
      time: '5 min atrás',
      icon: MessageSquare
    },
    {
      id: 3,
      type: 'payment',
      message: 'Pagamento PIX recebido: R$ 299,90',
      time: '10 min atrás',
      icon: CreditCard
    },
    {
      id: 4,
      type: 'workflow',
      message: 'Workflow "Onboarding" executado',
      time: '15 min atrás',
      icon: Zap
    }
  ]);

  useEffect(() => {
    loadDashboardData();
    checkIntegrationStatus();
  }, []);

  const loadDashboardData = async () => {
    // Simular carregamento de dados
    setTimeout(() => {
      setStats({
        totalCustomers: 127,
        todayMessages: 45,
        activeWorkflows: 8,
        totalRevenue: 15420.50,
        connectedInstances: 2,
        activePaymentMethods: 3
      });
    }, 1000);
  };

  const checkIntegrationStatus = async () => {
    // Verificar status das integrações
    setTimeout(() => {
      setIntegrationStatus({
        evolution: 'connected',
        n8n: 'pending',
        payments: 'configured'
      });
    }, 1500);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
      case 'configured':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
      case 'partial':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected':
        return 'Conectado';
      case 'configured':
        return 'Configurado';
      case 'pending':
        return 'Pendente';
      case 'partial':
        return 'Parcial';
      default:
        return 'Desconectado';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo de volta, {user?.name}! Aqui está um resumo do seu CRM.
          </p>
        </div>
        <Button>
          <Settings className="w-4 h-4 mr-2" />
          Configurações
        </Button>
      </div>

      {/* Status das Integrações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Status das Integrações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-8 h-8 text-green-600" />
                <div>
                  <p className="font-medium">Evolution API</p>
                  <p className="text-sm text-muted-foreground">WhatsApp Business</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(integrationStatus.evolution)}
                <span className="text-sm">{getStatusText(integrationStatus.evolution)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Bot className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="font-medium">n8n.cloud</p>
                  <p className="text-sm text-muted-foreground">Automações</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(integrationStatus.n8n)}
                <span className="text-sm">{getStatusText(integrationStatus.n8n)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <CreditCard className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="font-medium">Pagamentos</p>
                  <p className="text-sm text-muted-foreground">PIX, Stripe, Mercado Pago</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(integrationStatus.payments)}
                <span className="text-sm">{getStatusText(integrationStatus.payments)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mensagens Hoje</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayMessages}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8%</span> em relação a ontem
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workflows Ativos</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeWorkflows}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-600">2 novos</span> esta semana
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+15%</span> em relação ao mês passado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Atividade Recente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-full">
                    <activity.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Users className="w-4 h-4 mr-2" />
                Adicionar Novo Cliente
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <MessageSquare className="w-4 h-4 mr-2" />
                Enviar Mensagem WhatsApp
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <CreditCard className="w-4 h-4 mr-2" />
                Criar Link de Pagamento
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Zap className="w-4 h-4 mr-2" />
                Executar Workflow
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
