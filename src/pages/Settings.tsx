
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Settings as SettingsIcon, Users, Zap, Key, Database } from 'lucide-react';

const Settings = () => {
  const users = [
    { id: 1, name: 'Admin User', email: 'admin@crm.com', role: 'admin', status: 'active' },
    { id: 2, name: 'Ana Costa', email: 'ana@crm.com', role: 'agent', status: 'active' },
    { id: 3, name: 'Carlos Silva', email: 'carlos@crm.com', role: 'agent', status: 'active' }
  ];

  const integrations = [
    { name: 'n8n', status: 'connected', url: 'https://n8n.exemplo.com', key: 'n8n_***' },
    { name: 'Evolution API', status: 'connected', url: 'https://api.evolution.com', key: 'evo_***' },
    { name: 'OpenAI', status: 'connected', url: 'https://api.openai.com', key: 'sk-***' },
    { name: 'Stripe', status: 'disconnected', url: '', key: '' }
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">Gerencie configurações do sistema</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <SettingsIcon className="w-4 h-4" />
            Geral
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Usuários
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Integrações
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Key className="w-4 h-4" />
            API
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Banco
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Gerais</CardTitle>
                <CardDescription>Configurações básicas do sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="company-name">Nome da Empresa</Label>
                  <Input id="company-name" defaultValue="Minha Empresa CRM" />
                </div>
                <div>
                  <Label htmlFor="system-email">Email do Sistema</Label>
                  <Input id="system-email" type="email" defaultValue="sistema@empresa.com" />
                </div>
                <div>
                  <Label htmlFor="timezone">Fuso Horário</Label>
                  <select className="w-full p-2 border rounded-md" defaultValue="America/Sao_Paulo">
                    <option value="America/Sao_Paulo">São Paulo (UTC-3)</option>
                    <option value="America/New_York">New York (UTC-4)</option>
                    <option value="Europe/London">London (UTC+0)</option>
                  </select>
                </div>
                <Button className="bg-gradient-primary text-white">Salvar Configurações</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preferências do Sistema</CardTitle>
                <CardDescription>Configurações de comportamento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-assign">Auto-atribuição de Tickets</Label>
                  <Switch id="auto-assign" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="ai-responses">Respostas Automáticas IA</Label>
                  <Switch id="ai-responses" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications">Notificações Email</Label>
                  <Switch id="notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="analytics">Coletar Analytics</Label>
                  <Switch id="analytics" defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Gerenciamento de Usuários</CardTitle>
                  <CardDescription>Controle de acesso e permissões</CardDescription>
                </div>
                <Button className="bg-gradient-primary text-white">
                  <Users className="w-4 h-4 mr-2" />
                  Novo Usuário
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="p-4 rounded-lg border border-border bg-background/50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role === 'admin' ? 'Administrador' : 'Agente'}
                      </Badge>
                      <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                        {user.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                      <Button size="sm" variant="outline">Editar</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Integrações Externas</CardTitle>
              <CardDescription>Gerencie conexões com APIs externas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {integrations.map((integration, index) => (
                  <div key={index} className="p-4 rounded-lg border border-border bg-background/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${integration.status === 'connected' ? 'bg-green-500' : 'bg-red-500'}`} />
                        <h3 className="font-semibold">{integration.name}</h3>
                      </div>
                      <Badge variant={integration.status === 'connected' ? 'default' : 'destructive'}>
                        {integration.status === 'connected' ? 'Conectado' : 'Desconectado'}
                      </Badge>
                    </div>
                    {integration.url && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <Label className="text-xs text-muted-foreground">URL</Label>
                          <p className="text-sm font-mono">{integration.url}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Chave API</Label>
                          <p className="text-sm font-mono">{integration.key}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        {integration.status === 'connected' ? 'Reconfigurar' : 'Conectar'}
                      </Button>
                      <Button size="sm" variant="outline">Testar</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de API</CardTitle>
              <CardDescription>Gerencie chaves e endpoints da API</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="api-key">Chave API Principal</Label>
                <div className="flex gap-2">
                  <Input id="api-key" type="password" value="api_key_***************" readOnly />
                  <Button variant="outline">Gerar Nova</Button>
                </div>
              </div>
              <div>
                <Label htmlFor="webhook-url">URL do Webhook</Label>
                <Input id="webhook-url" defaultValue="https://seu-dominio.com/webhook" />
              </div>
              <div>
                <Label>Endpoints Disponíveis</Label>
                <div className="space-y-2 mt-2">
                  <div className="p-2 bg-muted/50 rounded text-sm font-mono">
                    GET /api/customers - Listar clientes
                  </div>
                  <div className="p-2 bg-muted/50 rounded text-sm font-mono">
                    POST /api/messages - Enviar mensagem
                  </div>
                  <div className="p-2 bg-muted/50 rounded text-sm font-mono">
                    POST /api/workflows/trigger - Acionar workflow
                  </div>
                </div>
              </div>
              <Button className="bg-gradient-primary text-white">Salvar Configurações</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuração da Conexão</CardTitle>
                <CardDescription>Configure a conexão com o banco de dados</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="db-type">Tipo de Banco</Label>
                  <select id="db-type" className="w-full p-2 border rounded-md" defaultValue="mysql">
                    <option value="mysql">MySQL</option>
                    <option value="postgresql">PostgreSQL</option>
                    <option value="sqlite">SQLite</option>
                    <option value="mongodb">MongoDB</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="db-host">Host</Label>
                  <Input id="db-host" placeholder="localhost" defaultValue="localhost" />
                </div>
                <div>
                  <Label htmlFor="db-port">Porta</Label>
                  <Input id="db-port" type="number" placeholder="3306" defaultValue="3306" />
                </div>
                <div>
                  <Label htmlFor="db-name">Nome do Banco</Label>
                  <Input id="db-name" placeholder="crm_database" />
                </div>
                <div>
                  <Label htmlFor="db-user">Usuário</Label>
                  <Input id="db-user" placeholder="root" />
                </div>
                <div>
                  <Label htmlFor="db-password">Senha</Label>
                  <Input id="db-password" type="password" placeholder="••••••••" />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">Testar Conexão</Button>
                  <Button className="bg-gradient-primary text-white flex-1">Salvar</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status e Manutenção</CardTitle>
                <CardDescription>Backup e manutenção dos dados</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <h3 className="font-semibold">Status da Conexão</h3>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="text-sm text-green-600">Conectado</span>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <h3 className="font-semibold">Último Backup</h3>
                    <p className="text-sm text-muted-foreground">15/01/2024 às 03:00</p>
                    <Button size="sm" className="mt-2" variant="outline">Fazer Backup</Button>
                  </div>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <h3 className="font-semibold">Tamanho do Banco</h3>
                  <p className="text-sm text-muted-foreground">2.4 GB</p>
                  <Button size="sm" className="mt-2" variant="outline">Otimizar</Button>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-backup">Backup Automático (Diário às 3h)</Label>
                  <Switch id="auto-backup" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="compression">Compressão de Dados</Label>
                  <Switch id="compression" defaultChecked />
                </div>
                <Button className="bg-gradient-primary text-white w-full">
                  Executar Limpeza de Dados Antigos
                </Button>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Configurações Avançadas</CardTitle>
                <CardDescription>Parâmetros avançados de conexão</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="max-connections">Máximo de Conexões</Label>
                    <Input id="max-connections" type="number" defaultValue="100" />
                  </div>
                  <div>
                    <Label htmlFor="connection-timeout">Timeout da Conexão (ms)</Label>
                    <Input id="connection-timeout" type="number" defaultValue="30000" />
                  </div>
                  <div>
                    <Label htmlFor="charset">Charset</Label>
                    <Input id="charset" defaultValue="utf8mb4" />
                  </div>
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Input id="timezone" defaultValue="America/Sao_Paulo" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="ssl-enabled">Habilitar SSL</Label>
                  <Switch id="ssl-enabled" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="debug-mode">Modo Debug</Label>
                  <Switch id="debug-mode" />
                </div>
                <Button className="bg-gradient-primary text-white">Aplicar Configurações</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
