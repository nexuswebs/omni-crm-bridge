
# CRM Inteligente - Sistema Completo

## Visão Geral

Sistema CRM completo com integração WhatsApp, automações n8n, inteligência artificial e processamento de pagamentos. Desenvolvido com React, TypeScript e integração com Evolution API e n8n.cloud.

**URL do Projeto**: https://lovable.dev/projects/e1db57eb-cf13-4ddc-8ee4-ebd755cd3218

## Características Principais

- 🚀 **Dashboard Inteligente** com métricas em tempo real
- 👥 **Gestão Completa de Clientes** com histórico detalhado
- 💬 **WhatsApp Business Integration** via Evolution API
- 🤖 **Automações Avançadas** com n8n.cloud
- 🧠 **Inteligência Artificial** OpenAI para respostas automáticas
- 💳 **Processamento de Pagamentos** Stripe/PIX
- 📊 **Analytics e Relatórios** detalhados
- 🔐 **Sistema de Usuários** com diferentes níveis de acesso

## Tecnologias Utilizadas

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Roteamento**: React Router DOM
- **Estado**: React Query (TanStack)
- **Build**: Vite
- **Banco de Dados**: MySQL/MariaDB
- **Backend**: Node.js + Express
- **Integrações**: Evolution API, n8n.cloud, OpenAI, Stripe

## Pré-requisitos

### Servidor Principal (cPanel/CloudLinux)
- cPanel com CloudLinux
- Node.js 18+ (via Node.js Selector)
- MySQL 5.7+ ou MariaDB 10.2+
- SSL/TLS configurado
- Domínio ou subdomínio

### VPS Evolution API (Separada)
- Ubuntu 20.04+ ou CentOS 8+
- Node.js 18+
- Docker (opcional)
- 2GB RAM mínimo
- 20GB SSD mínimo

### Contas de Serviços Externos
- [n8n.cloud](https://n8n.cloud) - Automações
- [OpenAI](https://platform.openai.com) - Inteligência Artificial
- [Stripe](https://stripe.com) - Pagamentos (opcional)

## Instalação Completa

### 1. Configuração do Servidor Principal (cPanel)

#### 1.1 Preparar Banco de Dados
1. Acesse **MySQL Databases** no cPanel
2. Crie banco: `seu_usuario_crm_database`
3. Crie usuário: `seu_usuario_crm_user` com senha forte
4. Adicione usuário ao banco com todas as permissões
5. Acesse **phpMyAdmin** e importe `database/crm_structure.sql`

#### 1.2 Configurar Node.js
1. Acesse **Node.js Selector** no cPanel
2. Clique em **Create Application**:
   - Node.js version: 18.x ou superior
   - Application mode: Production
   - Application root: `crm-system`
   - Application URL: seu domínio
   - Application startup file: `server.js`

#### 1.3 Upload e Instalação
1. Via **File Manager** ou FTP, envie todos os arquivos para `/public_html/crm-system/`
2. No terminal do cPanel ou SSH:
```bash
cd public_html/crm-system
npm install
npm run build
```

#### 1.4 Configurar servidor Express
Crie `server.js` na raiz:
```javascript
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`CRM rodando na porta ${port}`);
});
```

### 2. Configuração Evolution API (VPS Separada)

#### 2.1 Preparar Servidor VPS
```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2 para gerenciamento
sudo npm install -g pm2
```

#### 2.2 Instalar Evolution API
```bash
# Clonar repositório
git clone https://github.com/EvolutionAPI/evolution-api.git
cd evolution-api

# Instalar dependências
npm install

# Configurar ambiente
cp .env.example .env
```

#### 2.3 Configurar Evolution API
Edite o arquivo `.env`:
```env
# Servidor
SERVER_TYPE=http
SERVER_PORT=8080
CORS_ORIGIN=*
CORS_METHODS=GET,POST,PUT,DELETE
CORS_CREDENTIALS=true

# Autenticação
AUTHENTICATION_TYPE=apikey
AUTHENTICATION_API_KEY=SUA_CHAVE_SECRETA_AQUI

# Database
DATABASE_ENABLED=true
DATABASE_CONNECTION_URI=mongodb://localhost:27017/evolution
# ou use PostgreSQL:
# DATABASE_CONNECTION_URI=postgresql://user:pass@localhost:5432/evolution

# Redis (opcional, para performance)
REDIS_ENABLED=false

# Webhook
WEBHOOK_GLOBAL_ENABLED=true
WEBHOOK_GLOBAL_URL=https://seu-crm-domain.com/api/webhook/whatsapp

# Instâncias
INSTANCE_EXPIRATION_TIME=false
DEL_INSTANCE=false

# Logs
LOG_LEVEL=ERROR
LOG_COLOR=true
```

#### 2.4 Instalar MongoDB
```bash
# Instalar MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Iniciar MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### 2.5 Iniciar Evolution API
```bash
# Iniciar com PM2
pm2 start npm --name "evolution-api" -- start

# Configurar auto-start
pm2 startup
pm2 save

# Verificar status
pm2 status
```

#### 2.6 Configurar Firewall
```bash
# Permitir porta 8080
sudo ufw allow 8080
sudo ufw allow 22
sudo ufw enable
```

### 3. Configuração n8n.cloud

#### 3.1 Criar Conta
1. Acesse [n8n.cloud](https://n8n.cloud)
2. Crie uma conta gratuita ou paga
3. Crie um novo workflow

#### 3.2 Configurar Webhook Principal
1. No n8n.cloud, adicione um nó **Webhook**
2. Configure:
   - HTTP Method: `POST`
   - Path: `crm-webhook`
   - Response: `Immediately`
3. Copie a URL do webhook (ex: `https://sua-instancia.n8n.cloud/webhook/crm-webhook`)

#### 3.3 Configurar Integrações
1. **WhatsApp Integration**:
   - Adicione nó **HTTP Request**
   - URL: `http://SEU_VPS_IP:8080/instance/create`
   - Headers: `apikey: SUA_CHAVE_API`

2. **CRM Integration**:
   - Adicione nó **HTTP Request** 
   - URL: `https://seu-crm-domain.com/api/webhook/n8n`

3. **OpenAI Integration**:
   - Adicione nó **OpenAI**
   - API Key: Sua chave OpenAI

### 4. Configuração Final do CRM

#### 4.1 Variáveis de Ambiente
Crie `.env` na raiz do CRM:
```env
# Sistema
NODE_ENV=production
PORT=3000
APP_URL=https://seu-crm-domain.com

# Banco de Dados
DB_HOST=localhost
DB_PORT=3306
DB_NAME=seu_usuario_crm_database
DB_USER=seu_usuario_crm_user
DB_PASSWORD=sua_senha_segura

# Evolution API (VPS Separada)
WHATSAPP_API_URL=http://SEU_VPS_IP:8080
WHATSAPP_API_KEY=SUA_CHAVE_SECRETA_AQUI
WHATSAPP_WEBHOOK_URL=https://seu-crm-domain.com/api/webhook/whatsapp

# n8n.cloud
N8N_WEBHOOK_URL=https://sua-instancia.n8n.cloud/webhook/crm-webhook
N8N_API_URL=https://sua-instancia.n8n.cloud/api/v1
N8N_API_KEY=sua_chave_api_n8n

# OpenAI
OPENAI_API_KEY=sk-sua_chave_openai
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_MAX_TOKENS=500

# Stripe (opcional)
STRIPE_PUBLIC_KEY=pk_live_sua_chave_publica
STRIPE_SECRET_KEY=sk_live_sua_chave_secreta
STRIPE_WEBHOOK_SECRET=whsec_seu_webhook_secret

# Segurança
JWT_SECRET=seu_jwt_secret_muito_seguro
SESSION_SECRET=sua_session_secret_segura
```

#### 4.2 Configurar SSL/HTTPS
```bash
# No cPanel, vá para SSL/TLS > Let's Encrypt
# Ou adicione no .htaccess:
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

#### 4.3 Iniciar Aplicação
```bash
# No Node.js Selector do cPanel:
# 1. Adicione as variáveis de ambiente
# 2. Clique em "Restart"
# 3. Verifique se está rodando
```

## Credenciais Padrão

Após a instalação, use estas credenciais para primeiro acesso:

- **Email**: `admin@crm.com`
- **Senha**: `password`

⚠️ **IMPORTANTE**: Altere a senha imediatamente após o primeiro login!

## Configuração Pós-Instalação

### 1. Primeiro Acesso
1. Acesse: `https://seu-crm-domain.com`
2. Faça login com as credenciais padrão
3. Altere a senha em Perfil > Alterar Senha

### 2. Configurar Integrações
1. Vá para **Configurações > Integrações**
2. Configure cada integração:

#### WhatsApp Evolution API:
- URL da API: `http://SEU_VPS_IP:8080`
- API Key: `SUA_CHAVE_SECRETA_AQUI`
- Teste a conexão

#### n8n.cloud:
- Webhook URL: `https://sua-instancia.n8n.cloud/webhook/crm-webhook`
- API URL: `https://sua-instancia.n8n.cloud/api/v1`
- API Key: `sua_chave_api_n8n`

#### OpenAI:
- API Key: `sk-sua_chave_openai`
- Modelo: `gpt-3.5-turbo`
- Max Tokens: `500`

### 3. Conectar WhatsApp
1. Vá para **WhatsApp > Conectar Instância**
2. Crie uma nova instância
3. Escaneie o QR Code com WhatsApp Business
4. Aguarde confirmação de conexão

### 4. Criar Primeiro Workflow
1. Vá para **Workflows > Templates**
2. Escolha "Onboarding Automático"
3. Personalize conforme necessário
4. Ative o workflow

## Monitoramento e Manutenção

### Logs do Sistema
```bash
# CRM logs
tail -f /home/usuario/logs/crm-system.log

# Evolution API logs
pm2 logs evolution-api

# n8n logs disponíveis no dashboard n8n.cloud
```

### Backup Automático
Configure no cPanel > Cron Jobs:
```bash
# Backup diário às 3h
0 3 * * * cd /home/usuario && ./backup-crm.sh
```

### Monitoramento de Recursos
```bash
# Verificar status
cd /home/usuario/public_html/crm-system
node -e "console.log('CRM Status: OK')"

# VPS Evolution API
pm2 status
systemctl status mongod
```

## Solução de Problemas

### CRM não carrega
1. Verificar logs: `tail -f logs/crm-system.log`
2. Verificar Node.js Selector está ativo
3. Testar: `curl https://seu-crm-domain.com/api/health`

### WhatsApp não conecta
1. Verificar VPS Evolution API: `pm2 status`
2. Testar API: `curl http://SEU_VPS_IP:8080/instance/fetchInstances`
3. Verificar firewall: `sudo ufw status`

### n8n workflows não executam
1. Verificar webhook URL no n8n.cloud
2. Testar webhook manualmente
3. Verificar logs no dashboard n8n.cloud

### Banco de dados
```sql
-- Verificar conexão
SHOW TABLES;

-- Verificar usuário admin
SELECT * FROM users WHERE email = 'admin@crm.com';

-- Reset senha admin se necessário
UPDATE users SET password = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' WHERE email = 'admin@crm.com';
```

## Estrutura do Projeto

```
crm-system/
├── src/
│   ├── components/          # Componentes React
│   ├── pages/              # Páginas da aplicação
│   ├── contexts/           # Contextos React
│   ├── hooks/              # Custom hooks
│   └── lib/                # Utilitários
├── database/
│   └── crm_structure.sql   # Estrutura do banco
├── server.js               # Servidor Express
├── .env                    # Variáveis de ambiente
└── README.md              # Este arquivo
```

## Arquitetura do Sistema

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   CRM Frontend  │    │   CRM Backend    │    │   MySQL DB      │
│   (React)       │◄──►│   (Node.js)      │◄──►│   (cPanel)      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌──────────────────┐
│   n8n.cloud     │    │  Evolution API   │
│   (Workflows)   │    │  (VPS Separada)  │
└─────────────────┘    └──────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌──────────────────┐
│   OpenAI API    │    │   WhatsApp       │
│   (IA)          │    │   Business       │
└─────────────────┘    └──────────────────┘
```

## Custos Estimados (Mensais)

- **cPanel/CloudLinux**: R$ 30-80 (hospedagem)
- **VPS Evolution API**: R$ 20-50 (1-2GB RAM)
- **n8n.cloud**: $0-20 (dependendo do plano)
- **OpenAI API**: $5-50 (conforme uso)
- **Domínio**: R$ 15-30/ano
- **Total**: ~R$ 70-200/mês

## Licença e Suporte

- **Licença**: MIT
- **Suporte**: suporte@empresa.com
- **Documentação**: [Link para docs]
- **Comunidade**: [Discord/Telegram]

## Atualizações

Para atualizar o sistema:
1. Faça backup completo
2. Baixe nova versão
3. Execute `npm install && npm run build`
4. Reinicie aplicação

## Contribuição

1. Fork o projeto
2. Crie branch para feature (`git checkout -b feature/nova-feature`)
3. Commit mudanças (`git commit -am 'Add nova feature'`)
4. Push para branch (`git push origin feature/nova-feature`)
5. Abra Pull Request

---

**Desenvolvido com ❤️ para automatizar e potencializar seu negócio**
