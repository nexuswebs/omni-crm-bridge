
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Settings as SettingsIcon, 
  Users, 
  Zap, 
  CreditCard, 
  Server, 
  Bell, 
  Shield,
  Database,
  Globe
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { IntegrationManager } from '@/components/IntegrationManager';
import { UserManagement } from '@/components/UserManagement';
import { PaymentSettings } from '@/components/PaymentSettings';
import { ProductionConfig } from '@/components/ProductionConfig';
import { NotificationSettings } from '@/components/NotificationSettings';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <SettingsIcon className="w-8 h-8" />
            Configurações
          </h2>
          <p className="text-muted-foreground">
            Gerencie todas as configurações do sistema
          </p>
        </div>
        <ThemeToggle />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <SettingsIcon className="w-4 h-4" />
            Geral
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Usuários
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Integrações
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Pagamentos
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="production" className="flex items-center gap-2">
            <Server className="w-4 h-4" />
            Produção
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="w-5 h-5" />
                  Configurações Gerais
                </CardTitle>
                <CardDescription>
                  Configurações básicas do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Tema do Sistema</span>
                  <ThemeToggle />
                </div>
                <div className="flex items-center justify-between">
                  <span>Ambiente</span>
                  <Badge variant="outline">Desenvolvimento</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Versão</span>
                  <Badge>v1.0.0</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Banco de Dados
                </CardTitle>
                <CardDescription>
                  Status da conexão com o banco
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Supabase</span>
                  <Badge className="bg-green-500">Conectado</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tabelas</span>
                  <Badge variant="outline">5 ativas</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Último Backup</span>
                  <Badge variant="outline">Hoje</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Segurança
                </CardTitle>
                <CardDescription>
                  Configurações de segurança
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Autenticação 2FA</span>
                  <Badge variant="outline">Disponível</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>SSL/TLS</span>
                  <Badge className="bg-green-500">Ativo</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Logs de Acesso</span>
                  <Badge className="bg-green-500">Ativo</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Sistema
                </CardTitle>
                <CardDescription>
                  Informações do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Uptime</span>
                  <Badge className="bg-green-500">99.9%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Usuários Ativos</span>
                  <Badge variant="outline">3</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Última Atualização</span>
                  <Badge variant="outline">Hoje</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>

        <TabsContent value="integrations">
          <IntegrationManager />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentSettings />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="production">
          <ProductionConfig />
        </TabsContent>
      </Tabs>
    </div>
  );
}
