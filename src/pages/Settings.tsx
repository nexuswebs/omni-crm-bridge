
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EvolutionApiConfigDatabase } from '@/components/EvolutionApiConfigDatabase';
import { WorkflowN8nIntegrationDatabase } from '@/components/WorkflowN8nIntegrationDatabase';
import { ProductionConfig } from '@/components/ProductionConfig';
import { PaymentConfig } from '@/components/PaymentConfig';
import { NotificationSettings } from '@/components/NotificationSettings';
import { UserManagement } from '@/components/UserManagement';
import { 
  Settings as SettingsIcon, 
  Zap, 
  Workflow, 
  CreditCard, 
  Bell, 
  Users,
  Server
} from 'lucide-react';

export default function Settings() {
  const [showN8nIntegration, setShowN8nIntegration] = useState(false);

  if (showN8nIntegration) {
    return <WorkflowN8nIntegrationDatabase onClose={() => setShowN8nIntegration(false)} />;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <SettingsIcon className="w-8 h-8" />
          Configurações
        </h1>
        <p className="text-muted-foreground">Gerencie as configurações do seu CRM</p>
      </div>

      <Tabs defaultValue="evolution" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="evolution" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Evolution API
          </TabsTrigger>
          <TabsTrigger value="workflows" className="flex items-center gap-2">
            <Workflow className="w-4 h-4" />
            Workflows
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Pagamentos
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Usuários
          </TabsTrigger>
          <TabsTrigger value="production" className="flex items-center gap-2">
            <Server className="w-4 h-4" />
            Produção
          </TabsTrigger>
        </TabsList>

        <TabsContent value="evolution">
          <EvolutionApiConfigDatabase />
        </TabsContent>

        <TabsContent value="workflows">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Workflow className="w-5 h-5" />
                Integração com Workflows
              </CardTitle>
              <CardDescription>
                Configure integrações com n8n.cloud e outros sistemas de automação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <button
                onClick={() => setShowN8nIntegration(true)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Configurar n8n.cloud
              </button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <PaymentConfig />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>

        <TabsContent value="production">
          <ProductionConfig />
        </TabsContent>
      </Tabs>
    </div>
  );
}
