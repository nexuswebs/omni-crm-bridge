
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useEvolutionApiDatabase } from '@/hooks/useEvolutionApiDatabase';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Zap, CheckCircle, XCircle, RefreshCw, Database } from 'lucide-react';

export const EvolutionApiConfigDatabase = () => {
  const { toast } = useToast();
  const { config, isLoading, isSaving, updateConfig } = useEvolutionApiDatabase();
  
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    key: '',
    instanceName: '',
    webhookUrl: '',
    autoConnect: false
  });

  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  // Atualizar form quando config carregar
  useEffect(() => {
    if (!isLoading && config) {
      setFormData({
        name: config.name || 'Evolution API',
        url: config.url || '',
        key: config.key || '',
        instanceName: config.instanceName || 'crm-instance',
        webhookUrl: config.webhookUrl || '',
        autoConnect: config.autoConnect || false
      });
    }
  }, [config, isLoading]);

  const handleTestConnection = async () => {
    if (!formData.url || !formData.key) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha a URL e a API Key.",
        variant: "destructive",
      });
      return;
    }

    setTestStatus('testing');

    try {
      const response = await fetch(`${formData.url}/instance/fetchInstances`, {
        method: 'GET',
        headers: {
          'apikey': formData.key
        }
      });

      if (response.ok) {
        setTestStatus('success');
        await updateConfig({ 
          ...formData, 
          connected: true, 
          status: 'connected' 
        });
        toast({
          title: "Conexão estabelecida!",
          description: "Evolution API conectada com sucesso.",
        });
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      setTestStatus('error');
      await updateConfig({ 
        ...formData, 
        connected: false, 
        status: 'disconnected' 
      });
      toast({
        title: "Erro na conexão",
        description: "Verifique suas credenciais da Evolution API.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    const success = await updateConfig(formData);
    if (success) {
      toast({
        title: "Configurações salvas!",
        description: "Configurações da Evolution API salvas no banco de dados.",
      });
    }
  };

  const getStatusIcon = () => {
    switch (testStatus) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'testing': return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      default: return <Database className="w-4 h-4 text-muted-foreground" />;
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
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Zap className="w-6 h-6" />
          Configuração Evolution API (Banco de Dados)
        </h2>
        <p className="text-muted-foreground">Configure sua Evolution API - dados salvos no banco</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Configurações da API
          </CardTitle>
          <CardDescription>
            Configure sua Evolution API - os dados serão salvos no banco de dados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="api-name">Nome da API</Label>
            <Input
              id="api-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Evolution API"
            />
          </div>

          <div>
            <Label htmlFor="api-url">URL da API</Label>
            <Input
              id="api-url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://api.redenexus.top"
            />
          </div>

          <div>
            <Label htmlFor="api-key">API Key</Label>
            <Input
              id="api-key"
              type="password"
              value={formData.key}
              onChange={(e) => setFormData({ ...formData, key: e.target.value })}
              placeholder="Sua API Key"
            />
          </div>

          <div>
            <Label htmlFor="instance-name">Nome da Instância</Label>
            <Input
              id="instance-name"
              value={formData.instanceName}
              onChange={(e) => setFormData({ ...formData, instanceName: e.target.value })}
              placeholder="crm-instance"
            />
          </div>

          <div>
            <Label htmlFor="webhook-url">URL do Webhook</Label>
            <Input
              id="webhook-url"
              value={formData.webhookUrl}
              onChange={(e) => setFormData({ ...formData, webhookUrl: e.target.value })}
              placeholder="https://webhook.site/unique-id"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="auto-connect"
              checked={formData.autoConnect}
              onCheckedChange={(checked) => setFormData({ ...formData, autoConnect: checked })}
            />
            <Label htmlFor="auto-connect">Conectar automaticamente</Label>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <span>Status da Conexão</span>
            </div>
            <Badge variant={testStatus === 'success' ? 'default' : 'secondary'}>
              {testStatus === 'success' ? 'Conectado' : 
               testStatus === 'error' ? 'Erro' :
               testStatus === 'testing' ? 'Testando...' : 'Não testado'}
            </Badge>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleTestConnection} 
              disabled={testStatus === 'testing' || isSaving}
              variant="outline"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${testStatus === 'testing' ? 'animate-spin' : ''}`} />
              Testar Conexão
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
    </div>
  );
};
