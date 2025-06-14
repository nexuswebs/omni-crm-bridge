
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Download, Play } from 'lucide-react';

interface WorkflowTemplatesProps {
  onUseTemplate: (templateData: any) => void;
  onClose: () => void;
}

export const WorkflowTemplates = ({ onUseTemplate, onClose }: WorkflowTemplatesProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const templates = [
    {
      id: 1,
      name: 'Onboarding Automático',
      description: 'Processo completo de boas-vindas para novos clientes',
      category: 'Atendimento',
      trigger: 'Novo cliente cadastrado',
      actions: ['Envio WhatsApp', 'Email boas-vindas', 'Criação de ticket'],
      conditions: ['Cliente tem email válido', 'Cliente não é VIP'],
      popularity: 'Alta'
    },
    {
      id: 2,
      name: 'Suporte Inteligente',
      description: 'IA que responde dúvidas comuns automaticamente',
      category: 'IA',
      trigger: 'Nova mensagem WhatsApp',
      actions: ['Análise IA', 'Resposta automática', 'Escalação se necessário'],
      conditions: ['Pergunta não respondida no FAQ', 'Sentimento negativo'],
      popularity: 'Alta'
    },
    {
      id: 3,
      name: 'Follow-up Vendas',
      description: 'Acompanhamento automático de prospects',
      category: 'Vendas',
      trigger: 'Lead inativo por 24h',
      actions: ['Mensagem personalizada', 'Oferta especial', 'Reagendamento'],
      conditions: ['Lead não respondeu', 'Lead não comprou'],
      popularity: 'Média'
    },
    {
      id: 4,
      name: 'Confirmação Pagamento PIX',
      description: 'Automação para confirmar pagamentos PIX',
      category: 'Pagamentos',
      trigger: 'Pagamento recebido',
      actions: ['Confirmação PIX', 'Liberação produto', 'NF automática'],
      conditions: ['Pagamento aprovado', 'Estoque disponível'],
      popularity: 'Alta'
    },
    {
      id: 5,
      name: 'Recuperação de Carrinho',
      description: 'Reconquista clientes com carrinho abandonado',
      category: 'E-commerce',
      trigger: 'Carrinho abandonado por 1h',
      actions: ['Lembrete WhatsApp', 'Desconto especial', 'Link direto'],
      conditions: ['Carrinho tem valor > R$50', 'Cliente não finalizou'],
      popularity: 'Média'
    },
    {
      id: 6,
      name: 'Pesquisa de Satisfação',
      description: 'Coleta feedback após atendimento',
      category: 'Qualidade',
      trigger: 'Ticket resolvido',
      actions: ['Envio pesquisa', 'Coleta rating', 'Análise sentimento'],
      conditions: ['Ticket foi resolvido', 'Cliente não é VIP'],
      popularity: 'Baixa'
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
      conditions: template.conditions
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Atendimento': return 'bg-blue-100 text-blue-800';
      case 'IA': return 'bg-purple-100 text-purple-800';
      case 'Vendas': return 'bg-green-100 text-green-800';
      case 'Pagamentos': return 'bg-yellow-100 text-yellow-800';
      case 'E-commerce': return 'bg-orange-100 text-orange-800';
      case 'Qualidade': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPopularityColor = (popularity: string) => {
    switch (popularity) {
      case 'Alta': return 'bg-green-500';
      case 'Média': return 'bg-yellow-500';
      case 'Baixa': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="w-full max-w-6xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Templates de Workflows</CardTitle>
            <p className="text-muted-foreground">Escolha um template para começar rapidamente</p>
          </div>
          <Button variant="outline" onClick={onClose}>Fechar</Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <Badge className={getCategoryColor(template.category)}>
                      {template.category}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${getPopularityColor(template.popularity)}`} />
                      <span className="text-xs text-muted-foreground">{template.popularity}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Trigger:</p>
                  <p className="text-xs text-muted-foreground bg-muted/50 rounded p-2 mt-1">
                    {template.trigger}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium">Condições:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {template.conditions.map((condition, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium">Ações:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {template.actions.map((action, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {action}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    size="sm" 
                    onClick={() => handleUseTemplate(template)}
                    className="flex-1"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Usar Template
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    title="Visualizar"
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nenhum template encontrado</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
