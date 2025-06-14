import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Search, Plus, Play, Pause, Edit, Trash2, BarChart3, FileText, Zap, Download } from 'lucide-react';
import { WorkflowEditor } from '@/components/WorkflowEditor';
import { WorkflowLogs } from '@/components/WorkflowLogs';
import { WorkflowAnalytics } from '@/components/WorkflowAnalytics';
import { N8nConnection } from '@/components/N8nConnection';
import { WorkflowTemplates } from '@/components/WorkflowTemplates';
import { useToast } from '@/hooks/use-toast';

const Workflows = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showConnection, setShowConnection] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);

  const [workflows, setWorkflows] = useState([
    {
      id: 1,
      name: 'Onboarding Automático',
      description: 'Processo completo de boas-vindas para novos clientes',
      status: 'running',
      executions: 156,
      successRate: 98.5,
      lastRun: '2 min atrás',
      trigger: 'Novo cliente cadastrado',
      actions: ['Envio WhatsApp', 'Email boas-vindas', 'Criação de ticket'],
      conditions: ['Cliente tem email válido', 'Cliente não é VIP'],
      n8nId: 'wf_001'
    },
    {
      id: 2,
      name: 'Suporte Inteligente',
      description: 'IA que responde dúvidas comuns automaticamente',
      status: 'running',
      executions: 89,
      successRate: 94.2,
      lastRun: '5 min atrás',
      trigger: 'Nova mensagem WhatsApp',
      actions: ['Análise IA', 'Resposta automática', 'Escalação se necessário'],
      conditions: ['Pergunta não respondida no FAQ', 'Sentimento negativo'],
      n8nId: 'wf_002'
    },
    {
      id: 3,
      name: 'Follow-up Vendas',
      description: 'Acompanhamento automático de prospects',
      status: 'paused',
      executions: 234,
      successRate: 91.8,
      lastRun: '1 hora atrás',
      trigger: 'Lead inativo por 24h',
      actions: ['Mensagem personalizada', 'Oferta especial', 'Reagendamento'],
      conditions: ['Lead não respondeu', 'Lead não comprou'],
      n8nId: 'wf_003'
    },
    {
      id: 4,
      name: 'Processamento Pagamentos',
      description: 'Automação completa para pagamentos PIX e cartão',
      status: 'running',
      executions: 67,
      successRate: 99.1,
      lastRun: '10 min atrás',
      trigger: 'Pagamento recebido',
      actions: ['Confirmação PIX', 'Liberação produto', 'NF automática'],
      conditions: ['Pagamento aprovado', 'Estoque disponível'],
      n8nId: 'wf_004'
    }
  ]);

  const handleCreateWorkflow = (workflowData: any) => {
    const newWorkflow = {
      id: Date.now(),
      ...workflowData,
      executions: 0,
      successRate: 0,
      lastRun: 'Nunca',
      n8nId: `wf_${Math.random().toString(36).substr(2, 9)}`
    };
    setWorkflows([...workflows, newWorkflow]);
    setShowEditor(false);
    
    toast({
      title: "Workflow criado!",
      description: `${workflowData.name} foi criado com sucesso.`,
    });
  };

  const handleUpdateWorkflow = (workflowData: any) => {
    setWorkflows(workflows.map(workflow => 
      workflow.id === editingWorkflow?.id 
        ? { ...workflow, ...workflowData }
        : workflow
    ));
    setEditingWorkflow(null);
    
    toast({
      title: "Workflow atualizado!",
      description: "As alterações foram salvas com sucesso.",
    });
  };

  const handleToggleWorkflow = (id: number) => {
    const workflow = workflows.find(w => w.id === id);
    const newStatus = workflow?.status === 'running' ? 'paused' : 'running';
    
    setWorkflows(workflows.map(workflow => 
      workflow.id === id 
        ? { ...workflow, status: newStatus }
        : workflow
    ));
    
    toast({
      title: newStatus === 'running' ? "Workflow ativado" : "Workflow pausado",
      description: `${workflow?.name} foi ${newStatus === 'running' ? 'ativado' : 'pausado'}.`,
    });
  };

  const handleDeleteWorkflow = (id: number) => {
    const workflow = workflows.find(w => w.id === id);
    setWorkflows(workflows.filter(workflow => workflow.id !== id));
    
    toast({
      title: "Workflow removido",
      description: `${workflow?.name} foi removido com sucesso.`,
    });
  };

  const handleExecuteWorkflow = (workflow: any) => {
    toast({
      title: "Executando workflow...",
      description: `${workflow.name} está sendo executado manualmente.`,
    });
    
    // Simular execução
    setTimeout(() => {
      setWorkflows(workflows.map(w => 
        w.id === workflow.id 
          ? { ...w, executions: w.executions + 1, lastRun: 'Agora' }
          : w
      ));
      
      toast({
        title: "Execução concluída!",
        description: `${workflow.name} foi executado com sucesso.`,
      });
    }, 2000);
  };

  const handleUseTemplate = (templateData: any) => {
    handleCreateWorkflow(templateData);
  };

  const handleShowAnalytics = (workflow: any) => {
    setSelectedWorkflow(workflow);
    setShowAnalytics(true);
  };

  const handleExportWorkflow = (workflow: any) => {
    const exportData = {
      name: workflow.name,
      description: workflow.description,
      trigger: workflow.trigger,
      actions: workflow.actions,
      conditions: workflow.conditions
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${workflow.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    link.click();
    
    toast({
      title: "Workflow exportado!",
      description: `${workflow.name} foi exportado como JSON.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'running': return 'Rodando';
      case 'paused': return 'Pausado';
      case 'error': return 'Erro';
      default: return 'Inativo';
    }
  };

  const filteredWorkflows = workflows.filter(workflow =>
    workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workflow.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Workflows n8n</h1>
          <p className="text-muted-foreground">Gerencie suas automações inteligentes</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Templates
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <WorkflowTemplates
                onUseTemplate={handleUseTemplate}
                onClose={() => setShowTemplates(false)}
              />
            </DialogContent>
          </Dialog>
          
          <Dialog open={showEditor} onOpenChange={setShowEditor}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary text-white">
                <Plus className="w-4 h-4 mr-2" />
                Criar Workflow
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <WorkflowEditor
                onSubmit={handleCreateWorkflow}
                onCancel={() => setShowEditor(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Actions */}
      <Card className="border-0 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar workflows..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Dialog open={showConnection} onOpenChange={setShowConnection}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Zap className="w-4 h-4 mr-2" />
                  Conectar n8n
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <N8nConnection onClose={() => setShowConnection(false)} />
              </DialogContent>
            </Dialog>
            
            <Dialog open={showLogs} onOpenChange={setShowLogs}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Logs
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <WorkflowLogs onClose={() => setShowLogs(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">4</p>
                <p className="text-sm text-muted-foreground">Workflows Ativos</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Play className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">546</p>
                <p className="text-sm text-muted-foreground">Execuções Hoje</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <span className="text-xl">⚡</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">95.9%</p>
                <p className="text-sm text-muted-foreground">Taxa de Sucesso</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <span className="text-xl">✓</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">2.3s</p>
                <p className="text-sm text-muted-foreground">Tempo Médio</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <span className="text-xl">⏱️</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Workflow List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredWorkflows.map((workflow) => (
          <Card key={workflow.id} className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(workflow.status)}`} />
                    {workflow.name}
                  </CardTitle>
                  <CardDescription>{workflow.description}</CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleWorkflow(workflow.id)}
                    title={workflow.status === 'running' ? 'Pausar' : 'Ativar'}
                  >
                    {workflow.status === 'running' ? 
                      <Pause className="w-4 h-4" /> : 
                      <Play className="w-4 h-4" />
                    }
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleExecuteWorkflow(workflow)}
                    title="Executar agora"
                  >
                    <Zap className="w-4 h-4" />
                  </Button>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setEditingWorkflow(workflow)}
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                      <WorkflowEditor
                        onSubmit={handleUpdateWorkflow}
                        onCancel={() => setEditingWorkflow(null)}
                        initialData={editingWorkflow}
                      />
                    </DialogContent>
                  </Dialog>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleShowAnalytics(workflow)}
                    title="Análises"
                  >
                    <BarChart3 className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleExportWorkflow(workflow)}
                    title="Exportar"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteWorkflow(workflow.id)}
                    className="text-destructive hover:bg-destructive/10"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant={workflow.status === 'running' ? 'default' : 'secondary'}>
                    {getStatusLabel(workflow.status)}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Execuções:</span>
                    <span className="ml-2 font-medium">{workflow.executions}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Taxa de Sucesso:</span>
                    <span className="ml-2 font-medium text-green-600">{workflow.successRate}%</span>
                  </div>
                </div>

                <div className="text-sm">
                  <span className="text-muted-foreground">Trigger:</span>
                  <p className="mt-1 p-2 bg-muted/50 rounded text-xs">{workflow.trigger}</p>
                </div>

                <div className="text-sm">
                  <span className="text-muted-foreground">Condições:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {workflow.conditions.map((condition, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="text-sm">
                  <span className="text-muted-foreground">Ações:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {workflow.actions.map((action, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {action}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                  <span>ID n8n: {workflow.n8nId}</span>
                  <span>Última execução: {workflow.lastRun}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics Dialog */}
      <Dialog open={showAnalytics} onOpenChange={setShowAnalytics}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          {selectedWorkflow && (
            <WorkflowAnalytics
              workflow={selectedWorkflow}
              onClose={() => {
                setShowAnalytics(false);
                setSelectedWorkflow(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Workflows;
