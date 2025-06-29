
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zap, Smartphone, Bot, CreditCard, Settings, CheckCircle, XCircle } from 'lucide-react';
import { N8nConnection } from './N8nConnection';
import { EvolutionApiIntegration } from './EvolutionApiIntegration';
import { useToast } from '@/hooks/use-toast';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'connected' | 'disconnected' | 'pending';
  component?: React.ComponentType<{ onClose: () => void }>;
}

export const IntegrationManager = () => {
  const { toast } = useToast();
  const [activeIntegration, setActiveIntegration] = useState<string | null>(null);

  const integrations: Integration[] = [
    {
      id: 'n8n',
      name: 'n8n',
      description: 'Automação de workflows',
      icon: <Zap className="w-5 h-5" />,
      status: 'connected',
      component: N8nConnection
    },
    {
      id: 'evolution-api',
      name: 'Evolution API',
      description: 'WhatsApp Business API',
      icon: <Smartphone className="w-5 h-5" />,
      status: 'connected',
      component: EvolutionApiIntegration
    },
    {
      id: 'openai',
      name: 'OpenAI',
      description: 'Inteligência Artificial',
      icon: <Bot className="w-5 h-5" />,
      status: 'disconnected'
    },
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Processamento de pagamentos',
      icon: <CreditCard className="w-5 h-5" />,
      status: 'disconnected'
    }
  ];

  const handleConfigureIntegration = (integrationId: string) => {
    const integration = integrations.find(i => i.id === integrationId);
    
    if (integration?.component) {
      setActiveIntegration(integrationId);
    } else {
      toast({
        title: "Em desenvolvimento",
        description: `Configuração para ${integration?.name} ainda não implementada.`,
        variant: "destructive",
      });
    }
  };

  const handleConnectIntegration = (integrationId: string) => {
    console.log('Conectando integração:', integrationId);
    toast({
      title: "Conectando...",
      description: "Estabelecendo conexão com a integração.",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Settings className="w-4 h-4 text-yellow-500 animate-spin" />;
      default:
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-500">Conectado</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pendente</Badge>;
      default:
        return <Badge variant="outline">Desconectado</Badge>;
    }
  };

  if (activeIntegration) {
    const integration = integrations.find(i => i.id === activeIntegration);
    const Component = integration?.component;
    
    if (Component) {
      return <Component onClose={() => setActiveIntegration(null)} />;
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Integrações</h2>
        <p className="text-muted-foreground">Configure e gerencie suas integrações externas</p>
      </div>

      <Tabs defaultValue="available" className="w-full">
        <TabsList>
          <TabsTrigger value="available">Disponíveis</TabsTrigger>
          <TabsTrigger value="configured">Configuradas</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {integrations.map((integration) => (
              <Card key={integration.id} className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {integration.icon}
                      <div>
                        <CardTitle className="text-lg">{integration.name}</CardTitle>
                        <CardDescription>{integration.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(integration.status)}
                      {getStatusBadge(integration.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    {integration.status === 'connected' ? (
                      <Button 
                        onClick={() => handleConfigureIntegration(integration.id)}
                        className="flex-1"
                      >
                        Configurar
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => handleConnectIntegration(integration.id)}
                        className="flex-1"
                        variant="outline"
                      >
                        Conectar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="configured" className="space-y-4">
          <div className="space-y-4">
            {integrations
              .filter(i => i.status === 'connected')
              .map((integration) => (
                <Card key={integration.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {integration.icon}
                        <div>
                          <CardTitle className="text-lg">{integration.name}</CardTitle>
                          <CardDescription>{integration.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(integration.status)}
                        {getStatusBadge(integration.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleConfigureIntegration(integration.id)}
                        size="sm"
                      >
                        Gerenciar
                      </Button>
                      <Button 
                        variant="outline"
                        size="sm"
                      >
                        Desconectar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
