
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Download, Star, Clock, Users } from 'lucide-react';

interface WorkflowTemplatesProps {
  onUseTemplate: (template: any) => void;
  onClose: () => void;
}

export const WorkflowTemplates = ({ onUseTemplate, onClose }: WorkflowTemplatesProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const templates = [
    {
      id: 1,
      name: 'Onboarding de Clientes',
      description: 'Processo completo de boas-vindas com WhatsApp e email',
      category: 'vendas',
      popularity: 4.8,
      uses: 1250,
      estimatedTime: '5 min',
      tags: ['whatsapp', 'email', 'boas-vindas'],
      triggers: ['Novo cliente cadastrado'],
      actions: ['Envio WhatsApp', 'Email boas-vindas', 'Criação de ticket']
    },
    {
      id: 2,
      name: 'Suporte Automático IA',
      description: 'IA responde dúvidas e escala para humanos quando necessário',
      category: 'suporte',
      popularity: 4.6,
      uses: 890,
      estimatedTime: '3 min',
      tags: ['ia', 'suporte', 'whatsapp'],
      triggers: ['Nova mensagem WhatsApp'],
      actions: ['Análise IA', 'Resposta automática', 'Escalação']
    },
    {
      id: 3,
      name: 'Follow-up de Vendas',
      description: 'Acompanhamento automático de leads inativos',
      category: 'vendas',
      popularity: 4.7,
      uses: 650,
      estimatedTime: '4 min',
      tags: ['vendas', 'follow-up', 'leads'],
      triggers: ['Lead inativo por 24h'],
      actions: ['Mensagem personalizada', 'Oferta especial']
    },
    {
      id: 4,
      name: 'Processamento de Pagamentos',
      description: 'Automação completa para PIX e cartão',
      category: 'financeiro',
      popularity: 4.9,
      uses: 2100,
      estimatedTime: '2 min',
      tags: ['pagamento', 'pix', 'nf'],
      triggers: ['Pagamento recebido'],
      actions: ['Confirmação PIX', 'Liberação produto', 'NF automática']
    },
    {
      id: 5,
      name: 'Recuperação de Carrinho',
      description: 'Recupera vendas de carrinhos abandonados',
      category: 'ecommerce',
      popularity: 4.5,
      uses: 780,
      estimatedTime: '6 min',
      tags: ['ecommerce', 'carrinho', 'recuperacao'],
      triggers: ['Carrinho abandonado por 2h'],
      actions: ['Email lemb    rete', 'WhatsApp com desconto', 'Remarketing']
    },
    {
      id: 6,
      name: 'Feedback Pós-Venda',
      description: 'Coleta feedback e avaliações automaticamente',
      category: 'pos-venda',
      popularity: 4.3,
      uses: 420,
      estimatedTime: '4 min',
      tags: ['feedback', 'avaliacao', 'pos-venda'],
      triggers: ['Produto entregue'],
      actions: ['Pesquisa satisfação', 'Solicitar avaliação', 'Upsell']
    }
  ];

  const categories = [
    { id: 'all', name: 'Todos', count: templates.length },
    { id: 'vendas', name: 'Vendas', count: templates.filter(t => t.category === 'vendas').length },
    { id: 'suporte', name: 'Suporte', count: templates.filter(t => t.category === 'suporte').length },
    { id: 'financeiro', name: 'Financeiro', count: templates.filter(t => t.category === 'financeiro').length },
    { id: 'ecommerce', name: 'E-commerce', count: templates.filter(t => t.category === 'ecommerce').length },
    { id: 'pos-venda', name: 'Pós-venda', count: templates.filter(t => t.category === 'pos-venda').length }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUseTemplate = (template: any) => {
    const workflowData = {
      name: template.name,
      description: template.description,
      trigger: template.triggers[0],
      actions: template.actions,
      conditions: [],
      status: 'paused'
    };
    onUseTemplate(workflowData);
    onClose();
  };

  return (
    <Card className="w-full max-w-6xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Templates de Workflows</CardTitle>
          <Button variant="outline" onClick={onClose}>Fechar</Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {categories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name} ({category.count})
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map(template => (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{template.popularity}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {template.uses} usos
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {template.estimatedTime}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Trigger:</p>
                  <Badge variant="outline" className="text-xs">
                    {template.triggers[0]}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Ações:</p>
                  <div className="flex flex-wrap gap-1">
                    {template.actions.slice(0, 2).map((action, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {action}
                      </Badge>
                    ))}
                    {template.actions.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{template.actions.length - 2} mais
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Tags:</p>
                  <div className="flex flex-wrap gap-1">
                    {template.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button 
                  className="w-full mt-3"
                  onClick={() => handleUseTemplate(template)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Usar Template
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
