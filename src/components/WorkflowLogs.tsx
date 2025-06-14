
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Download, RefreshCw } from 'lucide-react';

interface WorkflowLogsProps {
  onClose: () => void;
}

export const WorkflowLogs = ({ onClose }: WorkflowLogsProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterWorkflow, setFilterWorkflow] = useState('all');

  const logs = [
    {
      id: 1,
      timestamp: '2024-01-15 10:30:15',
      workflow: 'Onboarding Automático',
      level: 'success',
      message: 'Workflow executado com sucesso para cliente João Silva',
      execution_id: 'exec_123456',
      duration: '2.3s'
    },
    {
      id: 2,
      timestamp: '2024-01-15 10:25:33',
      workflow: 'Suporte Inteligente',
      level: 'info',
      message: 'Nova mensagem processada via IA',
      execution_id: 'exec_123455',
      duration: '1.1s'
    },
    {
      id: 3,
      timestamp: '2024-01-15 10:20:45',
      workflow: 'Follow-up Vendas',
      level: 'warning',
      message: 'Lead não respondeu após 3 tentativas',
      execution_id: 'exec_123454',
      duration: '0.8s'
    },
    {
      id: 4,
      timestamp: '2024-01-15 10:15:22',
      workflow: 'Processamento Pagamentos',
      level: 'error',
      message: 'Falha ao processar pagamento - Gateway indisponível',
      execution_id: 'exec_123453',
      duration: '5.2s'
    },
    {
      id: 5,
      timestamp: '2024-01-15 10:10:18',
      workflow: 'Onboarding Automático',
      level: 'success',
      message: 'Email de boas-vindas enviado para maria@email.com',
      execution_id: 'exec_123452',
      duration: '1.9s'
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'info': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'success': return 'Sucesso';
      case 'error': return 'Erro';
      case 'warning': return 'Aviso';
      case 'info': return 'Info';
      default: return level;
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.workflow.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = filterLevel === 'all' || log.level === filterLevel;
    const matchesWorkflow = filterWorkflow === 'all' || log.workflow === filterWorkflow;
    
    return matchesSearch && matchesLevel && matchesWorkflow;
  });

  return (
    <Card className="w-full max-w-6xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Logs dos Workflows</CardTitle>
            <CardDescription>
              Histórico detalhado de execuções e eventos
            </CardDescription>
          </div>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filtros */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar nos logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filterLevel} onValueChange={setFilterLevel}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="success">Sucesso</SelectItem>
              <SelectItem value="error">Erro</SelectItem>
              <SelectItem value="warning">Aviso</SelectItem>
              <SelectItem value="info">Info</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterWorkflow} onValueChange={setFilterWorkflow}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Workflows</SelectItem>
              <SelectItem value="Onboarding Automático">Onboarding Automático</SelectItem>
              <SelectItem value="Suporte Inteligente">Suporte Inteligente</SelectItem>
              <SelectItem value="Follow-up Vendas">Follow-up Vendas</SelectItem>
              <SelectItem value="Processamento Pagamentos">Processamento Pagamentos</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <RefreshCw className="w-4 h-4" />
          </Button>

          <Button variant="outline" size="icon">
            <Download className="w-4 h-4" />
          </Button>
        </div>

        {/* Lista de Logs */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredLogs.map((log) => (
            <div key={log.id} className="p-4 rounded-lg border border-border bg-background/50">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`w-2 h-2 rounded-full ${getLevelColor(log.level)} mt-2`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{log.workflow}</span>
                      <Badge variant="outline" className="text-xs">
                        {log.execution_id}
                      </Badge>
                      <Badge 
                        variant={log.level === 'success' ? 'default' : log.level === 'error' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {getLevelLabel(log.level)}
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground">{log.message}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>{log.timestamp}</span>
                      <span>Duração: {log.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nenhum log encontrado com os filtros aplicados.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
