
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react';

interface WorkflowAnalyticsProps {
  workflow: any;
  onClose: () => void;
}

export const WorkflowAnalytics = ({ workflow, onClose }: WorkflowAnalyticsProps) => {
  const analyticsData = {
    totalExecutions: workflow.executions,
    successfulExecutions: Math.floor(workflow.executions * (workflow.successRate / 100)),
    failedExecutions: workflow.executions - Math.floor(workflow.executions * (workflow.successRate / 100)),
    averageDuration: '2.3s',
    peakHours: ['09:00-10:00', '14:00-15:00', '19:00-20:00'],
    commonErrors: [
      { error: 'Timeout na API', count: 3 },
      { error: 'Cliente não encontrado', count: 2 },
      { error: 'Falha no webhook', count: 1 }
    ],
    weeklyData: [
      { day: 'Segunda', executions: 45, success: 43 },
      { day: 'Terça', executions: 52, success: 50 },
      { day: 'Quarta', executions: 38, success: 36 },
      { day: 'Quinta', executions: 41, success: 39 },
      { day: 'Sexta', executions: 49, success: 47 },
      { day: 'Sábado', executions: 23, success: 22 },
      { day: 'Domingo', executions: 18, success: 17 }
    ]
  };

  return (
    <Card className="w-full max-w-6xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Analytics - {workflow.name}
            </CardTitle>
            <CardDescription>
              Análise detalhada de performance e execuções
            </CardDescription>
          </div>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-0 bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total de Execuções</p>
                  <p className="text-2xl font-bold">{analyticsData.totalExecutions}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Taxa de Sucesso</p>
                  <p className="text-2xl font-bold text-green-600">{workflow.successRate}%</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Execuções Falharam</p>
                  <p className="text-2xl font-bold text-red-600">{analyticsData.failedExecutions}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tempo Médio</p>
                  <p className="text-2xl font-bold">{analyticsData.averageDuration}</p>
                </div>
                <Clock className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico Semanal */}
        <Card className="border-0 bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Execuções por Dia da Semana</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.weeklyData.map((day, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-20 text-sm font-medium">{day.day}</div>
                  <div className="flex-1 bg-muted rounded-full h-6 relative">
                    <div 
                      className="bg-blue-500 h-full rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${(day.executions / 60) * 100}%` }}
                    >
                      <span className="text-xs text-white font-medium">{day.executions}</span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {day.success} sucessos
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Horários de Pico e Erros Comuns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-0 bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Horários de Pico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analyticsData.peakHours.map((hour, index) => (
                  <Badge key={index} variant="secondary" className="mr-2">
                    {hour}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg">Erros Mais Comuns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analyticsData.commonErrors.map((error, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{error.error}</span>
                    <Badge variant="destructive">{error.count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Configuração do Workflow */}
        <Card className="border-0 bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Configuração Atual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Trigger:</p>
                <Badge variant="outline">{workflow.trigger}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status:</p>
                <Badge variant={workflow.status === 'running' ? 'default' : 'secondary'}>
                  {workflow.status === 'running' ? 'Rodando' : 'Pausado'}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Condições:</p>
                <div className="flex flex-wrap gap-1">
                  {workflow.conditions.map((condition: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Ações:</p>
                <div className="flex flex-wrap gap-1">
                  {workflow.actions.map((action: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {action}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};
