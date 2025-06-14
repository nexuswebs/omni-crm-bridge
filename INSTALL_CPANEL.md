
# Instalação em Servidor cPanel com CloudLinux

Este guia fornece instruções passo a passo para instalar e configurar o sistema CRM em um servidor com cPanel e CloudLinux.

## Pré-requisitos

- Servidor com cPanel/WHM
- CloudLinux OS
- Node.js 18+ (disponível via Node.js Selector no cPanel)
- Acesso SSH (opcional, mas recomendado)
- Domínio ou subdomínio configurado
- Banco de dados MySQL/MariaDB

## 1. Configuração Inicial no cPanel

### 1.1 Criar Banco de Dados

1. **Acesse "MySQL Databases"** no cPanel
2. **Crie um novo banco** (ex: `crm_database`)
3. **Crie um usuário** (ex: `crm_user`)
4. **Defina uma senha forte**
5. **Adicione o usuário ao banco** com todas as permissões
6. **Anote as credenciais:**
   - Host: `localhost` (ou IP do servidor)
   - Porta: `3306` (padrão MySQL)
   - Database: `seu_usuario_crm_database`
   - Username: `seu_usuario_crm_user`
   - Password: `sua_senha_segura`

### 1.2 Importar Estrutura do Banco

1. **Acesse "phpMyAdmin"** no cPanel
2. **Selecione o banco criado**
3. **Clique em "Importar"**
4. **Selecione o arquivo** `database/crm_structure.sql`
5. **Execute a importação**
6. **Verifique se todas as tabelas foram criadas**

### 1.3 Preparar o Ambiente Node.js

1. **Acesse o cPanel** da sua conta de hospedagem
2. **Localize "Node.js Selector"** na seção "Software"
3. **Clique em "Create Application"**
4. **Configure:**
   - Node.js version: `18.x` ou superior
   - Application mode: `Production`
   - Application root: `crm-system` (ou nome desejado)
   - Application URL: seu domínio/subdomínio
   - Application startup file: `server.js`

### 1.4 Configurar Domínio

1. No cPanel, vá para **"Subdomains"** ou use domínio principal
2. Crie um subdomínio se necessário (ex: `crm.seudominio.com`)
3. Aponte o Document Root para a pasta da aplicação

## 2. Upload e Configuração dos Arquivos

### 2.1 Upload via File Manager

1. **Acesse "File Manager"** no cPanel
2. **Navegue até** a pasta da aplicação (`public_html/crm-system/`)
3. **Upload todos os arquivos** do projeto (exceto `node_modules`)
4. **Extraia** se necessário

### 2.2 Upload via FTP/SFTP (Alternativo)

```bash
# Conecte via FTP/SFTP e envie os arquivos para:
/home/usuario/public_html/crm-system/
```

## 3. Instalação de Dependências

### 3.1 Via Terminal SSH (Recomendado)

```bash
# Conecte via SSH
ssh usuario@seuservidor.com

# Navegue até a pasta da aplicação
cd public_html/crm-system

# Instale as dependências
npm install

# Build da aplicação
npm run build
```

### 3.2 Via Terminal do cPanel

1. **Abra "Terminal"** no cPanel
2. **Execute os comandos:**

```bash
cd public_html/crm-system
npm install
npm run build
```

## 4. Configuração do Servidor Web

### 4.1 Criar arquivo server.js

Crie um arquivo `server.js` na raiz da aplicação:

```javascript
const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'dist')));

// API Routes (para futuras integrações)
app.use('/api', (req, res, next) => {
  // Aqui você pode adicionar suas rotas de API
  res.json({ message: 'API funcionando' });
});

// Roteamento SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor CRM rodando na porta ${port}`);
  console.log(`Acesse: http://localhost:${port}`);
});
```

### 4.2 Instalar Dependências do Servidor

```bash
npm install express cors --save
```

### 4.3 Atualizar package.json

Adicione os scripts necessários:

```json
{
  "scripts": {
    "start": "node server.js",
    "build": "vite build",
    "preview": "vite preview",
    "dev": "vite",
    "deploy": "npm run build && npm start"
  }
}
```

## 5. Configuração de Variáveis de Ambiente

### 5.1 Criar arquivo .env

Crie um arquivo `.env` na raiz da aplicação:

```env
# Configurações do Sistema
NODE_ENV=production
PORT=3000
APP_URL=https://seudominio.com

# Banco de Dados
DB_HOST=localhost
DB_PORT=3306
DB_NAME=seu_usuario_crm_database
DB_USER=seu_usuario_crm_user
DB_PASSWORD=sua_senha_segura

# WhatsApp Evolution API
WHATSAPP_API_URL=https://sua-instancia.evolution-api.com
WHATSAPP_API_KEY=sua_chave_da_evolution_api
WHATSAPP_INSTANCE_NAME=sua_instancia

# n8n Automation
N8N_WEBHOOK_URL=https://sua-instancia.n8n.io/webhook
N8N_API_URL=https://sua-instancia.n8n.io/api/v1
N8N_API_KEY=sua_chave_n8n

# OpenAI
OPENAI_API_KEY=sk-sua_chave_openai
OPENAI_MODEL=gpt-3.5-turbo

# Pagamentos
STRIPE_PUBLIC_KEY=pk_live_sua_chave_publica_stripe
STRIPE_SECRET_KEY=sk_live_sua_chave_secreta_stripe
STRIPE_WEBHOOK_SECRET=whsec_seu_webhook_secret

# PIX (opcional)
PIX_CERTIFICATE_PATH=/path/to/certificate.p12
PIX_CERTIFICATE_PASSWORD=senha_do_certificado
```

## 6. Configuração das Integrações

### 6.1 Configurar WhatsApp Evolution API

1. **Contrate um servidor VPS** para Evolution API
2. **Instale a Evolution API:**

```bash
# No servidor VPS da Evolution API
git clone https://github.com/EvolutionAPI/evolution-api.git
cd evolution-api
npm install
```

3. **Configure o .env da Evolution API:**

```env
# Evolution API .env
SERVER_TYPE=http
SERVER_PORT=8080
CORS_ORIGIN=*
DATABASE_ENABLED=true
DATABASE_CONNECTION_URI=mongodb://localhost:27017/evolution
```

4. **Inicie a Evolution API:**

```bash
npm run start:prod
```

5. **Crie uma instância WhatsApp:**

```bash
curl -X POST http://seu-servidor-evolution:8080/instance/create \
  -H "Content-Type: application/json" \
  -H "apikey: sua_api_key" \
  -d '{
    "instanceName": "crm-instance",
    "qrcode": true,
    "integration": "WHATSAPP-BAILEYS"
  }'
```

6. **Configure o webhook no CRM:**
   - Acesse: Configurações > Integrações > WhatsApp
   - URL da API: `http://seu-servidor-evolution:8080`
   - API Key: `sua_chave_da_evolution_api`
   - Nome da Instância: `crm-instance`

### 6.2 Configurar n8n para Automação

1. **Instale n8n no servidor ou use n8n.cloud:**

```bash
# Instalação local (opcional)
npm install n8n -g
```

2. **Configure n8n.cloud (Recomendado):**
   - Acesse: https://n8n.cloud
   - Crie uma conta
   - Crie um novo workflow

3. **Configurar Webhook no n8n:**
   - Adicione um nó "Webhook"
   - Configure a URL: `https://sua-instancia.n8n.cloud/webhook/crm`
   - Método: POST
   - Ative o webhook

4. **Conectar CRM com n8n:**
   - Acesse: Configurações > Integrações > n8n
   - URL do Webhook: `https://sua-instancia.n8n.cloud/webhook/crm`
   - API URL: `https://sua-instancia.n8n.cloud/api/v1`
   - API Key: (gere nas configurações do n8n)

### 6.3 Configurar OpenAI

1. **Obtenha uma API Key:**
   - Acesse: https://platform.openai.com/api-keys
   - Crie uma nova API Key
   - Configure limites de uso

2. **Configure no CRM:**
   - Acesse: Configurações > Integrações > OpenAI
   - API Key: `sk-sua_chave_openai`
   - Modelo: `gpt-3.5-turbo` ou `gpt-4`
   - Max Tokens: `500`

### 6.4 Configurar Pagamentos

#### Stripe:
1. **Crie uma conta Stripe**
2. **Obtenha as chaves:**
   - Chave Pública: `pk_live_...`
   - Chave Secreta: `sk_live_...`
3. **Configure webhooks no Stripe**
4. **Configure no CRM:**
   - Acesse: Configurações > Pagamentos > Stripe
   - Insira as chaves obtidas

## 7. Configuração CloudLinux

### 7.1 Limites de Recursos

1. **Acesse WHM** (se você tem acesso admin)
2. **CloudLinux LVE Manager**
3. **Configure limites apropriados:**
   - CPU: 100% (1 core)
   - Memory: 1GB
   - IO: 10MB/s
   - IOPS: 1000
   - Processes: 100

### 7.2 Node.js App no cPanel

1. **Volte ao "Node.js Selector"**
2. **Clique na aplicação criada**
3. **Configure:**
   - Startup File: `server.js`
   - Application Mode: `Production`
4. **Adicione variáveis de ambiente** (do arquivo .env)
5. **Clique em "Restart"**

## 8. Configurações de SSL

### 8.1 SSL via Let's Encrypt (cPanel)

1. **Acesse "SSL/TLS"** no cPanel
2. **Clique em "Let's Encrypt"**
3. **Selecione seu domínio**
4. **Clique em "Issue"**

### 8.2 Forçar HTTPS

Adicione no `.htaccess` (na pasta public_html):

```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Configurações para React SPA
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

## 9. Primeiro Acesso e Configuração

### 9.1 Acesso Inicial

1. **Acesse seu domínio:** `https://crm.seudominio.com`
2. **Login inicial:**
   - Email: `admin@crm.com`
   - Senha: `password`
3. **IMPORTANTE:** Altere a senha imediatamente!

### 9.2 Configurações Essenciais

1. **Configurar Banco de Dados:**
   - Vá para: Configurações > Banco
   - Insira as credenciais do banco criado
   - Teste a conexão

2. **Configurar WhatsApp:**
   - Vá para: Configurações > Integrações > WhatsApp
   - Insira URL da Evolution API
   - Insira API Key
   - Nome da instância
   - Teste a conexão

3. **Configurar n8n:**
   - Vá para: Configurações > Integrações > n8n
   - Insira URL do webhook
   - Insira API Key
   - Teste a conexão

4. **Configurar IA:**
   - Vá para: Configurações > Integrações > OpenAI
   - Insira API Key
   - Configure modelo preferido
   - Teste a conexão

## 10. Testando as Funcionalidades

### 10.1 Teste WhatsApp

1. **Conectar instância:**
   - Vá para: WhatsApp > Conectar
   - Escaneie o QR Code
   - Verifique status: "Conectado"

2. **Teste de envio:**
   - Crie um cliente de teste
   - Envie uma mensagem de teste
   - Verifique se chegou no WhatsApp

### 10.2 Teste Workflows

1. **Criar workflow simples:**
   - Vá para: Workflows > Criar Workflow
   - Trigger: "Nova mensagem"
   - Ação: "Resposta automática"
   - Salvar e ativar

2. **Testar execução:**
   - Envie mensagem para o WhatsApp conectado
   - Verifique se a resposta automática funcionou
   - Veja os logs em: Workflows > Logs

### 10.3 Teste Pagamentos

1. **Configurar produto de teste:**
   - Vá para: Pagamentos > Novo Pagamento
   - Valor: R$ 1,00 (teste)
   - Cliente: Cliente de teste

2. **Processar pagamento:**
   - Use cartão de teste do Stripe
   - Verifique se o status mudou para "Pago"

## 11. Monitoramento e Manutenção

### 11.1 Logs da Aplicação

```bash
# Ver logs em tempo real
tail -f /home/usuario/logs/crm-system.log

# Logs do Node.js (cPanel)
# Disponível em: Node.js Selector > Sua App > Open App > Logs
```

### 11.2 Monitoramento de Performance

```bash
# Verificar uso de recursos
cat /proc/*/cgroup | grep memory

# Status da aplicação
cd public_html/crm-system
node -e "console.log('CRM Status: OK')"
```

### 11.3 Cron Jobs para Manutenção

Configure no cPanel > Cron Jobs:

```bash
# Limpeza de logs (diário às 2h)
0 2 * * * cd /home/usuario/public_html/crm-system && npm run clean-logs

# Backup do banco (diário às 3h)
0 3 * * * mysqldump -u usuario -p senha database > /home/usuario/backups/crm-$(date +\%Y\%m\%d).sql

# Restart da aplicação (semanal)
0 4 * * 0 cd /home/usuario/public_html/crm-system && npm restart
```

## 12. Backup e Recuperação

### 12.1 Backup Automático

Configure no cPanel > Backup Wizard:
1. **Backup completo** semanal
2. **Backup incremental** diário
3. **Incluir banco de dados**
4. **Armazenar remotamente** (Google Drive, Dropbox)

### 12.2 Script de Backup Manual

```bash
#!/bin/bash
# backup-crm.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/usuario/backups"

# Criar diretório de backup
mkdir -p $BACKUP_DIR

# Backup do banco
mysqldump -u usuario -p senha database > $BACKUP_DIR/db_$DATE.sql

# Backup dos arquivos
tar -czf $BACKUP_DIR/files_$DATE.tar.gz /home/usuario/public_html/crm-system

# Limpar backups antigos (manter últimos 7 dias)
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup concluído: $DATE"
```

## 13. Solução de Problemas

### 13.1 Problemas Comuns

**Aplicação não inicia:**
```bash
# Verificar logs
tail -f /home/usuario/logs/crm-system.log

# Verificar dependências
cd /home/usuario/public_html/crm-system
npm list --depth=0

# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

**Erro de conexão com banco:**
```bash
# Testar conexão
mysql -h localhost -u usuario -p database
# Se conectar, problema é na aplicação
# Se não conectar, problema é nas credenciais
```

**WhatsApp não conecta:**
1. Verificar se Evolution API está rodando
2. Verificar firewall (portas 8080, 9000)
3. Verificar logs da Evolution API
4. Recriar instância se necessário

**n8n não executa workflows:**
1. Verificar URL do webhook
2. Testar webhook manualmente
3. Verificar logs do n8n
4. Verificar permissões de API

### 13.2 Comandos de Diagnóstico

```bash
# Status geral do sistema
cd /home/usuario/public_html/crm-system

# Verificar se Node.js está funcionando
node --version
npm --version

# Verificar se a aplicação compila
npm run build

# Testar servidor
node server.js &
curl http://localhost:3000

# Verificar banco de dados
mysql -u usuario -p -e "SHOW TABLES;" database

# Verificar integrações
curl -X GET http://sua-evolution-api:8080/instance/fetchInstances \
  -H "apikey: sua_api_key"
```

## 14. Atualizações

### 14.1 Atualizar Sistema

```bash
# Backup antes da atualização
./backup-crm.sh

# Baixar nova versão
cd /home/usuario/public_html
mv crm-system crm-system-backup
# Upload nova versão para crm-system

# Restaurar configurações
cp crm-system-backup/.env crm-system/
cp crm-system-backup/server.js crm-system/ (se personalizado)

# Instalar e buildar
cd crm-system
npm install
npm run build

# Reiniciar aplicação
npm restart
```

### 14.2 Atualizar Dependências

```bash
# Verificar dependências desatualizadas
npm outdated

# Atualizar dependências
npm update

# Rebuild
npm run build
npm restart
```

## 15. Segurança

### 15.1 Configurações de Segurança

```bash
# Permissões de arquivos
chmod 755 /home/usuario/public_html/crm-system
chmod 644 /home/usuario/public_html/crm-system/.env
chmod 600 /home/usuario/public_html/crm-system/database/

# Firewall (se disponível)
# Liberar apenas portas necessárias: 80, 443, 3000
```

### 15.2 SSL e HTTPS

- Sempre use HTTPS em produção
- Configure redirecionamento HTTP → HTTPS
- Use certificados válidos (Let's Encrypt)
- Configure HSTS headers

## 16. Performance

### 16.1 Otimizações

```bash
# Compressão Gzip (adicionar ao .htaccess)
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache (adicionar ao .htaccess)
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
</IfModule>
```

---

## Checklist de Instalação Completa

### Pré-Instalação
- [ ] Servidor cPanel/CloudLinux configurado
- [ ] Node.js 18+ instalado
- [ ] Domínio/subdomínio configurado
- [ ] Acesso SSH disponível (opcional)

### Banco de Dados
- [ ] Banco MySQL/MariaDB criado
- [ ] Usuário e permissões configurados
- [ ] Arquivo SQL importado
- [ ] Conexão testada

### Aplicação
- [ ] Arquivos enviados para servidor
- [ ] Dependências instaladas (`npm install`)
- [ ] Build executado (`npm run build`)
- [ ] Arquivo `server.js` configurado
- [ ] Variáveis de ambiente configuradas
- [ ] Aplicação iniciada no Node.js Selector

### Integrações
- [ ] WhatsApp Evolution API configurada
- [ ] Instância WhatsApp conectada
- [ ] n8n configurado e conectado
- [ ] OpenAI API configurada
- [ ] Stripe/Pagamentos configurados

### Segurança e SSL
- [ ] SSL/TLS configurado
- [ ] HTTPS forçado
- [ ] Permissões de arquivo ajustadas
- [ ] Senha admin alterada

### Testes
- [ ] Login funcionando
- [ ] Banco de dados conectando
- [ ] WhatsApp enviando/recebendo
- [ ] Workflows executando
- [ ] Pagamentos processando

### Monitoramento
- [ ] Logs configurados
- [ ] Backup automático ativo
- [ ] Cron jobs configurados
- [ ] Monitoramento de recursos

### Finalização
- [ ] Documentação revisada
- [ ] Usuários treinados
- [ ] Suporte configurado

**Data da Instalação:** ___________
**Versão do Sistema:** ___________
**Responsável Técnico:** ___________
**Domínio:** ___________
**Servidor:** ___________

---

## Contatos e Suporte

- **Documentação Técnica**: [Link para documentação]
- **Suporte Técnico**: suporte@empresa.com
- **Emergências**: +55 11 99999-9999
- **Comunidade**: [Link para Discord/Telegram]

## Recursos Úteis

- **Evolution API**: https://github.com/EvolutionAPI/evolution-api
- **n8n Documentation**: https://docs.n8n.io/
- **OpenAI API**: https://platform.openai.com/docs
- **Stripe Documentation**: https://stripe.com/docs

---

*Este documento deve ser atualizado sempre que houver mudanças na arquitetura ou nos procedimentos de instalação.*
