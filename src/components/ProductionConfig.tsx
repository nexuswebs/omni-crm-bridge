
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Server, 
  Database, 
  Shield, 
  Zap, 
  CheckCircle2,
  AlertTriangle,
  Settings,
  Globe
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ProductionConfig = () => {
  const { toast } = useToast();
  
  const [config, setConfig] = useState({
    domain: '',
    ssl: true,
    compression: true,
    caching: true,
    monitoring: true,
    backups: true,
    security: true,
    logs: true
  });

  const [serverConfig, setServerConfig] = useState({
    port: '3000',
    nodeEnv: 'production',
    maxMemory: '2048',
    workers: '4'
  });

  const productionChecklist = [
    { id: 1, name: 'SSL Certificate', status: config.ssl ? 'completed' : 'pending', required: true },
    { id: 2, name: 'Domain Configuration', status: config.domain ? 'completed' : 'pending', required: true },
    { id: 3, name: 'Database Optimization', status: 'completed', required: true },
    { id: 4, name: 'Security Headers', status: config.security ? 'completed' : 'pending', required: true },
    { id: 5, name: 'Gzip Compression', status: config.compression ? 'completed' : 'pending', required: false },
    { id: 6, name: 'Caching Strategy', status: config.caching ? 'completed' : 'pending', required: false },
    { id: 7, name: 'Monitoring Setup', status: config.monitoring ? 'completed' : 'pending', required: false },
    { id: 8, name: 'Backup Strategy', status: config.backups ? 'completed' : 'pending', required: true },
    { id: 9, name: 'Log Configuration', status: config.logs ? 'completed' : 'pending', required: false }
  ];

  const getStatusIcon = (status: string) => {
    return status === 'completed' ? 
      <CheckCircle2 className="w-4 h-4 text-green-500" /> : 
      <AlertTriangle className="w-4 h-4 text-yellow-500" />;
  };

  const getStatusBadge = (status: string, required: boolean) => {
    if (status === 'completed') {
      return <Badge className="bg-green-500">Concluído</Badge>;
    }
    return required ? 
      <Badge variant="destructive">Obrigatório</Badge> : 
      <Badge variant="secondary">Opcional</Badge>;
  };

  const handleSaveConfig = () => {
    console.log('Salvando configuração de produção:', { config, serverConfig });
    toast({
      title: "Configuração salva!",
      description: "Configurações de produção foram salvas com sucesso.",
    });
  };

  const handleDeploy = () => {
    const requiredItems = productionChecklist.filter(item => item.required && item.status !== 'completed');
    
    if (requiredItems.length > 0) {
      toast({
        title: "Configuração incompleta",
        description: `Complete os itens obrigatórios antes de fazer deploy: ${requiredItems.map(i => i.name).join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    console.log('Iniciando deploy para produção...');
    toast({
      title: "Deploy iniciado!",
      description: "O sistema está sendo preparado para produção.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Configuração de Produção</h2>
        <p className="text-muted-foreground">Configure o sistema para ambiente de produção</p>
      </div>

      {/* Checklist de Produção */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Checklist de Produção
          </CardTitle>
          <CardDescription>
            Verifique todos os itens antes do deploy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {productionChecklist.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(item.status)}
                  <span className="font-medium">{item.name}</span>
                </div>
                {getStatusBadge(item.status, item.required)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Configuração do Domínio */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Configuração do Domínio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="domain">Domínio de Produção</Label>
            <Input
              id="domain"
              placeholder="crm.suaempresa.com"
              value={config.domain}
              onChange={(e) => setConfig(prev => ({ ...prev, domain: e.target.value }))}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="ssl">SSL/HTTPS</Label>
              <p className="text-sm text-muted-foreground">Habilitar certificado SSL</p>
            </div>
            <Switch
              id="ssl"
              checked={config.ssl}
              onCheckedChange={(checked) => setConfig(prev => ({ ...prev, ssl: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Configuração do Servidor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="w-5 h-5" />
            Configuração do Servidor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="port">Porta</Label>
              <Input
                id="port"
                value={serverConfig.port}
                onChange={(e) => setServerConfig(prev => ({ ...prev, port: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="workers">Workers</Label>
              <Input
                id="workers"
                value={serverConfig.workers}
                onChange={(e) => setServerConfig(prev => ({ ...prev, workers: e.target.value }))}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="memory">Memória Máxima (MB)</Label>
            <Input
              id="memory"
              value={serverConfig.maxMemory}
              onChange={(e) => setServerConfig(prev => ({ ...prev, maxMemory: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Otimizações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Otimizações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="compression">Compressão Gzip</Label>
              <p className="text-sm text-muted-foreground">Reduz o tamanho dos arquivos</p>
            </div>
            <Switch
              id="compression"
              checked={config.compression}
              onCheckedChange={(checked) => setConfig(prev => ({ ...prev, compression: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="caching">Cache de Recursos</Label>
              <p className="text-sm text-muted-foreground">Cache de arquivos estáticos</p>
            </div>
            <Switch
              id="caching"
              checked={config.caching}
              onCheckedChange={(checked) => setConfig(prev => ({ ...prev, caching: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Segurança */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Segurança
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="security">Headers de Segurança</Label>
              <p className="text-sm text-muted-foreground">CORS, CSP, HSTS, etc.</p>
            </div>
            <Switch
              id="security"
              checked={config.security}
              onCheckedChange={(checked) => setConfig(prev => ({ ...prev, security: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="monitoring">Monitoramento</Label>
              <p className="text-sm text-muted-foreground">Logs e métricas de performance</p>
            </div>
            <Switch
              id="monitoring"
              checked={config.monitoring}
              onCheckedChange={(checked) => setConfig(prev => ({ ...prev, monitoring: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="flex gap-2">
        <Button onClick={handleSaveConfig} variant="outline">
          Salvar Configuração
        </Button>
        <Button onClick={handleDeploy} className="bg-gradient-primary">
          Deploy para Produção
        </Button>
      </div>
    </div>
  );
};
