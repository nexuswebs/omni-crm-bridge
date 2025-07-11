
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WorkflowEditorProps {
  onSubmit: (workflow: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export const WorkflowEditor = ({ onSubmit, onCancel, initialData }: WorkflowEditorProps) => {
  const { toast } = useToast();
  
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

  const availableActions = [
    'Envio WhatsApp',
    'Envio Email',
    'Criar Ticket',
    'Atualizar Cliente',
    'Envio SMS',
    'Webhook Externo',
    'Aguardar Resposta',
    'Criar Tarefa'
  ];

  const availableConditions = [
    'Cliente tem email válido',
    'Cliente é novo',
    'Horário comercial',
    'Cliente VIP',
    'Primeiro contato',
    'Ticket em aberto',
    'Pagamento em atraso'
  ];

  const handleAddAction = () => {
    if (newAction && !formData.actions.includes(newAction)) {
      setFormData({ ...formData, actions: [...formData.actions, newAction] });
      setNewAction('');
      console.log('Ação adicionada:', newAction);
    }
  };

  const handleRemoveAction = (action: string) => {
    setFormData({ ...formData, actions: formData.actions.filter(a => a !== action) });
    console.log('Ação removida:', action);
  };

  const handleAddCondition = () => {
    if (newCondition && !formData.conditions.includes(newCondition)) {
      setFormData({ ...formData, conditions: [...formData.conditions, newCondition] });
      setNewCondition('');
      console.log('Condição adicionada:', newCondition);
    }
  };

  const handleRemoveCondition = (condition: string) => {
    setFormData({ ...formData, conditions: formData.conditions.filter(c => c !== condition) });
    console.log('Condição removida:', condition);
  };

  const handleQuickAddAction = (action: string) => {
    if (!formData.actions.includes(action)) {
      setFormData({ ...formData, actions: [...formData.actions, action] });
      console.log('Ação rápida adicionada:', action);
    }
  };

  const handleQuickAddCondition = (condition: string) => {
    if (!formData.conditions.includes(condition)) {
      setFormData({ ...formData, conditions: [...formData.conditions, condition] });
      console.log('Condição rápida adicionada:', condition);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, informe o nome do workflow.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.trigger) {
      toast({
        title: "Trigger obrigatório",
        description: "Por favor, selecione um trigger para o workflow.",
        variant: "destructive",
      });
      return;
    }

    console.log('Salvando workflow:', formData);
    
    onSubmit(formData);
    
    toast({
      title: initialData ? "Workflow atualizado!" : "Workflow criado!",
      description: `Workflow "${formData.name}" foi ${initialData ? 'atualizado' : 'criado'} com sucesso.`,
    });
  };

  const handleCancel = () => {
    console.log('Cancelando edição do workflow');
    onCancel();
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>{initialData ? 'Editar Workflow' : 'Criar Novo Workflow'}</CardTitle>
        <CardDescription>
          Configure triggers, condições e ações para automação
        </CardDescription>
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
                placeholder="Ex: Onboarding Automático"
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
                  <SelectItem value="error">Com Erro</SelectItem>
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
              placeholder="Descreva o que este workflow faz..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="trigger">Trigger (Gatilho) *</Label>
            <Select value={formData.trigger} onValueChange={(value) => setFormData({ ...formData, trigger: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um trigger" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Novo cliente cadastrado">Novo cliente cadastrado</SelectItem>
                <SelectItem value="Nova mensagem WhatsApp">Nova mensagem WhatsApp</SelectItem>
                <SelectItem value="Lead inativo por 24h">Lead inativo por 24h</SelectItem>
                <SelectItem value="Pagamento recebido">Pagamento recebido</SelectItem>
                <SelectItem value="Ticket criado">Ticket criado</SelectItem>
                <SelectItem value="Email recebido">Email recebido</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Condições</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                placeholder="Digite uma condição personalizada"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCondition())}
              />
              <Button type="button" onClick={handleAddCondition}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="mb-2">
              <Label className="text-sm text-muted-foreground">Condições sugeridas:</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {availableConditions.map((condition) => (
                  <Button
                    key={condition}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAddCondition(condition)}
                    disabled={formData.conditions.includes(condition)}
                    className="text-xs"
                  >
                    + {condition}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {formData.conditions.map((condition, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1">
                  {condition}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => handleRemoveCondition(condition)} />
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label>Ações</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newAction}
                onChange={(e) => setNewAction(e.target.value)}
                placeholder="Digite uma ação personalizada"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAction())}
              />
              <Button type="button" onClick={handleAddAction}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="mb-2">
              <Label className="text-sm text-muted-foreground">Ações sugeridas:</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {availableActions.map((action) => (
                  <Button
                    key={action}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAddAction(action)}
                    disabled={formData.actions.includes(action)}
                    className="text-xs"
                  >
                    + {action}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {formData.actions.map((action, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {action}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => handleRemoveAction(action)} />
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={handleCancel}>
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
