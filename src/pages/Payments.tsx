
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, DollarSign, QrCode, TrendingUp, Calendar, Filter } from 'lucide-react';
import { PaymentConfig } from '@/components/PaymentConfig';

const Payments = () => {
  const [payments] = useState([
    {
      id: 1,
      customer: 'João Silva',
      amount: 299.00,
      method: 'PIX',
      status: 'completed',
      date: '2024-01-15T10:30:00',
      transactionId: 'pix_123456789'
    },
    {
      id: 2,
      customer: 'Maria Santos',
      amount: 150.00,
      method: 'Stripe',
      status: 'pending',
      date: '2024-01-15T09:15:00',
      transactionId: 'st_987654321'
    },
    {
      id: 3,
      customer: 'Carlos Oliveira',
      amount: 450.00,
      method: 'Mercado Pago',
      status: 'completed',
      date: '2024-01-14T16:45:00',
      transactionId: 'mp_456789123'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Concluído';
      case 'pending': return 'Pendente';
      case 'failed': return 'Falhou';
      default: return 'Desconhecido';
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'PIX': return <QrCode className="w-4 h-4" />;
      case 'Stripe': return <CreditCard className="w-4 h-4" />;
      case 'Mercado Pago': return <DollarSign className="w-4 h-4" />;
      default: return null;
    }
  };

  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pagamentos</h1>
          <p className="text-muted-foreground">Gerencie gateways e transações</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Relatório
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="transactions">Transações</TabsTrigger>
          <TabsTrigger value="config">Configurações</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-green-600">R$ {totalRevenue.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">Receita Total</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">R$ {pendingAmount.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">Pendente</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{payments.length}</p>
                    <p className="text-sm text-muted-foreground">Transações</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {((payments.filter(p => p.status === 'completed').length / payments.length) * 100).toFixed(1)}%
                    </p>
                    <p className="text-sm text-muted-foreground">Taxa de Sucesso</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                    <span className="text-xl">✓</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions">
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Transações Recentes</CardTitle>
              <CardDescription>
                Lista completa de todas as transações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payments.map((payment) => (
                  <div key={payment.id} className="p-4 rounded-lg border border-border bg-background/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center text-white font-bold">
                          {payment.customer.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold">{payment.customer}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(payment.date).toLocaleString('pt-BR')}
                          </p>
                          <p className="text-xs text-muted-foreground">ID: {payment.transactionId}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-lg font-bold">R$ {payment.amount.toFixed(2)}</p>
                          <div className="flex items-center gap-2">
                            {getMethodIcon(payment.method)}
                            <span className="text-sm text-muted-foreground">{payment.method}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(payment.status)}`} />
                          <Badge 
                            variant={payment.status === 'completed' ? 'default' : payment.status === 'pending' ? 'secondary' : 'destructive'}
                          >
                            {getStatusLabel(payment.status)}
                          </Badge>
                        </div>

                        <Button size="sm" variant="outline">
                          Detalhes
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config">
          <PaymentConfig />
        </TabsContent>

        <TabsContent value="analytics">
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Analytics de Pagamentos</CardTitle>
              <CardDescription>
                Insights sobre suas transações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-muted-foreground">Gráficos e analytics em desenvolvimento...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Payments;
