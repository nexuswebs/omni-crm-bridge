
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe } from 'lucide-react';
import { WhatsAppInstance } from '@/hooks/useWhatsAppInstances';

interface InstanceConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  instance: WhatsAppInstance | null;
  onSave: (instance: WhatsAppInstance) => void;
}

export const InstanceConfigModal = ({
  open,
  onOpenChange,
  instance,
  onSave
}: InstanceConfigModalProps) => {
  const [editedInstance, setEditedInstance] = useState<WhatsAppInstance | null>(null);

  useEffect(() => {
    if (instance) {
      setEditedInstance({ ...instance });
    }
  }, [instance]);

  const handleSave = () => {
    if (!editedInstance) return;
    
    onSave(editedInstance);
    onOpenChange(false);
  };

  if (!editedInstance) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Configurações - {editedInstance.name}</DialogTitle>
          <DialogDescription>
            Configure as opções avançadas da instância
          </DialogDescription>
        </DialogHeader>
        
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
                value={editedInstance.name}
                onChange={(e) => setEditedInstance({
                  ...editedInstance,
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
                checked={editedInstance.businessHours?.enabled || false}
                onCheckedChange={(enabled) => setEditedInstance({
                  ...editedInstance,
                  businessHours: {
                    ...editedInstance.businessHours!,
                    enabled
                  }
                })}
              />
            </div>

            {editedInstance.businessHours?.enabled && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Início</Label>
                  <Input
                    type="time"
                    value={editedInstance.businessHours.start}
                    onChange={(e) => setEditedInstance({
                      ...editedInstance,
                      businessHours: {
                        ...editedInstance.businessHours!,
                        start: e.target.value
                      }
                    })}
                  />
                </div>
                <div>
                  <Label>Fim</Label>
                  <Input
                    type="time"
                    value={editedInstance.businessHours.end}
                    onChange={(e) => setEditedInstance({
                      ...editedInstance,
                      businessHours: {
                        ...editedInstance.businessHours!,
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
                checked={editedInstance.autoReply || false}
                onCheckedChange={(autoReply) => setEditedInstance({
                  ...editedInstance,
                  autoReply
                })}
              />
            </div>

            {editedInstance.autoReply && (
              <div>
                <Label>Mensagem de Auto Resposta</Label>
                <Textarea
                  value={editedInstance.autoReplyMessage || ''}
                  onChange={(e) => setEditedInstance({
                    ...editedInstance,
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
                value={editedInstance.webhook || ''}
                onChange={(e) => setEditedInstance({
                  ...editedInstance,
                  webhook: e.target.value
                })}
                placeholder="https://webhook.site/unique-id"
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

        <div className="flex gap-2 pt-4">
          <Button onClick={handleSave} className="flex-1">
            Salvar Configurações
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
