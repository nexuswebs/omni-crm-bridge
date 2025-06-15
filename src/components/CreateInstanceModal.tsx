
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CreateInstanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateInstance: (instanceName: string) => Promise<boolean>;
  isLoading: boolean;
}

export const CreateInstanceModal = ({
  open,
  onOpenChange,
  onCreateInstance,
  isLoading
}: CreateInstanceModalProps) => {
  const [instanceName, setInstanceName] = useState('');

  const handleCreate = async () => {
    const success = await onCreateInstance(instanceName);
    if (success) {
      setInstanceName('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Instância WhatsApp</DialogTitle>
          <DialogDescription>
            Crie uma nova instância na Evolution API para conectar um número WhatsApp
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="instance-name">Nome da Instância</Label>
            <Input
              id="instance-name"
              value={instanceName}
              onChange={(e) => setInstanceName(e.target.value)}
              placeholder="Ex: vendas, suporte, marketing"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleCreate}
              disabled={!instanceName.trim() || isLoading}
              className="flex-1"
            >
              {isLoading ? 'Criando...' : 'Criar Instância'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
