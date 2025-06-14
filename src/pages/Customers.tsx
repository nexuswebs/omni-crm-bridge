
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Phone, User } from 'lucide-react';

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const customers = [
    {
      id: 1,
      name: 'João Silva',
      email: 'joao@email.com',
      phone: '+55 11 99999-9999',
      status: 'active',
      lastInteraction: '2 horas atrás',
      source: 'WhatsApp',
      tags: ['VIP', 'Interessado'],
      agent: 'IA Assistant'
    },
    {
      id: 2,
      name: 'Maria Santos',
      email: 'maria@email.com',
      phone: '+55 11 88888-8888',
      status: 'prospect',
      lastInteraction: '1 dia atrás',
      source: 'Site',
      tags: ['Novo Lead'],
      agent: 'Agente Humano'
    },
    {
      id: 3,
      name: 'Carlos Oliveira',
      email: 'carlos@email.com',
      phone: '+55 11 77777-7777',
      status: 'customer',
      lastInteraction: '3 dias atrás',
      source: 'Indicação',
      tags: ['Cliente Recorrente'],
      agent: 'IA Assistant'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'prospect': return 'bg-yellow-500';
      case 'customer': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'prospect': return 'Prospect';
      case 'customer': return 'Cliente';
      default: return 'Inativo';
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clientes</h1>
          <p className="text-muted-foreground">Gerencie seus contatos e relacionamentos</p>
        </div>
        <Button className="bg-gradient-primary text-white">
          <Plus className="w-4 h-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="border-0 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, email ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">Filtros</Button>
            <Button variant="outline">Exportar</Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <User className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">1,247</p>
                <p className="text-sm text-muted-foreground">Total de Clientes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">89</p>
                <p className="text-sm text-muted-foreground">Ativos Hoje</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                <User className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">156</p>
                <p className="text-sm text-muted-foreground">Novos Prospects</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">98.5%</p>
                <p className="text-sm text-muted-foreground">Taxa de Satisfação</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer List */}
      <Card className="border-0 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>
            {filteredCustomers.length} clientes encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCustomers.map((customer) => (
              <div key={customer.id} className="p-4 rounded-lg border border-border bg-background/50 hover:bg-background/80 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold">{customer.name}</h3>
                      <p className="text-sm text-muted-foreground">{customer.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="w-3 h-3" />
                        <span className="text-xs text-muted-foreground">{customer.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(customer.status)}`} />
                        <span className="text-sm font-medium">{getStatusLabel(customer.status)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Última interação: {customer.lastInteraction}</p>
                      <p className="text-xs text-muted-foreground">Agente: {customer.agent}</p>
                    </div>

                    <div className="flex flex-col gap-1">
                      {customer.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <Badge variant="outline" className="text-xs">
                      {customer.source}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Customers;
