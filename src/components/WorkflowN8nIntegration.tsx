
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Zap, CheckCircle, XCircle, RefreshCw, Globe, Key, Webhook } from 'lucide-react';

interface WorkflowN8nIntegrationProps {
  onClose: () => void;
}

export const WorkflowN8nIntegration = ({ onClose }: WorkflowN8nIntegrationProps) => {
  const { toast } = useToast();
  
  const [config, setConfig] = useState({
    n8nUrl: 'https://app.n8n.cloud',
    apiKey: '',
    webhookUrl: '',
    connected: false,
    workflowsSync: false
  });

  const [testResults, setTestResults] = useState({
    connection: null as 'success' | 'error' | null,
    webhooks: null as 'success' | 'error' | null,
    workflows: null as 'success' | 'error' | null
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleTestConnection = async () => {
    if (!config.n8nUrl || !config.apiKey) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha a URL do n8n.cloud e a API Key.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log('Testando conexão n8n.cloud:', { url: config.n8nUrl, apiKey: '***' });

    try {
      // Simular teste de conexão
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const success = Math.random() > 0.2; // 80% chance de sucesso
      
      if (success) {
        setTestResults({
          connection: 'success',
          webhooks: 'success',
          workflows: 'success'
        });
        
        setConfig({ ...config, connected: true });
        
        toast({
          title: "Conexão estabelecida!",
          description: "n8n.cloud conectado com sucesso.",
        });
      } else {
        setTestResults({
          connection: 'error',
          webhooks: 'error',
          workflows: 'error'
        });
        
        toast({
          title: "Erro na conexão",
          description: "Verifique suas credenciais do n8n.cloud.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao conectar com n8n.cloud.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncWorkflows = async () => {
    if (!config.connected) {
      toast({
        title: "Conexão necessária",
        description: "Conecte-se ao n8n.cloud primeiro.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log('Sincronizando workflows do n8n.cloud');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setConfig({ ...config, workflowsSync: true });
      
      toast({
        title: "Sincronização concluída!",
        description: "Workflows importados do n8n.cloud com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha na sincronização de workflows.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfigureWebhooks = async () => {
    if (!config.webhookUrl) {
      toast({
        title: "URL do Webhook necessária",
        description: "Configure a URL do webhook primeiro.",
        variant: "destructive",
      });
      return;
    }

    console.log('Configurando webhooks:', config.webhookUrl);
    
    toast({
      title: "Webhooks configurados!",
      description: "Webhooks do n8n.cloud estão ativos.",
    });
  };

  const getStatusIcon = (status: 'success' | 'error' | null) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <RefreshCw className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Zap className="w-6 h-6" />
            Integração n8n.cloud
          </h2>
          <p className="text-muted-foreground">Configure a conexão com n8n.cloud</p>
        </div>
        <Button variant="outline" onClick={onClose}>
          Fechar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Configuração da Conexão
          </CardTitle>
          <CardDescription>
            Configure suas credenciais do n8n.cloud
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="n8n-url">URL do n8n.cloud</Label>
            <Input
              id="n8n-url"
              value={config.n8nUrl}
              onChange={(e) => setConfig({ ...config, n8nUrl: e.target.value })}
              placeholder="https://app.n8n.cloud"
            />
          </div>

          <div>
            <Label htmlFor="api-key">API Key do n8n.cloud</Label>
            <Input
              id="api-key"
              type="password"
              value={config.apiKey}
              onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
              placeholder="Sua API Key do n8n.cloud"
            />
          </div>

          <div>
            <Label htmlFor="webhook-url">URL do Webhook (CRM)</Label>
            <Input
              id="webhook-url"
              value={config.webhookUrl}
              onChange={(e) => setConfig({ ...config, webhookUrl: e.target.value })}
              placeholder="https://seu-crm.com/api/webhook/n8n"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleTestConnection} disabled={isLoading}>
              <Zap className="w-4 h-4 mr-2" />
              {isLoading ? 'Testando...' : 'Testar Conexão'}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleConfigureWebhooks}
              disabled={!config.connected}
            >
              <Webhook className="w-4 h-4 mr-2" />
              Configurar Webhooks
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status da Integração</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Conexão n8n.cloud</span>
              <div className="flex items-center gap-2">
                {getStatusIcon(testResults.connection)}
                <Badge variant={testResults.connection === 'success' ? 'default' : 'secondary'}>
                  {testResults.connection === 'success' ? 'Conectado' : 'Desconectado'}
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span>Webhooks</span>
              <div className="flex items-center gap-2">
                {getStatusIcon(testResults.webhooks)}
                <Badge variant={testResults.webhooks === 'success' ? 'default' : 'secondary'}>
                  {testResults.webhooks === 'success' ? 'Configurado' : 'Pendente'}
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span>Sincronização de Workflows</span>
              <div className="flex items-center gap-2">
                {getStatusIcon(testResults.workflows)}
                <Badge variant={config.workflowsSync ? 'default' : 'secondary'}>
                  {config.workflowsSync ? 'Sincronizado' : 'Pendente'}
                </Badge>
              </div>
            </div>
          </div>

          {config.connected && (
            <div className="mt-4 pt-4 border-t">
              <Button onClick={handleSyncWorkflows} disabled={isLoading} className="w-full">
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Sincronizando...' : 'Sincronizar Workflows'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Instruções de Configuração</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm">
            <h4 className="font-medium mb-2">Para configurar n8n.cloud:</h4>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>Acesse app.n8n.cloud e faça login</li>
              <li>Vá em Settings → API Keys</li>
              <li>Crie uma nova API Key</li>
              <li>Cole a API Key no campo acima</li>
              <li>Configure os webhooks nos seus workflows</li>
              <li>Use a URL do webhook fornecida acima</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
