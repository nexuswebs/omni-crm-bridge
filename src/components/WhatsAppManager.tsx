import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Smartphone, 
  Plus, 
  RefreshCw,
  Send,
  MessageSquare,
  Users,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useWhatsAppInstances, WhatsAppInstance } from '@/hooks/useWhatsAppInstances';
import { CreateInstanceModal } from './CreateInstanceModal';
import { InstanceConfigModal } from './InstanceConfigModal';
import { ConfirmModal } from './ConfirmModal';
import { WhatsAppInstanceCard } from './WhatsAppInstanceCard';

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

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [configInstance, setConfigInstance] = useState<WhatsAppInstance | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; instanceId: string }>({
    show: false,
    instanceId: ''
  });
  const [testMessage, setTestMessage] = useState({
    phone: '',
    message: 'Esta é uma mensagem de teste do sistema CRM!'
  });

  useEffect(() => {
    refreshInstances();
  }, []);

  const handleDeleteInstance = async () => {
    if (deleteConfirm.instanceId) {
      await deleteInstance(deleteConfirm.instanceId);
      setDeleteConfirm({ show: false, instanceId: '' });
    }
  };

  const handleSendTestMessage = async (instanceId: string) => {
    const success = await sendTestMessage(instanceId, testMessage.phone, testMessage.message);
    if (success) {
      setTestMessage({ phone: '', message: 'Esta é uma mensagem de teste do sistema CRM!' });
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
          
          <Button onClick={() => setIsCreateModalOpen(true)} className="bg-gradient-primary">
            <Plus className="w-4 h-4 mr-2" />
            Nova Instância
          </Button>
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
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeira Instância
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {instances.map((instance) => (
                <WhatsAppInstanceCard
                  key={instance.id}
                  instance={instance}
                  isLoading={isLoading}
                  onConnect={connectInstance}
                  onDisconnect={disconnectInstance}
                  onDelete={(id) => setDeleteConfirm({ show: true, instanceId: id })}
                  onConfigure={setConfigInstance}
                />
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

      {/* Modals */}
      <CreateInstanceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateInstance={createInstance}
        isLoading={isLoading}
      />

      <InstanceConfigModal
        isOpen={!!configInstance}
        onClose={() => setConfigInstance(null)}
        instance={configInstance}
        onUpdateInstance={updateInstance}
      />

      <ConfirmModal
        isOpen={deleteConfirm.show}
        onClose={() => setDeleteConfirm({ show: false, instanceId: '' })}
        onConfirm={handleDeleteInstance}
        title="Deletar Instância"
        description="Tem certeza que deseja deletar esta instância? Esta ação não pode ser desfeita."
        confirmText="Deletar"
        variant="destructive"
      />
    </div>
  );
};
