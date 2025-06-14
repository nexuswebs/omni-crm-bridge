
# Instalação em Servidor cPanel com CloudLinux

Este guia fornece instruções passo a passo para instalar e configurar o sistema CRM em um servidor com cPanel e CloudLinux.

## Pré-requisitos

- Servidor com cPanel/WHM
- CloudLinux OS
- Node.js 18+ (disponível via Node.js Selector no cPanel)
- Acesso SSH (opcional, mas recomendado)
- Domínio ou subdomínio configurado

## 1. Configuração Inicial no cPanel

### 1.1 Preparar o Ambiente Node.js

1. **Acesse o cPanel** da sua conta de hospedagem
2. **Localize "Node.js Selector"** na seção "Software"
3. **Clique em "Create Application"**
4. **Configure:**
   - Node.js version: `18.x` ou superior
   - Application mode: `Production`
   - Application root: `crm-system` (ou nome desejado)
   - Application URL: seu domínio/subdomínio
   - Application startup file: `server.js`

### 1.2 Configurar Domínio

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
const app = express();

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'dist')));

// Roteamento SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
```

### 4.2 Instalar Express

```bash
npm install express --save
```

### 4.3 Atualizar package.json

Adicione o script de start:

```json
{
  "scripts": {
    "start": "node server.js",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

## 5. Configuração CloudLinux

### 5.1 Limites de Recursos

1. **Acesse WHM** (se você tem acesso admin)
2. **CloudLinux LVE Manager**
3. **Configure limites apropriados:**
   - CPU: 100% (1 core)
   - Memory: 1GB
   - IO: 10MB/s
   - IOPS: 1000

### 5.2 Node.js App no cPanel

1. **Volte ao "Node.js Selector"**
2. **Clique na aplicação criada**
3. **Configure:**
   - Startup File: `server.js`
   - Application Mode: `Production`
4. **Clique em "Restart"**

## 6. Configurações de SSL

### 6.1 SSL via Let's Encrypt (cPanel)

1. **Acesse "SSL/TLS"** no cPanel
2. **Clique em "Let's Encrypt"**
3. **Selecione seu domínio**
4. **Clique em "Issue"**

### 6.2 Forçar HTTPS

Adicione no `.htaccess` (na pasta public_html):

```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

## 7. Configurações Finais

### 7.1 Variáveis de Ambiente

Crie arquivo `.env` na raiz:

```env
NODE_ENV=production
PORT=3000
```

### 7.2 Configurar Cron Jobs (Opcional)

Para tarefas automatizadas:

1. **Acesse "Cron Jobs"** no cPanel
2. **Adicione:** `0 */6 * * * cd /home/usuario/public_html/crm-system && npm run maintenance`

## 8. Monitoramento e Logs

### 8.1 Logs da Aplicação

Logs ficam disponíveis em:
- cPanel > "Node.js Selector" > Sua app > "Open App" > Logs
- Via SSH: `/home/usuario/logs/`

### 8.2 Monitoramento de Performance

```bash
# Via SSH - verificar status
cd public_html/crm-system
npm run status

# Verificar logs
tail -f logs/app.log
```

## 9. Backup e Manutenção

### 9.1 Backup Automático

Configure no cPanel:
1. **"Backup Wizard"**
2. **Agendar backups diários**
3. **Incluir banco de dados** (se aplicável)

### 9.2 Atualizações

```bash
# Para atualizar a aplicação
cd public_html/crm-system
git pull origin main  # se usando Git
npm install
npm run build
npm restart
```

## 10. Solução de Problemas

### 10.1 Problemas Comuns

**Aplicação não inicia:**
- Verifique os logs no Node.js Selector
- Confirme se o `server.js` está correto
- Verifique se as dependências foram instaladas

**Erro 404 em rotas:**
- Confirme se o roteamento SPA está configurado
- Verifique o arquivo `.htaccess`

**Performance lenta:**
- Ajuste limites no CloudLinux LVE Manager
- Otimize o build da aplicação
- Considere usar CDN

### 10.2 Comandos Úteis

```bash
# Reiniciar aplicação
npm restart

# Verificar status
npm run status

# Ver logs em tempo real
tail -f logs/access.log

# Verificar uso de recursos
cat /proc/*/cgroup | grep memory
```

## 11. Contatos e Suporte

- **Documentação**: [Link para docs]
- **Suporte Técnico**: [Email de suporte]
- **Comunidade**: [Link para fórum/Discord]

---

## Checklist de Instalação

- [ ] Node.js configurado no cPanel
- [ ] Arquivos enviados para servidor
- [ ] Dependências instaladas (`npm install`)
- [ ] Build executado (`npm run build`)
- [ ] Arquivo `server.js` criado
- [ ] Aplicação configurada no Node.js Selector
- [ ] SSL configurado
- [ ] Domínio/subdomínio funcionando
- [ ] Logs verificados
- [ ] Backup configurado

**Data da Instalação:** ___________
**Versão:** ___________
**Responsável:** ___________
