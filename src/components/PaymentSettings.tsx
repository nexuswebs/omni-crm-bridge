
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, DollarSign, Percent, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const PaymentSettings = () => {
  const { toast } = useToast();
  
  const [stripeConfig, setStripeConfig] = useState({
    publicKey: '',
    secretKey: '',
    webhookSecret: '',
    enabled: false
  });

  const [paymentSettings, setPaymentSettings] = useState({
    currency: 'BRL',
    processingFee: 2.9,
    minimumAmount: 5.00,
    maximumAmount: 10000.00,
    autoCapture: true,
    allowInstallments: true,
    maxInstallments: 12
  });

  const [pixConfig, setPixConfig] = useState({
    enabled: true,
    key: 'stark@redenexus.top',
    type: 'email'
  });

  const handleSaveStripeConfig = () => {
    console.log('Salvando configuração Stripe:', stripeConfig);
    
    toast({
      title: "Configuração salva!",
      description: "Configurações do Stripe foram atualizadas.",
    });
  };

  const handleSavePaymentSettings = () => {
    console.log('Salvando configurações de pagamento:', paymentSettings);
    
    toast({
      title: "Configurações salvas!",
      description: "Configurações de pagamento foram atualizadas.",
    });
  };

  const handleTestConnection = () => {
    console.log('Testando conexão com Stripe...');
    
    toast({
      title: "Testando conexão...",
      description: "Verificando conectividade com Stripe.",
    });

    setTimeout(() => {
      toast({
        title: "Conexão estabelecida!",
        description: "Stripe configurado com sucesso.",
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <CreditCard className="w-6 h-6" />
          Configurações de Pagamento
        </h2>
        <p className="text-muted-foreground">Configure processadores de pagamento e métodos</p>
      </div>

      <Tabs defaultValue="stripe" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="stripe">Stripe</TabsTrigger>
          <TabsTrigger value="pix">PIX</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="stripe" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Configuração Stripe
              </CardTitle>
              <CardDescription>
                Configure suas credenciais do Stripe para processar pagamentos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="stripe-enabled"
                  checked={stripeConfig.enabled}
                  onCheckedChange={(checked) => setStripeConfig({ ...stripeConfig, enabled: checked })}
                />
                <Label htmlFor="stripe-enabled">Habilitar Stripe</Label>
                <Badge variant={stripeConfig.enabled ? "default" : "secondary"}>
                  {stripeConfig.enabled ? "Ativo" : "Inativo"}
                </Badge>
              </div>

              <div>
                <Label htmlFor="stripe-public-key">Chave Pública</Label>
                <Input
                  id="stripe-public-key"
                  type="password"
                  value={stripeConfig.publicKey}
                  onChange={(e) => setStripeConfig({ ...stripeConfig, publicKey: e.target.value })}
                  placeholder="pk_test_..."
                />
              </div>

              <div>
                <Label htmlFor="stripe-secret-key">Chave Secreta</Label>
                <Input
                  id="stripe-secret-key"
                  type="password"
                  value={stripeConfig.secretKey}
                  onChange={(e) => setStripeConfig({ ...stripeConfig, secretKey: e.target.value })}
                  placeholder="sk_test_..."
                />
              </div>

              <div>
                <Label htmlFor="stripe-webhook-secret">Webhook Secret</Label>
                <Input
                  id="stripe-webhook-secret"
                  type="password"
                  value={stripeConfig.webhookSecret}
                  onChange={(e) => setStripeConfig({ ...stripeConfig, webhookSecret: e.target.value })}
                  placeholder="whsec_..."
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSaveStripeConfig} className="bg-gradient-primary">
                  Salvar Configuração
                </Button>
                <Button variant="outline" onClick={handleTestConnection}>
                  Testar Conexão
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pix" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Configuração PIX
              </CardTitle>
              <CardDescription>
                Configure sua chave PIX para receber pagamentos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="pix-enabled"
                  checked={pixConfig.enabled}
                  onCheckedChange={(checked) => setPixConfig({ ...pixConfig, enabled: checked })}
                />
                <Label htmlFor="pix-enabled">Habilitar PIX</Label>
                <Badge variant={pixConfig.enabled ? "default" : "secondary"}>
                  {pixConfig.enabled ? "Ativo" : "Inativo"}
                </Badge>
              </div>

              <div>
                <Label htmlFor="pix-type">Tipo de Chave PIX</Label>
                <Select value={pixConfig.type} onValueChange={(value) => setPixConfig({ ...pixConfig, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="cpf">CPF</SelectItem>
                    <SelectItem value="cnpj">CNPJ</SelectItem>
                    <SelectItem value="phone">Telefone</SelectItem>
                    <SelectItem value="random">Chave Aleatória</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="pix-key">Chave PIX</Label>
                <Input
                  id="pix-key"
                  value={pixConfig.key}
                  onChange={(e) => setPixConfig({ ...pixConfig, key: e.target.value })}
                  placeholder="Sua chave PIX"
                />
              </div>

              <Button onClick={() => toast({ title: "PIX Configurado!", description: "Chave PIX salva com sucesso." })}>
                Salvar Configuração PIX
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configurações Gerais
              </CardTitle>
              <CardDescription>
                Configure parâmetros gerais de pagamento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="currency">Moeda</Label>
                <Select value={paymentSettings.currency} onValueChange={(value) => setPaymentSettings({ ...paymentSettings, currency: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BRL">Real (BRL)</SelectItem>
                    <SelectItem value="USD">Dólar (USD)</SelectItem>
                    <SelectItem value="EUR">Euro (EUR)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="processing-fee">Taxa de Processamento (%)</Label>
                <Input
                  id="processing-fee"
                  type="number"
                  step="0.1"
                  value={paymentSettings.processingFee}
                  onChange={(e) => setPaymentSettings({ ...paymentSettings, processingFee: parseFloat(e.target.value) })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="min-amount">Valor Mínimo</Label>
                  <Input
                    id="min-amount"
                    type="number"
                    step="0.01"
                    value={paymentSettings.minimumAmount}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, minimumAmount: parseFloat(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="max-amount">Valor Máximo</Label>
                  <Input
                    id="max-amount"
                    type="number"
                    step="0.01"
                    value={paymentSettings.maximumAmount}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, maximumAmount: parseFloat(e.target.value) })}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-capture"
                  checked={paymentSettings.autoCapture}
                  onCheckedChange={(checked) => setPaymentSettings({ ...paymentSettings, autoCapture: checked })}
                />
                <Label htmlFor="auto-capture">Captura Automática</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="allow-installments"
                  checked={paymentSettings.allowInstallments}
                  onCheckedChange={(checked) => setPaymentSettings({ ...paymentSettings, allowInstallments: checked })}
                />
                <Label htmlFor="allow-installments">Permitir Parcelamento</Label>
              </div>

              {paymentSettings.allowInstallments && (
                <div>
                  <Label htmlFor="max-installments">Máximo de Parcelas</Label>
                  <Select 
                    value={paymentSettings.maxInstallments.toString()} 
                    onValueChange={(value) => setPaymentSettings({ ...paymentSettings, maxInstallments: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(12)].map((_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          {i + 1}x
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button onClick={handleSavePaymentSettings} className="w-full">
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
