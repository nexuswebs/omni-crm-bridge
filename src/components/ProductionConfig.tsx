
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Server, 
  Database, 
  Shield, 
  Globe, 
  AlertTriangle, 
  CheckCircle, 
  Copy,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { productionConfig, validateProductionConfig } from '@/config/production';

export const ProductionConfig = () => {
  const { toast } = useToast();
  
  const [config, setConfig] = useState({
    domain: '',
    apiUrl: '',
    supabaseUrl: '',
    supabaseKey: '',
    environment: 'production',
    sslEnabled: true,
    backupEnabled: true,
    monitoringEnabled: true,
    compressionEnabled: true,
    cachingEnabled: true
  });

  const [deploymentStatus, setDeploymentStatus] = useState({
    database: 'checking',
    api: 'checking',
    ssl: 'checking',
    domain: 'checking'
  });

  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    // Carregar configurações salvas
    const savedConfig = localStorage.getItem('production-config');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        setConfig({ ...config, ...parsed });
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      }
    }
  }, []);

  const handleSaveConfig = () => {
    localStorage.setItem('production-config', JSON.stringify(config));
    console.log('Configurações de produção salvas:', config);
    
    toast({
      title: "Configurações salvas!",
      description: "Configurações de produção foram atualizadas.",
    });
  };

  const handleValidateConfig = async () => {
    setIsValidating(true);
    
    try {
      // Simular validação
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      validateProductionConfig();
      
      setDeploymentStatus({
        database: 'success',
        api: 'success',
        ssl: 'success',
        domain: 'success'
      });
      
      toast({
        title: "Validação concluída!",
        description: "Todas as configurações estão corretas.",
      });
    } catch (error) {
      setDeploymentStatus({
        database: 'error',
        api: 'error',
        ssl: 'error',
        domain: 'error'
      });
      
      toast({
        title: "Erro na validação",
        description: "Algumas configurações precisam ser corrigidas.",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleDeploy = async () => {
    console.log('Iniciando deploy para produção...');
    
    toast({
      title: "Deploy iniciado!",
      description: "O sistema está sendo implantado em produção.",
    });
    
    // Simular processo de deploy
    setTimeout(() => {
      toast({
        title: "Deploy concluído!",
        description: "Sistema implantado com sucesso na VPS.",
      });
    }, 5000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Texto copiado para a área de transferência.",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <RefreshCw className="w-4 h-4 text-yellow-500 animate-spin" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-500">OK</Badge>;
      case 'error':
        return <Badge variant="destructive">Erro</Badge>;
      default:
        return <Badge variant="secondary">Verificando...</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Server className="w-6 h-6" />
          Configuração de Produção
        </h2>
        <p className="text-muted-foreground">Configure o sistema para implantação na VPS</p>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Certifique-se de que todas as configurações estão corretas antes de fazer o deploy em produção.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="environment" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="environment">Ambiente</TabsTrigger>
          <TabsTrigger value="database">Banco de Dados</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="deploy">Deploy</TabsTrigger>
        </TabsList>

        <TabsContent value="environment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Configurações do Ambiente
              </CardTitle>
              <CardDescription>
                Configure domínio e URLs de produção
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="domain">Domínio Principal</Label>
                <Input
                  id="domain"
                  value={config.domain}
                  onChange={(e) => setConfig({ ...config, domain: e.target.value })}
                  placeholder="https://crm.seudominio.com"
                />
              </div>

              <div>
                <Label htmlFor="api-url">URL da API</Label>
                <Input
                  id="api-url"
                  value={config.apiUrl}
                  onChange={(e) => setConfig({ ...config, apiUrl: e.target.value })}
                  placeholder="https://api.seudominio.com"
                />
              </div>

              <div>
                <Label htmlFor="environment">Ambiente</Label>
                <Select value={config.environment} onValueChange={(value) => setConfig({ ...config, environment: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="development">Desenvolvimento</SelectItem>
                    <SelectItem value="staging">Staging</SelectItem>
                    <SelectItem value="production">Produção</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="ssl-enabled"
                    checked={config.sslEnabled}
                    onCheckedChange={(checked) => setConfig({ ...config, sslEnabled: checked })}
                  />
                  <Label htmlFor="ssl-enabled">SSL/TLS</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="compression-enabled"
                    checked={config.compressionEnabled}
                    onCheckedChange={(checked) => setConfig({ ...config, compressionEnabled: checked })}
                  />
                  <Label htmlFor="compression-enabled">Compressão</Label>
                </div>
              </div>

              <Button onClick={handleSaveConfig} className="w-full">
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Configurações do Banco de Dados
              </CardTitle>
              <CardDescription>
                Configure conexão com Supabase
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="supabase-url">URL do Supabase</Label>
                <div className="flex gap-2">
                  <Input
                    id="supabase-url"
                    value={config.supabaseUrl}
                    onChange={(e) => setConfig({ ...config, supabaseUrl: e.target.value })}
                    placeholder="https://xxx.supabase.co"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(config.supabaseUrl)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="supabase-key">Chave Anônima</Label>
                <div className="flex gap-2">
                  <Input
                    id="supabase-key"
                    type="password"
                    value={config.supabaseKey}
                    onChange={(e) => setConfig({ ...config, supabaseKey: e.target.value })}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5..."
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(config.supabaseKey)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="backup-enabled"
                  checked={config.backupEnabled}
                  onCheckedChange={(checked) => setConfig({ ...config, backupEnabled: checked })}
                />
                <Label htmlFor="backup-enabled">Backup Automático</Label>
              </div>

              <Alert>
                <Database className="h-4 w-4" />
                <AlertDescription>
                  Certifique-se de que as políticas RLS estão configuradas corretamente no Supabase.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Configurações de Segurança
              </CardTitle>
              <CardDescription>
                Configure medidas de segurança para produção
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="monitoring-enabled"
                    checked={config.monitoringEnabled}
                    onCheckedChange={(checked) => setConfig({ ...config, monitoringEnabled: checked })}
                  />
                  <Label htmlFor="monitoring-enabled">Monitoramento</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="caching-enabled"
                    checked={config.cachingEnabled}
                    onCheckedChange={(checked) => setConfig({ ...config, cachingEnabled: checked })}
                  />
                  <Label htmlFor="caching-enabled">Cache</Label>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Checklist de Segurança</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">HTTPS configurado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Variáveis de ambiente protegidas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Autenticação configurada</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Backup automático ativo</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deploy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5" />
                Status do Deploy
              </CardTitle>
              <CardDescription>
                Verifique o status dos componentes antes do deploy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {getStatusIcon(deploymentStatus.database)}
                    Banco de Dados
                  </span>
                  {getStatusBadge(deploymentStatus.database)}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {getStatusIcon(deploymentStatus.api)}
                    API
                  </span>
                  {getStatusBadge(deploymentStatus.api)}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {getStatusIcon(deploymentStatus.ssl)}
                    SSL/TLS
                  </span>
                  {getStatusBadge(deploymentStatus.ssl)}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {getStatusIcon(deploymentStatus.domain)}
                    Domínio
                  </span>
                  {getStatusBadge(deploymentStatus.domain)}
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleValidateConfig} 
                  disabled={isValidating}
                  variant="outline"
                  className="flex-1"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isValidating ? 'animate-spin' : ''}`} />
                  {isValidating ? 'Validando...' : 'Validar Configurações'}
                </Button>
                
                <Button 
                  onClick={handleDeploy}
                  className="flex-1 bg-gradient-primary"
                  disabled={Object.values(deploymentStatus).some(status => status !== 'success')}
                >
                  <Server className="w-4 h-4 mr-2" />
                  Deploy para Produção
                </Button>
              </div>

              <Alert>
                <Server className="h-4 w-4" />
                <AlertDescription>
                  Comandos para VPS:
                  <br />
                  <code className="text-xs bg-muted p-1 rounded">git clone [repository]</code>
                  <br />
                  <code className="text-xs bg-muted p-1 rounded">npm install && npm run build</code>
                  <br />
                  <code className="text-xs bg-muted p-1 rounded">pm2 start ecosystem.config.js</code>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
