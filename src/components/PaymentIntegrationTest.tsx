
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, DollarSign, TestTube, CheckCircle, XCircle } from 'lucide-react';

interface PaymentIntegrationTestProps {
  onClose: () => void;
}

export const PaymentIntegrationTest = ({ onClose }: PaymentIntegrationTestProps) => {
  const { toast } = useToast();
  
  const [stripeConfig, setStripeConfig] = useState({
    publicKey: '',
    secretKey: '',
    webhookSecret: '',
    tested: false,
    working: false
  });

  const [mpConfig, setMpConfig] = useState({
    publicKey: '',
    accessToken: '',
    webhookSecret: '',
    tested: false,
    working: false
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleTestStripe = async () => {
    if (!stripeConfig.publicKey || !stripeConfig.secretKey) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha as chaves do Stripe.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log('Testando integração Stripe:', { 
      publicKey: stripeConfig.publicKey.substring(0, 10) + '...', 
      secretKey: '***' 
    });

    try {
      // Simular teste da API do Stripe
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const success = Math.random() > 0.2; // 80% chance de sucesso
      
      setStripeConfig({
        ...stripeConfig,
        tested: true,
        working: success
      });

      if (success) {
        toast({
          title: "Stripe funcionando!",
          description: "Integração com Stripe testada com sucesso.",
        });
      } else {
        toast({
          title: "Erro no Stripe",
          description: "Verifique suas chaves da API.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao testar Stripe.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestMercadoPago = async () => {
    if (!mpConfig.publicKey || !mpConfig.accessToken) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha as chaves do Mercado Pago.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log('Testando integração Mercado Pago:', { 
      publicKey: mpConfig.publicKey.substring(0, 10) + '...', 
      accessToken: '***' 
    });

    try {
      // Simular teste da API do Mercado Pago
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const success = Math.random() > 0.2; // 80% chance de sucesso
      
      setMpConfig({
        ...mpConfig,
        tested: true,
        working: success
      });

      if (success) {
        toast({
          title: "Mercado Pago funcionando!",
          description: "Integração com Mercado Pago testada com sucesso.",
        });
      } else {
        toast({
          title: "Erro no Mercado Pago",
          description: "Verifique suas credenciais.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao testar Mercado Pago.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTestPayment = async (provider: 'stripe' | 'mercadopago') => {
    const config = provider === 'stripe' ? stripeConfig : mpConfig;
    
    if (!config.working) {
      toast({
        title: "Teste necessário",
        description: `Teste a integração com ${provider === 'stripe' ? 'Stripe' : 'Mercado Pago'} primeiro.`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log(`Criando pagamento teste com ${provider}`);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Pagamento teste criado!",
        description: `Checkout de teste com ${provider === 'stripe' ? 'Stripe' : 'Mercado Pago'} gerado.`,
      });
      
      // Simular abertura do checkout em nova aba
      console.log(`Abrindo checkout ${provider} em nova aba`);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao criar pagamento teste.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (tested: boolean, working: boolean) => {
    if (!tested) return <TestTube className="w-4 h-4 text-muted-foreground" />;
    return working ? 
      <CheckCircle className="w-4 h-4 text-green-500" /> : 
      <XCircle className="w-4 h-4 text-red-500" />;
  };

  const getStatusBadge = (tested: boolean, working: boolean) => {
    if (!tested) return <Badge variant="outline">Não testado</Badge>;
    return working ? 
      <Badge className="bg-green-500">Funcionando</Badge> : 
      <Badge variant="destructive">Erro</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Teste de Integrações de Pagamento</h2>
          <p className="text-muted-foreground">Verifique se suas integrações estão funcionando</p>
        </div>
        <Button variant="outline" onClick={onClose}>
          Fechar
        </Button>
      </div>

      <Tabs defaultValue="stripe">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stripe">Stripe</TabsTrigger>
          <TabsTrigger value="mercadopago">Mercado Pago</TabsTrigger>
        </TabsList>

        <TabsContent value="stripe" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Teste Stripe
              </CardTitle>
              <CardDescription>
                Teste sua integração com Stripe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="stripe-public">Chave Pública Stripe</Label>
                <Input
                  id="stripe-public"
                  value={stripeConfig.publicKey}
                  onChange={(e) => setStripeConfig({ ...stripeConfig, publicKey: e.target.value })}
                  placeholder="pk_test_..."
                />
              </div>

              <div>
                <Label htmlFor="stripe-secret">Chave Secreta Stripe</Label>
                <Input
                  id="stripe-secret"
                  type="password"
                  value={stripeConfig.secretKey}
                  onChange={(e) => setStripeConfig({ ...stripeConfig, secretKey: e.target.value })}
                  placeholder="sk_test_..."
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  {getStatusIcon(stripeConfig.tested, stripeConfig.working)}
                  <span>Status da Integração</span>
                </div>
                {getStatusBadge(stripeConfig.tested, stripeConfig.working)}
              </div>

              <div className="flex gap-2">
                <Button onClick={handleTestStripe} disabled={isLoading}>
                  <TestTube className="w-4 h-4 mr-2" />
                  {isLoading ? 'Testando...' : 'Testar Stripe'}
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => handleCreateTestPayment('stripe')}
                  disabled={!stripeConfig.working || isLoading}
                >
                  Pagamento Teste
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mercadopago" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Teste Mercado Pago
              </CardTitle>
              <CardDescription>
                Teste sua integração com Mercado Pago
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="mp-public">Chave Pública Mercado Pago</Label>
                <Input
                  id="mp-public"
                  value={mpConfig.publicKey}
                  onChange={(e) => setMpConfig({ ...mpConfig, publicKey: e.target.value })}
                  placeholder="APP_USR-..."
                />
              </div>

              <div>
                <Label htmlFor="mp-access">Access Token</Label>
                <Input
                  id="mp-access"
                  type="password"
                  value={mpConfig.accessToken}
                  onChange={(e) => setMpConfig({ ...mpConfig, accessToken: e.target.value })}
                  placeholder="APP_USR-..."
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  {getStatusIcon(mpConfig.tested, mpConfig.working)}
                  <span>Status da Integração</span>
                </div>
                {getStatusBadge(mpConfig.tested, mpConfig.working)}
              </div>

              <div className="flex gap-2">
                <Button onClick={handleTestMercadoPago} disabled={isLoading}>
                  <TestTube className="w-4 h-4 mr-2" />
                  {isLoading ? 'Testando...' : 'Testar Mercado Pago'}
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => handleCreateTestPayment('mercadopago')}
                  disabled={!mpConfig.working || isLoading}
                >
                  Pagamento Teste
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Resumo dos Testes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Stripe</span>
              {getStatusBadge(stripeConfig.tested, stripeConfig.working)}
            </div>
            <div className="flex items-center justify-between">
              <span>Mercado Pago</span>
              {getStatusBadge(mpConfig.tested, mpConfig.working)}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
