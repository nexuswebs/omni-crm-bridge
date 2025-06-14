
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Settings } from 'lucide-react';

interface WorkflowEditorProps {
  onSubmit: (workflow: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export const WorkflowEditor = ({ onSubmit, onCancel, initialData }: WorkflowEditorProps) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    trigger: initialData?.trigger || '',
    status: initialData?.status || 'paused',
    actions: initialData?.actions || [],
    conditions: initialData?.conditions || []
  });

  const [newAction, setNewAction] = useState('');
  const [newCondition, setNewCondition] = useState('');

  const handleAddAction = () => {
    if (newAction) {
      setFormData({ ...formData, actions: [...formData.actions, newAction] });
      setNewAction('');
    }
  };

  const handleRemoveAction = (index: number) => {
    setFormData({ ...formData, actions: formData.actions.filter((_, i) => i !== index) });
  };

  const handleAddCondition = () => {
    if (newCondition) {
      setFormData({ ...formData, conditions: [...formData.conditions, newCondition] });
      setNewCondition('');
    }
  };

  const handleRemoveCondition = (index: number) => {
    setFormData({ ...formData, conditions: formData.conditions.filter((_, i) => i !== index) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          {initialData ? 'Editar Workflow' : 'Novo Workflow'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome do Workflow *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="running">Rodando</SelectItem>
                  <SelectItem value="paused">Pausado</SelectItem>
                  <SelectItem value="error">Erro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="trigger">Trigger (Gatilho)</Label>
            <Select value={formData.trigger} onValueChange={(value) => setFormData({ ...formData, trigger: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um gatilho" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Novo cliente cadastrado">Novo cliente cadastrado</SelectItem>
                <SelectItem value="Nova mensagem WhatsApp">Nova mensagem WhatsApp</SelectItem>
                <SelectItem value="Lead inativo por 24h">Lead inativo por 24h</SelectItem>
                <SelectItem value="Pagamento recebido">Pagamento recebido</SelectItem>
                <SelectItem value="Horário específico">Horário específico</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Condições</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                placeholder="Nova condição"
              />
              <Button type="button" onClick={handleAddCondition}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-1">
              {formData.conditions.map((condition, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                  <span className="flex-1 text-sm">{condition}</span>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveCondition(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Ações</Label>
            <div className="flex gap-2 mb-2">
              <Select value={newAction} onValueChange={setNewAction}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Selecione uma ação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Envio WhatsApp">Envio WhatsApp</SelectItem>
                  <SelectItem value="Email boas-vindas">Email boas-vindas</SelectItem>
                  <SelectItem value="Criação de ticket">Criação de ticket</SelectItem>
                  <SelectItem value="Análise IA">Análise IA</SelectItem>
                  <SelectItem value="Resposta automática">Resposta automática</SelectItem>
                  <SelectItem value="Confirmação PIX">Confirmação PIX</SelectItem>
                  <SelectItem value="Liberação produto">Liberação produto</SelectItem>
                  <SelectItem value="NF automática">NF automática</SelectItem>
                </SelectContent>
              </Select>
              <Button type="button" onClick={handleAddAction}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-1">
              {formData.actions.map((action, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                  <span className="flex-1 text-sm">{action}</span>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveAction(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-primary text-white">
              {initialData ? 'Atualizar' : 'Criar'} Workflow
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
