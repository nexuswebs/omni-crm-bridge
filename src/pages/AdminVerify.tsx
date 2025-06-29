
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Database, 
  Shield, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Eye,
  EyeOff
} from 'lucide-react';

const AdminVerify = () => {
  const { user, session } = useAuth();
  const { toast } = useToast();
  
  const [showPassword, setShowPassword] = useState(false);
  const [testCredentials, setTestCredentials] = useState({
    email: 'admin@crm.com',
    password: 'admin123'
  });
  
  const [dbStatus, setDbStatus] = useState({
    profiles: { count: 0, status: 'unknown' },
    customers: { count: 0, status: 'unknown' },
    whatsapp_instances: { count: 0, status: 'unknown' },
    messages: { count: 0, status: 'unknown' },
    workflows: { count: 0, status: 'unknown' },
    payments: { count: 0, status: 'unknown' }
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkDatabaseStatus();
  }, []);

  const checkDatabaseStatus = async () => {
    setIsLoading(true);
    const newStatus = { ...dbStatus };

    try {
      // Verificar tabela profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' });
      
      newStatus.profiles = {
        count: profiles?.length || 0,
        status: profilesError ? 'error' : 'ok'
      };

      // Verificar tabela customers
      const { data: customers, error: customersError } = await supabase
        .from('customers')
        .select('*', { count: 'exact' });
      
      newStatus.customers = {
        count: customers?.length || 0,
        status: customersError ? 'error' : 'ok'
      };

      // Verificar tabela whatsapp_instances
      const { data: instances, error: instancesError } = await supabase
        .from('whatsapp_instances')
        .select('*', { count: 'exact' });
      
      newStatus.whatsapp_instances = {
        count: instances?.length || 0,
        status: instancesError ? 'error' : 'ok'
      };

      // Verificar tabela messages
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select('*', { count: 'exact' });
      
      newStatus.messages = {
        count: messages?.length || 0,
        status: messagesError ? 'error' : 'ok'
      };

      // Verificar tabela workflows
      const { data: workflows, error: workflowsError } = await supabase
        .from('workflows')
        .select('*', { count: 'exact' });
      
      newStatus.workflows = {
        count: workflows?.length || 0,
        status: workflowsError ? 'error' : 'ok'
      };

      // Verificar tabela payments
      const { data: payments, error: paymentsError } = await supabase
        .from('payments')
        .select('*', { count: 'exact' });
      
      newStatus.payments = {
        count: payments?.length || 0,
        status: paymentsError ? 'error' : 'ok'
      };

    } catch (error) {
      console.error('Erro ao verificar banco de dados:', error);
    }

    setDbStatus(newStatus);
    setIsLoading(false);
  };

  const createAdminUser = async () => {
    setIsLoading(true);
    try {
      // Primeiro, tentar criar o usuário
      const { data, error } = await supabase.auth.signUp({
        email: testCredentials.email,
        password: testCredentials.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            name: 'Administrador'
          }
        }
      });

      if (error) {
        console.error('Erro ao criar usuário admin:', error);
        toast({
          title: "Erro ao criar admin",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Usuário admin criado!",
          description: "Verifique o email para confirmar a conta ou tente fazer login",
        });
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const testLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: testCredentials.email,
        password: testCredentials.password,
      });

      if (error) {
        console.error('Erro no login:', error);
        toast({
          title: "Erro no login",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login bem-sucedido!",
          description: "Credenciais do admin funcionam corretamente",
        });
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ok':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ok':
        return <Badge variant="default" className="bg-green-500">OK</Badge>;
      case 'error':
        return <Badge variant="destructive">Erro</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Verificação do Sistema
          </h1>
          <p className="text-muted-foreground mt-2">
            Verifique o status do admin e banco de dados
          </p>
        </div>

        {/* Status do Usuário Atual */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Status do Usuário Atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            {user ? (
              <div className="space-y-2">
                <p><strong>ID:</strong> {user.id}</p>
                <p><strong>Nome:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <Badge variant="default" className="bg-green-500">Logado</Badge>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Não logado</Badge>
                <p>Nenhum usuário conectado</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Teste de Credenciais Admin */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Teste de Credenciais Admin
            </CardTitle>
            <CardDescription>
              Teste as credenciais do administrador
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="admin-email">Email do Admin</Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={testCredentials.email}
                  onChange={(e) => setTestCredentials({ ...testCredentials, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="admin-password">Senha do Admin</Label>
                <div className="relative">
                  <Input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    value={testCredentials.password}
                    onChange={(e) => setTestCredentials({ ...testCredentials, password: e.target.value })}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={testLogin} disabled={isLoading}>
                Testar Login
              </Button>
              <Button onClick={createAdminUser} variant="outline" disabled={isLoading}>
                Criar Usuário Admin
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Status do Banco de Dados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Status do Banco de Dados
            </CardTitle>
            <CardDescription>
              Verificação das tabelas principais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(dbStatus).map(([table, info]) => (
                <div key={table} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(info.status)}
                    <span className="font-medium">{table}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {info.count} registros
                    </span>
                    {getStatusBadge(info.status)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4">
              <Button onClick={checkDatabaseStatus} disabled={isLoading} variant="outline">
                Atualizar Status
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Informações da Sessão */}
        {session && (
          <Card>
            <CardHeader>
              <CardTitle>Detalhes da Sessão</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>Access Token:</strong> {session.access_token.substring(0, 50)}...</p>
                <p><strong>Refresh Token:</strong> {session.refresh_token?.substring(0, 50)}...</p>
                <p><strong>Expires At:</strong> {new Date(session.expires_at! * 1000).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminVerify;
