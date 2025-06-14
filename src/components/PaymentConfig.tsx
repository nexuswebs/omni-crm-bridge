
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
  const [stripePublicKey, setStripePublicKey] = useState('asdasd');
  const [stripeSecretKey, setStripeSecretKey] = useState('');
  const [stripeWebhookSecret, setStripeWebhookSecret] = useState('');

  // Mercado Pago Config
  const [mpEnabled, setMpEnabled] = useState(false);
  const [mpPublicKey, setMpPublicKey] = useState('APP_USR-...');
  const [mpAccessToken, setMpAccessToken] = useState('APP_USR-...');
  const [mpWebhookSecret, setMpWebhookSecret] = useState('');

  // PIX Config
  const [pixEnabled, setPixEnabled] = useState(true);
  const [pixKey, setPixKey] = useState('ss');
  const [pixKeyType, setPixKeyType] = useState('Email');
  const [pixBankName, setPixBankName] = useState('ss');
  const [pixAccountHolder, setPixAccountHolder] = useState('ss');

  const handleSaveStripe = () => {
    toast({
      title: "Configurações Stripe salvas!",
      description: "As configurações do Stripe foram atualizadas com sucesso.",
    });
  };

  const handleSaveMercadoPago = () => {
    toast({
      title: "Configurações Mercado Pago salvas!",
      description: "As configurações do Mercado Pago foram atualizadas com sucesso.",
    });
  };

  const handleSavePix = () => {
    toast({
      title: "Configurações PIX salvas!",
      description: "As configurações do PIX foram atualizadas com sucesso.",
    });
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

              <Button 
                onClick={handleSaveStripe} 
                disabled={!stripeEnabled}
                className="bg-gradient-primary"
              >
                Salvar Configurações Stripe
              </Button>
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

              <Button 
                onClick={handleSaveMercadoPago} 
                disabled={!mpEnabled}
                className="bg-gradient-primary"
              >
                Salvar Configurações Mercado Pago
              </Button>
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

              <Button 
                onClick={handleSavePix} 
                disabled={!pixEnabled}
                className="bg-gradient-primary"
              >
                Salvar Configurações PIX
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
