
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Save, Play } from 'lucide-react';

interface WorkflowEditorProps {
  onSubmit: (workflowData: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export const WorkflowEditor = ({ onSubmit, onCancel, initialData }: WorkflowEditorProps) => {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [trigger, setTrigger] = useState(initialData?.trigger || '');
  const [conditions, setConditions] = useState(initialData?.conditions || []);
  const [actions, setActions] = useState(initialData?.actions || []);
  const [newCondition, setNewCondition] = useState('');
  const [newAction, setNewAction] = useState('');

  const triggerOptions = [
    'Novo cliente cadastrado',
    'Nova mensagem WhatsApp',
    'Pagamento recebido',
    'Lead inativo por 24h',
    'Ticket criado',
    'Cliente VIP identificado'
  ];

  const actionOptions = [
    'Envio WhatsApp',
    'Email boas-vindas',
    'Criação de ticket',
    'Análise IA',
    'Resposta automática',
    'Escalação',
    'Mensagem personalizada',
    'Oferta especial',
    'Confirmação PIX',
    'Liberação produto',
    'NF automática'
  ];

  const handleAddCondition = () => {
    if (newCondition.trim()) {
      setConditions([...conditions, newCondition.trim()]);
      setNewCondition('');
    }
  };

  const handleRemoveCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const handleAddAction = () => {
    if (newAction.trim()) {
      setActions([...actions, newAction.trim()]);
      setNewAction('');
    }
  };

  const handleRemoveAction = (index: number) => {
    setActions(actions.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      description,
      trigger,
      conditions,
      actions,
      status: 'draft'
    });
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>
          {initialData ? 'Editar Workflow' : 'Criar Novo Workflow'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Workflow</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Onboarding Automático"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="trigger">Trigger</Label>
              <Select value={trigger} onValueChange={setTrigger} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o trigger" />
                </SelectTrigger>
                <SelectContent>
                  {triggerOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o que este workflow faz..."
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <div>
              <Label>Condições</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  placeholder="Ex: Cliente tem email válido"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCondition())}
                />
                <Button type="button" onClick={handleAddCondition}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {conditions.map((condition, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {condition}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-red-500"
                      onClick={() => handleRemoveCondition(index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label>Ações</Label>
              <div className="flex gap-2 mt-2">
                <Select value="" onValueChange={(value) => {
                  setActions([...actions, value]);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma ação" />
                  </SelectTrigger>
                  <SelectContent>
                    {actionOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  value={newAction}
                  onChange={(e) => setNewAction(e.target.value)}
                  placeholder="Ou digite uma ação personalizada"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAction())}
                />
                <Button type="button" onClick={handleAddAction}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {actions.map((action, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {action}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-red-500"
                      onClick={() => handleRemoveAction(index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              <Save className="w-4 h-4 mr-2" />
              {initialData ? 'Atualizar' : 'Criar'} Workflow
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
