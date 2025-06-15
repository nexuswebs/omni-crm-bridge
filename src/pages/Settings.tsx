
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Settings as SettingsIcon, 
  Users, 
  Bell, 
  CreditCard, 
  Shield, 
  Zap, 
  Plus, 
  Edit, 
  Trash2,
  Download,
  Upload,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PaymentConfig } from '@/components/PaymentConfig';
import { N8nConnection } from '@/components/N8nConnection';
import { UserModal } from '@/components/UserModal';
import { IntegrationModal } from '@/components/IntegrationModal';
import { ConfirmModal } from '@/components/ConfirmModal';
import { NotificationSettings } from '@/components/NotificationSettings';

const Settings = () => {
  const { toast } = useToast();

  // Estados das configurações gerais
  const [companyName, setCompanyName] = useState('Minha Empresa CRM');
  const [systemEmail, setSystemEmail] = useState('sistema@empresa.com');
  const [timezone, setTimezone] = useState('America/Sao_Paulo');
  const [language, setLanguage] = useState('pt-BR');
  const [currency, setCurrency] = useState('BRL');

  // Estados de segurança
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [passwordMinLength, setPasswordMinLength] = useState('8');
  const [loginAttempts, setLoginAttempts] = useState('5');

  // Estados de sistema
  const [autoBackup, setAutoBackup] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState('daily');
  const [logLevel, setLogLevel] = useState('info');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [sslEnabled, setSslEnabled] = useState(false);
  const [debugMode, setDebugMode] = useState(false);

  // Estados para usuários e integrações
  const [users, setUsers] = useState([
    { id: 1, name: 'Admin User', email: 'admin@crm.com', role: 'admin', status: 'active' },
    { id: 2, name: 'Ana Costa', email: 'ana@crm.com', role: 'agent', status: 'active' },
    { id: 3, name: 'Carlos Silva', email: 'carlos@crm.com', role: 'agent', status: 'active' }
  ]);

  const [integrations, setIntegrations] = useState([
    { name: 'n8n', status: 'connected', url: 'https://n8n.exemplo.com', key: 'n8n_***' },
    { name: 'Evolution API', status: 'connected', url: 'https://api.evolution.com', key: 'evo_***' },
    { name: 'OpenAI', status: 'connected', url: 'https://api.openai.com', key: 'sk-***' },
    { name: 'Stripe', status: 'disconnected', url: '', key: '' }
  ]);

  // Novos estados para modais
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [integrationModalOpen, setIntegrationModalOpen] = useState(false);
  const [editingIntegration, setEditingIntegration] = useState<any>(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [confirmMessage, setConfirmMessage] = useState('');

  // Estados para outras seções
  const [showN8nConnection, setShowN8nConnection] = useState(false);

  const handleSaveGeneral = () => {
    console.log('Salvando configurações gerais:', { companyName, systemEmail, timezone });
    toast({
      title: "Configurações salvas!",
      description: "As configurações gerais foram atualizadas com sucesso.",
    });
  };

  const handleSaveSecurity = () => {
    console.log('Salvando configurações de segurança:', { 
      twoFactorEnabled, 
      sessionTimeout, 
      passwordMinLength, 
      loginAttempts 
    });
    toast({
      title: "Segurança atualizada!",
      description: "As configurações de segurança foram salvas.",
    });
  };

  const handleSaveSystem = () => {
    console.log('Salvando configurações de sistema:', { 
      autoBackup, 
      backupFrequency, 
      logLevel, 
      maintenanceMode 
    });
    toast({
      title: "Sistema configurado!",
      description: "As configurações do sistema foram salvas.",
    });
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setUserModalOpen(true);
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setUserModalOpen(true);
  };

  const handleDeleteUser = (userId: number) => {
    const user = users.find(u => u.id === userId);
    setConfirmMessage(`Tem certeza que deseja excluir o usuário ${user?.name}?`);
    setConfirmAction(() => () => {
      setUsers(prev => prev.filter(u => u.id !== userId));
      console.log('Usuário removido:', userId);
      toast({
        title: "Usuário removido!",
        description: "O usuário foi excluído com sucesso.",
      });
    });
    setConfirmModalOpen(true);
  };

  const handleSaveUser = (userData: any) => {
    if (userData.id) {
      setUsers(prev => prev.map(u => u.id === userData.id ? userData : u));
    } else {
      const newUser = { ...userData, id: Math.max(...users.map(u => u.id)) + 1 };
      setUsers(prev => [...prev, newUser]);
    }
    console.log('Usuário salvo:', userData);
  };

  const handleConfigureIntegration = (integration: any) => {
    setEditingIntegration(integration);
    setIntegrationModalOpen(true);
  };

  const handleSaveIntegration = (integrationData: any) => {
    setIntegrations(prev => prev.map(i => 
      i.name === integrationData.name ? integrationData : i
    ));
    console.log('Integração salva:', integrationData);
  };

  const handleExportSettings = () => {
    const settings = {
      general: { companyName, systemEmail, timezone, language, currency },
      security: { twoFactorEnabled, sessionTimeout, passwordMinLength, loginAttempts },
      system: { autoBackup, backupFrequency, logLevel, maintenanceMode, sslEnabled, debugMode },
      users: users.map(u => ({ ...u, password: undefined })),
      integrations: integrations.map(i => ({ ...i, key: undefined }))
    };

    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'crm-settings.json';
    link.click();
    
    console.log('Exportando configurações:', settings);
    
    toast({
      title: "Configurações exportadas!",
      description: "Arquivo de configuração foi baixado.",
    });
  };

  const handleImportSettings = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const settings = JSON.parse(e.target?.result as string);
            
            // Aplicar configurações importadas
            if (settings.general) {
              setCompanyName(settings.general.companyName || companyName);
              setSystemEmail(settings.general.systemEmail || systemEmail);
              setTimezone(settings.general.timezone || timezone);
              setLanguage(settings.general.language || language);
              setCurrency(settings.general.currency || currency);
            }
            
            if (settings.security) {
              setTwoFactorEnabled(settings.security.twoFactorEnabled || false);
              setSessionTimeout(settings.security.sessionTimeout || '30');
              setPasswordMinLength(settings.security.passwordMinLength || '8');
              setLoginAttempts(settings.security.loginAttempts || '5');
            }
            
            if (settings.system) {
              setAutoBackup(settings.system.autoBackup || true);
              setBackupFrequency(settings.system.backupFrequency || 'daily');
              setLogLevel(settings.system.logLevel || 'info');
              setMaintenanceMode(settings.system.maintenanceMode || false);
              setSslEnabled(settings.system.sslEnabled || false);
              setDebugMode(settings.system.debugMode || false);
            }
            
            console.log('Configurações importadas:', settings);
            toast({
              title: "Configurações importadas!",
              description: "As configurações foram carregadas com sucesso.",
            });
          } catch (error) {
            console.error('Erro ao importar configurações:', error);
            toast({
              title: "Erro na importação",
              description: "Arquivo de configuração inválido.",
              variant: "destructive",
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleResetSettings = () => {
    setConfirmMessage('Tem certeza que deseja restaurar as configurações padrão? Esta ação não pode ser desfeita.');
    setConfirmAction(() => () => {
      // Resetar para valores padrão
      setCompanyName('Minha Empresa CRM');
      setSystemEmail('sistema@empresa.com');
      setTimezone('America/Sao_Paulo');
      setLanguage('pt-BR');
      setCurrency('BRL');
      setTwoFactorEnabled(false);
      setSessionTimeout('30');
      setPasswordMinLength('8');
      setLoginAttempts('5');
      setAutoBackup(true);
      setBackupFrequency('daily');
      setLogLevel('info');
      setMaintenanceMode(false);
      setSslEnabled(false);
      setDebugMode(false);
      
      console.log('Configurações restauradas para padrão');
      toast({
        title: "Configurações restauradas!",
        description: "Todas as configurações foram restauradas para os valores padrão.",
      });
    });
    setConfirmModalOpen(true);
  };

  const handleCreateBackup = () => {
    console.log('Criando backup manual');
    toast({
      title: "Backup iniciado",
      description: "Criando backup do sistema...",
    });
    
    // Simular criação de backup
    setTimeout(() => {
      toast({
        title: "Backup concluído!",
        description: "Backup criado com sucesso.",
      });
    }, 3000);
  };

  const handleRestoreBackup = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.backup,.sql,.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        console.log('Restaurando backup:', file.name);
        toast({
          title: "Restauração iniciada",
          description: `Restaurando backup: ${file.name}`,
        });
        
        // Simular restauração
        setTimeout(() => {
          toast({
            title: "Backup restaurado!",
            description: "Sistema restaurado com sucesso.",
          });
        }, 5000);
      }
    };
    input.click();
  };

  const handleClearLogs = () => {
    setConfirmMessage('Tem certeza que deseja limpar todos os logs do sistema?');
    setConfirmAction(() => () => {
      console.log('Limpando logs do sistema');
      toast({
        title: "Logs limpos!",
        description: "Todos os logs foram removidos.",
      });
    });
    setConfirmModalOpen(true);
  };

  if (showN8nConnection) {
    return <N8nConnection onClose={() => setShowN8nConnection(false)} />;
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">Gerencie as configurações do sistema</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="payments">Pagamentos</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="w-5 h-5" />
                Configurações Gerais
              </CardTitle>
              <CardDescription>
                Configure as informações básicas do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company-name">Nome da Empresa</Label>
                  <Input
                    id="company-name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Nome da sua empresa"
                  />
                </div>
                <div>
                  <Label htmlFor="system-email">Email do Sistema</Label>
                  <Input
                    id="system-email"
                    type="email"
                    value={systemEmail}
                    onChange={(e) => setSystemEmail(e.target.value)}
                    placeholder="sistema@empresa.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="timezone">Fuso Horário</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Sao_Paulo">São Paulo (UTC-3)</SelectItem>
                      <SelectItem value="America/New_York">Nova York (UTC-5)</SelectItem>
                      <SelectItem value="Europe/London">Londres (UTC+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="language">Idioma</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es-ES">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="currency">Moeda</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BRL">Real (R$)</SelectItem>
                      <SelectItem value="USD">Dólar ($)</SelectItem>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSaveGeneral} className="bg-gradient-primary">
                  Salvar Configurações
                </Button>
                <Button variant="outline" onClick={handleExportSettings}>
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
                <Button variant="outline" onClick={handleImportSettings}>
                  <Upload className="w-4 h-4 mr-2" />
                  Importar
                </Button>
                <Button variant="outline" onClick={handleResetSettings}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Restaurar Padrão
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Seção de Integrações */}
          <Card className="border-0 bg-card/50 backdrop-blur-sm mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Integrações
              </CardTitle>
              <CardDescription>
                Configure integrações com serviços externos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {integrations.map((integration) => (
                  <div key={integration.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center text-white text-sm font-bold">
                        {integration.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-medium">{integration.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {integration.status === 'connected' ? 'Conectado' : 'Desconectado'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={integration.status === 'connected' ? 'default' : 'secondary'}>
                        {integration.status === 'connected' ? 'Conectado' : 'Desconectado'}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleConfigureIntegration(integration)}
                      >
                        Configurar
                      </Button>
                    </div>
                  </div>
                ))}
                
                <Button 
                  variant="outline" 
                  onClick={() => setShowN8nConnection(true)}
                  className="w-full"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Conectar n8n
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Gerenciamento de Usuários
                  </CardTitle>
                  <CardDescription>
                    Gerencie usuários e permissões do sistema
                  </CardDescription>
                </div>
                <Button onClick={handleAddUser} className="bg-gradient-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Usuário
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-medium">{user.name}</h4>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role === 'admin' ? 'Admin' : 'Agente'}
                      </Badge>
                      <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                        {user.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentConfig />
        </TabsContent>

        <TabsContent value="security">
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Configurações de Segurança
              </CardTitle>
              <CardDescription>
                Configure políticas de segurança e autenticação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="two-factor">Autenticação de Dois Fatores</Label>
                  <p className="text-sm text-muted-foreground">Ative 2FA para maior segurança</p>
                </div>
                <Switch
                  id="two-factor"
                  checked={twoFactorEnabled}
                  onCheckedChange={setTwoFactorEnabled}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="session-timeout">Timeout de Sessão (minutos)</Label>
                  <Input
                    id="session-timeout"
                    type="number"
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(e.target.value)}
                    min="5"
                    max="120"
                  />
                </div>
                <div>
                  <Label htmlFor="password-length">Tamanho Mínimo da Senha</Label>
                  <Input
                    id="password-length"
                    type="number"
                    value={passwordMinLength}
                    onChange={(e) => setPasswordMinLength(e.target.value)}
                    min="6"
                    max="20"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="login-attempts">Máximo de Tentativas de Login</Label>
                <Input
                  id="login-attempts"
                  type="number"
                  value={loginAttempts}
                  onChange={(e) => setLoginAttempts(e.target.value)}
                  min="3"
                  max="10"
                />
              </div>

              <Button onClick={handleSaveSecurity} className="bg-gradient-primary">
                Salvar Configurações de Segurança
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Configurações do Sistema</CardTitle>
              <CardDescription>
                Configure backup, logs e manutenção do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Backup */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Backup</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-backup">Backup Automático</Label>
                    <p className="text-sm text-muted-foreground">Criar backups automaticamente</p>
                  </div>
                  <Switch
                    id="auto-backup"
                    checked={autoBackup}
                    onCheckedChange={setAutoBackup}
                  />
                </div>

                <div>
                  <Label htmlFor="backup-frequency">Frequência do Backup</Label>
                  <Select value={backupFrequency} onValueChange={setBackupFrequency}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">A cada hora</SelectItem>
                      <SelectItem value="daily">Diário</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                      <SelectItem value="monthly">Mensal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleCreateBackup} variant="outline">
                    Criar Backup Agora
                  </Button>
                  <Button onClick={handleRestoreBackup} variant="outline">
                    Restaurar Backup
                  </Button>
                </div>
              </div>

              {/* Logs */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Logs</h3>
                <div>
                  <Label htmlFor="log-level">Nível de Log</Label>
                  <Select value={logLevel} onValueChange={setLogLevel}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="error">Apenas Erros</SelectItem>
                      <SelectItem value="warn">Avisos e Erros</SelectItem>
                      <SelectItem value="info">Informações</SelectItem>
                      <SelectItem value="debug">Debug (Detalhado)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleClearLogs} variant="outline">
                  Limpar Logs
                </Button>
              </div>

              {/* Manutenção */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Manutenção</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenance-mode">Modo de Manutenção</Label>
                    <p className="text-sm text-muted-foreground">Desabilita acesso ao sistema</p>
                  </div>
                  <Switch
                    id="maintenance-mode"
                    checked={maintenanceMode}
                    onCheckedChange={setMaintenanceMode}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="ssl-enabled">SSL Habilitado</Label>
                    <p className="text-sm text-muted-foreground">Força conexões HTTPS</p>
                  </div>
                  <Switch
                    id="ssl-enabled"
                    checked={sslEnabled}
                    onCheckedChange={setSslEnabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="debug-mode">Modo Debug</Label>
                    <p className="text-sm text-muted-foreground">Exibe informações de debug</p>
                  </div>
                  <Switch
                    id="debug-mode"
                    checked={debugMode}
                    onCheckedChange={setDebugMode}
                  />
                </div>
              </div>

              <Button onClick={handleSaveSystem} className="bg-gradient-primary">
                Salvar Configurações do Sistema
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modais */}
      {userModalOpen && (
        <UserModal
          isOpen={userModalOpen}
          onClose={() => setUserModalOpen(false)}
          user={editingUser}
          onSave={handleSaveUser}
        />
      )}

      {integrationModalOpen && editingIntegration && (
        <IntegrationModal
          isOpen={integrationModalOpen}
          onClose={() => setIntegrationModalOpen(false)}
          integration={editingIntegration}
          onSave={handleSaveIntegration}
        />
      )}

      <ConfirmModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={() => {
          confirmAction();
          setConfirmModalOpen(false);
        }}
        title="Confirmar Ação"
        message={confirmMessage}
      />
    </div>
  );
};

export default Settings;
