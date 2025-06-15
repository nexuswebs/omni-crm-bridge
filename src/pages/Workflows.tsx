import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
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

interface Workflow {
  id: string;
  name: string;
  description: string | null;
  status: string;
  trigger_type: string | null;
  trigger_config: any;
  actions: any;
  created_at: string;
  updated_at: string;
}

const Workflows = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showConnection, setShowConnection] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<Workflow | null>(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkflows = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar workflows:', error);
        toast({
          title: "Erro ao carregar workflows",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      console.log('Workflows carregados:', data);
      setWorkflows(data || []);
    } catch (error) {
      console.error('Erro ao buscar workflows:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchWorkflows();
    }
  }, [user]);

  const handleCreateWorkflow = async (workflowData: any) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('workflows')
        .insert([{
          user_id: user.id,
          name: workflowData.name,
          description: workflowData.description,
          trigger_type: workflowData.trigger === 'Novo cliente cadastrado' ? 'webhook' : 'manual',
          trigger_config: { trigger: workflowData.trigger },
          actions: workflowData.actions,
          status: workflowData.status === 'running' ? 'active' : 'inactive'
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar workflow:', error);
        toast({
          title: "Erro ao criar workflow",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      console.log('Workflow criado:', data);
      setWorkflows([data, ...workflows]);
      setShowEditor(false);
      
      toast({
        title: "Workflow criado!",
        description: `${workflowData.name} foi criado com sucesso.`,
      });
    } catch (error) {
      console.error('Erro ao criar workflow:', error);
    }
  };

  const handleUpdateWorkflow = async (workflowData: any) => {
    if (!editingWorkflow || !user) return;

    try {
      const { data, error } = await supabase
        .from('workflows')
        .update({
          name: workflowData.name,
          description: workflowData.description,
          trigger_type: workflowData.trigger === 'Novo cliente cadastrado' ? 'webhook' : 'manual',
          trigger_config: { trigger: workflowData.trigger },
          actions: workflowData.actions,
          status: workflowData.status === 'running' ? 'active' : 'inactive',
          updated_at: new Date().toISOString()
        })
        .eq('id', editingWorkflow.id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar workflow:', error);
        toast({
          title: "Erro ao atualizar workflow",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      console.log('Workflow atualizado:', data);
      setWorkflows(workflows.map(w => w.id === editingWorkflow.id ? data : w));
      setEditingWorkflow(null);
      setShowEditor(false);
      
      toast({
        title: "Workflow atualizado!",
        description: "As alterações foram salvas com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao atualizar workflow:', error);
    }
  };

  const handleToggleWorkflow = async (id: string) => {
    const workflow = workflows.find(w => w.id === id);
    if (!workflow) return;
    
    const newStatus = workflow.status === 'active' ? 'inactive' : 'active';
    
    try {
      const { error } = await supabase
        .from('workflows')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) {
        console.error('Erro ao alterar status:', error);
        toast({
          title: "Erro ao alterar status",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setWorkflows(workflows.map(w => 
        w.id === id ? { ...w, status: newStatus } : w
      ));
      
      toast({
        title: newStatus === 'active' ? "Workflow ativado" : "Workflow pausado",
        description: `${workflow.name} foi ${newStatus === 'active' ? 'ativado' : 'pausado'}.`,
      });
    } catch (error) {
      console.error('Erro ao alterar status:', error);
    }
  };

  const handleDeleteWorkflow = async (id: string) => {
    const workflow = workflows.find(w => w.id === id);
    if (!workflow) return;
    
    try {
      const { error } = await supabase
        .from('workflows')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar workflow:', error);
        toast({
          title: "Erro ao deletar workflow",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setWorkflows(workflows.filter(w => w.id !== id));
      
      toast({
        title: "Workflow removido",
        description: `${workflow.name} foi removido com sucesso.`,
      });
    } catch (error) {
      console.error('Erro ao deletar workflow:', error);
    }
  };

  const handleExecuteWorkflow = (workflow: any) => {
    toast({
      title: "Executando workflow...",
      description: `${workflow.name} está sendo executado manualmente.`,
    });
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
      trigger: workflow.trigger_config?.trigger || 'Manual',
      actions: workflow.actions || [],
      conditions: []
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
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';  
      default: return 'Desconhecido';
    }
  };

  const filteredWorkflows = workflows.filter(workflow =>
    workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (workflow.description && workflow.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Workflows</h1>
            <p className="text-muted-foreground">Carregando suas automações...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Workflows</h1>
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
              <Button 
                className="bg-gradient-primary text-white"
                data-create-workflow
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Workflow
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <WorkflowEditor
                onSubmit={editingWorkflow ? handleUpdateWorkflow : handleCreateWorkflow}
                onCancel={() => {
                  setShowEditor(false);
                  setEditingWorkflow(null);
                }}
                initialData={editingWorkflow}
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
                <p className="text-2xl font-bold text-green-600">{workflows.filter(w => w.status === 'active').length}</p>
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
                <p className="text-2xl font-bold">{workflows.length}</p>
                <p className="text-sm text-muted-foreground">Total de Workflows</p>
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
                <p className="text-2xl font-bold text-green-600">100%</p>
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
                <p className="text-2xl font-bold">-</p>
                <p className="text-sm text-muted-foreground">Tempo Médio</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <span className="text-xl">⏱️</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workflow List */}
      {workflows.length === 0 ? (
        <Card className="border-0 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-lg bg-muted mx-auto mb-4 flex items-center justify-center">
              <Zap className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Nenhum workflow criado</h3>
            <p className="text-muted-foreground mb-4">
              Crie seu primeiro workflow para automatizar processos
            </p>
            <Button onClick={() => setShowEditor(true)} className="bg-gradient-primary text-white">
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeiro Workflow
            </Button>
          </CardContent>
        </Card>
      ) : (
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
                      title={workflow.status === 'active' ? 'Pausar' : 'Ativar'}
                    >
                      {workflow.status === 'active' ? 
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
                    
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setEditingWorkflow(workflow);
                        setShowEditor(true);
                      }}
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    
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
                    <Badge variant={workflow.status === 'active' ? 'default' : 'secondary'}>
                      {getStatusLabel(workflow.status)}
                    </Badge>
                  </div>

                  <div className="text-sm">
                    <span className="text-muted-foreground">Trigger:</span>
                    <p className="mt-1 p-2 bg-muted/50 rounded text-xs">
                      {workflow.trigger_config?.trigger || workflow.trigger_type || 'Manual'}
                    </p>
                  </div>

                  <div className="text-sm">
                    <span className="text-muted-foreground">Ações:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(workflow.actions || []).map((action: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {action}
                        </Badge>
                      ))}
                      {(!workflow.actions || workflow.actions.length === 0) && (
                        <span className="text-xs text-muted-foreground">Nenhuma ação configurada</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                    <span>Criado: {new Date(workflow.created_at).toLocaleDateString('pt-BR')}</span>
                    <span>Atualizado: {new Date(workflow.updated_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

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
