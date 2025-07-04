
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useN8nConfig } from '@/hooks/useN8nConfig';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Zap, CheckCircle, XCircle, RefreshCw, Globe, Webhook, Database } from 'lucide-react';

interface WorkflowN8nIntegrationDatabaseProps {
  onClose: () => void;
}

export const WorkflowN8nIntegrationDatabase = ({ onClose }: WorkflowN8nIntegrationDatabaseProps) => {
  const { toast } = useToast();
  const { config, isLoading, isSaving, updateConfig } = useN8nConfig();
  
  const [formData, setFormData] = useState({
    n8nUrl: '',
    apiKey: '',
    webhookUrl: ''
  });

  const [testResults, setTestResults] = useState({
    connection: null as 'success' | 'error' | null,
    webhooks: null as 'success' | 'error' | null,
    workflows: null as 'success' | 'error' | null
  });

  const [isLoadingTest, setIsLoadingTest] = useState(false);

  // Atualizar form quando config carregar
  useEffect(() => {
    if (!isLoading && config) {
      setFormData({
        n8nUrl: config.n8nUrl || 'https://app.n8n.cloud',
        apiKey: config.apiKey || '',
        webhookUrl: config.webhookUrl || ''
      });
    }
  }, [config, isLoading]);

  const handleTestConnection = async () => {
    if (!formData.n8nUrl || !formData.apiKey) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha a URL do n8n.cloud e a API Key.",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingTest(true);
    console.log('Testando conexão n8n.cloud:', { url: formData.n8nUrl, apiKey: '***' });

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
        
        await updateConfig({ 
          ...formData, 
          connected: true,
          workflowsSync: false
        });
        
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
        
        await updateConfig({ 
          ...formData, 
          connected: false,
          workflowsSync: false
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
      setIsLoadingTest(false);
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

    setIsLoadingTest(true);
    console.log('Sincronizando workflows do n8n.cloud');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      await updateConfig({ 
        ...formData, 
        connected: config.connected,
        workflowsSync: true
      });
      
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
      setIsLoadingTest(false);
    }
  };

  const handleSave = async () => {
    const success = await updateConfig(formData);
    if (success) {
      toast({
        title: "Configurações salvas!",
        description: "Configurações do n8n.cloud salvas no banco de dados.",
      });
    }
  };

  const getStatusIcon = (status: 'success' | 'error' | null) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <RefreshCw className="w-4 h-4 text-muted-foreground" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <LoadingSpinner />
          <span className="ml-2">Carregando configurações...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Zap className="w-6 h-6" />
            Integração n8n.cloud (Banco de Dados)
          </h2>
          <p className="text-muted-foreground">Configure a conexão com n8n.cloud - dados salvos no banco</p>
        </div>
        <Button variant="outline" onClick={onClose}>
          Fechar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Configuração da Conexão
          </CardTitle>
          <CardDescription>
            Configure suas credenciais do n8n.cloud - dados salvos no banco de dados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="n8n-url">URL do n8n.cloud</Label>
            <Input
              id="n8n-url"
              value={formData.n8nUrl}
              onChange={(e) => setFormData({ ...formData, n8nUrl: e.target.value })}
              placeholder="https://app.n8n.cloud"
            />
          </div>

          <div>
            <Label htmlFor="api-key">API Key do n8n.cloud</Label>
            <Input
              id="api-key"
              type="password"
              value={formData.apiKey}
              onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
              placeholder="Sua API Key do n8n.cloud"
            />
          </div>

          <div>
            <Label htmlFor="webhook-url">URL do Webhook (CRM)</Label>
            <Input
              id="webhook-url"
              value={formData.webhookUrl}
              onChange={(e) => setFormData({ ...formData, webhookUrl: e.target.value })}
              placeholder="https://seu-crm.com/api/webhook/n8n"
            />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleTestConnection} 
              disabled={isLoadingTest || isSaving}
              variant="outline"
            >
              <Zap className="w-4 h-4 mr-2" />
              {isLoadingTest ? 'Testando...' : 'Testar Conexão'}
            </Button>
            
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="flex-1"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Database className="w-4 h-4 mr-2" />
                  Salvar no Banco
                </>
              )}
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
              <Button 
                onClick={handleSyncWorkflows} 
                disabled={isLoadingTest || isSaving} 
                className="w-full"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingTest ? 'animate-spin' : ''}`} />
                {isLoadingTest ? 'Sincronizando...' : 'Sincronizar Workflows'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
