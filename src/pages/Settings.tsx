
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const Settings = () => {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">Gerencie as configurações do sistema</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="integrations">Integrações</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Informações da Empresa</CardTitle>
                <CardDescription>
                  Dados básicos da sua empresa
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Nome da Empresa</Label>
                  <Input id="company-name" placeholder="Sua Empresa LTDA" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-email">Email Principal</Label>
                  <Input id="company-email" type="email" placeholder="contato@empresa.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-phone">Telefone</Label>
                  <Input id="company-phone" placeholder="+55 11 99999-9999" />
                </div>
                <Button className="w-full">Salvar Alterações</Button>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Preferências do Sistema</CardTitle>
                <CardDescription>
                  Configure o comportamento do CRM
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Fuso Horário</Label>
                  <select className="w-full p-2 rounded-md border border-input bg-background">
                    <option>America/Sao_Paulo</option>
                    <option>America/New_York</option>
                    <option>Europe/London</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Idioma</Label>
                  <select className="w-full p-2 rounded-md border border-input bg-background">
                    <option>Português (BR)</option>
                    <option>English (US)</option>
                    <option>Español</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Tema</Label>
                  <select className="w-full p-2 rounded-md border border-input bg-background">
                    <option>Automático</option>
                    <option>Claro</option>
                    <option>Escuro</option>
                  </select>
                </div>
                <Button className="w-full">Aplicar Configurações</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* n8n Integration */}
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-red-100 flex items-center justify-center">
                      <span className="text-lg">⚡</span>
                    </div>
                    n8n
                  </CardTitle>
                  <Badge variant="default">Conectado</Badge>
                </div>
                <CardDescription>Plataforma de automação</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="text-green-600 font-medium">Ativo</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Workflows:</span>
                    <span className="font-medium">4 ativos</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Última sync:</span>
                    <span className="font-medium">2 min atrás</span>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    Configurar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Evolution API */}
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-green-100 flex items-center justify-center">
                      <span className="text-lg">📱</span>
                    </div>
                    Evolution API
                  </CardTitle>
                  <Badge variant="default">Conectado</Badge>
                </div>
                <CardDescription>API WhatsApp Business</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="text-green-600 font-medium">Ativo</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Instâncias:</span>
                    <span className="font-medium">3 conectadas</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Mensagens hoje:</span>
                    <span className="font-medium">245</span>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    Configurar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* OpenAI */}
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-purple-100 flex items-center justify-center">
                      <span className="text-lg">🤖</span>
                    </div>
                    OpenAI
                  </CardTitle>
                  <Badge variant="default">Conectado</Badge>
                </div>
                <CardDescription>Inteligência Artificial</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="text-green-600 font-medium">Ativo</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Modelo:</span>
                    <span className="font-medium">GPT-4</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Requests hoje:</span>
                    <span className="font-medium">1.2k</span>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    Configurar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Gerenciamento de Usuários</CardTitle>
                  <CardDescription>Controle acessos e permissões</CardDescription>
                </div>
                <Button className="bg-gradient-primary text-white">
                  Novo Usuário
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Admin User', email: 'admin@empresa.com', role: 'Administrador', status: 'Ativo' },
                  { name: 'Ana Costa', email: 'ana@empresa.com', role: 'Agente', status: 'Ativo' },
                  { name: 'Carlos Silva', email: 'carlos@empresa.com', role: 'Suporte', status: 'Ativo' }
                ].map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-border bg-background/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-medium">{user.name}</h4>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline">{user.role}</Badge>
                      <Badge variant="default">{user.status}</Badge>
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Backup Automático</CardTitle>
                <CardDescription>
                  Configure backups automáticos dos dados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Frequência</Label>
                  <select className="w-full p-2 rounded-md border border-input bg-background">
                    <option>Diário</option>
                    <option>Semanal</option>
                    <option>Mensal</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Retenção</Label>
                  <select className="w-full p-2 rounded-md border border-input bg-background">
                    <option>30 dias</option>
                    <option>90 dias</option>
                    <option>1 ano</option>
                  </select>
                </div>
                <Button className="w-full">Configurar Backup</Button>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Backups Recentes</CardTitle>
                <CardDescription>
                  Histórico de backups realizados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { date: '15/01/2024 03:00', size: '45.2 MB', status: 'Sucesso' },
                    { date: '14/01/2024 03:00', size: '44.8 MB', status: 'Sucesso' },
                    { date: '13/01/2024 03:00', size: '44.1 MB', status: 'Sucesso' }
                  ].map((backup, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="text-sm font-medium">{backup.date}</p>
                        <p className="text-xs text-muted-foreground">{backup.size}</p>
                      </div>
                      <Badge variant="default" className="text-xs">
                        {backup.status}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" variant="outline">
                  Criar Backup Agora
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Chaves de API</CardTitle>
                <CardDescription>
                  Gerencie suas chaves de API
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>API Key Principal</Label>
                  <div className="flex gap-2">
                    <Input type="password" value="sk-1234567890abcdef" readOnly />
                    <Button variant="outline">Copiar</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Webhook URL</Label>
                  <div className="flex gap-2">
                    <Input value="https://api.seucrm.com/webhook" readOnly />
                    <Button variant="outline">Copiar</Button>
                  </div>
                </div>
                <Button className="w-full">Gerar Nova Chave</Button>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Documentação da API</CardTitle>
                <CardDescription>
                  Endpoints disponíveis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { method: 'GET', endpoint: '/api/customers', description: 'Listar clientes' },
                    { method: 'POST', endpoint: '/api/customers', description: 'Criar cliente' },
                    { method: 'GET', endpoint: '/api/messages', description: 'Listar mensagens' },
                    { method: 'POST', endpoint: '/api/messages', description: 'Enviar mensagem' }
                  ].map((api, index) => (
                    <div key={index} className="p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={api.method === 'GET' ? 'default' : 'secondary'} className="text-xs">
                          {api.method}
                        </Badge>
                        <code className="text-xs font-mono">{api.endpoint}</code>
                      </div>
                      <p className="text-xs text-muted-foreground">{api.description}</p>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" variant="outline">
                  Ver Documentação Completa
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
