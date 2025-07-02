
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { WhatsAppInstance } from '@/hooks/useWhatsAppInstances';

interface CreateInstanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateInstance: (instanceName: string) => Promise<boolean>;
  isLoading: boolean;
}

export const CreateInstanceModal = ({
  isOpen,
  onClose,
  onCreateInstance,
  isLoading
}: CreateInstanceModalProps) => {
  const { toast } = useToast();
  const [instanceName, setInstanceName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!instanceName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Digite um nome para a instância.",
        variant: "destructive",
      });
      return;
    }

    const success = await onCreateInstance(instanceName);
    if (success) {
      setInstanceName('');
      onClose();
    }
  };

  const handleClose = () => {
    setInstanceName('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Nova Instância WhatsApp</DialogTitle>
          <DialogDescription>
            Crie uma nova instância para conectar um número WhatsApp
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="instance-name">Nome da Instância</Label>
            <Input
              id="instance-name"
              value={instanceName}
              onChange={(e) => setInstanceName(e.target.value)}
              placeholder="ex: atendimento-01"
              disabled={isLoading}
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              type="submit" 
              disabled={isLoading || !instanceName.trim()} 
              className="flex-1"
            >
              {isLoading ? 'Criando...' : 'Criar Instância'}
            </Button>
            <Button 
              type="button"
              variant="outline" 
              onClick={handleClose} 
              className="flex-1"
              disabled={isLoading}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
