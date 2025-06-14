
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface WorkflowAnalyticsProps {
  workflow: any;
  onClose: () => void;
}

export const WorkflowAnalytics = ({ workflow, onClose }: WorkflowAnalyticsProps) => {
  const executionData = [
    { date: '01/01', execucoes: 45, sucessos: 43, falhas: 2 },
    { date: '02/01', execucoes: 52, sucessos: 48, falhas: 4 },
    { date: '03/01', execucoes: 38, sucessos: 36, falhas: 2 },
    { date: '04/01', execucoes: 61, sucessos: 58, falhas: 3 },
    { date: '05/01', execucoes: 47, sucessos: 45, falhas: 2 },
    { date: '06/01', execucoes: 55, sucessos: 52, falhas: 3 },
    { date: '07/01', execucoes: 49, sucessos: 47, falhas: 2 }
  ];

  const performanceData = [
    { hora: '00h', tempo: 1.2 },
    { hora: '04h', tempo: 0.9 },
    { hora: '08h', tempo: 2.1 },
    { hora: '12h', tempo: 1.8 },
    { hora: '16h', tempo: 2.4 },
    { hora: '20h', tempo: 1.6 }
  ];

  const statusData = [
    { name: 'Sucesso', value: 294, color: '#10b981' },
    { name: 'Falha', value: 18, color: '#ef4444' },
    { name: 'Timeout', value: 8, color: '#f59e0b' },
    { name: 'Cancelado', value: 3, color: '#6b7280' }
  ];

  return (
    <Card className="w-full max-w-6xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Análise: {workflow.name}
            <Badge variant={workflow.status === 'running' ? 'default' : 'secondary'}>
              {workflow.status === 'running' ? 'Ativo' : 'Pausado'}
            </Badge>
          </CardTitle>
          <Button variant="outline" onClick={onClose}>Fechar</Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Métricas Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Execuções</p>
                  <p className="text-2xl font-bold">323</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
              <p className="text-xs text-green-600 mt-1">+12% vs semana anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Taxa Sucesso</p>
                  <p className="text-2xl font-bold text-green-600">91.0%</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <p className="text-xs text-green-600 mt-1">+2.3% vs semana anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tempo Médio</p>
                  <p className="text-2xl font-bold">1.7s</p>
                </div>
                <Clock className="w-8 h-8 text-blue-500" />
              </div>
              <p className="text-xs text-red-600 mt-1">+0.2s vs semana anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Falhas</p>
                  <p className="text-2xl font-bold text-red-600">29</p>
                </div>
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-xs text-red-600 mt-1">+3 vs semana anterior</p>
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
              <BarChart data={executionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sucessos" fill="#10b981" name="Sucessos" />
                <Bar dataKey="falhas" fill="#ef4444" name="Falhas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráficos de Performance e Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance por Horário</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hora" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="tempo" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 mt-4">
                {statusData.map((status, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: status.color }}
                    />
                    <span className="text-sm">{status.name}: {status.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alertas e Recomendações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              Alertas e Recomendações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800">Tempo de execução aumentando</p>
                  <p className="text-sm text-yellow-700">O tempo médio de execução aumentou 15% esta semana. Considere otimizar as ações mais lentas.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800">Pico de uso às 16h</p>
                  <p className="text-sm text-blue-700">Maior volume de execuções entre 16h-17h. Configure limites de rate para evitar sobrecarga.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};
