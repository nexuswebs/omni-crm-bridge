
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SystemConfig {
  id?: string;
  user_id?: string;
  config_type: string;
  config_data: any;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export const useSystemConfig = (configType: string) => {
  const { toast } = useToast();
  const [config, setConfig] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Carregar configuração do banco
  const loadConfig = async () => {
    try {
      setIsLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('Usuário não autenticado');
        return;
      }

      const { data, error } = await supabase
        .from('system_configs')
        .select('*')
        .eq('user_id', user.id)
        .eq('config_type', configType)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao carregar configuração:', error);
        return;
      }

      if (data) {
        setConfig(data.config_data || {});
      }
    } catch (error) {
      console.error('Erro ao carregar configuração do sistema:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Salvar configuração no banco
  const saveConfig = async (newConfig: any) => {
    try {
      setIsSaving(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erro de autenticação",
          description: "Você precisa estar logado para salvar configurações.",
          variant: "destructive",
        });
        return false;
      }

      // Primeiro, desativar configurações antigas
      await supabase
        .from('system_configs')
        .update({ is_active: false })
        .eq('user_id', user.id)
        .eq('config_type', configType);

      // Criar nova configuração
      const { data, error } = await supabase
        .from('system_configs')
        .insert({
          user_id: user.id,
          config_type: configType,
          config_data: newConfig,
          is_active: true
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao salvar configuração:', error);
        toast({
          title: "Erro ao salvar",
          description: "Não foi possível salvar a configuração.",
          variant: "destructive",
        });
        return false;
      }

      setConfig(newConfig);
      toast({
        title: "Configuração salva!",
        description: "Suas configurações foram salvas com sucesso.",
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      toast({
        title: "Erro",
        description: "Erro interno ao salvar configuração.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Atualizar configuração
  const updateConfig = (updates: any) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    return saveConfig(newConfig);
  };

  useEffect(() => {
    loadConfig();
  }, [configType]);

  return {
    config,
    isLoading,
    isSaving,
    saveConfig,
    updateConfig,
    reloadConfig: loadConfig
  };
};
