
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
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          CRM Inteligente
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Sistema completo de gestão de relacionamento com clientes
        </p>
        <div className="space-y-4">
          <Link 
            to="/login"
            className="inline-flex items-center justify-center w-full px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            Entrar no Sistema
          </Link>
          <p className="text-sm text-muted-foreground">
            Gerencie seus clientes, WhatsApp, workflows e pagamentos em um só lugar
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
