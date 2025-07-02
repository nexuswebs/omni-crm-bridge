
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Smartphone, 
  Plus, 
  QrCode, 
  Trash2, 
  Send, 
  RefreshCw,
  Power,
  Settings,
  MessageSquare,
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useWhatsAppInstances } from '@/hooks/useWhatsAppInstances';

export const WhatsAppManager = () => {
  const { toast } = useToast();
  const {
    instances,
    isLoading,
    createInstance,
    deleteInstance,
    connectInstance,
    disconnectInstance,
    sendTestMessage,
    updateInstance,
    refreshInstances
  } = useWhatsAppInstances();

  const [newInstanceName, setNewInstanceName] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [testMessage, setTestMessage] = useState({
    phone: '',
    message: 'Esta é uma mensagem de teste do sistema CRM!'
  });
  const [selectedInstance, setSelectedInstance] = useState<string | null>(null);

  useEffect(() => {
    refreshInstances();
  }, []);

  const handleCreateInstance = async () => {
    if (!newInstanceName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Digite um nome para a instância.",
        variant: "destructive",
      });
      return;
    }

    const success = await createInstance(newInstanceName);
    if (success) {
      setNewInstanceName('');
      setIsCreateDialogOpen(false);
    }
  };

  const handleSendTestMessage = async (instanceId: string) => {
    const success = await sendTestMessage(instanceId, testMessage.phone, testMessage.message);
    if (success) {
      setTestMessage({ phone: '', message: 'Esta é uma mensagem de teste do sistema CRM!' });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'connecting':
      case 'qr_ready':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-500">Conectado</Badge>;
      case 'connecting':
        return <Badge className="bg-blue-500">Conectando</Badge>;
      case 'qr_ready':
        return <Badge className="bg-yellow-500">QR Code Pronto</Badge>;
      default:
        return <Badge variant="outline">Desconectado</Badge>;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'connected': return 'Conectado';
      case 'connecting': return 'Conectando';
      case 'qr_ready': return 'QR Code Pronto';
      default: return 'Desconectado';
    }
  };

  const connectedInstances = instances.filter(i => i.status === 'connected');
  const totalMessages = connectedInstances.length * 245; // Simulado
  const activeChats = connectedInstances.length * 12; // Simulado

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Smartphone className="w-6 h-6" />
            WhatsApp Manager
          </h2>
          <p className="text-muted-foreground">Gerencie suas instâncias WhatsApp Business</p>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={refreshInstances} variant="outline" disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary">
                <Plus className="w-4 h-4 mr-2" />
                Nova Instância
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova Instância WhatsApp</DialogTitle>
                <DialogDescription>
                  Crie uma nova instância para conectar um número WhatsApp
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="instance-name">Nome da Instância</Label>
                  <Input
                    id="instance-name"
                    value={newInstanceName}
                    onChange={(e) => setNewInstanceName(e.target.value)}
                    placeholder="ex: atendimento-01"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={handleCreateInstance} disabled={isLoading} className="flex-1">
                    {isLoading ? 'Criando...' : 'Criar Instância'}
                  </Button>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="flex-1">
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{instances.length}</p>
                <p className="text-sm text-muted-foreground">Total Instâncias</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">{connectedInstances.length}</p>
                <p className="text-sm text-muted-foreground">Conectadas</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{totalMessages}</p>
                <p className="text-sm text-muted-foreground">Mensagens Hoje</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{activeChats}</p>
                <p className="text-sm text-muted-foreground">Chats Ativos</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="instances" className="w-full">
        <TabsList>
          <TabsTrigger value="instances">Instâncias</TabsTrigger>
          <TabsTrigger value="messages">Enviar Mensagem</TabsTrigger>
        </TabsList>

        <TabsContent value="instances" className="space-y-4">
          {instances.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Smartphone className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nenhuma instância WhatsApp criada</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Crie sua primeira instância para começar a usar o WhatsApp Business
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeira Instância
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {instances.map((instance) => (
                <Card key={instance.id} className="relative">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                          <Smartphone className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{instance.name}</CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            {instance.phone || 'Não conectado'}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(instance.status)}
                        {getStatusBadge(instance.status)}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {instance.status === 'qr_ready' && instance.qrCode && (
                      <Alert>
                        <QrCode className="h-4 w-4" />
                        <AlertDescription>
                          <div className="space-y-2">
                            <p>Escaneie o QR Code com seu WhatsApp:</p>
                            <div className="flex justify-center">
                              <img 
                                src={`data:image/png;base64,${instance.qrCode}`} 
                                alt="QR Code WhatsApp"
                                className="w-32 h-32 border rounded"
                              />
                            </div>
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="flex gap-2">
                      {instance.status === 'disconnected' ? (
                        <Button 
                          onClick={() => connectInstance(instance.id)}
                          disabled={isLoading}
                          className="flex-1"
                        >
                          <Power className="w-4 h-4 mr-2" />
                          Conectar
                        </Button>
                      ) : instance.status === 'connected' ? (
                        <Button 
                          onClick={() => disconnectInstance(instance.id)}
                          disabled={isLoading}
                          variant="outline"
                          className="flex-1"
                        >
                          <Power className="w-4 h-4 mr-2" />
                          Desconectar
                        </Button>
                      ) : (
                        <Button disabled className="flex-1">
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          {getStatusLabel(instance.status)}
                        </Button>
                      )}
                      
                      <Button 
                        onClick={() => deleteInstance(instance.id)}
                        disabled={isLoading}
                        variant="outline"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                Enviar Mensagem de Teste
              </CardTitle>
              <CardDescription>
                Teste o envio de mensagens através das suas instâncias conectadas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {connectedInstances.length === 0 ? (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Você precisa ter pelo menos uma instância conectada para enviar mensagens.
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  <div>
                    <Label htmlFor="test-phone">Número de Telefone</Label>
                    <Input
                      id="test-phone"
                      value={testMessage.phone}
                      onChange={(e) => setTestMessage({ ...testMessage, phone: e.target.value })}
                      placeholder="+55 11 99999-9999"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="test-message">Mensagem</Label>
                    <Input
                      id="test-message"
                      value={testMessage.message}
                      onChange={(e) => setTestMessage({ ...testMessage, message: e.target.value })}
                      placeholder="Digite sua mensagem..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Selecione a Instância</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {connectedInstances.map((instance) => (
                        <Card key={instance.id} className="cursor-pointer hover:bg-muted/50">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{instance.name}</p>
                                <p className="text-sm text-muted-foreground">{instance.phone}</p>
                              </div>
                              <Button 
                                onClick={() => handleSendTestMessage(instance.id)}
                                disabled={isLoading || !testMessage.phone.trim() || !testMessage.message.trim()}
                                size="sm"
                              >
                                <Send className="w-4 h-4 mr-2" />
                                Enviar
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
