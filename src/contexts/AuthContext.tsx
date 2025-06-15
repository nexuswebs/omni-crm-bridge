
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'agent' | 'user';
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Buscando perfil para usuário:', userId);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Erro ao buscar perfil:', error);
        return null;
      }

      console.log('Perfil encontrado:', profile);
      return profile;
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      return null;
    }
  };

  const createUserProfile = async (userId: string, email: string, name: string) => {
    try {
      console.log('Criando perfil para usuário:', userId, email, name);
      const { data, error } = await supabase
        .from('profiles')
        .insert([
          {
            id: userId,
            name: name,
            email: email,
            role: 'user' as const
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar perfil:', error);
        return null;
      }

      console.log('Perfil criado com sucesso:', data);
      return data;
    } catch (error) {
      console.error('Erro ao criar perfil:', error);
      return null;
    }
  };

  useEffect(() => {
    // Configurar listener de mudança de estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        
        if (session?.user) {
          // Buscar perfil do usuário
          setTimeout(async () => {
            let profile = await fetchUserProfile(session.user.id);
            
            // Se não encontrou perfil, criar um novo
            if (!profile) {
              console.log('Perfil não encontrado, criando novo...');
              profile = await createUserProfile(
                session.user.id,
                session.user.email || '',
                session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Usuário'
              );
            }
            
            if (profile) {
              setUser({
                id: session.user.id,
                name: profile.name || session.user.email?.split('@')[0] || 'Usuário',
                email: session.user.email || '',
                role: (profile.role as 'admin' | 'agent' | 'user') || 'user'
              });
            }
          }, 0);
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    // Verificar sessão existente
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Sessão inicial:', session?.user?.id);
      setSession(session);
      
      if (session?.user) {
        fetchUserProfile(session.user.id).then(async (profile) => {
          // Se não encontrou perfil, criar um novo
          if (!profile) {
            console.log('Perfil não encontrado na sessão inicial, criando novo...');
            profile = await createUserProfile(
              session.user.id,
              session.user.email || '',
              session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Usuário'
            );
          }
          
          if (profile) {
            setUser({
              id: session.user.id,
              name: profile.name || session.user.email?.split('@')[0] || 'Usuário',
              email: session.user.email || '',
              role: (profile.role as 'admin' | 'agent' | 'user') || 'user'
            });
          }
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Erro no login:', error);
        return { error: error.message };
      }

      return {};
    } catch (error: any) {
      console.error('Erro no login:', error);
      return { error: 'Erro inesperado ao fazer login' };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: name
          }
        }
      });

      if (error) {
        console.error('Erro no cadastro:', error);
        return { error: error.message };
      }

      return {};
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      return { error: 'Erro inesperado ao criar conta' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Erro no logout:', error);
      }
      
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
