
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Download, Star } from 'lucide-react';

interface WorkflowTemplatesProps {
  onUseTemplate: (template: any) => void;
  onClose: () => void;
}

export const WorkflowTemplates = ({ onUseTemplate, onClose }: WorkflowTemplatesProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const templates = [
    {
      id: 1,
      name: 'Onboarding Completo',
      description: 'Processo automatizado de boas-vindas para novos clientes',
      category: 'Atendimento',
      rating: 4.8,
      uses: 1247,
      trigger: 'Novo cliente cadastrado',
      actions: ['Envio WhatsApp', 'Email boas-vindas', 'Criação de perfil'],
      conditions: ['Cliente tem email', 'Cliente não é VIP'],
      popular: true
    },
    {
      id: 2,
      name: 'Resposta Automática IA',
      description: 'IA que responde dúvidas comuns automaticamente',
      category: 'Suporte',
      rating: 4.6,
      uses: 892,
      trigger: 'Nova mensagem WhatsApp',
      actions: ['Análise IA', 'Resposta automática', 'Escalação'],
      conditions: ['Pergunta no FAQ', 'Sentimento positivo'],
      popular: true
    },
    {
      id: 3,
      name: 'Follow-up Vendas',
      description: 'Acompanhamento automático de prospects',
      category: 'Vendas',
      rating: 4.5,
      uses: 673,
      trigger: 'Lead inativo por 24h',
      actions: ['Mensagem personalizada', 'Oferta especial'],
      conditions: ['Lead não respondeu', 'Lead qualificado'],
      popular: false
    },
    {
      id: 4,
      name: 'Cobrança Inteligente',
      description: 'Cobrança automática com diferentes estratégias',
      category: 'Financeiro',
      rating: 4.7,
      uses: 543,
      trigger: 'Fatura vencida',
      actions: ['Lembrete WhatsApp', 'Email cobrança', 'SMS'],
      conditions: ['Fatura > 24h vencida', 'Cliente não bloqueado'],
      popular: false
    },
    {
      id: 5,
      name: 'Pesquisa Satisfação',
      description: 'Coleta automática de feedback dos clientes',
      category: 'Atendimento',
      rating: 4.3,
      uses: 389,
      trigger: 'Ticket resolvido',
      actions: ['Envio pesquisa', 'Coleta resposta', 'Análise NPS'],
      conditions: ['Ticket fechado', 'Cliente ativo'],
      popular: false
    },
    {
      id: 6,
      name: 'Reativação de Clientes',
      description: 'Reativa clientes inativos com ofertas especiais',
      category: 'Vendas',
      rating: 4.4,
      uses: 298,
      trigger: 'Cliente inativo por 30 dias',
      actions: ['Oferta especial', 'Mensagem personalizada'],
      conditions: ['Cliente não comprou', 'Cliente teve valor alto'],
      popular: false
    }
  ];

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUseTemplate = (template: any) => {
    onUseTemplate({
      name: template.name,
      description: template.description,
      trigger: template.trigger,
      actions: template.actions,
      conditions: template.conditions,
      status: 'paused'
    });
    onClose();
  };

  return (
    <Card className="w-full max-w-6xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Templates de Workflows
            </CardTitle>
            <CardDescription>
              Escolha um template pronto para usar
            </CardDescription>
          </div>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Lista de Templates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="border-0 bg-muted/50 hover:bg-muted/70 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      {template.name}
                      {template.popular && (
                        <Badge variant="default" className="text-xs">
                          <Star className="w-3 h-3 mr-1" />
                          Popular
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {template.description}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {template.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current text-yellow-500" />
                      <span>{template.rating}</span>
                    </div>
                    <span>•</span>
                    <span>{template.uses} usos</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Trigger:</p>
                    <Badge variant="outline" className="text-xs">
                      {template.trigger}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Ações:</p>
                    <div className="flex flex-wrap gap-1">
                      {template.actions.slice(0, 2).map((action, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {action}
                        </Badge>
                      ))}
                      {template.actions.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{template.actions.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  size="sm"
                  onClick={() => handleUseTemplate(template)}
                  className="w-full bg-gradient-primary text-white"
                >
                  Usar Template
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nenhum template encontrado.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
