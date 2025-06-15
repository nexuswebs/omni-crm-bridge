import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Smartphone, 
  QrCode, 
  MessageCircle, 
  Settings, 
  Plus, 
  Trash2, 
  Power,
  PowerOff,
  Wifi,
  WifiOff,
  RefreshCw,
  Edit,
  Send,
  Globe
} from 'lucide-react';

interface WhatsAppInstance {
  id: string;
  name: string;
  status: 'disconnected' | 'connecting' | 'connected' | 'qr_ready';
  phone?: string;
  qrCode?: string;
  webhook?: string;
  autoReply?: boolean;
  autoReplyMessage?: string;
  businessHours?: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export const WhatsAppManager = () => {
  const { toast } = useToast();
  
  const [instances, setInstances] = useState<WhatsAppInstance[]>([
    {
      id: '1',
      name: 'Instância Principal',
      status: 'disconnected',
      webhook: 'https://seu-crm.com/webhook/whatsapp',
      autoReply: false,
      autoReplyMessage: 'Obrigado pela mensagem! Retornaremos em breve.',
      businessHours: {
        enabled: false,
        start: '09:00',
        end: '18:00'
      }
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [newInstanceName, setNewInstanceName] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [selectedInstance, setSelectedInstance] = useState<WhatsAppInstance | null>(null);
  const [testMessage, setTestMessage] = useState('');
  const [testPhone, setTestPhone] = useState('');

  useEffect(() => {
    // Simular atualização do status da instância a cada 10 segundos
    const intervalId = setInterval(() => {
      setInstances(prevInstances => {
        return prevInstances.map(instance => {
          if (instance.status === 'disconnected') {
            return { ...instance, status: 'disconnected' };
          } else if (instance.status === 'connecting') {
            // Simula a transição para 'qr_ready' ou 'connected'
            const randomStatus = Math.random() > 0.5 ? 'qr_ready' : 'connected';
            return { ...instance, status: randomStatus, phone: '+5511999999999' };
          } else if (instance.status === 'qr_ready') {
            // Permanece em 'qr_ready' até ser conectado
            return instance;
          } else {
            return instance;
          }
        });
      });
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const handleCreateInstance = async () => {
    setIsLoading(true);
    try {
      // Simular a criação de uma nova instância
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newInstance: WhatsAppInstance = {
        id: Date.now().toString(),
        name: newInstanceName,
        status: 'disconnected',
        webhook: 'https://seu-crm.com/webhook/whatsapp',
        autoReply: false,
        autoReplyMessage: 'Obrigado pela mensagem! Retornaremos em breve.',
        businessHours: {
          enabled: false,
          start: '09:00',
          end: '18:00'
        }
      };

      setInstances(prev => [...prev, newInstance]);
      setNewInstanceName('');
      setShowCreateModal(false);

      toast({
        title: "Instância criada!",
        description: "A instância WhatsApp foi criada com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao criar instância",
        description: "Houve um problema ao criar a instância.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteInstance = (instanceId: string) => {
    setInstances(prev => prev.filter(instance => instance.id !== instanceId));
    toast({
      title: "Instância removida!",
      description: "A instância WhatsApp foi removida.",
    });
  };

  const handleConnectInstance = async (instanceId: string) => {
    setIsLoading(true);
    try {
      // Simular a conexão da instância
      await new Promise(resolve => setTimeout(resolve, 2000));

      setInstances(prevInstances => {
        return prevInstances.map(instance => {
          if (instance.id === instanceId) {
            return { ...instance, status: 'connecting' };
          }
          return instance;
        });
      });

      toast({
        title: "Conectando...",
        description: "Aguarde enquanto a instância é conectada.",
      });
    } catch (error) {
      toast({
        title: "Erro ao conectar",
        description: "Houve um problema ao conectar a instância.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnectInstance = async (instanceId: string) => {
    setIsLoading(true);
    try {
      // Simular a desconexão da instância
      await new Promise(resolve => setTimeout(resolve, 1500));

      setInstances(prevInstances => {
        return prevInstances.map(instance => {
          if (instance.id === instanceId) {
            return { ...instance, status: 'disconnected', phone: undefined };
          }
          return instance;
        });
      });

      toast({
        title: "Instância desconectada!",
        description: "A instância WhatsApp foi desconectada.",
      });
    } catch (error) {
      toast({
        title: "Erro ao desconectar",
        description: "Houve um problema ao desconectar a instância.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendTestMessage = async (instanceId: string) => {
    setIsLoading(true);
    try {
      // Simular o envio de mensagem de teste
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Mensagem enviada!",
        description: `Mensagem de teste enviada para ${testPhone}.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao enviar mensagem",
        description: "Houve um problema ao enviar a mensagem de teste.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfigureInstance = (instance: WhatsAppInstance) => {
    setSelectedInstance(instance);
    setConfigModalOpen(true);
  };

  const handleSaveInstanceConfig = () => {
    if (!selectedInstance) return;
    
    setInstances(prev => prev.map(inst => 
      inst.id === selectedInstance.id ? selectedInstance : inst
    ));
    
    setConfigModalOpen(false);
    toast({
      title: "Configurações salvas!",
      description: "As configurações da instância foram atualizadas.",
    });
  };

  const getStatusBadge = (status: WhatsAppInstance['status']) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-500">Conectado</Badge>;
      case 'connecting':
        return <Badge variant="secondary">Conectando...</Badge>;
      case 'qr_ready':
        return <Badge variant="outline">QR Code Pronto</Badge>;
      default:
        return <Badge variant="destructive">Desconectado</Badge>;
    }
  };

  const getStatusIcon = (status: WhatsAppInstance['status']) => {
    switch (status) {
      case 'connected':
        return <Wifi className="w-4 h-4 text-green-500" />;
      case 'connecting':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'qr_ready':
        return <QrCode className="w-4 h-4 text-orange-500" />;
      default:
        return <WifiOff className="w-4 h-4 text-red-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Smartphone className="w-6 h-6" />
            Gerenciador WhatsApp
          </h2>
          <p className="text-muted-foreground">Gerencie suas instâncias WhatsApp</p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Instância
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {instances.map((instance) => (
          <Card key={instance.id} className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(instance.status)}
                  <CardTitle className="text-lg">{instance.name}</CardTitle>
                </div>
                {getStatusBadge(instance.status)}
              </div>
              <CardDescription>
                {instance.phone || 'Aguardando conexão'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* QR Code Display */}
              {(instance.status === 'qr_ready' || instance.status === 'disconnected') && (
                <div className="text-center space-y-2">
                  <div className="bg-white p-4 rounded-lg inline-block border">
                    <QrCode className="w-32 h-32 mx-auto text-gray-400" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Escaneie o QR Code com seu WhatsApp
                  </p>
                </div>
              )}

              {/* Instance Controls */}
              <div className="flex gap-2">
                {instance.status === 'disconnected' ? (
                  <Button 
                    onClick={() => handleConnectInstance(instance.id)}
                    disabled={isLoading}
                    size="sm"
                    className="flex-1"
                  >
                    <Power className="w-4 h-4 mr-2" />
                    {isLoading ? 'Conectando...' : 'Conectar'}
                  </Button>
                ) : (
                  <Button 
                    onClick={() => handleDisconnectInstance(instance.id)}
                    disabled={isLoading}
                    size="sm"
                    variant="outline"
                    className="flex-1"
                  >
                    <PowerOff className="w-4 h-4 mr-2" />
                    Desconectar
                  </Button>
                )}
                
                <Button 
                  onClick={() => handleConfigureInstance(instance)}
                  size="sm"
                  variant="outline"
                >
                  <Settings className="w-4 h-4" />
                </Button>
                
                <Button 
                  onClick={() => handleDeleteInstance(instance.id)}
                  size="sm"
                  variant="outline"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Test Message Section */}
              {instance.status === 'connected' && (
                <div className="space-y-2 pt-2 border-t">
                  <Label className="text-sm font-medium">Teste Rápido</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Número (ex: +5511999999999)"
                      value={testPhone}
                      onChange={(e) => setTestPhone(e.target.value)}
                      className="text-xs"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Mensagem de teste"
                      value={testMessage}
                      onChange={(e) => setTestMessage(e.target.value)}
                      className="text-xs"
                    />
                    <Button 
                      onClick={() => handleSendTestMessage(instance.id)}
                      size="sm"
                      disabled={!testMessage.trim() || !testPhone.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Instance Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Instância WhatsApp</DialogTitle>
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
                placeholder="Ex: Vendas, Suporte, Marketing"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleCreateInstance}
                disabled={!newInstanceName.trim() || isLoading}
                className="flex-1"
              >
                {isLoading ? 'Criando...' : 'Criar Instância'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowCreateModal(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Instance Configuration Modal */}
      <Dialog open={configModalOpen} onOpenChange={setConfigModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Configurações - {selectedInstance?.name}</DialogTitle>
            <DialogDescription>
              Configure as opções avançadas da instância
            </DialogDescription>
          </DialogHeader>
          
          {selectedInstance && (
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Básico</TabsTrigger>
                <TabsTrigger value="autoreply">Auto Resposta</TabsTrigger>
                <TabsTrigger value="webhook">Webhooks</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div>
                  <Label htmlFor="instance-name-edit">Nome da Instância</Label>
                  <Input
                    id="instance-name-edit"
                    value={selectedInstance.name}
                    onChange={(e) => setSelectedInstance({
                      ...selectedInstance,
                      name: e.target.value
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Horário Comercial</Label>
                    <p className="text-sm text-muted-foreground">
                      Responder apenas em horário comercial
                    </p>
                  </div>
                  <Switch
                    checked={selectedInstance.businessHours?.enabled || false}
                    onCheckedChange={(enabled) => setSelectedInstance({
                      ...selectedInstance,
                      businessHours: {
                        ...selectedInstance.businessHours!,
                        enabled
                      }
                    })}
                  />
                </div>

                {selectedInstance.businessHours?.enabled && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Início</Label>
                      <Input
                        type="time"
                        value={selectedInstance.businessHours.start}
                        onChange={(e) => setSelectedInstance({
                          ...selectedInstance,
                          businessHours: {
                            ...selectedInstance.businessHours!,
                            start: e.target.value
                          }
                        })}
                      />
                    </div>
                    <div>
                      <Label>Fim</Label>
                      <Input
                        type="time"
                        value={selectedInstance.businessHours.end}
                        onChange={(e) => setSelectedInstance({
                          ...selectedInstance,
                          businessHours: {
                            ...selectedInstance.businessHours!,
                            end: e.target.value
                          }
                        })}
                      />
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="autoreply" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto Resposta</Label>
                    <p className="text-sm text-muted-foreground">
                      Responder automaticamente a novas mensagens
                    </p>
                  </div>
                  <Switch
                    checked={selectedInstance.autoReply || false}
                    onCheckedChange={(autoReply) => setSelectedInstance({
                      ...selectedInstance,
                      autoReply
                    })}
                  />
                </div>

                {selectedInstance.autoReply && (
                  <div>
                    <Label>Mensagem de Auto Resposta</Label>
                    <Textarea
                      value={selectedInstance.autoReplyMessage || ''}
                      onChange={(e) => setSelectedInstance({
                        ...selectedInstance,
                        autoReplyMessage: e.target.value
                      })}
                      placeholder="Digite a mensagem que será enviada automaticamente..."
                      rows={4}
                    />
                  </div>
                )}
              </TabsContent>

              <TabsContent value="webhook" className="space-y-4">
                <div>
                  <Label htmlFor="webhook-url">URL do Webhook</Label>
                  <Input
                    id="webhook-url"
                    value={selectedInstance.webhook || ''}
                    onChange={(e) => setSelectedInstance({
                      ...selectedInstance,
                      webhook: e.target.value
                    })}
                    placeholder="https://seu-crm.com/webhook/whatsapp"
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Eventos de Webhook
                  </h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• message.receive - Nova mensagem recebida</li>
                    <li>• message.send - Mensagem enviada</li>
                    <li>• instance.connect - Instância conectada</li>
                    <li>• instance.disconnect - Instância desconectada</li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          )}

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSaveInstanceConfig} className="flex-1">
              Salvar Configurações
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setConfigModalOpen(false)}
            >
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
