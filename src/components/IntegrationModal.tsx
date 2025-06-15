
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface Integration {
  name: string;
  status: 'connected' | 'disconnected';
  url: string;
  key: string;
}

interface IntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  integration: Integration | null;
  onSave: (integration: Integration) => void;
}

export const IntegrationModal = ({ isOpen, onClose, integration, onSave }: IntegrationModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    url: integration?.url || '',
    key: integration?.key || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  // Se não há integração, não renderiza o modal
  if (!integration) {
    return null;
  }

  const handleTest = async () => {
    setIsTesting(true);
    try {
      // Simular teste de conexão
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Teste realizado!",
        description: `Conexão com ${integration.name} testada com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro no teste",
        description: `Falha ao conectar com ${integration.name}.`,
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validação básica
      if (!formData.url || !formData.key) {
        toast({
          title: "Erro de validação",
          description: "URL e chave da API são obrigatórias.",
          variant: "destructive",
        });
        return;
      }

      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSave({
        ...integration,
        url: formData.url,
        key: formData.key,
        status: 'connected',
      });
      
      toast({
        title: "Integração configurada!",
        description: `${integration.name} foi configurado com sucesso.`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao configurar a integração.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Configurar {integration.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="url">URL da API</Label>
            <Input
              id="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://api.exemplo.com"
              required
            />
          </div>
          <div>
            <Label htmlFor="key">Chave da API</Label>
            <Input
              id="key"
              type="password"
              value={formData.key}
              onChange={(e) => setFormData({ ...formData, key: e.target.value })}
              placeholder="Digite a chave da API"
              required
            />
          </div>
          <div className="flex justify-between gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleTest}
              disabled={isTesting || !formData.url || !formData.key}
            >
              {isTesting ? 'Testando...' : 'Testar Conexão'}
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
