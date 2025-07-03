
# Guia de Produção - CRM Nexus Agents

## Preparação Local

1. Execute o script de deploy:
```bash
chmod +x deploy.sh
./deploy.sh
```

## Configuração no cPanel/CloudLinux

### 1. Upload dos Arquivos
- Faça upload de todos os arquivos para o diretório raiz da sua aplicação
- Certifique-se de que a pasta `dist/` foi incluída

### 2. Configuração Node.js no cPanel
1. Acesse o cPanel
2. Vá em "Node.js App" ou "Node.js Selector"
3. Clique em "Create Application"
4. Configure:
   - **Node.js Version**: 22.x
   - **Application Mode**: Production
   - **Application Root**: /
   - **Application URL**: seu-dominio.com
   - **Application Startup File**: app.js
   - **Passenger Log File**: /logs/passenger.log

### 3. Variáveis de Ambiente
Configure no cPanel as seguintes variáveis:
- `NODE_ENV=production`
- `PORT=3000` (ou a porta fornecida pelo cPanel)

### 4. Instalação de Dependências
No terminal do cPanel, execute:
```bash
npm install --production
```

## Estrutura de Arquivos no Servidor

```
/
├── app.js              # Servidor Express principal
├── start.js            # Script de inicialização
├── ecosystem.config.js # Configuração PM2 (opcional)
├── deploy.sh           # Script de deploy
├── dist/               # Build da aplicação React
├── logs/               # Logs da aplicação
├── public/             # Arquivos estáticos
│   └── .htaccess       # Configuração Apache
└── node_modules/       # Dependências
```

## URLs de Teste

Após o deploy, teste:
- **Health Check**: `https://seu-dominio.com/api/health`
- **Aplicação**: `https://seu-dominio.com/`

## Logs e Monitoramento

- **Logs da aplicação**: `/logs/`
- **Logs do Passenger**: Configurado no cPanel
- **Console logs**: Disponíveis no terminal do cPanel

## Troubleshooting

### Problema: Aplicação não inicia
- Verifique se o Node.js v22 está selecionado
- Confirme que o arquivo `app.js` existe
- Verifique os logs no cPanel

### Problema: Rotas React não funcionam
- Certifique-se de que o `.htaccess` está na pasta `public/`
- Verifique se o Apache mod_rewrite está ativo

### Problema: Arquivos estáticos não carregam
- Confirme que a pasta `dist/` foi enviada
- Verifique permissões dos arquivos (755 para pastas, 644 para arquivos)

## Comandos Úteis no Terminal cPanel

```bash
# Verificar status da aplicação
pm2 status

# Reiniciar aplicação
pm2 restart crm-nexus-agents

# Ver logs em tempo real
pm2 logs crm-nexus-agents

# Parar aplicação
pm2 stop crm-nexus-agents
```
