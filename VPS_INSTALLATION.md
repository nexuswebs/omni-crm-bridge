
# 🚀 Nexus Agents - Guia Completo de Instalação VPS & Docker Portainer

## 📋 Índice
- [Pré-requisitos](#pré-requisitos)
- [Opção 1: Instalação Tradicional na VPS](#opção-1-instalação-tradicional-na-vps)
- [Opção 2: Instalação com Docker & Portainer](#opção-2-instalação-com-docker--portainer)
- [Configuração do Supabase](#configuração-do-supabase)
- [Configuração de Domínio e SSL](#configuração-de-domínio-e-ssl)
- [Monitoramento e Manutenção](#monitoramento-e-manutenção)
- [Troubleshooting](#troubleshooting)

---

## 📝 Pré-requisitos

### 🖥️ Servidor VPS
- **OS**: Ubuntu 20.04 LTS ou superior / CentOS 8+
- **RAM**: Mínimo 2GB (Recomendado 4GB+)
- **Storage**: Mínimo 20GB SSD
- **CPU**: 2 vCPUs mínimo
- **Rede**: IP público com acesso SSH

### 🌐 Domínio
- [ ] Domínio registrado (ex: nexusagents.com)
- [ ] DNS apontando para IP da VPS
- [ ] Acesso ao painel de DNS

### 🔑 Credenciais
- [ ] Acesso SSH à VPS (root ou sudo)
- [ ] Credenciais do Supabase
- [ ] Chaves de API (se aplicável)

---

## 🛠️ Opção 1: Instalação Tradicional na VPS

### 1️⃣ Preparação do Servidor

```bash
# Conectar via SSH
ssh root@SEU_IP_VPS

# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar dependências básicas
sudo apt install -y curl wget git unzip software-properties-common

# Instalar Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar instalação
node --version
npm --version
```

### 2️⃣ Instalar e Configurar Nginx

```bash
# Instalar Nginx
sudo apt install -y nginx

# Iniciar e habilitar Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Verificar status
sudo systemctl status nginx
```

### 3️⃣ Configurar Firewall

```bash
# Configurar UFW
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable

# Verificar status
sudo ufw status
```

### 4️⃣ Deploy da Aplicação

```bash
# Criar diretório para aplicação
sudo mkdir -p /var/www/nexus-agents
cd /var/www/nexus-agents

# Clonar projeto (substitua pela URL do seu repositório)
sudo git clone https://github.com/SEU_USUARIO/nexus-agents.git .

# Instalar dependências
sudo npm install

# Criar arquivo de ambiente
sudo nano .env
```

**Conteúdo do arquivo `.env`:**
```env
VITE_SUPABASE_URL=https://eirvcmzqbtkmoxquovsy.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpcnZjbXpxYnRrbW94cXVvdnN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5OTIzNzEsImV4cCI6MjA2NTU2ODM3MX0.pFTNDBbigWzm0pdWvuzQU9giujRVVSXU-tm8eXpl2ts
```

```bash
# Build da aplicação
sudo npm run build

# Configurar permissões
sudo chown -R www-data:www-data /var/www/nexus-agents
sudo chmod -R 755 /var/www/nexus-agents
```

### 5️⃣ Configurar Nginx para SPA

```bash
# Criar configuração do site
sudo nano /etc/nginx/sites-available/nexus-agents
```

**Conteúdo da configuração:**
```nginx
server {
    listen 80;
    server_name SEU_DOMINIO.com www.SEU_DOMINIO.com;
    root /var/www/nexus-agents/dist;
    index index.html;

    # Configuração para SPA (Single Page Application)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache para assets estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Compressão gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
```

```bash
# Habilitar site
sudo ln -s /etc/nginx/sites-available/nexus-agents /etc/nginx/sites-enabled/

# Testar configuração
sudo nginx -t

# Recarregar Nginx
sudo systemctl reload nginx
```

### 6️⃣ Configurar SSL com Let's Encrypt

```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obter certificado SSL
sudo certbot --nginx -d SEU_DOMINIO.com -d www.SEU_DOMINIO.com

# Verificar renovação automática
sudo certbot renew --dry-run
```

---

## 🐳 Opção 2: Instalação com Docker & Portainer

### 1️⃣ Instalar Docker

```bash
# Conectar via SSH
ssh root@SEU_IP_VPS

# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.21.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verificar instalação
docker --version
docker-compose --version
```

### 2️⃣ Instalar Portainer

```bash
# Criar volume para Portainer
docker volume create portainer_data

# Executar Portainer
docker run -d -p 8000:8000 -p 9443:9443 --name portainer --restart=always \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v portainer_data:/data \
    portainer/portainer-ce:latest
```

### 3️⃣ Configurar Firewall para Docker

```bash
# Configurar UFW
sudo ufw allow OpenSSH
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 9443
sudo ufw enable
```

### 4️⃣ Acessar Portainer

1. Acesse: `https://SEU_IP_VPS:9443`
2. Crie senha de admin
3. Conecte ao Docker local

### 5️⃣ Criar Dockerfile para Nexus Agents

```bash
# Criar diretório do projeto
mkdir -p /opt/nexus-agents
cd /opt/nexus-agents

# Criar Dockerfile
nano Dockerfile
```

**Conteúdo do Dockerfile:**
```dockerfile
# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copiar package files
COPY package*.json ./
RUN npm ci --only=production

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Production stage
FROM nginx:alpine

# Copiar build
COPY --from=build /app/dist /usr/share/nginx/html

# Configuração personalizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 6️⃣ Criar configuração do Nginx

```bash
# Criar nginx.conf
nano nginx.conf
```

**Conteúdo do nginx.conf:**
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Configuração para SPA
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache para assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Compressão
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
```

### 7️⃣ Criar Docker Compose

```bash
# Criar docker-compose.yml
nano docker-compose.yml
```

**Conteúdo do docker-compose.yml:**
```yaml
version: '3.8'

services:
  nexus-agents:
    build: .
    container_name: nexus-agents-app
    restart: unless-stopped
    ports:
      - "80:80"
    environment:
      - VITE_SUPABASE_URL=https://eirvcmzqbtkmoxquovsy.supabase.co
      - VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpcnZjbXpxYnRrbW94cXVvdnN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5OTIzNzEsImV4cCI6MjA2NTU2ODM3MX0.pFTNDBbigWzm0pdWvuzQU9giujRVVSXU-tm8eXpl2ts
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.nexus-agents.rule=Host(\`SEU_DOMINIO.com\`)"
      - "traefik.http.routers.nexus-agents.tls.certresolver=letsencrypt"

  # Opcional: Traefik para SSL automático
  traefik:
    image: traefik:v2.10
    container_name: traefik
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
      - "8080:8080"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./traefik.yml:/traefik.yml:ro
      - ./acme.json:/acme.json
    labels:
      - "traefik.enable=true"
```

### 8️⃣ Deploy via Portainer

1. **Acesse Portainer**: `https://SEU_IP_VPS:9443`
2. **Vá para Stacks** → **Add Stack**
3. **Nome**: `nexus-agents`
4. **Cole o conteúdo do docker-compose.yml**
5. **Clique em Deploy**

---

## 🔗 Configuração do Supabase

### ✅ Checklist Supabase

- [ ] **Projeto criado** no Supabase
- [ ] **URL do projeto**: `https://eirvcmzqbtkmoxquovsy.supabase.co`
- [ ] **Anon Key** configurada
- [ ] **Autenticação habilitada**
- [ ] **RLS (Row Level Security)** configurado
- [ ] **Tabelas criadas** (profiles, etc.)

### 🔑 Configurar Authentication

1. **Acesse o painel do Supabase**
2. **Vá para Authentication** → **Settings**
3. **Configure os provedores** (Email, Google, etc.)
4. **Defina URLs de redirecionamento**:
   - `https://SEU_DOMINIO.com`
   - `http://localhost:5173` (desenvolvimento)

### 📊 Verificar Banco de Dados

```sql
-- Verificar se as tabelas existem
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Verificar usuário admin
SELECT * FROM auth.users WHERE email = 'stark@redenexus.top';
```

---

## 🌐 Configuração de Domínio e SSL

### 📋 Checklist DNS

- [ ] **Registro A**: `SEU_DOMINIO.com` → `IP_DA_VPS`
- [ ] **Registro A**: `www.SEU_DOMINIO.com` → `IP_DA_VPS`
- [ ] **TTL**: 300 (5 minutos)
- [ ] **Propagação**: Aguardar 24h máximo

### 🔒 SSL Automático com Traefik (Docker)

```bash
# Criar traefik.yml
nano traefik.yml
```

**Conteúdo do traefik.yml:**
```yaml
api:
  dashboard: true
  insecure: true

entryPoints:
  web:
    address: ":80"
    http:
      redirections:
        entrypoint:
          to: websecure
          scheme: https
  websecure:
    address: ":443"

providers:
  docker:
    exposedByDefault: false

certificatesResolvers:
  letsencrypt:
    acme:
      email: seu-email@dominio.com
      storage: acme.json
      httpChallenge:
        entryPoint: web
```

```bash
# Criar arquivo para certificados
touch acme.json
chmod 600 acme.json
```

---

## 📊 Monitoramento e Manutenção

### 🔍 Scripts de Monitoramento

```bash
# Criar script de backup
nano /usr/local/bin/backup-nexus.sh
```

**Conteúdo do backup-nexus.sh:**
```bash
#!/bin/bash

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups"
APP_DIR="/var/www/nexus-agents"

# Criar diretório de backup
mkdir -p $BACKUP_DIR

# Backup da aplicação
tar -czf $BACKUP_DIR/nexus-agents_$DATE.tar.gz -C $APP_DIR .

# Manter apenas os últimos 7 backups
find $BACKUP_DIR -name "nexus-agents_*.tar.gz" -mtime +7 -delete

echo "Backup concluído: nexus-agents_$DATE.tar.gz"
```

```bash
# Tornar executável
chmod +x /usr/local/bin/backup-nexus.sh

# Adicionar ao crontab
crontab -e
# Adicionar linha: 0 2 * * * /usr/local/bin/backup-nexus.sh
```

### 📈 Script de Monitoramento de Status

```bash
# Criar script de status
nano /usr/local/bin/status-nexus.sh
```

**Conteúdo do status-nexus.sh:**
```bash
#!/bin/bash

echo "=== Status do Nexus Agents ==="
echo "Data: $(date)"
echo ""

# Status do Nginx
echo "Nginx Status:"
systemctl is-active nginx
echo ""

# Status do Docker (se usando)
if command -v docker &> /dev/null; then
    echo "Docker Containers:"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    echo ""
fi

# Uso de recursos
echo "Uso de Recursos:"
echo "CPU: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | awk -F'%' '{print $1}')%"
echo "RAM: $(free -m | awk 'NR==2{printf "%.1f%%", $3*100/$2}')"
echo "Disk: $(df -h / | awk 'NR==2{print $5}')"
echo ""

# Últimos logs
echo "Últimos erros do Nginx:"
tail -n 5 /var/log/nginx/error.log
```

```bash
# Tornar executável
chmod +x /usr/local/bin/status-nexus.sh
```

---

## 🚨 Troubleshooting

### ❌ Problemas Comuns

#### 1. **Aplicação não carrega**
```bash
# Verificar logs do Nginx
sudo tail -f /var/log/nginx/error.log

# Verificar configuração
sudo nginx -t

# Reiniciar serviços
sudo systemctl restart nginx
```

#### 2. **Erro 404 em rotas internas**
- Verificar se a configuração SPA está correta
- `try_files $uri $uri/ /index.html;` no Nginx

#### 3. **SSL não funciona**
```bash
# Verificar certificado
sudo certbot certificates

# Renovar certificado
sudo certbot renew --force-renewal
```

#### 4. **Docker containers não iniciam**
```bash
# Verificar logs
docker logs nexus-agents-app

# Verificar recursos
docker stats

# Reiniciar containers
docker-compose restart
```

### 🔧 Comandos Úteis

```bash
# Verificar portas abertas
sudo netstat -tulpn | grep LISTEN

# Verificar processos
sudo ps aux | grep nginx

# Verificar espaço em disco
df -h

# Verificar memória
free -h

# Logs em tempo real
tail -f /var/log/nginx/access.log
```

---

## ✅ Checklist Final de Instalação

### 🖥️ Servidor
- [ ] VPS configurada e acessível
- [ ] Ubuntu/CentOS atualizado
- [ ] Firewall configurado
- [ ] SSH funcionando

### 🐳 Docker (Opção 2)
- [ ] Docker instalado
- [ ] Docker Compose instalado
- [ ] Portainer funcionando
- [ ] Containers rodando

### 🌐 Aplicação
- [ ] Código clonado/buildado
- [ ] Variáveis de ambiente configuradas
- [ ] Nginx configurado
- [ ] SPA routes funcionando

### 🔒 SSL e Domínio
- [ ] DNS apontando corretamente
- [ ] SSL certificado ativo
- [ ] HTTPS redirecionamento funcionando
- [ ] Domínio acessível

### 🔗 Supabase
- [ ] Conexão com banco funcionando
- [ ] Autenticação funcionando
- [ ] Login/logout funcionando
- [ ] Dados sendo salvos

### 📊 Monitoramento
- [ ] Backup automatizado
- [ ] Logs sendo gerados
- [ ] Monitoramento ativo
- [ ] Alertas configurados

---

## 🆘 Suporte

Se encontrar problemas durante a instalação:

1. **Verifique os logs** primeiro
2. **Consulte este guia** novamente
3. **Teste cada etapa** individualmente
4. **Documente o erro** para análise

**Logs importantes:**
- `/var/log/nginx/error.log` - Erros do Nginx
- `/var/log/nginx/access.log` - Acessos
- `docker logs CONTAINER_NAME` - Logs do Docker

---

🎉 **Parabéns!** Se chegou até aqui, o Nexus Agents está rodando em produção!

📧 **Contato**: Para suporte, abra uma issue no repositório.
