
-- Criar tabela para configurações do sistema
CREATE TABLE public.system_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  config_type TEXT NOT NULL, -- 'evolution_api', 'n8n', 'payment', etc
  config_data JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS policies
ALTER TABLE public.system_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver suas próprias configurações" 
  ON public.system_configs 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar suas próprias configurações" 
  ON public.system_configs 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias configurações" 
  ON public.system_configs 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias configurações" 
  ON public.system_configs 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Índices para performance
CREATE INDEX idx_system_configs_user_type ON public.system_configs (user_id, config_type);
CREATE INDEX idx_system_configs_active ON public.system_configs (is_active) WHERE is_active = true;
