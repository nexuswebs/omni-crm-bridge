
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CheckCircle, Loader2, Globe, Key, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface N8nConnectionProps {
  onClose: () => void;
}

export const N8nConnection = ({ onClose }: N8nConnectionProps) => {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionData, setConnectionData] = useState({
    url: 'https://n8n.exemplo.com',
    apiKey: '',
    webhook: 'https://webhook.exemplo.com/n8n',
    autoSync: true,
    enableLogs: true
  });

  const [testResults, setTestResults] = useState({
    connection: null as boolean | null,
    webhooks: null as boolean | null,
    workflows: null as boolean | null
  });

  const handleConnect = async () => {
    setIsConnecting(true);
    
    try {
      // Simular teste de conexão
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setTestResults({
        connection: true,
        webhooks: true,
        workflows: true
      });
      
      setIsConnected(true);
      
      toast({
        title: "Conexão estabelecida!",
        description: "n8n conectado com sucesso. Workflows sincronizados.",
      });
      
    } catch (error) {
      setTestResults({
        connection: false,
        webhooks: false,
        workflows: false
      });
      
      toast({
        title: "Falha na conexão",
        description: "Não foi possível conectar ao n8n. Verifique as configurações.",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setTestResults({
      connection: null,
      webhooks: null,
      workflows: null
    });
    
    toast({
      title: "Desconectado",
      description: "Conexão com n8n foi removida.",
    });
  };

  const handleSyncWorkflows = async () => {
    toast({
      title: "Sincronização iniciada",
      description: "Buscando workflows do n8n...",
    });
    
    // Simular sincronização
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Workflows sincronizados",
      description: "12 workflows importados com sucesso.",
    });
  };

  const TestResult = ({ label, status }: { label: string; status: boolean | null }) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm">{label}</span>
      {status === null && <div className="w-4 h-4 rounded-full bg-gray-200" />}
      {status === true && <CheckCircle className="w-4 h-4 text-green-500" />}
      {status === false && <AlertCircle className="w-4 h-4 text-red-500" />}
    </div>
  );

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Conectar n8n
            {isConnected && <Badge className="bg-green-500">Conectado</Badge>}
          </CardTitle>
          <Button variant="outline" onClick={onClose}>Fechar</Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status da Conexão */}
        {isConnected && (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Conectado ao n8n</p>
                  <p className="text-sm text-green-600">Última sincronização: há 2 minutos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Configurações de Conexão */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="url">URL do n8n *</Label>
            <Input
              id="url"
              value={connectionData.url}
              onChange={(e) => setConnectionData({ ...connectionData, url: e.target.value })}
              placeholder="https://n8n.seudominio.com"
              disabled={isConnected}
            />
          </div>

          <div>
            <Label htmlFor="apiKey">API Key *</Label>
            <Input
              id="apiKey"
              type="password"
              value={connectionData.apiKey}
              onChange={(e) => setConnectionData({ ...connectionData, apiKey: e.target.value })}
              placeholder="n8n_api_key_aqui"
              disabled={isConnected}
            />
          </div>

          <div>
            <Label htmlFor="webhook">Webhook URL</Label>
            <Input
              id="webhook"
              value={connectionData.webhook}
              onChange={(e) => setConnectionData({ ...connectionData, webhook: e.target.value })}
              placeholder="https://webhook.seudominio.com/n8n"
              disabled={isConnected}
            />
          </div>
        </div>

        <Separator />

        {/* Configurações Avançadas */}
        <div className="space-y-4">
          <h4 className="font-medium">Configurações Avançadas</h4>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Sincronização Automática</Label>
              <p className="text-sm text-muted-foreground">Sincronizar workflows automaticamente</p>
            </div>
            <Switch
              checked={connectionData.autoSync}
              onCheckedChange={(checked) => setConnectionData({ ...connectionData, autoSync: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Logs Detalhados</Label>
              <p className="text-sm text-muted-foreground">Capturar logs de execução do n8n</p>
            </div>
            <Switch
              checked={connectionData.enableLogs}
              onCheckedChange={(checked) => setConnectionData({ ...connectionData, enableLogs: checked })}
            />
          </div>
        </div>

        {/* Teste de Conexão */}
        {(testResults.connection !== null) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Resultado dos Testes</CardTitle>
            </CardHeader>
            <CardContent>
              <TestResult label="Conexão com n8n" status={testResults.connection} />
              <TestResult label="Webhooks funcionando" status={testResults.webhooks} />
              <TestResult label="Acesso aos workflows" status={testResults.workflows} />
            </CardContent>
          </Card>
        )}

        {/* Ações */}
        <div className="flex gap-2 justify-end">
          {!isConnected ? (
            <Button 
              onClick={handleConnect} 
              disabled={isConnecting || !connectionData.url || !connectionData.apiKey}
              className="bg-gradient-primary text-white"
            >
              {isConnecting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isConnecting ? 'Conectando...' : 'Conectar'}
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSyncWorkflows}>
                <Database className="w-4 h-4 mr-2" />
                Sincronizar Workflows
              </Button>
              <Button variant="outline" onClick={handleDisconnect}>
                Desconectar
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
