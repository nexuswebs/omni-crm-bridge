
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings as SettingsIcon,
  MessageSquare,
  Bot,
  CreditCard,
  Plug,
  Shield,
  Bell,
  Users,
  Database,
  Server,
  Key,
  Palette,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { EvolutionApiConfig } from '@/components/EvolutionApiConfig';
import { PaymentConfig } from '@/components/PaymentConfig';
import { UserManagement } from '@/components/UserManagement';
import { NotificationSettings } from '@/components/NotificationSettings';

interface ConfigStatus {
  evolution: boolean;
  n8n: boolean;
  payments: boolean;
  database: boolean;
}

// Simple N8n Connection component to avoid missing prop error
const SimpleN8nConnection = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div>
          <p className="font-medium">n8n.cloud Connection</p>
          <p className="text-sm text-muted-foreground">Configure your n8n automation workflows</p>
        </div>
        <Button variant="outline">Configurar</Button>
      </div>
    </div>
  );
};

export default function Settings() {
  const [configStatus, setConfigStatus] = useState<ConfigStatus>({
    evolution: false,
    n8n: false,
    payments: true,
    database: true
  });

  const getStatusBadge = (status: boolean) => {
    return status ? (
      <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
        <CheckCircle className="w-3 h-3 mr-1" />
        Configurado
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">
        <XCircle className="w-3 h-3 mr-1" />
        Não Configurado
      </Badge>
    );
  };

  const configSections = [
    {
      id: 'integrations',
      label: 'Integrações',
      icon: Plug,
      description: 'Configure APIs externas e serviços'
    },
    {
      id: 'users',
      label: 'Usuários',
      icon: Users,
      description: 'Gerencie usuários e permissões'
    },
    {
      id: 'notifications',
      label: 'Notificações',
      icon: Bell,
      description: 'Configure alertas e notificações'
    },
    {
      id: 'security',
      label: 'Segurança',
      icon: Shield,
      description: 'Configurações de segurança e backup'
    },
    {
      id: 'appearance',
      label: 'Aparência',
      icon: Palette,
      description: 'Personalize tema e interface'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie todas as configurações do seu CRM em um só lugar.
          </p>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-8 h-8 text-green-600" />
                <div>
                  <p className="font-medium">Evolution API</p>
                  <p className="text-xs text-muted-foreground">WhatsApp</p>
                </div>
              </div>
              {getStatusBadge(configStatus.evolution)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bot className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="font-medium">n8n.cloud</p>
                  <p className="text-xs text-muted-foreground">Automações</p>
                </div>
              </div>
              {getStatusBadge(configStatus.n8n)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="font-medium">Pagamentos</p>
                  <p className="text-xs text-muted-foreground">PIX, Stripe, MP</p>
                </div>
              </div>
              {getStatusBadge(configStatus.payments)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Database className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="font-medium">Banco de Dados</p>
                  <p className="text-xs text-muted-foreground">Supabase</p>
                </div>
              </div>
              {getStatusBadge(configStatus.database)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Configuration Tabs */}
      <Tabs defaultValue="integrations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          {configSections.map((section) => (
            <TabsTrigger key={section.id} value={section.id} className="flex items-center gap-2">
              <section.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{section.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="integrations" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                  Evolution API - WhatsApp Business
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EvolutionApiConfig />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-purple-600" />
                  n8n.cloud - Automações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SimpleN8nConnection />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  Gateways de Pagamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PaymentConfig />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Gerenciamento de Usuários
              </CardTitle>
            </CardHeader>
            <CardContent>
              <UserManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Configurações de Notificação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <NotificationSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Segurança e Autenticação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Autenticação de Dois Fatores</p>
                    <p className="text-sm text-muted-foreground">Adicione uma camada extra de segurança</p>
                  </div>
                  <Button variant="outline">Configurar</Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Backup Automático</p>
                    <p className="text-sm text-muted-foreground">Backup diário dos dados</p>
                  </div>
                  <Button variant="outline">Configurar</Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Logs de Auditoria</p>
                    <p className="text-sm text-muted-foreground">Rastreamento de atividades do sistema</p>
                  </div>
                  <Button variant="outline">Ver Logs</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Personalização da Interface
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Tema</p>
                  <p className="text-sm text-muted-foreground">Escolha entre tema claro ou escuro</p>
                </div>
                <Button variant="outline">Alterar</Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Logo da Empresa</p>
                  <p className="text-sm text-muted-foreground">Personalize o logo no sistema</p>
                </div>
                <Button variant="outline">Upload</Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Cores Personalizadas</p>
                  <p className="text-sm text-muted-foreground">Defina as cores da sua marca</p>
                </div>
                <Button variant="outline">Personalizar</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
