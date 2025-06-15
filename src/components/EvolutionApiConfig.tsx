
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Save, TestTube, Settings, Smartphone, Globe, Key } from 'lucide-react';

export const EvolutionApiConfig = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [config, setConfig] = useState({
    serverUrl: 'http://sua-vps-ip:8080',
    apiKey: '',
    globalWebhook: 'https://seu-crm-domain.com/api/webhook/whatsapp',
    instanceName: 'crm-instance',
    instanceExpiration: false,
    deleteInstance: false,
    logLevel: 'ERROR'
  });

  const handleTest = async () => {
    setIsTesting(true);
    try {
      // Simular teste de conexão com Evolution API
      const response = await fetch(`${config.serverUrl}/instance/fetchInstances`, {
        method: 'GET',
        headers: {
          'apikey': config.apiKey,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast({
          title: "Conexão testada com sucesso!",
          description: "Evolution API está respondendo corretamente.",
        });
      } else {
        throw new Error('Falha na conexão');
      }
    } catch (error) {
      toast({
        title: "Erro na conexão",
        description: "Verifique a URL e a chave da API.",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simular salvamento das configurações
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Configurações salvas!",
        description: "Evolution API configurada com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao salvar configurações.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Configurações Evolution API
          </CardTitle>
          <CardDescription>
            Configure a conexão com sua VPS Evolution API para integração WhatsApp
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="serverUrl">URL do Servidor</Label>
              <Input
                id="serverUrl"
                value={config.serverUrl}
                onChange={(e) => setConfig({ ...config, serverUrl: e.target.value })}
                placeholder="http://sua-vps-ip:8080"
              />
            </div>
            <div>
              <Label htmlFor="apiKey">Chave da API</Label>
              <Input
                id="apiKey"
                type="password"
                value={config.apiKey}
                onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                placeholder="Digite sua chave da API"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="globalWebhook">Webhook Global</Label>
            <Input
              id="globalWebhook"
              value={config.globalWebhook}
              onChange={(e) => setConfig({ ...config, globalWebhook: e.target.value })}
              placeholder="https://seu-crm-domain.com/api/webhook/whatsapp"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="instanceName">Nome da Instância</Label>
              <Input
                id="instanceName"
                value={config.instanceName}
                onChange={(e) => setConfig({ ...config, instanceName: e.target.value })}
                placeholder="crm-instance"
              />
            </div>
            <div>
              <Label htmlFor="logLevel">Nível de Log</Label>
              <select 
                id="logLevel"
                value={config.logLevel}
                onChange={(e) => setConfig({ ...config, logLevel: e.target.value })}
                className="w-full px-3 py-2 border border-input bg-background rounded-md"
              >
                <option value="ERROR">ERROR</option>
                <option value="WARN">WARN</option>
                <option value="INFO">INFO</option>
                <option value="DEBUG">DEBUG</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              onClick={handleTest}
              disabled={isTesting || !config.serverUrl || !config.apiKey}
              variant="outline"
            >
              <TestTube className="w-4 h-4 mr-2" />
              {isTesting ? 'Testando...' : 'Testar Conexão'}
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isLoading}
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Salvando...' : 'Salvar Configurações'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configurações Avançadas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium">Expiração de Instância</p>
              <p className="text-sm text-muted-foreground">Desconectar instâncias inativas automaticamente</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.instanceExpiration}
                onChange={(e) => setConfig({ ...config, instanceExpiration: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium">Auto Deletar Instâncias</p>
              <p className="text-sm text-muted-foreground">Remover instâncias desconectadas automaticamente</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.deleteInstance}
                onChange={(e) => setConfig({ ...config, deleteInstance: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Status da Conexão
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Badge variant={config.serverUrl && config.apiKey ? "default" : "secondary"}>
              {config.serverUrl && config.apiKey ? "Configurado" : "Não Configurado"}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {config.serverUrl && config.apiKey 
                ? "Evolution API está configurada e pronta para uso"
                : "Configure a URL e chave da API para começar"
              }
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
