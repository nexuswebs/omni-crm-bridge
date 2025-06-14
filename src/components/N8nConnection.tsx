
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zap, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface N8nConnectionProps {
  onClose: () => void;
}

export const N8nConnection = ({ onClose }: N8nConnectionProps) => {
  const { toast } = useToast();
  const [connectionData, setConnectionData] = useState({
    baseUrl: 'https://n8n.seu-dominio.com',
    apiKey: '',
    webhookUrl: 'https://n8n.seu-dominio.com/webhook',
    connected: false,
    version: '',
    instanceInfo: null
  });

  const [testResults, setTestResults] = useState({
    connection: null,
    webhooks: null,
    workflows: null
  });

  const handleTestConnection = async () => {
    toast({
      title: "Testando conexão...",
      description: "Verificando conectividade com n8n",
    });

    // Simular teste de conexão
    setTimeout(() => {
      setTestResults({
        connection: 'success',
        webhooks: 'success',
        workflows: 'success'
      });
      
      setConnectionData({
        ...connectionData,
        connected: true,
        version: '1.19.4',
        instanceInfo: {
          workflows: 12,
          executions: 1547,
          activeWorkflows: 8
        }
      });

      toast({
        title: "Conexão estabelecida!",
        description: "n8n conectado com sucesso.",
      });
    }, 2000);
  };

  const handleSaveConnection = () => {
    toast({
      title: "Configurações salvas!",
      description: "Conexão com n8n configurada com sucesso.",
    });
  };

  const handleSyncWorkflows = () => {
    toast({
      title: "Sincronizando workflows...",
      description: "Importando workflows do n8n.",
    });
  };

  const getTestResultIcon = (result: string | null) => {
    switch (result) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <RefreshCw className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getTestResultLabel = (result: string | null) => {
    switch (result) {
      case 'success': return 'Sucesso';
      case 'error': return 'Erro';
      default: return 'Aguardando';
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Conexão n8n
            </CardTitle>
            <CardDescription>
              Configure a integração com sua instância n8n
            </CardDescription>
          </div>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="connection" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="connection">Conexão</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            <TabsTrigger value="sync">Sincronização</TabsTrigger>
          </TabsList>

          <TabsContent value="connection" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="base-url">URL Base do n8n</Label>
                <Input
                  id="base-url"
                  value={connectionData.baseUrl}
                  onChange={(e) => setConnectionData({ ...connectionData, baseUrl: e.target.value })}
                  placeholder="https://n8n.seu-dominio.com"
                />
              </div>

              <div>
                <Label htmlFor="api-key">API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  value={connectionData.apiKey}
                  onChange={(e) => setConnectionData({ ...connectionData, apiKey: e.target.value })}
                  placeholder="n8n_api_key_..."
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-sync"
                  checked={connectionData.connected}
                  onCheckedChange={(checked) => setConnectionData({ ...connectionData, connected: checked })}
                />
                <Label htmlFor="auto-sync">Sincronização automática</Label>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleTestConnection} className="bg-gradient-primary">
                  <Zap className="w-4 h-4 mr-2" />
                  Testar Conexão
                </Button>
                <Button variant="outline" onClick={handleSaveConnection}>
                  Salvar Configurações
                </Button>
              </div>
            </div>

            {/* Status da Conexão */}
            <Card className="border-0 bg-muted/50">
              <CardHeader>
                <CardTitle className="text-lg">Status da Conexão</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Conectividade</span>
                    <div className="flex items-center gap-2">
                      {getTestResultIcon(testResults.connection)}
                      <Badge variant={testResults.connection === 'success' ? 'default' : 'secondary'}>
                        {getTestResultLabel(testResults.connection)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Webhooks</span>
                    <div className="flex items-center gap-2">
                      {getTestResultIcon(testResults.webhooks)}
                      <Badge variant={testResults.webhooks === 'success' ? 'default' : 'secondary'}>
                        {getTestResultLabel(testResults.webhooks)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Workflows</span>
                    <div className="flex items-center gap-2">
                      {getTestResultIcon(testResults.workflows)}
                      <Badge variant={testResults.workflows === 'success' ? 'default' : 'secondary'}>
                        {getTestResultLabel(testResults.workflows)}
                      </Badge>
                    </div>
                  </div>
                </div>

                {connectionData.instanceInfo && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <h4 className="font-medium mb-2">Informações da Instância</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Versão:</span>
                        <p className="font-medium">{connectionData.version}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Workflows:</span>
                        <p className="font-medium">{connectionData.instanceInfo.workflows}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Execuções:</span>
                        <p className="font-medium">{connectionData.instanceInfo.executions}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="webhooks" className="space-y-4">
            <div>
              <Label htmlFor="webhook-url">URL do Webhook</Label>
              <Input
                id="webhook-url"
                value={connectionData.webhookUrl}
                onChange={(e) => setConnectionData({ ...connectionData, webhookUrl: e.target.value })}
                placeholder="https://n8n.seu-dominio.com/webhook"
              />
            </div>

            <Card className="border-0 bg-muted/50">
              <CardHeader>
                <CardTitle className="text-lg">Webhooks Configurados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Onboarding Automático</span>
                    <Badge variant="default">Ativo</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Suporte Inteligente</span>
                    <Badge variant="default">Ativo</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Follow-up Vendas</span>
                    <Badge variant="secondary">Pausado</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sync" className="space-y-4">
            <Card className="border-0 bg-muted/50">
              <CardHeader>
                <CardTitle className="text-lg">Sincronização de Workflows</CardTitle>
                <CardDescription>
                  Importe workflows do n8n para o sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button onClick={handleSyncWorkflows} className="bg-gradient-primary">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Sincronizar Agora
                  </Button>
                  <Button variant="outline">
                    Configurar Auto-Sync
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-muted/50">
              <CardHeader>
                <CardTitle className="text-lg">Última Sincronização</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  <p>Data: 15/01/2024 às 10:30</p>
                  <p>Workflows importados: 4</p>
                  <p>Status: Sucesso</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
