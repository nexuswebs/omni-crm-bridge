
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, DollarSign, QrCode } from 'lucide-react';

export const PaymentConfig = () => {
  const [stripeConfig, setStripeConfig] = useState({
    enabled: false,
    publicKey: '',
    secretKey: '',
    webhookSecret: ''
  });

  const [mercadoPagoConfig, setMercadoPagoConfig] = useState({
    enabled: false,
    publicKey: '',
    accessToken: '',
    webhookSecret: ''
  });

  const [pixConfig, setPixConfig] = useState({
    enabled: true,
    pixKey: '',
    pixKeyType: 'email',
    bankName: '',
    accountHolder: ''
  });

  const handleSaveStripe = () => {
    console.log('Salvando configurações Stripe:', stripeConfig);
    // Implementar salvamento
  };

  const handleSaveMercadoPago = () => {
    console.log('Salvando configurações Mercado Pago:', mercadoPagoConfig);
    // Implementar salvamento
  };

  const handleSavePix = () => {
    console.log('Salvando configurações PIX:', pixConfig);
    // Implementar salvamento
  };

  return (
    <div className="space-y-6">
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Configurações Stripe
                <Switch
                  checked={stripeConfig.enabled}
                  onCheckedChange={(enabled) => setStripeConfig({ ...stripeConfig, enabled })}
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="stripe-public">Chave Pública</Label>
                <Input
                  id="stripe-public"
                  value={stripeConfig.publicKey}
                  onChange={(e) => setStripeConfig({ ...stripeConfig, publicKey: e.target.value })}
                  placeholder="pk_live_..."
                />
              </div>
              <div>
                <Label htmlFor="stripe-secret">Chave Secreta</Label>
                <Input
                  id="stripe-secret"
                  type="password"
                  value={stripeConfig.secretKey}
                  onChange={(e) => setStripeConfig({ ...stripeConfig, secretKey: e.target.value })}
                  placeholder="sk_live_..."
                />
              </div>
              <div>
                <Label htmlFor="stripe-webhook">Webhook Secret</Label>
                <Input
                  id="stripe-webhook"
                  type="password"
                  value={stripeConfig.webhookSecret}
                  onChange={(e) => setStripeConfig({ ...stripeConfig, webhookSecret: e.target.value })}
                  placeholder="whsec_..."
                />
              </div>
              <Button onClick={handleSaveStripe} className="bg-gradient-primary text-white">
                Salvar Configurações Stripe
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mercadopago">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Configurações Mercado Pago
                <Switch
                  checked={mercadoPagoConfig.enabled}
                  onCheckedChange={(enabled) => setMercadoPagoConfig({ ...mercadoPagoConfig, enabled })}
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="mp-public">Chave Pública</Label>
                <Input
                  id="mp-public"
                  value={mercadoPagoConfig.publicKey}
                  onChange={(e) => setMercadoPagoConfig({ ...mercadoPagoConfig, publicKey: e.target.value })}
                  placeholder="APP_USR-..."
                />
              </div>
              <div>
                <Label htmlFor="mp-access">Access Token</Label>
                <Input
                  id="mp-access"
                  type="password"
                  value={mercadoPagoConfig.accessToken}
                  onChange={(e) => setMercadoPagoConfig({ ...mercadoPagoConfig, accessToken: e.target.value })}
                  placeholder="APP_USR-..."
                />
              </div>
              <div>
                <Label htmlFor="mp-webhook">Webhook Secret</Label>
                <Input
                  id="mp-webhook"
                  type="password"
                  value={mercadoPagoConfig.webhookSecret}
                  onChange={(e) => setMercadoPagoConfig({ ...mercadoPagoConfig, webhookSecret: e.target.value })}
                />
              </div>
              <Button onClick={handleSaveMercadoPago} className="bg-gradient-primary text-white">
                Salvar Configurações Mercado Pago
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pix">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Configurações PIX
                <Switch
                  checked={pixConfig.enabled}
                  onCheckedChange={(enabled) => setPixConfig({ ...pixConfig, enabled })}
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="pix-key">Chave PIX</Label>
                <Input
                  id="pix-key"
                  value={pixConfig.pixKey}
                  onChange={(e) => setPixConfig({ ...pixConfig, pixKey: e.target.value })}
                  placeholder="Sua chave PIX"
                />
              </div>
              <div>
                <Label htmlFor="pix-type">Tipo da Chave</Label>
                <select
                  id="pix-type"
                  value={pixConfig.pixKeyType}
                  onChange={(e) => setPixConfig({ ...pixConfig, pixKeyType: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="email">Email</option>
                  <option value="cpf">CPF</option>
                  <option value="cnpj">CNPJ</option>
                  <option value="phone">Telefone</option>
                  <option value="random">Chave Aleatória</option>
                </select>
              </div>
              <div>
                <Label htmlFor="bank-name">Nome do Banco</Label>
                <Input
                  id="bank-name"
                  value={pixConfig.bankName}
                  onChange={(e) => setPixConfig({ ...pixConfig, bankName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="account-holder">Titular da Conta</Label>
                <Input
                  id="account-holder"
                  value={pixConfig.accountHolder}
                  onChange={(e) => setPixConfig({ ...pixConfig, accountHolder: e.target.value })}
                />
              </div>
              <Button onClick={handleSavePix} className="bg-gradient-primary text-white">
                Salvar Configurações PIX
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
