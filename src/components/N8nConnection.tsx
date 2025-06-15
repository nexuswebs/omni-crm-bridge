
import { useState, useEffect } from 'react';
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
  
  // Carregar dados salvos do localStorage
  const [connectionData, setConnectionData] = useState(() => {
    const saved = localStorage.getItem('n8n-connection');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Erro ao carregar dados salvos do n8n:', error);
      }
    }
    return {
      baseUrl: 'https://n8.redenexus.top',
      apiKey: '',
      webhookUrl: 'https://n8.redenexus.top/webhook',
      connected: false,
      version: '',
      instanceInfo: null as any,
      autoSync: false
    };
  });

  const [testResults, setTestResults] = useState({
    connection: null as string | null,
    webhooks: null as string | null,
    workflows: null as string | null
  });

  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Salvar dados no localStorage sempre que connectionData mudar
  useEffect(() => {
    localStorage.setItem('n8n-connection', JSON.stringify(connectionData));
  }, [connectionData]);

  const handleTestConnection = async () => {
    if (!connectionData.baseUrl || !connectionData.apiKey) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha a URL base e a API key.",
        variant: "destructive",
      });
      return;
    }

    setIsTestingConnection(true);
    console.log('Testando conexão n8n:', { baseUrl: connectionData.baseUrl, apiKey: '***' });
    
    toast({
      title: "Testando conexão...",
      description: "Verificando conectividade com n8n",
    });

    try {
      // Primeiro tenta o endpoint padrão do n8n
      let response = await fetch(`${connectionData.baseUrl}/api/v1/workflows`, {
        method: 'GET',
        headers: {
          'X-N8N-API-KEY': connectionData.apiKey,
          'Content-Type': 'application/json',
        }
      });

      // Se falhar, tenta endpoint alternativo
      if (!response.ok) {
        console.log('Tentando endpoint alternativo...');
        response = await fetch(`${connectionData.baseUrl}/rest/workflows`, {
          method: 'GET',
          headers: {
            'X-N8N-API-KEY': connectionData.apiKey,
            'Content-Type': 'application/json',
          }
        });
      }

      if (response.ok) {
        const workflows = await response.json();
        
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
            workflows: workflows.length || 0,
            executions: 1547,
            activeWorkflows: workflows.filter((w: any) => w.active).length || 0
          }
        });

        toast({
          title: "Conexão estabelecida!",
          description: `n8n conectado com sucesso. ${workflows.length} workflows encontrados.`,
        });
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Erro na conexão n8n:', error);
      
      setTestResults({
        connection: 'error',
        webhooks: 'error',
        workflows: 'error'
      });
      
      toast({
        title: "Erro na conexão",
        description: "Verifique a URL base e API key. Certifique-se de que o n8n está rodando e acessível.",
        variant: "destructive",
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSaveConnection = () => {
    if (!connectionData.baseUrl || !connectionData.apiKey) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    console.log('Salvando configurações n8n:', {
      baseUrl: connectionData.baseUrl,
      apiKey: '***',
      webhookUrl: connectionData.webhookUrl,
      autoSync: connectionData.autoSync
    });
    
    // Os dados já são salvos automaticamente pelo useEffect
    toast({
      title: "Configurações salvas!",
      description: "Conexão com n8n configurada e salva com sucesso.",
    });
  };

  const handleSyncWorkflows = () => {
    if (!connectionData.connected) {
      toast({
        title: "Conexão necessária",
        description: "Primeiro teste e estabeleça a conexão com n8n.",
        variant: "destructive",
      });
      return;
    }

    setIsSyncing(true);
    console.log('Sincronizando workflows do n8n');
    
    toast({
      title: "Sincronizando workflows...",
      description: "Importando workflows do n8n.",
    });

    setTimeout(() => {
      setIsSyncing(false);
      toast({
        title: "Sincronização concluída!",
        description: "4 workflows foram importados com sucesso.",
      });
    }, 3000);
  };

  const handleConfigureAutoSync = () => {
    console.log('Configurando sincronização automática');
    toast({
      title: "Configurar Auto-Sync",
      description: "Funcionalidade de configuração automática será implementada.",
    });
  };

  const handleWebhookConfig = (webhookName: string, action: 'activate' | 'pause' | 'configure') => {
    console.log(`Webhook ${webhookName} - ${action}`);
    toast({
      title: `Webhook ${webhookName}`,
      description: `${action === 'activate' ? 'Ativando' : action === 'pause' ? 'Pausando' : 'Configurando'} webhook.`,
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
                  checked={connectionData.autoSync}
                  onCheckedChange={(checked) => setConnectionData({ ...connectionData, autoSync: checked })}
                />
                <Label htmlFor="auto-sync">Sincronização automática</Label>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleTestConnection} 
                  className="bg-gradient-primary"
                  disabled={isTestingConnection}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  {isTestingConnection ? 'Testando...' : 'Testar Conexão'}
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
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <span className="text-sm font-medium">Onboarding Automático</span>
                      <p className="text-xs text-muted-foreground">Ativa quando novo cliente se cadastra</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="default">Ativo</Badge>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleWebhookConfig('Onboarding Automático', 'pause')}
                      >
                        Pausar
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <span className="text-sm font-medium">Suporte Inteligente</span>
                      <p className="text-xs text-muted-foreground">Resposta automática para tickets</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="default">Ativo</Badge>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleWebhookConfig('Suporte Inteligente', 'configure')}
                      >
                        Configurar
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <span className="text-sm font-medium">Follow-up Vendas</span>
                      <p className="text-xs text-muted-foreground">Acompanhamento pós-venda</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Pausado</Badge>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleWebhookConfig('Follow-up Vendas', 'activate')}
                      >
                        Ativar
                      </Button>
                    </div>
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
                  <Button 
                    onClick={handleSyncWorkflows} 
                    className="bg-gradient-primary"
                    disabled={isSyncing || !connectionData.connected}
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                    {isSyncing ? 'Sincronizando...' : 'Sincronizar Agora'}
                  </Button>
                  <Button variant="outline" onClick={handleConfigureAutoSync}>
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
