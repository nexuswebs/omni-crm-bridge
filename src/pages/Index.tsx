
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (user) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mx-auto mb-4">
            <img 
              src="/lovable-uploads/c6d44030-5c90-4b0a-a929-4224d423ff2a.png" 
              alt="Nexus Agents Logo" 
              className="w-12 h-12 object-contain"
            />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            CRM Inteligente
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Sistema completo de gestão de relacionamento com clientes
          </p>
        </div>
        
        <div className="space-y-4">
          <Link 
            to="/login"
            className="inline-flex items-center justify-center w-full px-6 py-3 text-base font-medium text-primary-foreground bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Entrar no Sistema
          </Link>
          
          <div className="text-sm text-muted-foreground space-y-2">
            <p>✓ WhatsApp Business integrado</p>
            <p>✓ Automações com n8n.cloud</p>
            <p>✓ Pagamentos PIX, Stripe e Mercado Pago</p>
            <p>✓ Relatórios e análises em tempo real</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
