
# Guia de Deploy - CRM Nexus Agents

## Configuração Pré-Build

Antes de fazer o build, você pode configurar as credenciais de produção através de variáveis de ambiente ou editando diretamente o arquivo `build-config.js`.

### Opção 1: Variáveis de Ambiente

```bash
# Configurações de Domínio
export PRODUCTION_DOMAIN="https://crm.seudominio.com"
export PRODUCTION_API_URL="https://api.seudominio.com"

# Configurações Evolution API
export EVOLUTION_API_URL="https://api.redenexus.top"
export EVOLUTION_API_KEY="sua-api-key-aqui"
export EVOLUTION_INSTANCE_NAME="crm-instance"
export EVOLUTION_WEBHOOK_URL="https://webhook.site/unique-id"

# Configurações n8n
export N8N_URL="https://app.n8n.cloud"
export N8N_API_KEY="sua-n8n-api-key"
export N8N_WEBHOOK_URL="https://seu-crm.com/api/webhook/n8n"

# Configurações Supabase
export SUPABASE_URL="https://eirvcmzqbtkmoxquovsy.supabase.co"
export SUPABASE_ANON_KEY="sua-chave-anonima"
```

### Opção 2: Editar build-config.js

Edite o arquivo `build-config.js` e altere os valores padrão:

```javascript
const buildConfig = {
  PRODUCTION_DOMAIN: 'https://crm.seudominio.com',
  EVOLUTION_API_KEY: 'sua-api-key-real',
  N8N_API_KEY: 'sua-n8n-api-key',
  // ... outras configurações
};
```

## Processo de Deploy

### 1. Preparar o Build

```bash
# Dar permissão de execução
chmod +x deploy.sh

# Executar o script de deploy
./deploy.sh
```

### 2. Arquivos para Upload

Após o build, envie estes arquivos para o servidor:

- `app.js` - Servidor Express
- `start.js` - Script de inicialização
- `ecosystem.config.js` - Configuração PM2
- `dist/` - Aplicação React buildada
- `package.json` - Dependências
- `logs/` - Diretório de logs (vazio)

### 3. Configuração no cPanel

1. Acesse o cPanel
2. Vá em "Node.js App"
3. Clique em "Create Application"
4. Configure:
   - **Node.js Version**: 22.x
   - **Application Mode**: Production
   - **Application Root**: /
   - **Application URL**: seu-dominio.com
   - **Application Startup File**: app.js

### 4. Variáveis de Ambiente no cPanel

Configure no cPanel:
- `NODE_ENV=production`
- `PORT=3000` (ou porta fornecida)

### 5. Instalação de Dependências

No terminal do cPanel:
```bash
npm install --production
```

## Funcionalidades Automáticas

Com este novo sistema:

✅ **Configurações pré-definidas no build**
- Todas as credenciais são incluídas durante o build local
- Não precisa configurar novamente no servidor

✅ **Inicialização automática**
- Quando um usuário faz login, as configurações são automaticamente criadas no banco
- Evolution API e n8n são pré-configurados

✅ **Banco de dados pronto**
- Conexão com Supabase já configurada
- Tabelas e políticas RLS já criadas

## URLs de Teste

Após o deploy:
- **Health Check**: `https://seu-dominio.com/api/health`
- **Aplicação**: `https://seu-dominio.com/`

## Estrutura no Servidor

```
/
├── app.js              # Servidor Express
├── start.js            # Script de inicialização
├── ecosystem.config.js # Configuração PM2
├── dist/               # Aplicação React
├── logs/               # Logs da aplicação
└── node_modules/       # Dependências
```

## Troubleshooting

### Problema: Aplicação não inicia
- Verifique se Node.js v22 está selecionado
- Confirme que `app.js` existe e tem permissões corretas

### Problema: Banco não conecta
- Verifique se as credenciais do Supabase estão corretas
- Confirme se a URL do Supabase está acessível

### Problema: Configurações não aparecem
- Verifique se o usuário está logado
- Confirme se as políticas RLS estão ativas

### Logs Úteis

```bash
# Ver logs da aplicação
pm2 logs crm-nexus-agents

# Verificar status
pm2 status

# Reiniciar aplicação
pm2 restart crm-nexus-agents
```
