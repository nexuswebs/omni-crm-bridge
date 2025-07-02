
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { WhatsAppInstance } from '@/hooks/useWhatsAppInstances';
import { Settings, Clock, MessageSquare } from 'lucide-react';

interface InstanceConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  instance: WhatsAppInstance | null;
  onUpdateInstance: (instance: WhatsAppInstance) => void;
}

export const InstanceConfigModal = ({
  isOpen,
  onClose,
  instance,
  onUpdateInstance
}: InstanceConfigModalProps) => {
  const { toast } = useToast();
  const [config, setConfig] = useState({
    autoReply: instance?.autoReply || false,
    autoReplyMessage: instance?.autoReplyMessage || 'Obrigado pela mensagem! Retornaremos em breve.',
    businessHours: {
      enabled: instance?.businessHours?.enabled || false,
      start: instance?.businessHours?.start || '09:00',
      end: instance?.businessHours?.end || '18:00'
    }
  });

  const handleSave = () => {
    if (!instance) return;

    const updatedInstance: WhatsAppInstance = {
      ...instance,
      autoReply: config.autoReply,
      autoReplyMessage: config.autoReplyMessage,
      businessHours: config.businessHours
    };

    onUpdateInstance(updatedInstance);
    onClose();
  };

  if (!instance) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configurar {instance.name}
          </DialogTitle>
          <DialogDescription>
            Configure as opções de automação desta instância
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Auto Reply */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                <Label>Resposta Automática</Label>
              </div>
              <Switch
                checked={config.autoReply}
                onCheckedChange={(checked) => setConfig({ ...config, autoReply: checked })}
              />
            </div>
            
            {config.autoReply && (
              <div>
                <Label htmlFor="auto-reply-message">Mensagem de Resposta</Label>
                <Textarea
                  id="auto-reply-message"
                  value={config.autoReplyMessage}
                  onChange={(e) => setConfig({ ...config, autoReplyMessage: e.target.value })}
                  placeholder="Digite a mensagem automática..."
                  rows={3}
                />
              </div>
            )}
          </div>

          {/* Business Hours */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <Label>Horário Comercial</Label>
              </div>
              <Switch
                checked={config.businessHours.enabled}
                onCheckedChange={(checked) => 
                  setConfig({ 
                    ...config, 
                    businessHours: { ...config.businessHours, enabled: checked }
                  })
                }
              />
            </div>
            
            {config.businessHours.enabled && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="start-time">Início</Label>
                  <Input
                    id="start-time"
                    type="time"
                    value={config.businessHours.start}
                    onChange={(e) => 
                      setConfig({
                        ...config,
                        businessHours: { ...config.businessHours, start: e.target.value }
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="end-time">Fim</Label>
                  <Input
                    id="end-time"
                    type="time"
                    value={config.businessHours.end}
                    onChange={(e) => 
                      setConfig({
                        ...config,
                        businessHours: { ...config.businessHours, end: e.target.value }
                      })
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button onClick={handleSave} className="flex-1">
            Salvar Configurações
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
