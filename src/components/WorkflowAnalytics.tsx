
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface WorkflowAnalyticsProps {
  workflow: any;
  onClose: () => void;
}

export const WorkflowAnalytics = ({ workflow, onClose }: WorkflowAnalyticsProps) => {
  const executionData = [
    { date: '01/01', executions: 12, success: 11, failed: 1 },
    { date: '02/01', executions: 15, success: 14, failed: 1 },
    { date: '03/01', executions: 18, success: 17, failed: 1 },
    { date: '04/01', executions: 22, success: 21, failed: 1 },
    { date: '05/01', executions: 25, success: 24, failed: 1 },
    { date: '06/01', executions: 19, success: 18, failed: 1 },
    { date: '07/01', executions: 21, success: 20, failed: 1 }
  ];

  const performanceData = [
    { name: 'Sucesso', value: 94, color: '#10b981' },
    { name: 'Falha', value: 6, color: '#ef4444' }
  ];

  const avgExecutionTime = 1.8;
  const totalExecutions = 132;
  const successRate = 94.7;

  return (
    <Card className="w-full max-w-6xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Análise do Workflow</CardTitle>
            <p className="text-muted-foreground">{workflow.name}</p>
          </div>
          <Button variant="outline" onClick={onClose}>Fechar</Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{totalExecutions}</p>
                <p className="text-sm text-muted-foreground">Total de Execuções</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{successRate}%</p>
                <p className="text-sm text-muted-foreground">Taxa de Sucesso</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{avgExecutionTime}s</p>
                <p className="text-sm text-muted-foreground">Tempo Médio</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <Badge variant={workflow.status === 'running' ? 'default' : 'secondary'}>
                  {workflow.status === 'running' ? 'Ativo' : 'Inativo'}
                </Badge>
                <p className="text-sm text-muted-foreground mt-1">Status Atual</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de Execuções */}
        <Card>
          <CardHeader>
            <CardTitle>Execuções por Dia</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={executionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="executions" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="success" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="failed" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gráfico de Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={performanceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {performanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Informações Detalhadas */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhes do Workflow</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Trigger:</p>
                <p className="text-sm text-muted-foreground">{workflow.trigger}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Condições:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {workflow.conditions.map((condition: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium">Ações:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {workflow.actions.map((action: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {action}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium">Última Execução:</p>
                <p className="text-sm text-muted-foreground">{workflow.lastRun}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};
