
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Zap, ExternalLink, CheckCircle, AlertTriangle, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface N8nConnectionProps {
  onClose: () => void;
}

export const N8nConnection = ({ onClose }: N8nConnectionProps) => {
  const { toast } = useToast();
  
  const [config, setConfig] = useState({
    url: 'https://n8n.example.com',
    username: '',
    password: '',
    apiKey: '',
    enabled: true,
    webhookUrl: `${window.location.origin}/api/webhooks/n8n`,
    autoSync: true
  });

  const [isConnected, setIsConnected] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleTestConnection = async () => {
    if (!config.url || !config.apiKey) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha a URL e a chave da API.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simular teste de conexão
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsConnected(true);
      toast({
        title: "Conexão estabelecida!",
        description: "n8n conectado com sucesso.",
      });
    } catch (error) {
      setIsConnected(false);
      toast({
        title: "Erro na conexão",
        description: "Verifique suas credenciais n8n.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    console.log('Salvando configurações n8n:', config);
    
    toast({
      title: "Configurações salvas!",
      description: "n8n configurado com sucesso.",
    });
    
    onClose();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "URL copiada para a área de transferência.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Zap className="w-6 h-6" />
            Configuração n8n
          </h2>
          <p className="text-muted-foreground">Configure a integração com n8n para automação de workflows</p>
        </div>
        <Button variant="outline" onClick={onClose}>
          Voltar
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Configurações de Conexão
            </CardTitle>
            <CardDescription>
              Configure as credenciais para conectar ao n8n
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="n8n-enabled"
                checked={config.enabled}
                onCheckedChange={(checked) => setConfig({ ...config, enabled: checked })}
              />
              <Label htmlFor="n8n-enabled">Habilitar Integração</Label>
              <Badge variant={config.enabled ? "default" : "secondary"}>
                {config.enabled ? "Ativo" : "Inativo"}
              </Badge>
            </div>

            <div>
              <Label htmlFor="n8n-url">URL do n8n</Label>
              <Input
                id="n8n-url"
                value={config.url}
                onChange={(e) => setConfig({ ...config, url: e.target.value })}
                placeholder="https://n8n.example.com"
              />
            </div>

            <div>
              <Label htmlFor="n8n-username">Usuário</Label>
              <Input
                id="n8n-username"
                value={config.username}
                onChange={(e) => setConfig({ ...config, username: e.target.value })}
                placeholder="seu-usuario"
              />
            </div>

            <div>
              <Label htmlFor="n8n-password">Senha</Label>
              <Input
                id="n8n-password"
                type="password"
                value={config.password}
                onChange={(e) => setConfig({ ...config, password: e.target.value })}
                placeholder="sua-senha"
              />
            </div>

            <div>
              <Label htmlFor="n8n-api-key">Chave da API</Label>
              <Input
                id="n8n-api-key"
                type="password"
                value={config.apiKey}
                onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                placeholder="sua-api-key"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="auto-sync"
                checked={config.autoSync}
                onCheckedChange={(checked) => setConfig({ ...config, autoSync: checked })}
              />
              <Label htmlFor="auto-sync">Sincronização Automática</Label>
            </div>

            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm">
                {isConnected ? 'Conectado' : 'Desconectado'}
              </span>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleTestConnection} disabled={isLoading} variant="outline">
                {isLoading ? 'Testando...' : 'Testar Conexão'}
              </Button>
              <Button onClick={handleSave} disabled={isLoading}>
                Salvar Configurações
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="w-5 h-5" />
              Configurações de Webhook
            </CardTitle>
            <CardDescription>
              Configure webhooks para receber dados do n8n
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="webhook-url">URL do Webhook</Label>
              <div className="flex gap-2">
                <Input
                  id="webhook-url"
                  value={config.webhookUrl}
                  onChange={(e) => setConfig({ ...config, webhookUrl: e.target.value })}
                  readOnly
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(config.webhookUrl)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Use esta URL nos seus workflows n8n para enviar dados para o CRM.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <h4 className="font-medium">Workflows Disponíveis</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded border">
                  <span className="text-sm">Novo Cliente</span>
                  <Badge variant="outline">Ativo</Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded border">
                  <span className="text-sm">Follow-up Vendas</span>
                  <Badge variant="outline">Ativo</Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded border">
                  <span className="text-sm">Suporte Automático</span>
                  <Badge variant="secondary">Pausado</Badge>
                </div>
              </div>
            </div>

            <Button className="w-full" variant="outline">
              <ExternalLink className="w-4 h-4 mr-2" />
              Abrir n8n
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Documentação e Ajuda</CardTitle>
          <CardDescription>
            Links úteis para configurar a integração n8n
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border">
              <h4 className="font-medium mb-2">Documentação n8n</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Guia completo para usar n8n
              </p>
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                Ver Docs
              </Button>
            </div>
            
            <div className="p-4 rounded-lg border">
              <h4 className="font-medium mb-2">Templates</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Workflows prontos para usar
              </p>
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                Baixar
              </Button>
            </div>
            
            <div className="p-4 rounded-lg border">
              <h4 className="font-medium mb-2">Suporte</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Precisa de ajuda? Entre em contato
              </p>
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                Contato
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
