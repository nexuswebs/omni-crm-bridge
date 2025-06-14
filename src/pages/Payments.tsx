
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';

const Payments = () => {
  const [pixKey, setPixKey] = useState('');

  const transactions = [
    {
      id: 1,
      customer: 'João Silva',
      amount: 299.99,
      method: 'PIX',
      status: 'completed',
      date: '2024-01-15 14:30',
      reference: 'TXN001'
    },
    {
      id: 2,
      customer: 'Maria Santos',
      amount: 599.99,
      method: 'Cartão',
      status: 'completed',
      date: '2024-01-15 13:15',
      reference: 'TXN002'
    },
    {
      id: 3,
      customer: 'Carlos Oliveira',
      amount: 149.99,
      method: 'PIX',
      status: 'pending',
      date: '2024-01-15 12:45',
      reference: 'TXN003'
    },
    {
      id: 4,
      customer: 'Ana Costa',
      amount: 899.99,
      method: 'Mercado Pago',
      status: 'completed',
      date: '2024-01-15 11:20',
      reference: 'TXN004'
    }
  ];

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
      case 'PIX': return '🟢';
      case 'Cartão': return '💳';
      case 'Mercado Pago': return '💰';
      default: return '💱';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pagamentos</h1>
          <p className="text-muted-foreground">Gerencie seus gateways e transações</p>
        </div>
        <Button className="bg-gradient-primary text-white">
          <Plus className="w-4 h-4 mr-2" />
          Nova Cobrança
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">R$ 45.2k</p>
                <p className="text-sm text-muted-foreground">Receita Mensal</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <span className="text-xl">💰</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">156</p>
                <p className="text-sm text-muted-foreground">Transações Hoje</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <span className="text-xl">📊</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">98.5%</p>
                <p className="text-sm text-muted-foreground">Taxa de Sucesso</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <span className="text-xl">✅</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">R$ 2.1k</p>
                <p className="text-sm text-muted-foreground">Ticket Médio</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <span className="text-xl">💎</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="gateways" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="gateways">Gateways</TabsTrigger>
          <TabsTrigger value="transactions">Transações</TabsTrigger>
          <TabsTrigger value="config">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="gateways" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stripe */}
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-purple-100 flex items-center justify-center">
                      <span className="text-lg">💳</span>
                    </div>
                    Stripe
                  </CardTitle>
                  <Badge variant="default">Ativo</Badge>
                </div>
                <CardDescription>Gateway internacional para cartões</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="text-green-600 font-medium">Conectado</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Taxa:</span>
                    <span className="font-medium">3.4% + R$ 0.39</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Transações:</span>
                    <span className="font-medium">89 hoje</span>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    Configurar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Mercado Pago */}
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center">
                      <span className="text-lg">💰</span>
                    </div>
                    Mercado Pago
                  </CardTitle>
                  <Badge variant="default">Ativo</Badge>
                </div>
                <CardDescription>Gateway brasileiro completo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="text-green-600 font-medium">Conectado</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Taxa:</span>
                    <span className="font-medium">4.99%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Transações:</span>
                    <span className="font-medium">45 hoje</span>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    Configurar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* PIX */}
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-green-100 flex items-center justify-center">
                      <span className="text-lg">🟢</span>
                    </div>
                    PIX
                  </CardTitle>
                  <Badge variant="default">Ativo</Badge>
                </div>
                <CardDescription>Pagamentos instantâneos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="text-green-600 font-medium">Conectado</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Taxa:</span>
                    <span className="font-medium">R$ 0.99</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Transações:</span>
                    <span className="font-medium">22 hoje</span>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    Configurar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Transações Recentes</CardTitle>
              <CardDescription>
                Histórico de pagamentos e cobranças
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg border border-border bg-background/50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
                        {getMethodIcon(transaction.method)}
                      </div>
                      <div>
                        <h4 className="font-medium">{transaction.customer}</h4>
                        <p className="text-sm text-muted-foreground">
                          {transaction.method} • {transaction.date}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Ref: {transaction.reference}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold text-lg">
                          R$ {transaction.amount.toFixed(2)}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(transaction.status)}`} />
                          <span className="text-sm">{getStatusLabel(transaction.status)}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Detalhes
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Configuração PIX</CardTitle>
                <CardDescription>
                  Configure sua chave PIX para recebimentos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pix-key">Chave PIX Padrão</Label>
                  <Input
                    id="pix-key"
                    placeholder="Digite sua chave PIX (CPF, email, telefone ou chave aleatória)"
                    value={pixKey}
                    onChange={(e) => setPixKey(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Esta chave será usada como padrão para todos os pagamentos PIX
                  </p>
                </div>
                <Button className="w-full">Salvar Chave PIX</Button>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Configurações Gerais</CardTitle>
                <CardDescription>
                  Ajustes globais de pagamento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Gateway Padrão</Label>
                  <select className="w-full p-2 rounded-md border border-input bg-background">
                    <option>PIX (Instantâneo)</option>
                    <option>Mercado Pago</option>
                    <option>Stripe</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Moeda Padrão</Label>
                  <select className="w-full p-2 rounded-md border border-input bg-background">
                    <option>BRL - Real Brasileiro</option>
                    <option>USD - Dólar Americano</option>
                  </select>
                </div>
                <Button className="w-full">Salvar Configurações</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Payments;
