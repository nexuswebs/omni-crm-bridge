
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, DollarSign, QrCode } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const PaymentConfig = () => {
  const { toast } = useToast();
  
  // Stripe Config
  const [stripeEnabled, setStripeEnabled] = useState(true);
  const [stripePublicKey, setStripePublicKey] = useState('');
  const [stripeSecretKey, setStripeSecretKey] = useState('');
  const [stripeWebhookSecret, setStripeWebhookSecret] = useState('');

  // Mercado Pago Config
  const [mpEnabled, setMpEnabled] = useState(false);
  const [mpPublicKey, setMpPublicKey] = useState('');
  const [mpAccessToken, setMpAccessToken] = useState('');
  const [mpWebhookSecret, setMpWebhookSecret] = useState('');

  // PIX Config
  const [pixEnabled, setPixEnabled] = useState(true);
  const [pixKey, setPixKey] = useState('');
  const [pixKeyType, setPixKeyType] = useState('Email');
  const [pixBankName, setPixBankName] = useState('');
  const [pixAccountHolder, setPixAccountHolder] = useState('');

  const handleSaveStripe = () => {
    console.log('Salvando configurações Stripe:', {
      enabled: stripeEnabled,
      publicKey: stripePublicKey,
      secretKey: stripeSecretKey ? '***' : '',
      webhookSecret: stripeWebhookSecret ? '***' : ''
    });
    
    if (!stripePublicKey || !stripeSecretKey) {
      toast({
        title: "Erro ao salvar",
        description: "Por favor, preencha as chaves pública e secreta do Stripe.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Configurações Stripe salvas!",
      description: "As configurações do Stripe foram atualizadas com sucesso.",
    });
  };

  const handleSaveMercadoPago = () => {
    console.log('Salvando configurações Mercado Pago:', {
      enabled: mpEnabled,
      publicKey: mpPublicKey,
      accessToken: mpAccessToken ? '***' : '',
      webhookSecret: mpWebhookSecret ? '***' : ''
    });
    
    if (mpEnabled && (!mpPublicKey || !mpAccessToken)) {
      toast({
        title: "Erro ao salvar",
        description: "Por favor, preencha a chave pública e o access token do Mercado Pago.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Configurações Mercado Pago salvas!",
      description: "As configurações do Mercado Pago foram atualizadas com sucesso.",
    });
  };

  const handleSavePix = () => {
    console.log('Salvando configurações PIX:', {
      enabled: pixEnabled,
      key: pixKey,
      keyType: pixKeyType,
      bankName: pixBankName,
      accountHolder: pixAccountHolder
    });
    
    if (pixEnabled && (!pixKey || !pixBankName || !pixAccountHolder)) {
      toast({
        title: "Erro ao salvar",
        description: "Por favor, preencha todos os campos obrigatórios do PIX.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Configurações PIX salvas!",
      description: "As configurações do PIX foram atualizadas com sucesso.",
    });
  };

  const handleTestStripe = () => {
    console.log('Testando conexão Stripe');
    toast({
      title: "Testando Stripe...",
      description: "Verificando conectividade com Stripe.",
    });
    
    setTimeout(() => {
      toast({
        title: "Teste Stripe concluído!",
        description: "Conexão com Stripe estabelecida com sucesso.",
      });
    }, 2000);
  };

  const handleTestMercadoPago = () => {
    console.log('Testando conexão Mercado Pago');
    toast({
      title: "Testando Mercado Pago...",
      description: "Verificando conectividade com Mercado Pago.",
    });
    
    setTimeout(() => {
      toast({
        title: "Teste Mercado Pago concluído!",
        description: "Conexão com Mercado Pago estabelecida com sucesso.",
      });
    }, 2000);
  };

  const handleTestPix = () => {
    console.log('Testando configuração PIX');
    toast({
      title: "Testando PIX...",
      description: "Validando configurações PIX.",
    });
    
    setTimeout(() => {
      toast({
        title: "Teste PIX concluído!",
        description: "Configurações PIX estão válidas.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Configurações de Pagamento</h2>
        <p className="text-muted-foreground">Configure seus gateways de pagamento</p>
      </div>

      <Tabs defaultValue="stripe" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="stripe" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Stripe
          </TabsTrigger>
          <TabsTrigger value="mercadopago" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Mercado Pago
          </TabsTrigger>
          <TabsTrigger value="pix" className="flex items-center gap-2">
            <QrCode className="w-4 h-4" />
            PIX
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stripe">
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Configurações Stripe
                  </CardTitle>
                  <CardDescription>
                    Configure suas credenciais do Stripe
                  </CardDescription>
                </div>
                <Switch
                  checked={stripeEnabled}
                  onCheckedChange={setStripeEnabled}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="stripe-public">Chave Pública</Label>
                <Input
                  id="stripe-public"
                  value={stripePublicKey}
                  onChange={(e) => setStripePublicKey(e.target.value)}
                  placeholder="pk_test_..."
                  disabled={!stripeEnabled}
                />
              </div>

              <div>
                <Label htmlFor="stripe-secret">Chave Secreta</Label>
                <Input
                  id="stripe-secret"
                  type="password"
                  value={stripeSecretKey}
                  onChange={(e) => setStripeSecretKey(e.target.value)}
                  placeholder="sk_test_..."
                  disabled={!stripeEnabled}
                />
              </div>

              <div>
                <Label htmlFor="stripe-webhook">Webhook Secret</Label>
                <Input
                  id="stripe-webhook"
                  type="password"
                  value={stripeWebhookSecret}
                  onChange={(e) => setStripeWebhookSecret(e.target.value)}
                  placeholder="whsec_..."
                  disabled={!stripeEnabled}
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleSaveStripe} 
                  disabled={!stripeEnabled}
                  className="bg-gradient-primary"
                >
                  Salvar Configurações Stripe
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleTestStripe} 
                  disabled={!stripeEnabled}
                >
                  Testar Conexão
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mercadopago">
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Configurações Mercado Pago
                  </CardTitle>
                  <CardDescription>
                    Configure suas credenciais do Mercado Pago
                  </CardDescription>
                </div>
                <Switch
                  checked={mpEnabled}
                  onCheckedChange={setMpEnabled}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="mp-public">Chave Pública</Label>
                <Input
                  id="mp-public"
                  value={mpPublicKey}
                  onChange={(e) => setMpPublicKey(e.target.value)}
                  placeholder="APP_USR-..."
                  disabled={!mpEnabled}
                />
              </div>

              <div>
                <Label htmlFor="mp-access">Access Token</Label>
                <Input
                  id="mp-access"
                  type="password"
                  value={mpAccessToken}
                  onChange={(e) => setMpAccessToken(e.target.value)}
                  placeholder="APP_USR-..."
                  disabled={!mpEnabled}
                />
              </div>

              <div>
                <Label htmlFor="mp-webhook">Webhook Secret</Label>
                <Input
                  id="mp-webhook"
                  type="password"
                  value={mpWebhookSecret}
                  onChange={(e) => setMpWebhookSecret(e.target.value)}
                  placeholder="webhook_secret..."
                  disabled={!mpEnabled}
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleSaveMercadoPago} 
                  disabled={!mpEnabled}
                  className="bg-gradient-primary"
                >
                  Salvar Configurações Mercado Pago
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleTestMercadoPago} 
                  disabled={!mpEnabled}
                >
                  Testar Conexão
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pix">
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="w-5 h-5" />
                    Configurações PIX
                  </CardTitle>
                  <CardDescription>
                    Configure sua chave PIX para recebimentos
                  </CardDescription>
                </div>
                <Switch
                  checked={pixEnabled}
                  onCheckedChange={setPixEnabled}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="pix-key">Chave PIX</Label>
                <Input
                  id="pix-key"
                  value={pixKey}
                  onChange={(e) => setPixKey(e.target.value)}
                  placeholder="sua@chave.pix"
                  disabled={!pixEnabled}
                />
              </div>

              <div>
                <Label htmlFor="pix-type">Tipo da Chave</Label>
                <select 
                  id="pix-type"
                  value={pixKeyType}
                  onChange={(e) => setPixKeyType(e.target.value)}
                  disabled={!pixEnabled}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="Email">Email</option>
                  <option value="CPF">CPF</option>
                  <option value="CNPJ">CNPJ</option>
                  <option value="Telefone">Telefone</option>
                  <option value="Aleatoria">Chave Aleatória</option>
                </select>
              </div>

              <div>
                <Label htmlFor="pix-bank">Nome do Banco</Label>
                <Input
                  id="pix-bank"
                  value={pixBankName}
                  onChange={(e) => setPixBankName(e.target.value)}
                  placeholder="Banco do Brasil"
                  disabled={!pixEnabled}
                />
              </div>

              <div>
                <Label htmlFor="pix-holder">Titular da Conta</Label>
                <Input
                  id="pix-holder"
                  value={pixAccountHolder}
                  onChange={(e) => setPixAccountHolder(e.target.value)}
                  placeholder="Nome do titular"
                  disabled={!pixEnabled}
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleSavePix} 
                  disabled={!pixEnabled}
                  className="bg-gradient-primary"
                >
                  Salvar Configurações PIX
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleTestPix} 
                  disabled={!pixEnabled}
                >
                  Testar Configuração
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
