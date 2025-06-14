
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Filter, Download, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

interface WorkflowLogsProps {
  workflowId?: string;
  onClose: () => void;
}

export const WorkflowLogs = ({ workflowId, onClose }: WorkflowLogsProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [logLevel, setLogLevel] = useState('all');
  const [logs, setLogs] = useState([
    {
      id: 1,
      timestamp: new Date('2024-01-15T10:30:00'),
      level: 'info',
      message: 'Workflow iniciado com sucesso',
      workflowName: 'Onboarding Automático',
      executionId: 'exec_001',
      duration: 1250
    },
    {
      id: 2,
      timestamp: new Date('2024-01-15T10:30:01'),
      level: 'success',
      message: 'Mensagem WhatsApp enviada para +5511999999999',
      workflowName: 'Onboarding Automático',
      executionId: 'exec_001',
      duration: 850
    },
    {
      id: 3,
      timestamp: new Date('2024-01-15T10:29:45'),
      level: 'error',
      message: 'Falha ao conectar com API externa - Timeout após 30s',
      workflowName: 'Suporte Inteligente',
      executionId: 'exec_002',
      duration: 30000
    },
    {
      id: 4,
      timestamp: new Date('2024-01-15T10:29:30'),
      level: 'warning',
      message: 'Taxa de API próxima do limite (90/100)',
      workflowName: 'Follow-up Vendas',
      executionId: 'exec_003',
      duration: 2100
    }
  ]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'success': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'error': return 'Erro';
      case 'warning': return 'Aviso';
      case 'success': return 'Sucesso';
      default: return 'Info';
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.workflowName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = logLevel === 'all' || log.level === logLevel;
    return matchesSearch && matchesLevel;
  });

  const handleExportLogs = () => {
    const csvContent = filteredLogs.map(log => 
      `${format(log.timestamp, 'yyyy-MM-dd HH:mm:ss')},${log.level},${log.workflowName},${log.message},${log.duration}ms`
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `workflow-logs-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  const handleRefresh = () => {
    console.log('Atualizando logs...');
    // Simular atualização
  };

  return (
    <Card className="w-full max-w-6xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Logs de Execução</CardTitle>
          <Button variant="outline" onClick={onClose}>Fechar</Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar nos logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={logLevel} onValueChange={setLogLevel}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="success">Sucesso</SelectItem>
              <SelectItem value="warning">Aviso</SelectItem>
              <SelectItem value="error">Erro</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
          <Button variant="outline" onClick={handleExportLogs}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>

        <ScrollArea className="h-96 border rounded-lg">
          <div className="p-4 space-y-2">
            {filteredLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                <Badge className={`${getLevelColor(log.level)} text-white`}>
                  {getLevelLabel(log.level)}
                </Badge>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{log.workflowName}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(log.timestamp, 'dd/MM/yyyy HH:mm:ss')}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{log.message}</p>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>ID: {log.executionId}</span>
                    <span>Duração: {log.duration}ms</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
